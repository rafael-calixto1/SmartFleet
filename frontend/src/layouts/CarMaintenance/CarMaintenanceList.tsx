import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import CarMaintenanceModel from '../../models/CarMaintenanceModel';
import CarMaintenanceForm from '../../forms/CarMaintenanceForm';
import ConfirmationModal from '../../components/ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CarMaintenanceList = () => {
  const [carMaintenance, setCarMaintenance] = useState<CarMaintenanceModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [validLimits, setValidLimits] = useState<number[]>([10, 20, 50, 100]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<CarMaintenanceModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingMaintenance, setDeletingMaintenance] = useState<CarMaintenanceModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fieldMapping: { [key: string]: string } = {
    'carId': 'car_id',
    'maintenanceType': 'maintenance_type_name',
    'maintenanceDate': 'maintenance_date',
    'maintenanceKilometers': 'maintenance_kilometers',
    'recurrency': 'recurrency',
    'id': 'id',
    'carModel': 'vehicle'
  };

  const fetchCarMaintenance = async () => {
    setIsLoading(true);
    try {
      const backendSortField = fieldMapping[sortField] || 'id';
      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/car-maintenance?page=${currentPage}&limit=${limit}&sortField=${backendSortField}&sortOrder=${sortOrder}`;

      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json();
      const loadedCarMaintenance: CarMaintenanceModel[] = responseData.carMaintenanceHistory.map((entry: any) => ({
        id: entry.id,
        carId: entry.car_id,
        maintenanceType: entry.maintenance_type,
        maintenanceDate: entry.maintenance_date,
        maintenanceKilometers: entry.maintenance_kilometers,
        recurrency: entry.recurrency,
        carMake: entry.make,
        carModel: entry.model,
        licensePlate: entry.license_plate,
      }));

      setCarMaintenance(loadedCarMaintenance);
      setTotalPages(responseData.totalPages);
      if (responseData.validLimits) {
        setValidLimits(responseData.validLimits);
      }
    } catch (error: any) {
      console.error('Fetch error:', error.message);
      setHttpError(`Error: ${error.message}`);
      toast.error('Failed to load maintenances. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarMaintenance();
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

  const handleEdit = (maintenance: CarMaintenanceModel) => {
    setEditingMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (maintenance: CarMaintenanceModel) => {
    setDeletingMaintenance(maintenance);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMaintenance?.id) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/car-maintenance/${deletingMaintenance.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Maintenance deleted successfully!');
        fetchCarMaintenance();
        setDeleteModalOpen(false);
        setDeletingMaintenance(null);
      } else {
        throw new Error('Failed to delete maintenance');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting maintenance. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMaintenanceSuccess = () => {
    setIsModalOpen(false);
    setEditingMaintenance(null);
    fetchCarMaintenance();
    toast.success(editingMaintenance ? 'Maintenance updated successfully!' : 'Maintenance added successfully!');
  };

  if (isLoading) {
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
        <h2>Maintenance List</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          Add Maintenance
        </button>
      </div>

      {isModalOpen && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingMaintenance ? 'Edit Maintenance' : 'Add Maintenance'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingMaintenance(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <CarMaintenanceForm
                    onSuccess={handleMaintenanceSuccess}
                    initialData={editingMaintenance}
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingMaintenance(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingMaintenance(null);
        }}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the maintenance for the vehicle ${deletingMaintenance?.carModel} - ${deletingMaintenance?.licensePlate}?`}
        confirmButtonText="Delete"
        isLoading={isDeleting}
      />

      {carMaintenance.length === 0 ? (
        <div className="alert alert-info">
          No maintenance registered.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>ID</th>
                  <th onClick={() => handleSort('carModel')}>Vehicle</th>
                  <th onClick={() => handleSort('maintenanceType')}>Maintenance Type</th>
                  <th onClick={() => handleSort('maintenanceDate')}>Date</th>
                  <th onClick={() => handleSort('maintenanceKilometers')}>Mileage</th>
                  <th onClick={() => handleSort('recurrency')}>Recurrence (Km)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {carMaintenance.map((maintenance) => (
                  <tr key={maintenance.id}>
                    <td>{maintenance.id}</td>
                    <td>{`${maintenance.carModel} - ${maintenance.licensePlate}`}</td>
                    <td>{maintenance.maintenanceType}</td>
                    <td>{format(new Date(maintenance.maintenanceDate), 'dd/MM/yyyy')}</td>
                    <td>{maintenance.maintenanceKilometers}</td>
                    <td>{maintenance.recurrency}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(maintenance)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(maintenance)}
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
              <ul className="pagination">
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

export default CarMaintenanceList;