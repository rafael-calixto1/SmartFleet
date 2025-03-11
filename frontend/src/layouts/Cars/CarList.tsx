import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from "../../forms/CarFormModal";
import CarModel from '../../models/CarModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import ConfirmationModal from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormCarData {
  id?: number;
  make: string;
  model: string;
  current_kilometers: number;
  next_tire_change: number;
  is_next_tire_change_bigger: boolean;
  next_oil_change: number;
  is_next_oil_change_bigger: boolean;
  driver_id?: number;
  license_plate: string;
  status: 'active' | 'inactive';
}

const CarList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarModel[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<FormCarData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCar, setDeletingCar] = useState<CarModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers`);
        if (!response.ok) {
          throw new Error('Erro ao carregar motoristas.');
        }
        const data = await response.json();
        setDrivers(data.drivers);
      } catch (error: any) {
        setHttpError(error.message || 'Erro desconhecido ao carregar motoristas.');
      }
    };

    fetchDrivers();
  }, []);

    const fetchCars = async () => {
      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/cars`;

      try {
      const response = await fetch(
        `${baseUrl}?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&status=${statusFilter}`
      );
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados.');
        }
        const data = await response.json();
        const loadedCars: CarModel[] = data.cars.map((car: any) => ({
          id: car.id,
          make: car.make,
          model: car.model,
        current_kilometers: car.current_kilometers,
        next_tire_change: car.next_tire_change,
        is_next_tire_change_bigger: car.is_next_tire_change_bigger,
        next_oil_change: car.next_oil_change,
        is_next_oil_change_bigger: car.is_next_oil_change_bigger,
        license_plate: car.license_plate,
        driver_id: car.driver_id,
        status: car.status,
      }));

        loadedCars.forEach((car) => {
        const driver = drivers.find((driver) => driver.id === car.driver_id);
          if (driver) {
          car.driver_name = driver.name;
          }
        });

        setCars(loadedCars);
        setTotalPages(data.totalPages || 1);
      if (data.validLimits) {
        setValidLimits(data.validLimits);
      }
      } catch (error: any) {
        setHttpError(error.message || 'Erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (drivers.length > 0) {
      fetchCars();
    }
  }, [currentPage, limit, sortField, sortOrder, drivers, statusFilter]);

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
    const fieldMapping: Record<string, string> = {
      'marca': 'make',
      'Modelo': 'model',
      'Km Atual': 'current_kilometers',
      'Próxima Troca de Pneu': 'next_tire_change',
      'Troca de Óleo Necessária': 'next_oil_change',
      'Placa': 'license_plate',
      'Nome do Motorista': 'driver_name',
      'status': 'status'
    };

    const newSortField = fieldMapping[field] || field;
    if (sortField === newSortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(newSortField);
      setSortOrder('asc');
    }
  };
  
  const handleEdit = (car: CarModel) => {
    const mappedCar: FormCarData = {
      id: car.id,
      make: car.make,
      model: car.model,
      current_kilometers: car.current_kilometers,
      next_tire_change: car.next_tire_change,
      is_next_tire_change_bigger: car.is_next_tire_change_bigger,
      next_oil_change: car.next_oil_change,
      is_next_oil_change_bigger: car.is_next_oil_change_bigger,
      driver_id: car.driver_id,
      license_plate: car.license_plate,
      status: car.status,
    };
    setEditingCar(mappedCar);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (car: CarModel) => {
    setDeletingCar(car);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingCar?.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${deletingCar.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Carro excluído com sucesso!');
        fetchCars();
        setDeleteModalOpen(false);
        setDeletingCar(null);
      } else {
        throw new Error(data.message || 'Falha ao excluir o carro');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Erro ao excluir o carro. Por favor, tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingCar(null);
    fetchCars();
    toast.success(editingCar ? 'Carro atualizado com sucesso!' : 'Carro adicionado com sucesso!');
  };

  const handleStatusChange = async (car: CarModel) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${car.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: car.status === 'active' ? 'inactive' : 'active'
        }),
      });

      if (response.ok) {
        toast.success(`Carro ${car.status === 'active' ? 'desativado' : 'ativado'} com sucesso!`);
        fetchCars();
      } else {
        throw new Error('Falha ao alterar o status do carro');
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error('Erro ao alterar o status do carro');
    }
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
        <h2>Lista de Carros</h2>
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex align-items-center">
            <label className="me-2" htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              style={{ width: 'auto' }}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Novo Carro
          </button>
        </div>
      </div>
      
      {!isModalOpen && (
        <button 
          className="btn btn-primary mb-4" 
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Novo Carro
        </button>
      )}

      {isModalOpen && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{editingCar ? 'Editar Carro' : 'Adicionar Novo Carro'}</h5>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingCar(null);
              }}
            >
              Cancelar
            </button>
          </div>
          <div className="card-body">
            <CarForm 
              onSuccess={handleFormSuccess}
              initialData={editingCar}
            />
          </div>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="alert alert-info">
          Nenhum carro cadastrado.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('marca')}>Marca</th>
                  <th onClick={() => handleSort('Modelo')}>Modelo</th>
                  <th onClick={() => handleSort('Placa')}>Placa</th>
                  <th onClick={() => handleSort('Km Atual')}>Km Atual</th>
                  <th onClick={() => handleSort('Próxima Troca de Pneu')}>Próxima Troca de Pneu</th>
                  <th onClick={() => handleSort('Troca de Óleo Necessária')}>Próxima Troca de Óleo</th>
                  <th onClick={() => handleSort('Nome do Motorista')}>Motorista</th>
                  <th onClick={() => handleSort('status')}>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id} className={car.status === 'inactive' ? 'table-secondary' : ''}>
                    <td>
                      <span 
                        className="text-primary" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCarClick(car.id)}
                      >
                        {car.make}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="text-primary" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCarClick(car.id)}
                      >
                        {car.model}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="text-primary" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleCarClick(car.id)}
                      >
                        {car.license_plate}
                      </span>
                    </td>
                    <td>{car.current_kilometers}</td>
                    <td>{car.next_tire_change}</td>
                    <td>{car.next_oil_change}</td>
                    <td>{car.driver_name || 'Não atribuído'}</td>
                    <td>
                      <span className={`badge ${car.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {car.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(car)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleStatusChange(car)}
                        >
                          {car.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(car)}
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

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingCar(null);
        }}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o carro ${deletingCar?.make} ${deletingCar?.model} - ${deletingCar?.license_plate}?`}
        confirmButtonText="Excluir"
        isLoading={isDeleting}
        />
    </div>
  );
};

export default CarList;