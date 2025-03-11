import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Primary action button (e.g., Add, Save, Submit)
export const PrimaryButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Secondary action button (e.g., Cancel, Back)
export const SecondaryButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      variant="outlined"
      color="primary"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Success button (e.g., Confirm, Approve)
export const SuccessButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      variant="contained"
      color="success"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Danger button (e.g., Delete, Remove)
export const DangerButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      variant="contained"
      color="error"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Link button (for navigation)
interface LinkButtonProps extends MuiButtonProps {
  to: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ to, ...props }) => {
  return (
    <MuiButton
      component={RouterLink}
      to={to}
      variant="outlined"
      color="primary"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Dashboard button (specific for dashboard links)
export const DashboardButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      variant="contained"
      color="info"
      sx={{ 
        marginRight: 2, 
        marginBottom: 2,
        ...props.sx 
      }}
      {...props}
    />
  );
};

// Action button for tables (smaller size)
export const TableActionButton: React.FC<MuiButtonProps> = (props) => {
  return (
    <MuiButton
      size="small"
      sx={{ 
        minWidth: '32px',
        marginRight: 1,
        ...props.sx 
      }}
      {...props}
    />
  );
}; 