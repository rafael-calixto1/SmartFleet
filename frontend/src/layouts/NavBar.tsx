import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';

const NavBar: React.FC = () => {
  return (
    <Nav className="me-auto">
      <Nav.Link as={Link} to="/dashboard">
        <i className="bi bi-speedometer2"></i> Dashboard de Veículos
      </Nav.Link>

      <NavDropdown title="Veículos" id="vehicles-dropdown">
        <NavDropdown.Item as={Link} to="/cars">
          <i className="bi bi-car-front"></i> Lista de Veículos
        </NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title="Manutenção" id="maintenance-dropdown">
        <NavDropdown.Item as={Link} to="/maintenance-history">
          <i className="bi bi-tools"></i> Histórico de Manutenção
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/oil-change-history">
          <i className="bi bi-droplet"></i> Trocas de Óleo
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/tire-change-history">
          <i className="bi bi-circle"></i> Trocas de Pneu
        </NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title="Abastecimento" id="fueling-dropdown">
        <NavDropdown.Item as={Link} to="/fueling-history">
          <i className="bi bi-fuel-pump"></i> Histórico de Abastecimento
        </NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title="Motoristas" id="drivers-dropdown">
        <NavDropdown.Item as={Link} to="/drivers">
          <i className="bi bi-person"></i> Lista de Motoristas
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
};

export default NavBar; 