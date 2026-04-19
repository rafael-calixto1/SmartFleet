import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import OilChangeHistoryModel from '../../models/OilChangeHistoryModel';
import OilChangeFormModal from '../../forms/OilChangeFormModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OilChangeHistoryList = () => {
  const [oilChangeHistory, setOilChangeHistory] = useState<OilChangeHistoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOilChange, setEditingOilChange] = useState<OilChangeHistoryModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingOilChange, setDeletingOilChange] = useState<OilChangeHistoryModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');

  const fetchOilChangeHistory = async () => {
    const baseUrl: string = `${process.env.REACT_APP_BACKEND_URL}/oil-changes`;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${baseUrl}?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&status=${statusFilter}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      const loadedOilChangeHistory: OilChangeHistoryModel[] = responseData.oilChangeHistory.map((item: any) => ({
        id: item.id,
        carId: item.car_id,
        oilChangeDate: item.oil_change_date,
        oilChangeKilometers: item.oil_change_kilometers,
        liters_quantity: Number(item.liters_quantity) || 0,
        price_per_liter: Number(item.price_per_liter) || 0,
        total_cost: Number(item.total_cost) || 0,
        observation: item.observation,
        make: item.make,
        model: item.model,
        license_plate: item.license_plate,
        carStatus: item.car_status
      }));

      setOilChangeHistory(loadedOilChangeHistory);
      setTotalPages(responseData.totalPages);
      if (responseData.validLimits) {
        setValidLimits(responseData.validLimits);
      }
      setHttpError(null);
    } catch (error: any) {
      setHttpError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOilChangeHistory();
  }, [currentPage, limit, sortField, sortOrder, statusFilter]);

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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingOilChange(null);
    fetchOilChangeHistory();
    toast.success(editingOilChange ? 'Troca de óleo atualizada com sucesso!' : 'Troca de óleo adicionada com sucesso!');
  };

  const handleEdit = (oilChange: OilChangeHistoryModel) => {
    setEditingOilChange(oilChange);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (oilChange: OilChangeHistoryModel) => {
    setDeletingOilChange(oilChange);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingOilChange?.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/oil-changes/${deletingOilChange.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Troca de óleo excluída com sucesso!');
        fetchOilChangeHistory();
        setDeleteModalOpen(false);
        setDeletingOilChange(null);
      } else {
        throw new Error('Falha ao excluir troca de óleo');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erro ao excluir troca de óleo. Por favor, tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (oilChange: OilChangeHistoryModel) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${oilChange.carId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: oilChange.carStatus === 'active' ? 'inactive' : 'active'
        }),
      });

      if (response.ok) {
        toast.success(`Carro ${oilChange.carStatus === 'active' ? 'desativado' : 'ativado'} com sucesso!`);
        fetchOilChangeHistory();
      } else {
        throw new Error('Falha ao alterar status do carro');
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Erro ao alterar status do carro');
    }
  };

  if (isLoading) {
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

  if (httpError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {httpError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Histórico de Troca de Óleo</h2>
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex align-items-center">
            <label className="me-2" htmlFor="statusFilter">Status do Veículo:</label>
            <select
              id="statusFilter"
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          {!isModalOpen && (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingOilChange(null);
                setIsModalOpen(true);
              }}
            >
              Adicionar Nova Troca de Óleo
            </button>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{editingOilChange ? 'Editar Troca de Óleo' : 'Adicionar Nova Troca de Óleo'}</h5>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingOilChange(null);
              }}
            >
              Cancelar
            </button>
          </div>
          <div className="card-body">
            <OilChangeFormModal 
              show={isModalOpen}
              handleClose={() => {
                setIsModalOpen(false);
                setEditingOilChange(null);
              }}
              onSuccess={handleFormSuccess}
              initialData={editingOilChange}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingOilChange(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta troca de óleo para o veículo ${deletingOilChange?.make} ${deletingOilChange?.model} - ${deletingOilChange?.license_plate}?`}
        confirmButtonText="Excluir"
        isLoading={isDeleting}
      />

      {oilChangeHistory.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma troca de óleo registrada.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>ID</th>
                  <th onClick={() => handleSort('car_id')}>Veículo</th>
                  <th onClick={() => handleSort('oil_change_date')}>Data da Troca</th>
                  <th onClick={() => handleSort('oil_change_kilometers')}>Quilometragem</th>
                  <th onClick={() => handleSort('liters_quantity')}>Litros</th>
                  <th onClick={() => handleSort('total_cost')}>Custo Total</th>
                  <th>Status do Carro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {oilChangeHistory.map((history) => (
                  <tr key={history.id} className={history.carStatus === 'inactive' ? 'table-secondary' : ''}>
                    <td>{history.id}</td>
                    <td>{history.make} {history.model} - {history.license_plate}</td>
                    <td>{format(new Date(history.oilChangeDate), 'dd/MM/yyyy HH:mm')}</td>
                    <td>{history.oilChangeKilometers} km</td>
                    <td>{history.liters_quantity}</td>
                    <td>R$ {(Number(history.total_cost) || 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${history.carStatus === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {history.carStatus === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(history)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleStatusChange(history)}
                        >
                          {history.carStatus === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(history)}
                        >
                          Excluir
                        </button>
                      </div>
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

export default OilChangeHistoryList;