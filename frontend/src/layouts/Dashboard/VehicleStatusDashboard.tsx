import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VehicleStatus {
  carro_id: number;
  marca_carro: string;
  modelo_carro: string;
  placa_carro: string;
  quilometragem_atual: number;
  data_proxima_troca_pneu: string;
  pneu_atrasado: boolean;
  data_proxima_troca_oleo: string;
  oleo_atrasado: boolean;
  nome_motorista: string;
  cnh_motorista: string;
  total_combustivel: number;
  custo_total_combustivel: number;
  media_consumo_km_por_litro: number;
  total_trocas_oleo: number;
  ultima_troca_oleo_data: string;
  ultima_troca_oleo_km: number;
  total_trocas_pneu: number;
  ultima_troca_pneu_data: string;
  ultima_troca_pneu_km: number;
  total_manutencoes: number;
  tipos_manutencao: string;
  ultima_manutencao_data: string;
}

const VehicleStatusDashboard: React.FC = () => {
  const [vehicleData, setVehicleData] = useState<VehicleStatus[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/vehicle-status?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle status data');
        }

        const data = await response.json();
        setVehicleData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const maintenanceChartData = {
    labels: vehicleData.map(v => `${v.marca_carro} ${v.modelo_carro}`),
    datasets: [
      {
        label: 'Total Manutenções',
        data: vehicleData.map(v => v.total_manutencoes),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Trocas de Óleo',
        data: vehicleData.map(v => v.total_trocas_oleo),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Trocas de Pneu',
        data: vehicleData.map(v => v.total_trocas_pneu),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  const fuelChartData = {
    labels: vehicleData.map(v => `${v.marca_carro} ${v.modelo_carro}`),
    datasets: [
      {
        label: 'Consumo Total de Combustível (L)',
        data: vehicleData.map(v => v.total_combustivel),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Custo Total (R$)',
        data: vehicleData.map(v => v.custo_total_combustivel),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Estatísticas por Veículo',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container mt-4" style={{ marginLeft: '60px' }}>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4" style={{ marginLeft: '60px' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ marginLeft: '60px' }}>
      <h1 className="mb-4">Dashboard de Status dos Veículos</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Data Inicial</Form.Label>
            <Form.Control
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Data Final</Form.Label>
            <Form.Control
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Manutenções por Veículo</Card.Header>
            <Card.Body>
              <Bar data={maintenanceChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Consumo e Custo de Combustível</Card.Header>
            <Card.Body>
              <Bar data={fuelChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>Detalhes dos Veículos</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Placa</th>
                  <th>Motorista</th>
                  <th>Quilometragem</th>
                  <th>Próx. Troca Óleo (km)</th>
                  <th>Próx. Troca Pneu (km)</th>
                  <th>Consumo Médio</th>
                  <th>Total Manutenções</th>
                  <th>Última Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((vehicle) => (
                  <tr key={vehicle.carro_id}>
                    <td>{`${vehicle.marca_carro} ${vehicle.modelo_carro}`}</td>
                    <td>{vehicle.placa_carro}</td>
                    <td>{vehicle.nome_motorista || 'Não atribuído'}</td>
                    <td>{vehicle.quilometragem_atual.toLocaleString()} km</td>
                    <td className={vehicle.oleo_atrasado ? 'text-danger' : ''}>
                      {vehicle.data_proxima_troca_oleo.toLocaleString()} km
                    </td>
                    <td className={vehicle.pneu_atrasado ? 'text-danger' : ''}>
                      {vehicle.data_proxima_troca_pneu.toLocaleString()} km
                    </td>
                    <td>{vehicle.media_consumo_km_por_litro?.toFixed(2) || '-'} km/L</td>
                    <td>{vehicle.total_manutencoes}</td>
                    <td>
                      {vehicle.ultima_manutencao_data
                        ? format(new Date(vehicle.ultima_manutencao_data), 'dd/MM/yyyy')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VehicleStatusDashboard; 