import React, { useState, useEffect } from 'react';
import { MaintenanceHistoryModel } from '../../models/MaintenanceHistoryModel';
import MaintenanceHistoryForm from '../../forms/MaintenanceHistoryForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';

const MaintenanceHistoryList: React.FC = () => {
    const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistoryModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingHistory, setEditingHistory] = useState<MaintenanceHistoryModel | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
    const [sortField, setSortField] = useState<string>('maintenance_date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingHistory, setDeletingHistory] = useState<MaintenanceHistoryModel | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMaintenanceHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/maintenance/history?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
            );
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Maintenance History Response:', data);

            if (data && typeof data === 'object') {
                const historyData = Array.isArray(data.maintenanceHistory) ? data.maintenanceHistory : [];
                const total = data.totalPages || Math.ceil((data.total || historyData.length) / limit) || 1;
                
                setMaintenanceHistory(historyData);
                setTotalPages(total);
                if (data.validLimits) {
                    setValidLimits(data.validLimits);
                }
            } else {
                setMaintenanceHistory([]);
                setTotalPages(1);
            }
            setError(null);
        } catch (err) {
            console.error('Detailed error:', err);
            setError('Failed to load maintenance history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenanceHistory();
    }, [currentPage, limit, sortField, sortOrder]);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value);
        setLimit(newLimit);
        setCurrentPage(1);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleAddHistory = async (maintenanceHistory: MaintenanceHistoryModel) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceHistory),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await fetchMaintenanceHistory();
            setShowForm(false);
            toast.success('Maintenance record added successfully!');
        } catch (err) {
            toast.error('Error adding maintenance record.');
            console.error('Error adding maintenance history:', err);
        }
    };

    const handleUpdateHistory = async (maintenanceHistory: MaintenanceHistoryModel) => {
        if (!editingHistory?.id) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/history/${editingHistory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceHistory),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await fetchMaintenanceHistory();
            setEditingHistory(null);
            toast.success('Maintenance record updated successfully!');
        } catch (err) {
            toast.error('Error updating maintenance record.');
            console.error('Error updating maintenance history:', err);
        }
    };

    const handleDeleteHistory = async (id: number) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/history/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await fetchMaintenanceHistory();
            setDeleteModalOpen(false);
            setDeletingHistory(null);
            toast.success('Maintenance record deleted successfully!');
        } catch (err) {
            toast.error('Error deleting maintenance record.');
            console.error('Error deleting maintenance history:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const formatNumber = (value: string | number): string => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return !isNaN(num) ? num.toFixed(2) : '0.00';
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Maintenance History</h2>

            <div className="d-flex gap-2 mb-4">
                {!showForm && !editingHistory && (
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowForm(true)}
                    >
                        Add New Maintenance
                    </button>
                )}
                
                <Link to="/maintenance/types" className="btn btn-outline-primary">
                    Manage Maintenance Types
                </Link>
            </div>

            {showForm && !editingHistory && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Add Maintenance Record</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="card-body">
                        <MaintenanceHistoryForm 
                            onSubmit={handleAddHistory} 
                            onSuccess={() => {
                                setShowForm(false);
                                fetchMaintenanceHistory();
                            }}
                        />
                    </div>
                </div>
            )}

            {editingHistory && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Edit Maintenance Record</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setEditingHistory(null)}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="card-body">
                        <MaintenanceHistoryForm 
                            onSubmit={handleUpdateHistory} 
                            initialData={editingHistory} 
                            isEditing={true} 
                            onSuccess={() => {
                                setEditingHistory(null);
                                fetchMaintenanceHistory();
                            }}
                        />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingHistory(null);
                }}
                onConfirm={() => deletingHistory?.id && handleDeleteHistory(deletingHistory.id)}
                title="Confirm Deletion"
                message={`Are you sure you want to delete this maintenance record for vehicle ${deletingHistory?.make} ${deletingHistory?.model} - ${deletingHistory?.license_plate}?`}
                confirmButtonText="Delete"
                isLoading={isDeleting}
            />

            {!loading && maintenanceHistory.length === 0 ? (
                <div className="alert alert-info">
                    No maintenance records registered.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>ID</th>
                                    <th onClick={() => handleSort('vehicle')}>Vehicle</th>
                                    <th onClick={() => handleSort('maintenance_type')}>Maintenance Type</th>
                                    <th onClick={() => handleSort('maintenance_date')}>Date</th>
                                    <th onClick={() => handleSort('maintenance_kilometers')}>Mileage</th>
                                    <th onClick={() => handleSort('recurrency')}>Recurrence</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceHistory.map((history) => (
                                    <tr key={history.id}>
                                        <td>{history.id}</td>
                                        <td>{history.make} {history.model} - {history.license_plate}</td>
                                        <td>{history.maintenance_type_name}</td>
                                        <td>{formatDate(history.maintenance_date)}</td>
                                        <td>{formatNumber(history.maintenance_kilometers)} km</td>
                                        <td>{history.recurrency} km</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setEditingHistory(history)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {
                                                    setDeletingHistory(history);
                                                    setDeleteModalOpen(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2">Items per page:</span>
                            <select 
                                className="form-select form-select-sm" 
                                style={{ width: 'auto' }}
                                value={limit} 
                                onChange={handleLimitChange}
                            >
                                {validLimits.map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>

                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
};

export default MaintenanceHistoryList; 