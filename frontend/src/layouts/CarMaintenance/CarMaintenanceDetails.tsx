import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CarDetailsMaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceType: "",
    maintenanceDate: "",
    maintenanceKilometers: 0,
    recurrency: 0,
    carId: "",
    observation: "",
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/car-maintenance/${id}`);
        if (!response.ok) {
          throw new Error("Error loading maintenance details.");
        }
        const data = await response.json();
        console.log("Data received:", data); // Debugging
        setMaintenance(data);

        // Update form data with fetched values
        setFormData({
          maintenanceType: data.maintenance_type,
          maintenanceDate: data.maintenance_date,
          maintenanceKilometers: data.maintenance_kilometers,
          recurrency: data.recurrency,
          carId: data.car_id,
          observation: data.observation,
        });
      } catch (error) {
        console.error(error);
        alert("Error loading maintenance details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaintenance();
  }, [id]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit updated data to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/car-maintenance/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenance_type: formData.maintenanceType,
          maintenance_date: formData.maintenanceDate,
          maintenance_kilometers: formData.maintenanceKilometers,
          recurrency: formData.recurrency,
          car_id: formData.carId,
          observation: formData.observation,
        }),
      });

      if (response.ok) {
        alert("Maintenance updated successfully!");
        setIsEditing(false);
        const updatedData = await response.json();
        setMaintenance(updatedData);
      } else {
        alert("Error updating maintenance.");
      }
    } catch (error) {
      console.error("Error updating maintenance:", error);
    }
  };

  // Cancel editing and reset the form
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      maintenanceType: maintenance.maintenance_type,
      maintenanceDate: maintenance.maintenance_date,
      maintenanceKilometers: maintenance.maintenance_kilometers,
      recurrency: maintenance.recurrency,
      carId: maintenance.car_id,
      observation: maintenance.observation,
    });
  };

  // Render loading or error states
  if (isLoading) {
    return (
      <div className="container m-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (!maintenance) {
    return (
      <div className="container m-5">
        <p className="text-danger">Maintenance not found.</p>
      </div>
    );
  }

  // Render main content
  return (
    <div className="container my-4">
      <h2 className="mb-4">Maintenance Details</h2>

      {!isEditing ? (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{maintenance.id}</td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td>{maintenance.maintenance_type}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{new Date(maintenance.maintenance_date).toLocaleDateString("en-US")}</td>
                </tr>
                <tr>
                  <th>Mileage</th>
                  <td>{maintenance.maintenance_kilometers}</td>
                </tr>
                <tr>
                  <th>Recurrence</th>
                  <td>{maintenance.recurrency}</td>
                </tr>
                <tr>
                  <th>Car ID</th>
                  <td>{maintenance.car_id}</td>
                </tr>
                <tr>
                  <th>Observation</th>
                  <td>{maintenance.observation}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="maintenanceType" className="form-label">
              Maintenance Type
            </label>
            <input
              type="text"
              id="maintenanceType"
              name="maintenanceType"
              value={formData.maintenanceType}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="maintenanceDate" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="maintenanceDate"
              name="maintenanceDate"
              value={formData.maintenanceDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="maintenanceKilometers" className="form-label">
              Mileage
            </label>
            <input
              type="number"
              id="maintenanceKilometers"
              name="maintenanceKilometers"
              value={formData.maintenanceKilometers}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="recurrency" className="form-label">
              Recurrence (Km)
            </label>
            <input
              type="number"
              id="recurrency"
              name="recurrency"
              value={formData.recurrency}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="carId" className="form-label">
              Car ID
            </label>
            <input
              type="text"
              id="carId"
              name="carId"
              value={formData.carId}
              onChange={handleChange}
              className="form-control"
              readOnly
            />
          </div>

          <div className="mb-3">
            <label htmlFor="observation" className="form-label">
              Observation
            </label>
            <textarea
              id="observation"
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success">
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary ms-3"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default CarDetailsMaintenanceDetails;