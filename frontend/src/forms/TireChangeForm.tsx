import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TireChangeFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialData?: {
    id?: number;
    carId: number;
    tireChangeDate: string;
    tireChangeKilometers: number;
    observation?: string;
    make?: string;
    model?: string;
    licensePlate?: string;
  } | null;
}

const TireChangeForm: React.FC<TireChangeFormProps> = ({ onSuccess, onClose, initialData }) => {
  const [tireChangeData, setTireChangeData] = useState({
    car_id: initialData?.carId?.toString() || '',
    tire_change_date: initialData?.tireChangeDate?.split('T')[0] || '',
    tire_change_kilometers: initialData?.tireChangeKilometers?.toString() || '',
    observation: initialData?.observation || '',
  });

  const [cars, setCars] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars`);
        if (response.data && Array.isArray(response.data.cars)) {
          setCars(response.data.cars);
        } else {
          console.error("A resposta não contém um array de carros:", response.data);
          toast.error("Erro ao carregar a lista de carros");
        }
      } catch (error) {
        console.error("Erro ao carregar os carros:", error);
        toast.error("Erro ao carregar a lista de carros");
      }
    };

    fetchCars();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!tireChangeData.car_id) {
      newErrors.car_id = 'Selecione um carro';
    }

    if (!tireChangeData.tire_change_date) {
      newErrors.tire_change_date = 'Selecione a data da troca';
    }

    if (!tireChangeData.tire_change_kilometers) {
      newErrors.tire_change_kilometers = 'Digite a quilometragem';
    } else if (parseInt(tireChangeData.tire_change_kilometers) < 0) {
      newErrors.tire_change_kilometers = 'A quilometragem não pode ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTireChangeData(prev => ({
      ...prev,
      [name]: value
    }));
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
        ...tireChangeData,
        car_id: parseInt(tireChangeData.car_id),
        tire_change_kilometers: parseInt(tireChangeData.tire_change_kilometers)
      };

      const url = initialData?.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/tire-change/${initialData.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/tire-change`;

      const response = await axios({
        method: initialData?.id ? 'PUT' : 'POST',
        url,
        data: formattedData
      });

      if (response.status === 200 || response.status === 201) {
        // Fetch current kilometers of the car
        const carResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars/${formattedData.car_id}`);
        const currentKilometers = carResponse.data.current_kilometers;

        // Update current_kilometers of the car only if the new value is greater
        if (formattedData.tire_change_kilometers > currentKilometers) {
          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cars/${formattedData.car_id}/current-kilometers`, {
            current_kilometers: formattedData.tire_change_kilometers,
          });
        }

        // Update next_tire_change of the car
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cars/${formattedData.car_id}/next-tire-change`, {
          next_tire_change: formattedData.tire_change_kilometers + 40000,
        });

        if (onSuccess) {
          onSuccess();
        }
        
        if (onClose) {
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Erro ao registrar troca de pneus:", error);
      toast.error(error.response?.data?.message || "Erro ao registrar troca de pneus");
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
          value={tireChangeData.car_id}
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
        <label htmlFor="tire_change_date" className="form-label">Data da Troca</label>
        <input
          type="date"
          id="tire_change_date"
          name="tire_change_date"
          className={`form-control ${errors.tire_change_date ? 'is-invalid' : ''}`}
          value={tireChangeData.tire_change_date}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.tire_change_date && (
          <div className="invalid-feedback">
            {errors.tire_change_date}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="tire_change_kilometers" className="form-label">Quilometragem</label>
        <input
          type="number"
          id="tire_change_kilometers"
          name="tire_change_kilometers"
          className={`form-control ${errors.tire_change_kilometers ? 'is-invalid' : ''}`}
          value={tireChangeData.tire_change_kilometers}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.tire_change_kilometers && (
          <div className="invalid-feedback">
            {errors.tire_change_kilometers}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="observation" className="form-label">Observação</label>
        <textarea
          id="observation"
          name="observation"
          className="form-control"
          value={tireChangeData.observation}
          onChange={handleChange}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        {onClose && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar' : 'Salvar')}
        </button>
      </div>
    </form>
  );
};

export default TireChangeForm;