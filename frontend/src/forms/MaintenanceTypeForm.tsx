import React, { useState } from 'react';
import { MaintenanceTypeModel, emptyMaintenanceType } from '../models/MaintenanceTypeModel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MaintenanceTypeFormProps {
    onSubmit?: (maintenanceType: MaintenanceTypeModel) => void;
    initialData?: MaintenanceTypeModel;
    isEditing?: boolean;
    onSuccess?: () => void;
}

const MaintenanceTypeForm: React.FC<MaintenanceTypeFormProps> = ({ 
    onSubmit, 
    initialData = emptyMaintenanceType,
    isEditing = false,
    onSuccess
}) => {
    const [maintenanceType, setMaintenanceType] = useState<MaintenanceTypeModel>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceTypeModel, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof MaintenanceTypeModel, string>> = {};
        
        if (!maintenanceType.name.trim()) {
            newErrors.name = 'Maintenance type name is required';
        }
        
        if (!maintenanceType.recurrency || maintenanceType.recurrency <= 0) {
            newErrors.recurrency = 'Recurrence must be a positive number';
        }
        
        if (!maintenanceType.recurrency_date) {
            newErrors.recurrency_date = 'Recurrence date is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMaintenanceType(prev => ({
            ...prev,
            [name]: ['recurrency', 'recurrency_date'].includes(name) ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please correct the errors in the form.');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (onSubmit) {
                await onSubmit(maintenanceType);
            }
            
            // Reset form if not editing
            if (!isEditing) {
                setMaintenanceType(emptyMaintenanceType);
            }
            
            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error submitting maintenance type:', error);
            toast.error(`Error ${isEditing ? 'updating' : 'adding'} maintenance type.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="needs-validation">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Maintenance Type Name</label>
                <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={maintenanceType.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="recurrency" className="form-label">Recurrence (in Km)</label>
                <input
                    type="number"
                    className={`form-control ${errors.recurrency ? 'is-invalid' : ''}`}
                    id="recurrency"
                    name="recurrency"
                    value={maintenanceType.recurrency}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={isSubmitting}
                />
                {errors.recurrency && <div className="invalid-feedback">{errors.recurrency}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="recurrency_date" className="form-label">Recurrence in Months</label>
                <input
                    type="number"
                    className={`form-control ${errors.recurrency_date ? 'is-invalid' : ''}`}
                    id="recurrency_date"
                    name="recurrency_date"
                    value={maintenanceType.recurrency_date}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={isSubmitting}
                />
                <small className="form-text text-muted">
                    Number of months for the next maintenance
                </small>
                {errors.recurrency_date && <div className="invalid-feedback">{errors.recurrency_date}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : (isEditing ? 'Update' : 'Add') + ' Maintenance Type'}
            </button>
        </form>
    );
};

export default MaintenanceTypeForm; 