import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TireChangeHistoryModel from '../../models/TireChangeHistoryModel';
import TireChangeForm from '../../forms/TireChangeForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../components/ConfirmationModal';

const TireChangeHistoryList = () => {
  const navigate = useNavigate();
  const [tireChangeHistory, setTireChangeHistory] = useState<TireChangeHistoryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTireChange, setEditingTireChange] = useState<TireChangeHistoryModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTireChange, setDeletingTireChange] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTireChangeHistory = async () => {
    const baseUrl: string = `${process.env.REACT_APP_BACKEND_URL}/tire-changes`;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${baseUrl}?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();

      const loadedTireChangeHistory: TireChangeHistoryModel[] = responseData.tireChangeHistory.map((item: any) => ({
        id: item.id,
        carId: item.car_id,
        tireChangeDate: item.tire_change_date,
        tireChangeKilometers: item.tire_change_kilometers,
        make: item.make,
        model: item.model,
        licensePlate: item.license_plate,
        observation: item.observation
      }));

      setTireChangeHistory(loadedTireChangeHistory);
      setTotalPages(responseData.totalPages || 1);
      if (responseData.validLimits) {
        setValidLimits(responseData.validLimits);
      }
      setHttpError(null);
    } catch (error: any) {
      setHttpError(error.message);
      toast.error('Falha ao carregar o histórico de trocas de pneus. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTireChangeHistory();
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
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (tireChange: TireChangeHistoryModel) => {
    setEditingTireChange(tireChange);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (tireChange: any) => {
    setDeletingTireChange(tireChange);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTireChange?.id) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tire-changes/entry/${deletingTireChange.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Troca de pneus excluída com sucesso!');
        fetchTireChangeHistory();
        setDeleteModalOpen(false);
        setDeletingTireChange(null);
      } else {
        throw new Error('Falha ao excluir a troca de pneus');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Erro ao excluir a troca de pneus. Por favor, tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingTireChange(null);
    fetchTireChangeHistory();
    toast.success(editingTireChange ? 'Troca de pneus atualizada com sucesso!' : 'Troca de pneus adicionada com sucesso!');
  };

  const handleCarClick = (carId: number) => {
    navigate(`/cars/${carId}`);
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
        <h2>Histórico de Troca de Pneus</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Adicionar Troca de Pneus
        </button>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingTireChange ? 'Editar Troca de Pneus' : 'Adicionar Troca de Pneus'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTireChange(null);
                  }}
                />
              </div>
              <div className="modal-body">
                <TireChangeForm
                  onSuccess={handleFormSuccess}
                  initialData={editingTireChange}
                  onClose={() => {
                    setIsModalOpen(false);
                    setEditingTireChange(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingTireChange(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta troca de pneus do veículo ${deletingTireChange?.make} ${deletingTireChange?.model} - ${deletingTireChange?.licensePlate}?`}
        confirmButtonText="Excluir"
        isLoading={isDeleting}
      />

      {tireChangeHistory.length === 0 ? (
        <div className="alert alert-info">
          Nenhuma troca de pneus registrada.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>ID</th>
                  <th onClick={() => handleSort('car_id')}>Veículo</th>
                  <th onClick={() => handleSort('tire_change_date')}>Data da Troca</th>
                  <th onClick={() => handleSort('tire_change_kilometers')}>Quilometragem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tireChangeHistory.map((history) => (
                  <tr key={history.id}>
                    <td>{history.id}</td>
                    <td>
                      <span 
                        className="text-primary" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCarClick(history.carId)}
                      >
                        {history.make} {history.model} - {history.licensePlate}
                      </span>
                    </td>
                    <td>{format(new Date(history.tireChangeDate), 'dd/MM/yyyy')}</td>
                    <td>{history.tireChangeKilometers} km</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(history)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(history)}
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
              <ul className="pagination">
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
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
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

export default TireChangeHistoryList;