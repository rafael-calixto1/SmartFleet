// filepath: /c:/Users/calix/Downloads/ultimo_sem_login_log/frontend/src/forms/CarFormPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TextField, 
  Checkbox, 
  FormControlLabel, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Paper
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from 'react-toastify';
import PageLayout from '../components/common/PageLayout';
import { PrimaryButton, LinkButton } from '../components/common/Buttons';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const CarFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [carData, setCarData] = useState({
    make: "",
    model: "",
    current_kilometers: 0,
    next_tire_change: 0,
    is_next_tire_change_bigger: false,
    next_oil_change: 0,
    is_next_oil_change_bigger: false,
    driver_id: undefined,
    license_plate: "",
  });

  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/drivers`);
        if (Array.isArray(response.data.drivers)) {
          setDrivers(response.data.drivers);
        } else {
          throw new Error("Formato de resposta inesperado");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Falha ao carregar motoristas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setCarData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carData.make || !carData.model || !carData.next_tire_change || !carData.next_oil_change || !carData.license_plate) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }

    const dataToSend = {
      ...carData,
      is_next_tire_change_bigger: carData.is_next_tire_change_bigger ?? false,
      is_next_oil_change_bigger: carData.is_next_oil_change_bigger ?? false,
      driver_id: carData.driver_id ?? null,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cars`, dataToSend);
      toast.success("Carro adicionado com sucesso!");
      navigate('/cars');
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error("Falha ao adicionar carro. Tente novamente.");
    }
  };

  const pageActions = (
    <LinkButton to="/cars">
      Voltar para Lista
    </LinkButton>
  );

  return (
    <div style={{ paddingLeft: '60px' }}>
    <PageLayout title="Adicionar Novo Carro" actions={pageActions}>
      <Paper elevation={0} sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <DirectionsCarIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
          <Typography variant="h5" component="h2" color="success.main">
            Informações do Veículo
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Informações Básicas
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Marca"
                    name="make"
                    value={carData.make}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Modelo"
                    name="model"
                    value={carData.model}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Placa do Veículo"
                    name="license_plate"
                    value={carData.license_plate}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="driver-select-label">Motorista</InputLabel>
                    <Select
                      labelId="driver-select-label"
                      name="driver_id"
                      value={carData.driver_id || ""}
                      onChange={handleChange}
                      label="Motorista"
                    >
                      <MenuItem value="" disabled>
                        {loading ? <CircularProgress size={24} /> : "Selecione um motorista"}
                      </MenuItem>
                      {drivers.map((driver) => (
                        <MenuItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Informações de Quilometragem */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Informações de Quilometragem
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Kilometragem Atual"
                    name="current_kilometers"
                    value={carData.current_kilometers}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Informações de Manutenção */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Informações de Manutenção
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Próxima Troca de Pneu (Km)"
                    name="next_tire_change"
                    value={carData.next_tire_change}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={carData.is_next_tire_change_bigger}
                        name="is_next_tire_change_bigger"
                        onChange={handleChange}
                      />
                    }
                    label="Troca de Pneu Vencida?"
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Próxima Troca de Óleo (Km)"
                    name="next_oil_change"
                    value={carData.next_oil_change}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={carData.is_next_oil_change_bigger}
                        name="is_next_oil_change_bigger"
                        onChange={handleChange}
                      />
                    }
                    label="Troca de Óleo Vencida?"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="large"
                >
                  Adicionar Carro
                </PrimaryButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageLayout>
    </div>
  );
};

export default CarFormPage; 