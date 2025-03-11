import React, { Suspense } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './layouts/NavAndFooter/NavBar';
import CarFormPage from './forms/CarFormPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Usando React.lazy para carregar componentes de forma assíncrona
const Dashboard = React.lazy(() => import('./layouts/Dashboard/Dashboard'));
const DriverList = React.lazy(() => import('./layouts/Drivers/DriverList'));
const DriverDetails = React.lazy(() => import('./layouts/Drivers/DriverDetails'));  // Novo componente para detalhes do motorista
const CarList = React.lazy(() => import('./layouts/Cars/CarList'));
const CarDetails = React.lazy(() => import('./layouts/Cars/CarDetails'));
const FuelingHistoryList = React.lazy(() => import('./layouts/Fueling/FuelingHistoryList'));
const OilChangeHistoryList = React.lazy(() => import('./layouts/Oil/OilChangeHistoryList'));
const OilChangeCostDashboard = React.lazy(() => import('./layouts/Oil/OilChangeCostDashboard'));
const TireChangeHistoryList = React.lazy(() => import('./layouts/Tire/TireChangeHistoryList'));
const CarMaintenanceList = React.lazy(() => import('./layouts/CarMaintenance/CarMaintenanceList'));
const CarMaintenanceDetails = React.lazy(() => import('./layouts/CarMaintenance/CarMaintenanceDetails'));  // Carregar o componente de detalhes da manutenção
const MaintenanceTypeList = React.lazy(() => import('./layouts/Maintenance/MaintenanceTypeList'));
const MaintenanceHistoryList = React.lazy(() => import('./layouts/Maintenance/MaintenanceHistoryList'));
const MaintenanceDashboard = React.lazy(() => import('./layouts/Maintenance/MaintenanceDashboard'));
const VehicleStatusDashboard = React.lazy(() => import('./layouts/Dashboard/VehicleStatusDashboard'));

// Página de erro 404
const NotFound = () => {
  return (
    <div className="container my-4">
      <h2>Página não encontrada</h2>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            <Route path="/cars/dashboard" element={
              <Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="/fueling/dashboard" element={
              <Suspense fallback={<div>Loading...</div>}>
                <VehicleStatusDashboard />
              </Suspense>
            } />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/cars/add-car" element={<CarFormPage />} /> 
            <Route path="/drivers" element={<DriverList />} />
            <Route path="/drivers/:id" element={<DriverDetails />} /> {/* Rota para detalhes do motorista */}
            <Route path="/fueling-history" element={<FuelingHistoryList />} />
            <Route path="/oil-change-history" element={<OilChangeHistoryList />} />
            <Route path="/oil-changes/dashboard" element={<OilChangeCostDashboard />} />
            <Route path="/tire-change-history" element={<TireChangeHistoryList />} />
            <Route path="/car-maintenance" element={<CarMaintenanceList />} />
            <Route path="/car-maintenance/:id" element={<CarMaintenanceDetails />} /> {/* Rota para detalhes da manutenção */}
            <Route path="/maintenance/types" element={<MaintenanceTypeList />} />
            <Route path="/maintenance" element={<MaintenanceHistoryList />} />
            <Route path="/maintenance/dashboard" element={<MaintenanceDashboard />} />
            
            {/* Rota padrão */}
            <Route path="/" element={<Dashboard />} />

            {/* Rota coringa para páginas não encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
