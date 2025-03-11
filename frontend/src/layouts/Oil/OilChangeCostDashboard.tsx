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

interface OilChangeCostStats {
  car_model: string;
  total_cost: number;
}

const OilChangeCostDashboard: React.FC = () => {
  const [costData, setCostData] = useState<OilChangeCostStats[]>([]);
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
          `${process.env.REACT_APP_BACKEND_URL}/oil-changes/costs-by-car?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch oil change cost statistics');
        }

        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCostData(data);
        } else {
          console.error('Expected array but got:', data);
          setCostData([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const chartData = {
    labels: costData.map(item => item.car_model),
    datasets: [
      {
        label: 'Custo Total de Troca de Óleo (R$)',
        data: costData.map(item => item.total_cost),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
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
        text: 'Custo Total de Troca de Óleo por Carro',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            const value = Number(tickValue);
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
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
      <h1 className="mb-4">Dashboard de Custos de Troca de Óleo</h1>
      
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
            <Card.Header>Custo Total de Troca de Óleo por Carro</Card.Header>
            <Card.Body>
              {costData.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="alert alert-info">
                  Não há dados de troca de óleo registrados no período selecionado.
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OilChangeCostDashboard; 