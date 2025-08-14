// filepath: /c:/Users/calix/Downloads/ultimo_sem_login_log/frontend/src/layouts/Cars/CarDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface FuelCostData {
  month: string;
  totalCost: number;
  totalLiters: number;
}

interface OilChangeCostData {
  month: string;
  total_cost: number;
}

interface MaintenanceCountData {
  month: string;
  maintenance_count: number;
}

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [fuelCostData, setFuelCostData] = useState<FuelCostData[]>([]);
  const [oilChangeCostData, setOilChangeCostData] = useState<OilChangeCostData[]>([]);
  const [maintenanceCountData, setMaintenanceCountData] = useState<MaintenanceCountData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    current_kilometers: 0,
    next_tire_change: 0,
    is_next_tire_change_bigger: false,
    next_oil_change: 0,
    is_next_oil_change_bigger: false,
    driver_id: "",
    license_plate: "",
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${id}`);
        if (!response.ok) {
          throw new Error("Error loading car details.");
        }
        const data = await response.json();
        setCar(data);
        setFormData({
          make: data.make,
          model: data.model,
          current_kilometers: data.current_kilometers,
          next_tire_change: data.next_tire_change,
          is_next_tire_change_bigger: data.is_next_tire_change_bigger,
          next_oil_change: data.next_oil_change,
          is_next_oil_change_bigger: data.is_next_oil_change_bigger,
          driver_id: data.driver_id || "",
          license_plate: data.license_plate || "",
          status: data.status || 'active'
        });
      } catch (error) {
        console.error(error);
        toast.error("Error loading car details.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/drivers`);
        setDrivers(response.data.drivers);
      } catch (error) {
        console.error("Error loading drivers:", error);
        toast.error("Error loading driver list.");
      }
    };

    const fetchFuelCostData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/fuel/costs/${id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        setFuelCostData(response.data);
      } catch (error) {
        console.error("Error loading fuel data:", error);
        toast.error("Error loading fuel cost data.");
      }
    };

    const fetchOilChangeCostData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/oil-changes/costs-by-month/${id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        setOilChangeCostData(response.data);
      } catch (error) {
        console.error("Error loading oil change data:", error);
        toast.error("Error loading oil change cost data.");
      }
    };

    const fetchMaintenanceCountData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/maintenance-stats/count-by-month/${id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        );
        setMaintenanceCountData(response.data);
      } catch (error) {
        console.error("Error loading maintenance data:", error);
        toast.error("Error loading maintenance data.");
      }
    };

    fetchCar();
    fetchDrivers();
    fetchFuelCostData();
    fetchOilChangeCostData();
    fetchMaintenanceCountData();
  }, [id, dateRange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Car updated successfully!");
        setIsEditing(false);
        // Refresh car data
        const updatedCarResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cars/${id}`);
        const updatedCarData = await updatedCarResponse.json();
        setCar(updatedCarData);
      } else {
        toast.error("Error updating car.");
      }
    } catch (error) {
      console.error("Error updating car: ", error);
      toast.error("Error updating car. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      make: car.make,
      model: car.model,
      current_kilometers: car.current_kilometers,
      next_tire_change: car.next_tire_change,
      is_next_tire_change_bigger: car.is_next_tire_change_bigger,
      next_oil_change: car.next_oil_change,
      is_next_oil_change_bigger: car.is_next_oil_change_bigger,
      driver_id: car.driver_id || "",
      license_plate: car.license_plate || "",
      status: car.status || 'active'
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (!car) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Car not found.
        </div>
      </div>
    );
  }

  const fuelChartData = {
    labels: fuelCostData.map(data => data.month),
    datasets: [
      {
        label: 'Total Cost (U$)',
        data: fuelCostData.map(data => data.totalCost),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Liters Fueled',
        data: fuelCostData.map(data => data.totalLiters),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Fuel Costs per Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const oilChangeChartData = {
    labels: oilChangeCostData.map(data => {
      // Format month from YYYY-MM to MM/YYYY
      const [year, month] = data.month.split('-');
      return `${month}/${year}`;
    }),
    datasets: [
      {
        label: 'Oil Change Cost (U$)',
        data: oilChangeCostData.map(data => data.total_cost),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const oilChangeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Oil Change Costs per Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost (U$)'
        }
      },
    },
  };

  const maintenanceChartData = {
    labels: maintenanceCountData.map(data => {
      // Format month from YYYY-MM to MM/YYYY
      const [year, month] = data.month.split('-');
      return `${month}/${year}`;
    }),
    datasets: [
      {
        label: 'Number of Maintenances',
        data: maintenanceCountData.map(data => data.maintenance_count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const maintenanceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Number of Maintenances per Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Quantity'
        }
      },
    },
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Car Details</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/cars')}
        >
          Back to List
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {!isEditing ? (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Basic Information</h5>
                    </div>
                    <div className="card-body">
                      <dl className="row mb-0">
                        <dt className="col-sm-4">Brand</dt>
                        <dd className="col-sm-8">{car.make}</dd>

                        <dt className="col-sm-4">Model</dt>
                        <dd className="col-sm-8">{car.model}</dd>

                        <dt className="col-sm-4">License Plate</dt>
                        <dd className="col-sm-8">{car.license_plate || "Not informed"}</dd>

                        <dt className="col-sm-4">Status</dt>
                        <dd className="col-sm-8">
                          <span className={`badge ${car.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {car.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Maintenance Information</h5>
                    </div>
                    <div className="card-body">
                      <dl className="row mb-0">
                        <dt className="col-sm-4">Mileage</dt>
                        <dd className="col-sm-8">{car.current_kilometers} km</dd>

                        <dt className="col-sm-4">Next Tire Change</dt>
                        <dd className="col-sm-8">
                          <span className={car.is_next_tire_change_bigger ? 'text-danger' : ''}>
                            {car.next_tire_change} km
                            {car.is_next_tire_change_bigger && 
                              <span className="badge bg-danger ms-2">Overdue</span>
                            }
                          </span>
                        </dd>

                        <dt className="col-sm-4">Next Oil Change</dt>
                        <dd className="col-sm-8">
                          <span className={car.is_next_oil_change_bigger ? 'text-danger' : ''}>
                            {car.next_oil_change} km
                            {car.is_next_oil_change_bigger && 
                              <span className="badge bg-danger ms-2">Overdue</span>
                            }
                          </span>
                        </dd>

                        <dt className="col-sm-4">Driver</dt>
                        <dd className="col-sm-8">
                          {drivers.find(d => d.id === car.driver_id)?.name || "Not assigned"}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button onClick={handleEdit} className="btn btn-primary">
                  Edit Information
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="make" className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="model" className="form-label">Model</label>
                    <input
                      type="text"
                      className="form-control"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="license_plate" className="form-label">License Plate</label>
                    <input
                      type="text"
                      className="form-control"
                      id="license_plate"
                      name="license_plate"
                      value={formData.license_plate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="driver_id" className="form-label">Driver</label>
                    <select
                      className="form-select"
                      id="driver_id"
                      name="driver_id"
                      value={formData.driver_id}
                      onChange={handleChange}
                    >
                      <option value="">Select a driver</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="current_kilometers" className="form-label">Current Mileage</label>
                    <input
                      type="number"
                      className="form-control"
                      id="current_kilometers"
                      name="current_kilometers"
                      value={formData.current_kilometers}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="next_tire_change" className="form-label">Next Tire Change (Km)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="next_tire_change"
                      name="next_tire_change"
                      value={formData.next_tire_change}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="next_oil_change" className="form-label">Next Oil Change (Km)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="next_oil_change"
                      name="next_oil_change"
                      value={formData.next_oil_change}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Date Range Controls */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Analysis Period</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">Start Date:</label>
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
                <label htmlFor="endDate" className="form-label">End Date:</label>
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
        </div>
      </div>

      {/* Fuel Cost Dashboard */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Fuel Cost Dashboard</h5>
        </div>
        <div className="card-body">
          {fuelCostData.length > 0 ? (
            <div style={{ height: '400px' }}>
              <Bar options={chartOptions} data={fuelChartData} />
            </div>
          ) : (
            <div className="alert alert-info">
              There is no fueling data registered for this vehicle in the selected period.
            </div>
          )}
        </div>
      </div>

      {/* Oil Change Cost Dashboard - Full Width */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Oil Change Cost Dashboard</h5>
        </div>
        <div className="card-body">
          {oilChangeCostData.length > 0 ? (
            <div style={{ height: '400px' }}>
              <Line options={oilChangeChartOptions} data={oilChangeChartData} />
            </div>
          ) : (
            <div className="alert alert-info">
              There is no oil change data registered for this vehicle in the selected period.
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Row for Maintenance */}
      <div className="row">
        {/* Left Column - Maintenance Dashboard */}
        <div className="col-md-6">
          {/* Maintenance Count Dashboard */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Maintenance Dashboard</h5>
            </div>
            <div className="card-body">
              {maintenanceCountData.length > 0 ? (
                <div style={{ height: '400px' }}>
                  <Line options={maintenanceChartOptions} data={maintenanceChartData} />
                </div>
              ) : (
                <div className="alert alert-info">
                  There is no maintenance data registered for this vehicle in the selected period.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Empty for now, can be used for future dashboards */}
        <div className="col-md-6">
          {/* Space for future dashboards */}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;