// filepath: /C:/Users/calix/Downloads/ultimo_sem_login_log/frontend/src/layouts/Drivers/DriverDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
  });

  const fetchDriver = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers/${id}`);
      if (!response.ok) {
        throw new Error("Error loading driver details.");
      }
      const data = await response.json();
      setDriver(data);
      setFormData({
        name: data.name,
        license_number: data.license_number,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the name and license_number fields are valid
    if (!formData.name || !formData.license_number) {
      toast.error("Name and license number are required.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Driver updated successfully!");
        setIsEditing(false);
        fetchDriver(); // Reload driver data after update
      } else {
        toast.error("Error updating driver.");
      }
    } catch (error) {
      console.error("Error updating driver: ", error);
      toast.error("Error updating driver. Please try again.");
    }
  };

  const handleDelete = async () => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this driver?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers/${id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                toast.success("Driver deleted successfully!");
                navigate("/drivers");
              } else {
                toast.error("Error deleting driver.");
              }
            } catch (error) {
              console.error("Error deleting driver: ", error);
              toast.error("Error deleting driver. Please try again.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: driver.name,
      license_number: driver.license_number,
    });
  };

  if (isLoading) {
    return (
      <div className="container m-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="container m-5">
        <p className="text-danger">Driver not found.</p>
      </div>
    );
  }

  return (
    <div className="container my-4" >
      <h2 className="mb-4">Driver Details</h2>

      {!isEditing ? (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{driver.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{driver.name}</td>
                </tr>
                <tr>
                  <th>License Number</th>
                  <td>{driver.license_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={handleEdit} className="btn btn-success">
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-danger ms-3">
            Delete
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="license_number" className="form-label">
              License Number
            </label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
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
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger ms-3"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
};

export default DriverDetails;