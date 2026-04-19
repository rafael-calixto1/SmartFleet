import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import OilChangeForm from "./OilChangeForm";

interface OilChangeFormModalProps {
  show: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const OilChangeFormModal: React.FC<OilChangeFormModalProps> = ({ show, handleClose, onSuccess, initialData }) => {
  if (!show) return null;

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Troca de Óleo</DialogTitle>
      <DialogContent>
        <OilChangeForm 
          onSuccess={() => {
            if (onSuccess) onSuccess();
            handleClose();
          }}
          initialData={initialData}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OilChangeFormModal;