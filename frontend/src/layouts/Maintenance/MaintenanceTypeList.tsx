import React, { useState, useEffect } from 'react';
import { MaintenanceTypeModel } from '../../models/MaintenanceTypeModel';
import MaintenanceTypeForm from '../../forms/MaintenanceTypeForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../components/ConfirmationModal';

const MaintenanceTypeList: React.FC = () => {
    const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceTypeModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editingType, setEditingType] = useState<MaintenanceTypeModel | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [validLimits, setValidLimits] = useState<number[]>([10]);
    const [sortField, setSortField] = useState<string>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingType, setDeletingType] = useState<MaintenanceTypeModel | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMaintenanceTypes = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/maintenance/types?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
            );
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            setMaintenanceTypes(data.maintenanceTypes);
            setTotalPages(data.totalPages);
            setValidLimits(data.validLimits || [10]);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar os tipos de manutenção. Por favor, tente novamente.');
            console.error('Error fetching maintenance types:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenanceTypes();
    }, [currentPage, limit, sortField, sortOrder]);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(event.target.value);
        setLimit(newLimit);
        setCurrentPage(1); // Reset to first page when changing limit
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleAddType = async (maintenanceType: MaintenanceTypeModel) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceType),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await fetchMaintenanceTypes();
            setShowForm(false);
            toast.success('Tipo de manutenção adicionado com sucesso!');
        } catch (err) {
            toast.error('Erro ao adicionar tipo de manutenção.');
            console.error('Error adding maintenance type:', err);
        }
    };

    const handleUpdateType = async (maintenanceType: MaintenanceTypeModel) => {
        if (!editingType?.id) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/types/${editingType.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(maintenanceType),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await fetchMaintenanceTypes();
            setEditingType(null);
            toast.success('Tipo de manutenção atualizado com sucesso!');
        } catch (err) {
            toast.error('Erro ao atualizar tipo de manutenção.');
            console.error('Error updating maintenance type:', err);
        }
    };

    const handleDeleteType = async (id: number) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/maintenance/types/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao excluir tipo de manutenção.');
            }

            await fetchMaintenanceTypes();
            setDeleteModalOpen(false);
            setDeletingType(null);
            toast.success('Tipo de manutenção excluído com sucesso!');
        } catch (err: any) {
            toast.error(err.message);
            console.error('Error deleting maintenance type:', err);
        } finally {
            setIsDeleting(false);
        }
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
            <h2 className="mb-4">Tipos de Manutenção</h2>
            
            {!showForm && !editingType && (
                <button 
                    className="btn btn-primary mb-4" 
                    onClick={() => setShowForm(true)}
                >
                    Adicionar Novo Tipo de Manutenção
                </button>
            )}

            {showForm && !editingType && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Adicionar Tipo de Manutenção</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setShowForm(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                    <div className="card-body">
                        <MaintenanceTypeForm 
                            onSubmit={handleAddType}
                            onSuccess={() => {
                                setShowForm(false);
                                fetchMaintenanceTypes();
                            }}
                        />
                    </div>
                </div>
            )}

            {editingType && (
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Editar Tipo de Manutenção</h5>
                        <button 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => setEditingType(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                    <div className="card-body">
                        <MaintenanceTypeForm 
                            onSubmit={handleUpdateType} 
                            initialData={editingType} 
                            isEditing={true}
                            onSuccess={() => {
                                setEditingType(null);
                                fetchMaintenanceTypes();
                            }}
                        />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingType(null);
                }}
                onConfirm={() => deletingType?.id && handleDeleteType(deletingType.id)}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o tipo de manutenção "${deletingType?.name}"?`}
                confirmButtonText="Excluir"
                isLoading={isDeleting}
            />

            {maintenanceTypes.length === 0 ? (
                <div className="alert alert-info">
                    Nenhum tipo de manutenção cadastrado.
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')}>Nome</th>
                                    <th onClick={() => handleSort('recurrency')}>Recorrência (Km)</th>
                                    <th onClick={() => handleSort('recurrency_date')}>Recorrência (Meses)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenanceTypes.map((type) => (
                                    <tr key={type.id}>
                                        <td>{type.name}</td>
                                        <td>{type.recurrency} km</td>
                                        <td>{type.recurrency_date} meses</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setEditingType(type)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => {
                                                    setDeletingType(type);
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

export default MaintenanceTypeList; 