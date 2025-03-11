import React, { useState, useEffect } from 'react';
import { MaintenanceHistoryModel, emptyMaintenanceHistory } from '../models/MaintenanceHistoryModel';
import { MaintenanceTypeModel } from '../models/MaintenanceTypeModel';
import CarModel from '../models/CarModel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface MaintenanceHistoryFormProps {
    onSubmit?: (maintenanceHistory: MaintenanceHistoryModel) => void;
    initialData?: MaintenanceHistoryModel;
    isEditing?: boolean;
    onSuccess?: () => void;
}

const MaintenanceHistoryForm: React.FC<MaintenanceHistoryFormProps> = ({ 
    onSubmit, 
    initialData = emptyMaintenanceHistory,
    isEditing = false,
    onSuccess
}) => {
    const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistoryModel>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceHistoryModel, string>>>({});
    const [cars, setCars] = useState<CarModel[]>([]);
    const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cars
                const carsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars`);
                if (!carsResponse.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const carsData = await carsResponse.json();
                // Extract the cars array from the response
                const formattedCars = (carsData.cars || []);
                setCars(formattedCars);

                // Fetch maintenance types
                const typesResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/types`);
                if (!typesResponse.ok) {
                    throw new Error('Failed to fetch maintenance types');
                }
                const typesData = await typesResponse.json();
                // Extract the maintenance types array from the response
                setMaintenanceTypes(typesData.maintenanceTypes || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Erro ao carregar dados. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof MaintenanceHistoryModel, string>> = {};
        
        if (!maintenanceHistory.car_id) {
            newErrors.car_id = 'Selecione um veículo';
        }
        
        if (!maintenanceHistory.maintenance_type_id) {
            newErrors.maintenance_type_id = 'Selecione um tipo de manutenção';
        }
        
        if (!maintenanceHistory.maintenance_date) {
            newErrors.maintenance_date = 'A data da manutenção é obrigatória';
        }
        
        if (!maintenanceHistory.maintenance_kilometers || maintenanceHistory.maintenance_kilometers <= 0) {
            newErrors.maintenance_kilometers = 'A quilometragem deve ser um número positivo';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMaintenanceHistory(prev => ({
            ...prev,
            [name]: ['car_id', 'maintenance_type_id', 'maintenance_kilometers', 'recurrency'].includes(name) 
                ? Number(value) 
                : value
        }));

        // If maintenance type changes, update recurrency from the selected type
        if (name === 'maintenance_type_id') {
            const selectedType = maintenanceTypes.find(type => type.id === Number(value));
            if (selectedType) {
                setMaintenanceHistory(prev => ({
                    ...prev,
                    recurrency: selectedType.recurrency
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const url = isEditing && maintenanceHistory.id
                ? `${process.env.REACT_APP_BACKEND_URL}/maintenance/history/${maintenanceHistory.id}`
                : `${process.env.REACT_APP_BACKEND_URL}/maintenance/history`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    car_id: maintenanceHistory.car_id,
                    maintenance_type_id: maintenanceHistory.maintenance_type_id,
                    maintenance_date: maintenanceHistory.maintenance_date,
                    maintenance_kilometers: maintenanceHistory.maintenance_kilometers,
                    observation: maintenanceHistory.observation || '',
                    recurrency: maintenanceHistory.recurrency || 0
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            if (onSuccess) {
                onSuccess();
            }

            if (!isEditing) {
                setMaintenanceHistory(emptyMaintenanceHistory);
            }

            toast.success(`Manutenção ${isEditing ? 'atualizada' : 'registrada'} com sucesso!`);
        } catch (error) {
            console.error('Error submitting maintenance:', error);
            toast.error(`Erro ao ${isEditing ? 'atualizar' : 'registrar'} manutenção.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>;
    }

    return (
        <form onSubmit={handleSubmit} className="needs-validation">
            <div className="mb-3">
                <label htmlFor="car_id" className="form-label">Veículo</label>
                <select
                    className={`form-select ${errors.car_id ? 'is-invalid' : ''}`}
                    id="car_id"
                    name="car_id"
                    value={maintenanceHistory.car_id || ''}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                >
                    <option value="">Selecione um veículo</option>
                    {cars.map(car => (
                        <option key={car.id} value={car.id}>
                            {car.make} {car.model} - {car.license_plate}
                        </option>
                    ))}
                </select>
                {errors.car_id && <div className="invalid-feedback">{errors.car_id}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="maintenance_type_id" className="form-label">Tipo de Manutenção</label>
                <select
                    className={`form-select ${errors.maintenance_type_id ? 'is-invalid' : ''}`}
                    id="maintenance_type_id"
                    name="maintenance_type_id"
                    value={maintenanceHistory.maintenance_type_id}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                >
                    <option value="">Selecione um tipo de manutenção</option>
                    {maintenanceTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name} (Recorrência: {type.recurrency} km)
                        </option>
                    ))}
                </select>
                {errors.maintenance_type_id && <div className="invalid-feedback">{errors.maintenance_type_id}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="maintenance_date" className="form-label">Data da Manutenção</label>
                <input
                    type="date"
                    className={`form-control ${errors.maintenance_date ? 'is-invalid' : ''}`}
                    id="maintenance_date"
                    name="maintenance_date"
                    value={maintenanceHistory.maintenance_date}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                />
                {errors.maintenance_date && <div className="invalid-feedback">{errors.maintenance_date}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="maintenance_kilometers" className="form-label">Quilometragem</label>
                <input
                    type="number"
                    className={`form-control ${errors.maintenance_kilometers ? 'is-invalid' : ''}`}
                    id="maintenance_kilometers"
                    name="maintenance_kilometers"
                    value={maintenanceHistory.maintenance_kilometers}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={isSubmitting}
                />
                {errors.maintenance_kilometers && <div className="invalid-feedback">{errors.maintenance_kilometers}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="recurrency" className="form-label">Recorrência (em Km)</label>
                <input
                    type="number"
                    className="form-control"
                    id="recurrency"
                    name="recurrency"
                    value={maintenanceHistory.recurrency}
                    onChange={handleChange}
                    min="0"
                    disabled={isSubmitting}
                />
                <small className="form-text text-muted">
                    Deixe em branco para usar a recorrência padrão do tipo de manutenção.
                </small>
            </div>

            <div className="mb-3">
                <label htmlFor="observation" className="form-label">Observações</label>
                <textarea
                    className="form-control"
                    id="observation"
                    name="observation"
                    value={maintenanceHistory.observation || ''}
                    onChange={handleChange}
                    rows={3}
                    disabled={isSubmitting}
                />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processando...' : (isEditing ? 'Atualizar' : 'Adicionar') + ' Registro de Manutenção'}
            </button>
        </form>
    );
};

export default MaintenanceHistoryForm; 