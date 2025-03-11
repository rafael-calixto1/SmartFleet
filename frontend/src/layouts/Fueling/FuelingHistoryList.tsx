import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import FuelingHistoryModel from '../../models/FuelingHistoryModel';
import FuelingForm from '../../forms/FuelingForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../components/ConfirmationModal';

const FuelingHistoryList = () => {
  const [fuelingHistory, setFuelingHistory] = useState<FuelingHistoryModel[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFueling, setEditingFueling] = useState<FuelingHistoryModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingFueling, setDeletingFueling] = useState<FuelingHistoryModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fieldMapping: { [key: string]: string } = {
    'id': 'id',
    'car_id': 'car_id',
    'fuel_date': 'fuel_date',
    'fueling_kilometers': 'fueling_kilometers',
    'liters_quantity': 'liters_quantity',
    'price_per_liter': 'price_per_liter',
    'total_cost': 'total_cost',
    'fuel_type': 'fuel_type',
    'license_plate': 'license_plate'
  };

  const fetchFuelingHistory = async () => {
    const fuelingUrl: string = `${process.env.REACT_APP_BACKEND_URL}/fueling`;
    const carsUrl: string = `${process.env.REACT_APP_BACKEND_URL}/cars`;

    try {
      const [fuelingResponse, carsResponse] = await Promise.all([
        fetch(
          `${fuelingUrl}?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
        ),
        fetch(carsUrl),
      ]);

      if (!fuelingResponse.ok || !carsResponse.ok) {
        throw new Error('Something went wrong!');
      }

      const fuelingData = await fuelingResponse.json();
      const carsData = await carsResponse.json();

      if (!Array.isArray(carsData.cars)) {
        throw new Error('Expected an array of cars data');
      }

      const loadedFuelingHistory: FuelingHistoryModel[] = fuelingData.fuelingHistory.map(
        (history: any) => {
          const car = carsData.cars.find((car: any) => car.id === history.car_id);

          return {
            id: history.id,
            carId: history.car_id,
            litersQuantity: history.liters_quantity,
            fuelDate: history.fuel_date,
            fuelingKilometers: history.fueling_kilometers,
            licensePlate: car?.license_plate || 'N/A',
            fuelType: history.fuel_type,
            pricePerLiter: history.price_per_liter,
            totalCost: history.total_cost,
            observation: history.observation,
            carModel: `${car?.make || 'N/A'} ${car?.model || ''}`
          };
        }
      );

      setFuelingHistory(loadedFuelingHistory);
      setTotalPages(fuelingData.totalPages);
      if (fuelingData.validLimits) {
        setValidLimits(fuelingData.validLimits);
      }
      setCars(carsData.cars);
    } catch (error: any) {
      setHttpError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelingHistory();
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
    const backendField = fieldMapping[field] || field;
    if (sortField === backendField) {
      setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(backendField);
      setSortOrder('asc');
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingFueling(null);
    fetchFuelingHistory();
    toast.success(editingFueling ? 'Abastecimento atualizado com sucesso!' : 'Abastecimento adicionado com sucesso!');
  };

  const handleEdit = (fueling: FuelingHistoryModel) => {
    setEditingFueling(fueling);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (fueling: FuelingHistoryModel) => {
    setDeletingFueling(fueling);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingFueling?.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fueling/entry/${deletingFueling.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o abastecimento');
      }

      toast.success('Abastecimento excluído com sucesso!');
      fetchFuelingHistory();
      setDeleteModalOpen(false);
      setDeletingFueling(null);
    } catch (error) {
      toast.error('Erro ao excluir o abastecimento');
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
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
      <h2 className="mb-4">Histórico de Abastecimento</h2>
      
      {!isModalOpen && (
        <button 
          className="btn btn-primary mb-4" 
          onClick={() => {
            setEditingFueling(null);
            setIsModalOpen(true);
          }}
        >
          Adicionar Novo Abastecimento
        </button>
      )}

      {isModalOpen && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{editingFueling ? 'Editar Abastecimento' : 'Adicionar Novo Abastecimento'}</h5>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingFueling(null);
              }}
            >
              Cancelar
            </button>
          </div>
          <div className="card-body">
            <FuelingForm 
              onSuccess={handleFormSuccess}
              initialData={editingFueling}
              cars={cars}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingFueling(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir este abastecimento do veículo ${deletingFueling?.licensePlate}?`}
        confirmButtonText="Excluir"
        isLoading={isDeleting}
      />

      {fuelingHistory.length === 0 ? (
        <div className="alert alert-info">
          Nenhum abastecimento registrado.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>ID</th>
                  <th onClick={() => handleSort('car_id')}>Veículo</th>
                  <th onClick={() => handleSort('license_plate')}>Placa</th>
                  <th onClick={() => handleSort('liters_quantity')}>Quantidade de Combustível</th>
                  <th onClick={() => handleSort('fuel_type')}>Tipo de Combustível</th>
                  <th onClick={() => handleSort('fuel_date')}>Data de Abastecimento</th>
                  <th onClick={() => handleSort('fueling_kilometers')}>Km no Abastecimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fuelingHistory.map((history) => (
                  <tr key={history.id}>
                    <td>{history.id}</td>
                    <td>{history.carModel}</td>
                    <td>{history.licensePlate}</td>
                    <td>{history.litersQuantity} L</td>
                    <td>{history.fuelType}</td>
                    <td>{format(new Date(history.fuelDate), 'dd/MM/yyyy HH:mm')}</td>
                    <td>{history.fuelingKilometers}</td>
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

export default FuelingHistoryList;
