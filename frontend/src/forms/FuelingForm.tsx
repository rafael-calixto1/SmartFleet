import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FuelingFormProps {
  onSuccess?: () => void;
  initialData?: any;
  cars?: any[];
}

const FuelingForm: React.FC<FuelingFormProps> = ({ onSuccess, initialData, cars: propsCars }) => {
  const [fuelingData, setFuelingData] = useState({
    car_id: initialData?.carId || 0,
    fuel_date: initialData?.fuelDate ? new Date(initialData.fuelDate).toISOString().split('T')[0] : "",
    fueling_kilometers: initialData?.fuelingKilometers || 0,
    liters_quantity: initialData?.litersQuantity || 0,
    price_per_liter: initialData?.pricePerLiter || 0,
    total_cost: initialData?.totalCost || 0,
    fuel_type: initialData?.fuelType || "",
    observation: initialData?.observation || "",
  });

  const [cars, setCars] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      if (propsCars) {
        setCars(propsCars);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/cars`
        );
        if (response.data && Array.isArray(response.data.cars)) {
          const activeCars = response.data.cars.filter((car: any) => car.status !== 'inactive');
          const carsWithPlates = activeCars.map((car: any) => ({
            ...car,
            id: car.id,
            plate: car.license_plate,
            make: car.make,
            model: car.model
          }));
          setCars(carsWithPlates);
        } else {
          console.error("Response does not contain an array of cars:", response.data);
          toast.error("Error loading car list");
        }
      } catch (error) {
        console.error("Error loading cars:", error);
        toast.error("Error loading car list");
      }
    };

    fetchCars();
  }, [propsCars]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFuelingData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]:
          name === "fueling_kilometers" ||
          name === "liters_quantity" ||
          name === "price_per_liter"
            ? parseFloat(value) || 0
            : value,
      };

      if (name === "liters_quantity" || name === "price_per_liter") {
        updatedData.total_cost = parseFloat(
          (updatedData.liters_quantity * updatedData.price_per_liter).toFixed(3)
        );
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const url = initialData?.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/fueling/${initialData.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/fueling`;

      const method = initialData?.id ? 'PUT' : 'POST';

      // First get the car's current kilometers
      const carResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cars/${fuelingData.car_id}`
      );
      const currentKilometers = carResponse.data.current_kilometers;

      // Check if the new kilometers is less than or equal to current
      if (fuelingData.fueling_kilometers <= currentKilometers) {
        toast.warn(
          `The informed mileage (${fuelingData.fueling_kilometers} km) is less than or equal to the current mileage (${currentKilometers} km). Please check the informed value.`,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
        setIsSubmitting(false);
        return;
      }

      const response = await axios({
        method,
        url,
        data: {
          car_id: fuelingData.car_id,
          fuel_date: fuelingData.fuel_date,
          fueling_kilometers: fuelingData.fueling_kilometers,
          liters_quantity: fuelingData.liters_quantity,
          price_per_liter: fuelingData.price_per_liter,
          total_cost: fuelingData.total_cost,
          fuel_type: fuelingData.fuel_type,
          observation: fuelingData.observation,
          fuel_amount: fuelingData.liters_quantity, // Add fuel_amount here
        }
      });

      // Update car's current kilometers
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/cars/${fuelingData.car_id}/current-kilometers`,
        { current_kilometers: fuelingData.fueling_kilometers }
      );

      toast.success("Fueling registered and mileage updated successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Reset form if not editing
      if (!initialData?.id) {
        setFuelingData({
          car_id: 0,
          fuel_date: "",
          fueling_kilometers: 0,
          liters_quantity: 0,
          price_per_liter: 0,
          total_cost: 0,
          fuel_type: "",
          observation: "",
        });
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error) {
      console.error("Error registering fueling:", error);
      toast.error("Error registering fueling. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Add New Fueling</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Car:</label>
          <select
            name="car_id"
            value={fuelingData.car_id}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          >
            <option value="">Select a car</option>
            {cars.length > 0 ? (
              cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.license_plate} - {car.make} {car.model}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No cars available
              </option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Fueling Date:</label>
          <input
            type="date"
            name="fuel_date"
            value={fuelingData.fuel_date}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fueling Kilometers:</label>
          <input
            type="number"
            name="fueling_kilometers"
            value={fuelingData.fueling_kilometers}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Liters Quantity:</label>
          <input
            type="number"
            name="liters_quantity"
            value={fuelingData.liters_quantity}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price per Liter:</label>
          <input
            type="number"
            name="price_per_liter"
            value={fuelingData.price_per_liter}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Cost:</label>
          <input
            type="number"
            name="total_cost"
            value={fuelingData.total_cost}
            readOnly
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fuel Type:</label>
          <select
            name="fuel_type"
            value={fuelingData.fuel_type}
            onChange={handleChange}
            required
            className="form-control"
            disabled={isSubmitting}
          >
            <option value="">Select fuel type</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Ethanol">Ethanol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Observation:</label>
          <textarea
            name="observation"
            value={fuelingData.observation}
            onChange={handleChange}
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (initialData?.id ? 'Update Fueling' : 'Add Fueling')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FuelingForm;
