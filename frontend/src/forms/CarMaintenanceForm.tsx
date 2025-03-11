import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CarMaintenanceFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialData?: {
    id?: number;
    carId: number;
    maintenanceType: string;
    maintenanceDate: string;
    maintenanceKilometers: number;
    recurrency: number;
    carMake?: string;
    carModel?: string;
    licensePlate?: string;
  } | null;
}

interface MaintenanceType {
  id: number;
  name: string;
  recurrency: number;
}

const CarMaintenanceForm: React.FC<CarMaintenanceFormProps> = ({ onSuccess, onClose, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState({
    car_id: initialData?.carId?.toString() || '',
    maintenance_type_id: '',
    maintenance_date: initialData?.maintenanceDate?.split('T')[0] || '',
    maintenance_kilometers: initialData?.maintenanceKilometers?.toString() || '',
    recurrency: initialData?.recurrency?.toString() || '',
  });

  const [cars, setCars] = useState<any[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsResponse, typesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/maintenance/types`)
        ]);

        if (carsResponse.data && Array.isArray(carsResponse.data.cars)) {
          setCars(carsResponse.data.cars);
        }

        if (typesResponse.data && Array.isArray(typesResponse.data.maintenanceTypes)) {
          const types = typesResponse.data.maintenanceTypes;
          setMaintenanceTypes(types);
          
          if (initialData) {
            const matchingType = types.find(
              (type: MaintenanceType) => type.name === initialData.maintenanceType
            );
            if (matchingType) {
              setMaintenanceData(prev => ({
                ...prev,
                maintenance_type_id: matchingType.id.toString(),
                recurrency: matchingType.recurrency.toString()
              }));
            }
          }
        } else {
          console.error('Invalid maintenance types data:', typesResponse.data);
          setMaintenanceTypes([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados necessários.");
        setMaintenanceTypes([]);
      }
    };

    fetchData();
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!maintenanceData.car_id) {
      newErrors.car_id = 'Selecione um carro';
    }

    if (!maintenanceData.maintenance_type_id) {
      newErrors.maintenance_type_id = 'Selecione o tipo de manutenção';
    }

    if (!maintenanceData.maintenance_date) {
      newErrors.maintenance_date = 'Selecione a data da manutenção';
    }

    if (!maintenanceData.maintenance_kilometers) {
      newErrors.maintenance_kilometers = 'Digite a quilometragem';
    } else if (parseInt(maintenanceData.maintenance_kilometers) < 0) {
      newErrors.maintenance_kilometers = 'A quilometragem não pode ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMaintenanceData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update recurrency when maintenance type changes
    if (name === 'maintenance_type_id') {
      const selectedType = maintenanceTypes.find(type => type.id.toString() === value);
      if (selectedType) {
        setMaintenanceData(prev => ({
          ...prev,
          [name]: value,
          recurrency: selectedType.recurrency.toString()
        }));
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedData = {
        ...maintenanceData,
        car_id: parseInt(maintenanceData.car_id),
        maintenance_type_id: parseInt(maintenanceData.maintenance_type_id),
        maintenance_kilometers: parseInt(maintenanceData.maintenance_kilometers),
        recurrency: parseInt(maintenanceData.recurrency)
      };

      const url = initialData?.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/car-maintenance/${initialData.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/car-maintenance`;

      const response = await axios({
        method: initialData?.id ? 'PUT' : 'POST',
        url,
        data: formattedData
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(initialData?.id ? 'Manutenção atualizada com sucesso!' : 'Manutenção registrada com sucesso!');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          
          if (onClose) {
            onClose();
          }
        }, 500);
      }
    } catch (error: any) {
      console.error("Erro ao registrar manutenção:", error);
      toast.error(error.response?.data?.message || "Erro ao registrar manutenção");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="mb-3">
        <label htmlFor="car_id" className="form-label">Carro</label>
        <select
          id="car_id"
          name="car_id"
          className={`form-select ${errors.car_id ? 'is-invalid' : ''}`}
          value={maintenanceData.car_id}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="">Selecione um carro</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.model} - {car.license_plate}
            </option>
          ))}
        </select>
        {errors.car_id && (
          <div className="invalid-feedback">
            {errors.car_id}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="maintenance_type_id" className="form-label">Tipo de Manutenção</label>
        <select
          id="maintenance_type_id"
          name="maintenance_type_id"
          className={`form-select ${errors.maintenance_type_id ? 'is-invalid' : ''}`}
          value={maintenanceData.maintenance_type_id}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="">Selecione o tipo de manutenção</option>
          {maintenanceTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.maintenance_type_id && (
          <div className="invalid-feedback">
            {errors.maintenance_type_id}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="maintenance_date" className="form-label">Data da manutenção</label>
        <input
          type="date"
          id="maintenance_date"
          name="maintenance_date"
          className={`form-control ${errors.maintenance_date ? 'is-invalid' : ''}`}
          value={maintenanceData.maintenance_date}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.maintenance_date && (
          <div className="invalid-feedback">
            {errors.maintenance_date}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="maintenance_kilometers" className="form-label">Quilometragem</label>
        <input
          type="number"
          id="maintenance_kilometers"
          name="maintenance_kilometers"
          className={`form-control ${errors.maintenance_kilometers ? 'is-invalid' : ''}`}
          value={maintenanceData.maintenance_kilometers}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.maintenance_kilometers && (
          <div className="invalid-feedback">
            {errors.maintenance_kilometers}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="recurrency" className="form-label">Recorrência (Km)</label>
        <input
          type="number"
          id="recurrency"
          name="recurrency"
          className="form-control"
          value={maintenanceData.recurrency}
          onChange={handleChange}
          disabled={true}
        />
        <small className="form-text text-muted">
          A recorrência é definida pelo tipo de manutenção selecionado.
        </small>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Salvando...
            </>
          ) : (
            initialData?.id ? 'Atualizar' : 'Salvar'
          )}
        </button>
      </div>
    </form>
  );
};

export default CarMaintenanceForm;