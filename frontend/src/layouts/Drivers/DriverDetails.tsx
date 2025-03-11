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
        throw new Error("Erro ao carregar os detalhes do motorista.");
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

    // Verifique se os campos name e license_number são válidos
    if (!formData.name || !formData.license_number) {
      toast.error("Nome e número da CNH são obrigatórios.");
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
        toast.success("Motorista atualizado com sucesso!");
        setIsEditing(false);
        fetchDriver(); // Recarrega os dados do motorista após a atualização
      } else {
        toast.error("Erro ao atualizar motorista.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o motorista: ", error);
      toast.error("Erro ao atualizar o motorista. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    confirmAlert({
      title: 'Confirmação de Exclusão',
      message: 'Tem certeza de que deseja excluir este motorista?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/drivers/${id}`, {
                method: "DELETE",
              });

              if (response.ok) {
                toast.success("Motorista excluído com sucesso!");
                navigate("/drivers");
              } else {
                toast.error("Erro ao excluir motorista.");
              }
            } catch (error) {
              console.error("Erro ao excluir o motorista: ", error);
              toast.error("Erro ao excluir o motorista. Tente novamente.");
            }
          }
        },
        {
          label: 'Não',
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
        <p>Carregando...</p>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="container m-5">
        <p className="text-danger">Motorista não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container my-4" >
      <h2 className="mb-4">Detalhes do Motorista</h2>

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
                  <th>Nome</th>
                  <td>{driver.name}</td>
                </tr>
                <tr>
                  <th>Número da CNH</th>
                  <td>{driver.license_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={handleEdit} className="btn btn-success">
            Editar
          </button>
          <button onClick={handleDelete} className="btn btn-danger ms-3">
            Excluir
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome
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
              Número da CNH
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
            Salvar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary ms-3"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger ms-3"
          >
            Excluir
          </button>
        </form>
      )}
    </div>
  );
};

export default DriverDetails;