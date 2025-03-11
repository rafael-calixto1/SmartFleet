import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import TireChangeForm from "./TireChangeForm";

interface TireChangeFormModalProps {
  show: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
}

const TireChangeFormModal: React.FC<TireChangeFormModalProps> = ({ show, handleClose, onSuccess }) => {
  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Troca de Pneus</DialogTitle>
      <DialogContent>
        <TireChangeForm onSuccess={() => {
          if (onSuccess) onSuccess();
          handleClose();
        }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TireChangeFormModal;