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
            setError('Falha ao carregar o histórico de manutenção. Por favor, tente novamente.');
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
            toast.success('Registro de manutenção adicionado com sucesso!');
        } catch (err) {
            toast.error('Erro ao adicionar registro de manutenção.');
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
            toast.success('Registro de manutenção atualizado com sucesso!');
        } catch (err) {
            toast.error('Erro ao atualizar registro de manutenção.');
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
            toast.success('Registro de manutenção excluído com sucesso!');
        } catch (err) {
            toast.error('Erro ao excluir registro de manutenção.');
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
                        <span className="visually-hidden">Carregando...</span>
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
            <h2 className="mb-4">Histórico de Manutenção</h2>

            <div className="d-flex gap-2 mb-4">
                {!showForm && !editingHistory && (
                    <button 
                        className="btn btn-primary" 
                        onClick={() => setShowForm(true)}
                    >
                        Adicionar Nova Manutenção
                    </button>
                )}
                
                <Link to="/maintenance/types" className="btn btn-outline-primary">
                    Gerenciar Tipos de Manutenção
                </Link>
            </div>

            {showForm && !editingHistory && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Adicionar Registro de Manutenção</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setShowForm(false)}
                        >
                            Cancelar
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
                        <h5 className="mb-0">Editar Registro de Manutenção</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setEditingHistory(null)}
                        >
                            Cancelar
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
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir este registro de manutenção do veículo ${deletingHistory?.make} ${deletingHistory?.model} - ${deletingHistory?.license_plate}?`}
                confirmButtonText="Excluir"
                isLoading={isDeleting}
            />

            {!loading && maintenanceHistory.length === 0 ? (
                <div className="alert alert-info">
                    Nenhum registro de manutenção cadastrado.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>ID</th>
                                    <th onClick={() => handleSort('vehicle')}>Veículo</th>
                                    <th onClick={() => handleSort('maintenance_type')}>Tipo de Manutenção</th>
                                    <th onClick={() => handleSort('maintenance_date')}>Data</th>
                                    <th onClick={() => handleSort('maintenance_kilometers')}>Quilometragem</th>
                                    <th onClick={() => handleSort('recurrency')}>Recorrência</th>
                                    <th>Ações</th>
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
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {
                                                    setDeletingHistory(history);
                                                    setDeleteModalOpen(true);
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2">Itens por página:</span>
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
                                        Anterior
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
                                        Próximo
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