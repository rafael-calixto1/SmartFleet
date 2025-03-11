import React, { useState, useEffect } from 'react';
import DriverModel from '../../models/DriverModel';
import DriverForm from "../../forms/DriverForm";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../../components/ConfirmationModal';

const DriverList = () => {
  const [drivers, setDrivers] = useState<DriverModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingDriver, setDeletingDriver] = useState<DriverModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDrivers = async () => {
    const baseUrl: string = `${process.env.REACT_APP_BACKEND_URL}/drivers`;

    try {
      const response = await fetch(`${baseUrl}?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`);
      if (!response.ok) {
        throw new Error('Algo deu errado!');
      }

      const responseData = await response.json();
      const loadedDrivers: DriverModel[] = [];
      for (const key in responseData.drivers) {
        loadedDrivers.push({
          id: responseData.drivers[key].id,
          name: responseData.drivers[key].name,
          licenseNumber: responseData.drivers[key].license_number,
        });
      }
      setDrivers(loadedDrivers);
      setTotalPages(responseData.totalPages);
    } catch (error: any) {
      setHttpError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [currentPage, limit, sortField, sortOrder]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (driver: DriverModel) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleDelete = async (driverId: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers/${driverId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao excluir o motorista');
      }

      toast.success('Motorista excluído com sucesso!');
      fetchDrivers();
      setDeleteModalOpen(false);
      setDeletingDriver(null);
    } catch (error: any) {
      toast.error(error.message);
      console.error('Error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
    fetchDrivers();
    toast.success(selectedDriver ? 'Motorista atualizado com sucesso!' : 'Motorista adicionado com sucesso!');
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
      <h2 className="mb-4">Lista de Motoristas</h2>
      
      {!isModalOpen && (
        <button 
          className="btn btn-primary mb-4" 
          onClick={() => setIsModalOpen(true)}
        >
          Adicionar Novo Motorista
        </button>
      )}

      {isModalOpen && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{selectedDriver ? 'Editar Motorista' : 'Adicionar Novo Motorista'}</h5>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDriver(null);
              }}
            >
              Cancelar
            </button>
          </div>
          <div className="card-body">
            <DriverForm
              driverId={selectedDriver?.id}
              initialData={selectedDriver ? {
                name: selectedDriver.name,
                license_number: selectedDriver.licenseNumber
              } : undefined}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingDriver(null);
        }}
        onConfirm={() => deletingDriver?.id && handleDelete(deletingDriver.id)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o motorista "${deletingDriver?.name}"?`}
        confirmButtonText="Excluir"
        isLoading={isDeleting}
      />

      {drivers.length === 0 ? (
        <div className="alert alert-info">
          Nenhum motorista cadastrado.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>ID</th>
                <th onClick={() => handleSort('name')}>Nome</th>
                <th onClick={() => handleSort('license_number')}>Número da CNH</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.id}</td>
                  <td>{driver.name}</td>
                  <td>{driver.licenseNumber}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(driver)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setDeletingDriver(driver);
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
      )}

      {drivers.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
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
      )}
    </div>
  );
};

export default DriverList;
