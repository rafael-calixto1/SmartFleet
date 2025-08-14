import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField, Box } from '@mui/material';

interface DriverFormProps {
  driverId?: number;
  initialData?: {
    name: string;
    license_number: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ driverId, initialData, onSuccess, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverData, setDriverData] = useState({
    name: initialData?.name || "",
    license_number: initialData?.license_number || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverData({
      ...driverData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (driverId) {
        // Update driver
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/drivers/${driverId}`, driverData);
        toast.success("Driver updated successfully!");
      } else {
        // Add new driver
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/drivers`, driverData);
        toast.success("Driver added successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      console.error("Error saving driver:", error);
      toast.error(error.response?.data?.message || "Error saving driver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={driverData.name}
        onChange={handleChange}
        required
        disabled={isSubmitting}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="License Number"
        name="license_number"
        value={driverData.license_number}
        onChange={handleChange}
        required
        disabled={isSubmitting}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onClose && (
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : driverId ? 'Update' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
};

export default DriverForm;