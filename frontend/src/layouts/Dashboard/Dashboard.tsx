import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
  TooltipItem
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { format, subMonths } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface FuelingDataItem {
  detalhesDoCarro: string;
  veiculo: string;
  custo_total: number;
}

interface FuelByTypeItem {
  tipo_combustivel: string;
  total_litros: number;
}

interface FuelCostByTypeItem {
  tipo_combustivel: string;
  custo_total: number;
}

interface MaintenanceByTypeItem {
  tipo_manutencao: string;
  total_manutencoes: number;
}

interface PieChartData extends ChartData<'pie'> {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

interface BarChartData extends ChartData<'bar'> {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }>;
}

interface FuelingByDateItem {
  periodo: string;
  data_inicio: string;
  data_fim: string;
  total_abastecimentos: number;
}

type TimeGrouping = 'day' | 'week' | 'month' | 'semester' | 'year';

const Dashboard = () => {
  const [fuelingData, setFuelingData] = useState<PieChartData>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });
  
  const [fuelByTypeData, setFuelByTypeData] = useState<BarChartData>({
    labels: [],
    datasets: [{
      label: 'Total de Litros',
      data: [],
      backgroundColor: '#36A2EB',
      borderColor: '#2993DC',
      borderWidth: 1
    }]
  });

  const [fuelCostByTypeData, setFuelCostByTypeData] = useState<BarChartData>({
    labels: [],
    datasets: [{
      label: 'Custo Total',
      data: [],
      backgroundColor: '#FF6384',
      borderColor: '#FF4F74',
      borderWidth: 1
    }]
  });

  const [maintenanceByTypeData, setMaintenanceByTypeData] = useState<BarChartData>({
    labels: [],
    datasets: [{
      label: 'Total de Manutenções',
      data: [],
      backgroundColor: '#FFCE56',
      borderColor: '#FFB420',
      borderWidth: 1
    }]
  });

  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('month');
  const [fuelingByDateData, setFuelingByDateData] = useState<BarChartData>({
    labels: [],
    datasets: [{
      label: 'Total de Abastecimentos',
      data: [],
      backgroundColor: '#4BC0C0',
      borderColor: '#3AA7A7',
      borderWidth: 1
    }]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [totalFuelCost, setTotalFuelCost] = useState<number>(0);
  const [totalFuelLiters, setTotalFuelLiters] = useState<number>(0);
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch vehicle cost data
        const costResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/fueling/statistics?` +
          `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );

        // Fetch fuel by type data
        const fuelByTypeResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/fueling/statistics/fuel-by-type?` +
          `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );

        // Fetch fuel cost by type data
        const fuelCostByTypeResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/fueling/statistics/fuel-cost-by-type?` +
          `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );

        // Fetch maintenance by type data
        const maintenanceByTypeResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/fueling/statistics/maintenance-by-type?` +
          `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );

        // Fetch fueling by date data
        const fuelingByDateResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/fueling/statistics/fueling-by-date?` +
          `startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&groupBy=${timeGrouping}`
        );

        if (!costResponse.ok || !fuelByTypeResponse.ok || !fuelCostByTypeResponse.ok || 
            !maintenanceByTypeResponse.ok || !fuelingByDateResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const costData: FuelingDataItem[] = await costResponse.json();
        const fuelByTypeData: FuelByTypeItem[] = await fuelByTypeResponse.json();
        const fuelCostByTypeData: FuelCostByTypeItem[] = await fuelCostByTypeResponse.json();
        const maintenanceByTypeData: MaintenanceByTypeItem[] = await maintenanceByTypeResponse.json();
        const fuelingByDateData: FuelingByDateItem[] = await fuelingByDateResponse.json();

        // Calculate totals
        const totalCost = costData.reduce((sum, item) => sum + Number(item.custo_total), 0);
        setTotalFuelCost(totalCost);
        
        const totalLiters = fuelByTypeData.reduce((sum, item) => sum + Number(item.total_litros), 0);
        setTotalFuelLiters(totalLiters);
        
        // Transform the data for the pie chart
        const pieChartData: PieChartData = {
          labels: costData.map(item => `${item.detalhesDoCarro} (${item.veiculo})`),
          datasets: [
            {
              data: costData.map(item => Number(item.custo_total) || 0),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0'
              ],
              borderColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0'
              ],
              borderWidth: 1,
            },
          ],
        };

        // Transform the data for the fuel by type bar chart
        const barChartData: BarChartData = {
          labels: fuelByTypeData.map(item => item.tipo_combustivel),
          datasets: [{
            label: 'Total de Litros',
            data: fuelByTypeData.map(item => Number(item.total_litros) || 0),
            backgroundColor: '#36A2EB',
            borderColor: '#2993DC',
            borderWidth: 1
          }]
        };

        // Transform the data for the fuel cost by type bar chart
        const costBarChartData: BarChartData = {
          labels: fuelCostByTypeData.map(item => item.tipo_combustivel),
          datasets: [{
            label: 'Custo Total',
            data: fuelCostByTypeData.map(item => Number(item.custo_total) || 0),
            backgroundColor: '#FF6384',
            borderColor: '#FF4F74',
            borderWidth: 1
          }]
        };

        // Transform the data for the maintenance by type bar chart
        const maintenanceChartData: BarChartData = {
          labels: maintenanceByTypeData.map(item => item.tipo_manutencao),
          datasets: [{
            label: 'Total de Manutenções',
            data: maintenanceByTypeData.map(item => Number(item.total_manutencoes) || 0),
            backgroundColor: '#FFCE56',
            borderColor: '#FFB420',
            borderWidth: 1
          }]
        };

        // Transform the data for the fueling by date bar chart
        const fuelingDateChartData: BarChartData = {
          labels: fuelingByDateData.map(item => {
            switch (timeGrouping) {
              case 'day':
                return format(new Date(item.data_inicio), 'dd/MM/yyyy');
              case 'week':
                return `Semana ${item.data_inicio.split('-')[1]}/${item.data_inicio.split('-')[0]}`;
              case 'month':
                return format(new Date(item.data_inicio + '-01'), 'MM/yyyy');
              case 'semester':
                const [year, semester] = item.periodo.split('-');
                return `${semester}º Sem/${year}`;
              case 'year':
                return item.data_inicio;
              default:
                return item.data_inicio;
            }
          }),
          datasets: [{
            label: 'Total de Abastecimentos',
            data: fuelingByDateData.map(item => Number(item.total_abastecimentos) || 0),
            backgroundColor: '#4BC0C0',
            borderColor: '#3AA7A7',
            borderWidth: 1
          }]
        };

        setFuelingData(pieChartData);
        setFuelByTypeData(barChartData);
        setFuelCostByTypeData(costBarChartData);
        setMaintenanceByTypeData(maintenanceChartData);
        setFuelingByDateData(fuelingDateChartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [dateRange, timeGrouping]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeGroupingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeGrouping(e.target.value as TimeGrouping);
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard de Custos com Combustível</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">Data Inicial:</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">Data Final:</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">Custo Total com Combustível</h5>
                  <h3 className="text-primary">R$ {totalFuelCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">Total de Litros Abastecidos</h5>
                  <h3 className="text-success">{totalFuelLiters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L</h3>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: '400px' }}>
            <Pie
              data={fuelingData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      boxWidth: 20,
                      padding: 20
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        try {
                          const value = Number(context.raw);
                          if (!isNaN(value)) {
                            return `R$ ${value.toFixed(2)}`;
                          }
                          return 'Valor inválido';
                        } catch (err) {
                          console.error('Error formatting tooltip value:', err);
                          return 'Erro ao formatar valor';
                        }
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Total de Combustível Abastecido por Tipo</h5>
              <div style={{ height: '300px' }}>
                <Bar
                  data={fuelByTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            try {
                              const value = Number(context.raw);
                              if (!isNaN(value)) {
                                return `${value.toFixed(2)}L`;
                              }
                              return 'Valor inválido';
                            } catch (err) {
                              console.error('Error formatting tooltip value:', err);
                              return 'Erro ao formatar valor';
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Litros'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Custo Total de Combustível por Tipo</h5>
              <div style={{ height: '300px' }}>
                <Bar
                  data={fuelCostByTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            try {
                              const value = Number(context.raw);
                              if (!isNaN(value)) {
                                return `R$ ${value.toFixed(2)}`;
                              }
                              return 'Valor inválido';
                            } catch (err) {
                              console.error('Error formatting tooltip value:', err);
                              return 'Erro ao formatar valor';
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Custo (R$)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Total de Manutenções por Tipo</h5>
              <div style={{ height: '300px' }}>
                <Bar
                  data={maintenanceByTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            try {
                              const value = Number(context.raw);
                              if (!isNaN(value)) {
                                return `${value} manutenção${value !== 1 ? 'ões' : ''}`;
                              }
                              return 'Valor inválido';
                            } catch (err) {
                              console.error('Error formatting tooltip value:', err);
                              return 'Erro ao formatar valor';
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Total de Abastecimentos por Data</h5>
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={timeGrouping}
                  onChange={handleTimeGroupingChange}
                >
                  <option value="day">Por Dia</option>
                  <option value="week">Por Semana</option>
                  <option value="month">Por Mês</option>
                  <option value="semester">Por Semestre</option>
                  <option value="year">Por Ano</option>
                </select>
              </div>
              <div style={{ height: '300px' }}>
                <Bar
                  data={fuelingByDateData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            try {
                              const value = Number(context.raw);
                              if (!isNaN(value)) {
                                return `${value} abastecimento${value !== 1 ? 's' : ''}`;
                              }
                              return 'Valor inválido';
                            } catch (err) {
                              console.error('Error formatting tooltip value:', err);
                              return 'Erro ao formatar valor';
                            }
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Quantidade'
                        }
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 