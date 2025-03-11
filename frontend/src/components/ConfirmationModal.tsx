import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal fade show" 
        style={{ 
          display: 'block', 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050 
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelButtonText}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Excluindo...
                  </>
                ) : (
                  confirmButtonText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal; 