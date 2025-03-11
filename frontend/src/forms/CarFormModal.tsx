import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { PrimaryButton } from '../components/common/Buttons';

interface CarFormProps {
  initialData?: {
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
  } | null;
  onSuccess?: () => void;
}

const CarForm: React.FC<CarFormProps> = ({ initialData, onSuccess }) => {
  const [carData, setCarData] = useState({
    make: initialData?.make || "",
    model: initialData?.model || "",
    current_kilometers: initialData?.current_kilometers || 0,
    next_tire_change: initialData?.next_tire_change || 0,
    is_next_tire_change_bigger: initialData?.is_next_tire_change_bigger || false,
    next_oil_change: initialData?.next_oil_change || 0,
    is_next_oil_change_bigger: initialData?.is_next_oil_change_bigger || false,
    driver_id: initialData?.driver_id || undefined,
    license_plate: initialData?.license_plate || "",
  });

  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/drivers`);
        if (Array.isArray(response.data.drivers)) {
          setDrivers(response.data.drivers);
        } else {
          throw new Error("Formato de resposta inesperado");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Falha ao carregar motoristas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<number | undefined>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setCarData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) :
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = initialData?.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/cars/${initialData.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/cars`;

      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...carData,
          current_kilometers: Number(carData.current_kilometers),
          next_tire_change: Number(carData.next_tire_change),
          next_oil_change: Number(carData.next_oil_change),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar o carro');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(initialData?.id ? 'Erro ao atualizar o carro' : 'Erro ao criar o carro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '1rem', padding: '1rem' }}>
        <TextField
          label="Marca"
          name="make"
          value={carData.make}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          label="Modelo"
          name="model"
          value={carData.model}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          label="Quilometragem Atual"
          name="current_kilometers"
          type="number"
          value={carData.current_kilometers}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          label="Próxima Troca de Pneu (km)"
          name="next_tire_change"
          type="number"
          value={carData.next_tire_change}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="is_next_tire_change_bigger"
              checked={carData.is_next_tire_change_bigger}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          }
          label="Próxima troca de pneu é maior?"
        />

        <TextField
          label="Próxima Troca de Óleo (km)"
          name="next_oil_change"
          type="number"
          value={carData.next_oil_change}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="is_next_oil_change_bigger"
              checked={carData.is_next_oil_change_bigger}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          }
          label="Próxima troca de óleo é maior?"
        />

        <TextField
          label="Placa"
          name="license_plate"
          value={carData.license_plate}
          onChange={handleChange}
          required
          fullWidth
          disabled={isSubmitting}
        />

        <FormControl fullWidth>
          <InputLabel id="driver-label">Motorista</InputLabel>
          <Select
            labelId="driver-label"
            name="driver_id"
            value={carData.driver_id}
            onChange={handleChange}
            label="Motorista"
            disabled={isSubmitting || loading}
          >
            <MenuItem value={undefined}>
              <em>Nenhum</em>
            </MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.id} value={driver.id}>
                {driver.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          style={{ marginTop: '1rem' }}
        >
          {isSubmitting ? 'Salvando...' : (initialData?.id ? 'Atualizar' : 'Adicionar')}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default CarForm;