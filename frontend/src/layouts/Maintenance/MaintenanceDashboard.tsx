import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
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

interface MaintenanceStats {
  maintenance_type: string;
  total_maintenance: number;
}

interface OilChangeCostByCar {
  car_model: string;
  total_cost: number;
}

const MaintenanceDashboard: React.FC = () => {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceStats[]>([]);
  const [oilChangeCostData, setOilChangeCostData] = useState<OilChangeCostByCar[]>([]);
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
        
        // Fetch maintenance statistics
        const maintenanceResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/maintenance/stats?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        
        if (!maintenanceResponse.ok) {
          throw new Error('Failed to fetch maintenance statistics');
        }

        const maintenanceData = await maintenanceResponse.json();
        setMaintenanceData(maintenanceData);
        
        // Fetch oil change costs by car
        const oilChangeCostResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/oil-changes/costs-by-car?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        
        if (!oilChangeCostResponse.ok) {
          throw new Error('Failed to fetch oil change costs by car');
        }

        const oilChangeCostData = await oilChangeCostResponse.json();
        setOilChangeCostData(oilChangeCostData);
        
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
    labels: maintenanceData.map(item => item.maintenance_type),
    datasets: [
      {
        label: 'Total de Manutenções',
        data: maintenanceData.map(item => item.total_maintenance),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const maintenanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total de Manutenções por Tipo',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
    },
  };

  const oilChangeCostChartData = {
    labels: oilChangeCostData.map(item => item.car_model),
    datasets: [
      {
        label: 'Custo Total (R$)',
        data: oilChangeCostData.map(item => item.total_cost),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const oilChangeCostChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Custo Total de Troca de Óleo por Carro',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Custo (R$)'
        }
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
      <h1 className="mb-4">Dashboard de Manutenções</h1>
      
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
        <Col>
          <Card>
            <Card.Header>Total de Manutenções por Tipo</Card.Header>
            <Card.Body>
              <Bar data={maintenanceChartData} options={maintenanceChartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>Custo Total de Troca de Óleo por Carro</Card.Header>
            <Card.Body>
              <Bar data={oilChangeCostChartData} options={oilChangeCostChartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MaintenanceDashboard; 