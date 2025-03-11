import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OilChangeFormProps {
  onSuccess?: () => void;
  initialData?: any;
  cars?: any[];
}

const OilChangeForm: React.FC<OilChangeFormProps> = ({ onSuccess, initialData, cars: propsCars }) => {
  const [oilChangeData, setOilChangeData] = useState({
    car_id: initialData?.carId || 0,
    oil_change_date: initialData?.oilChangeDate ? new Date(initialData.oilChangeDate).toISOString().split('T')[0] : "",
    oil_change_kilometers: initialData?.oilChangeKilometers || 0,
    liters_quantity: initialData?.litersQuantity || 0,
    price_per_liter: initialData?.pricePerLiter || 0,
    total_cost: initialData?.totalCost || 0,
    observation: initialData?.observation || "",
  });

  const [cars, setCars] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      if (propsCars) {
        setCars(propsCars);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars`);
        if (response.data && Array.isArray(response.data.cars)) {
          const carsWithPlates = response.data.cars.map((car: any) => ({
            ...car,
            plate: car.license_plate,
          }));
          setCars(carsWithPlates);
        } else {
          console.error("A resposta não contém um array de carros:", response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar os carros:", error);
      }
    };

    fetchCars();
  }, [propsCars]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setOilChangeData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === "oil_change_kilometers" || name === "liters_quantity" || name === "price_per_liter" ? parseFloat(value) || 0 : value,
      };

      if (name === "liters_quantity" || name === "price_per_liter") {
        updatedData.total_cost = parseFloat((updatedData.liters_quantity * updatedData.price_per_liter).toFixed(3));
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const url = initialData?.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/oil-changes/${initialData.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/oil-changes`;

      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: {
          car_id: oilChangeData.car_id,
          oil_change_date: oilChangeData.oil_change_date,
          oil_change_kilometers: oilChangeData.oil_change_kilometers,
          liters_quantity: oilChangeData.liters_quantity,
          price_per_liter: oilChangeData.price_per_liter,
          total_cost: oilChangeData.total_cost,
          observation: oilChangeData.observation,
        }
      });

      // Fetch current kilometers of the car
      const carResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cars/${oilChangeData.car_id}`);
      const currentKilometers = carResponse.data.current_kilometers;

      // Update current_kilometers of the car only if the new value is greater
      if (oilChangeData.oil_change_kilometers > currentKilometers) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cars/${oilChangeData.car_id}/current-kilometers`, {
          current_kilometers: oilChangeData.oil_change_kilometers,
        });
        
        toast.success("Quilometragem atualizada com sucesso!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      // Atualizar next_oil_change do carro
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cars/${oilChangeData.car_id}/next-oil-change`, {
        next_oil_change: oilChangeData.oil_change_kilometers + 10000,
      });

      toast.success(initialData?.id ? "Troca de óleo atualizada com sucesso!" : "Troca de óleo registrada com sucesso!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
      // Reset form if not editing
      if (!initialData?.id) {
        setOilChangeData({
          car_id: 0,
          oil_change_date: "",
          oil_change_kilometers: 0,
          liters_quantity: 0,
          price_per_liter: 0,
          total_cost: 0,
          observation: "",
        });
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao registrar troca de óleo:", error);
      toast.error("Erro ao registrar troca de óleo. Tente novamente.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{initialData?.id ? 'Editar Troca de Óleo' : 'Adicionar Nova Troca de Óleo'}</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Carro:</label>
          <select
            name="car_id"
            value={oilChangeData.car_id}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          >
            <option value="">Selecione um carro</option>
            {cars.length > 0 ? (
              cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.plate} - {car.make} {car.model}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Sem carros disponíveis
              </option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Data da Troca de Óleo:</label>
          <input
            type="date"
            name="oil_change_date"
            value={oilChangeData.oil_change_date}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quilometragem na Troca de Óleo:</label>
          <input
            type="number"
            name="oil_change_kilometers"
            value={oilChangeData.oil_change_kilometers}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantidade de Litros:</label>
          <input
            type="number"
            name="liters_quantity"
            value={oilChangeData.liters_quantity}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preço por Litro:</label>
          <input
            type="number"
            name="price_per_liter"
            value={oilChangeData.price_per_liter}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Custo Total:</label>
          <input
            type="number"
            name="total_cost"
            value={oilChangeData.total_cost}
            readOnly
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Observação:</label>
          <textarea
            name="observation"
            value={oilChangeData.observation}
            onChange={handleChange}
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : (initialData?.id ? 'Atualizar Troca de Óleo' : 'Adicionar Troca de Óleo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OilChangeForm;