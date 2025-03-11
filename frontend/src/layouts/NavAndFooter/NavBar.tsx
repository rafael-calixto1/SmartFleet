import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faOilCan,
  faWrench,
  faGasPump,
  faUser,
  faChevronDown,
  faChevronUp,
  faTools,
  faClipboardList,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [fuelingOpen, setFuelingOpen] = useState(false);
  const [oilChangeOpen, setOilChangeOpen] = useState(false);

  // Função para alternar o Drawer
  const handleMouseEnter = () => {
    setDrawerOpen(true);
  };

  const handleMouseLeave = () => {
    setDrawerOpen(false);
  };

  // Função para alternar o submenu de "Veículos"
  const toggleVehiclesMenu = () => {
    setVehiclesOpen(!vehiclesOpen);
  };

  // Função para alternar o submenu de "Manutenção"
  const toggleMaintenanceMenu = () => {
    setMaintenanceOpen(!maintenanceOpen);
  };

  // Função para alternar o submenu de "Abastecimentos"
  const toggleFuelingMenu = () => {
    setFuelingOpen(!fuelingOpen);
  };

  
  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "white" }}>
        {/* AppBar vazia com cor branca */}
        <Container maxWidth="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }} />
        </Container>
      </AppBar>

      <Drawer
        sx={{
          width: drawerOpen ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? 240 : 60,
            boxSizing: "border-box",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            transition: "width 0.3s ease",
            backgroundColor: "success.main",
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: drawerOpen ? "flex-start" : "center",
            padding: drawerOpen ? "16px 8px" : "16px 0",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <img
            src="/Logo-Conexao-Web-P&B.png"
            alt="Logo Conexão Web"
            style={{
              height: "40px",
              width: "auto",
            }}
          />
        </Link>

        <List sx={{ padding: 0 }}>
        <ListItem
            component="div" // Pode ser "div" ou qualquer outro container válido
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              padding: drawerOpen ? "10px 16px" : "10px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={toggleVehiclesMenu}
          >
            <FontAwesomeIcon
              icon={faCar}
              size="lg"
              style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
            />
            {drawerOpen && (
              <>
                <ListItemText
                  primary="Veículos"
                  sx={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}
                />
                <FontAwesomeIcon
                  icon={vehiclesOpen ? faChevronUp : faChevronDown}
                  style={{ color: "white" }}
                />
              </>
            )}
          </ListItem>
          <Collapse in={vehiclesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/cars"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {drawerOpen && (
                  <ListItemText
                    primary="Lista de Carros"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
              
      
              <ListItem
                component={Link}
                to="/cars/add-car"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {drawerOpen && (
                  <ListItemText
                    primary="Adicionar Carro"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
              <ListItem
                component={Link}
                to="/cars/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="sm"
                  style={{ color: "white", marginRight: drawerOpen ? 8 : 0 }}
                />
                {drawerOpen && (
                  <ListItemText
                    primary="Dashboard"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              padding: drawerOpen ? "10px 16px" : "10px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Link
              to="/fueling-history"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: drawerOpen ? "flex-start" : "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <FontAwesomeIcon
                icon={faGasPump}
                size="lg"
                style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
              />
              {drawerOpen && (
                <ListItemText
                  primary="Abastecimentos"
                  sx={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}
                />
              )}
            </Link>
          </ListItem>

          {/* Manutenção Dropdown */}
          <ListItem
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              padding: drawerOpen ? "10px 16px" : "10px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={toggleMaintenanceMenu}
          >
            <FontAwesomeIcon
              icon={faTools}
              size="lg"
              style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
            />
            {drawerOpen && (
              <>
                <ListItemText
                  primary="Manutenção"
                  sx={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}
                />
                <FontAwesomeIcon
                  icon={maintenanceOpen ? faChevronUp : faChevronDown}
                  style={{ color: "white" }}
                />
              </>
            )}
          </ListItem>
          <Collapse in={maintenanceOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/maintenance"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {drawerOpen && (
                  <ListItemText
                    primary="Histórico de Manutenção"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
              <ListItem
                component={Link}
                to="/maintenance/types"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {drawerOpen && (
                  <ListItemText
                    primary="Tipos de Manutenção"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
              <ListItem
                component={Link}
                to="/maintenance/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="sm"
                  style={{ color: "white", marginRight: drawerOpen ? 8 : 0 }}
                />
                {drawerOpen && (
                  <ListItemText
                    primary="Dashboard"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
            </List>
          </Collapse>

          {[
            { to: "/drivers", icon: faUser, label: "Motoristas" },
          ].map((item) => (
            <ListItem
              key={item.to}
              component={Link}
              to={item.to}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: drawerOpen ? "flex-start" : "center",
                padding: drawerOpen ? "10px 16px" : "10px 0",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                size="lg"
                style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
              />
              {drawerOpen && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                />
              )}
            </ListItem>
          ))}

          {/* Oil Changes Dropdown */}
          <ListItem
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              padding: drawerOpen ? "10px 16px" : "10px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => setOilChangeOpen(!oilChangeOpen)}
          >
            <FontAwesomeIcon
              icon={faOilCan}
              size="lg"
              style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
            />
            {drawerOpen && (
              <>
                <ListItemText
                  primary="Trocas de Óleo"
                  sx={{ color: "white", fontWeight: 500, fontSize: "0.875rem" }}
                />
                <FontAwesomeIcon
                  icon={oilChangeOpen ? faChevronUp : faChevronDown}
                  style={{ color: "white" }}
                />
              </>
            )}
          </ListItem>
          <Collapse in={oilChangeOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={Link}
                to="/oil-change-history"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {drawerOpen && (
                  <ListItemText
                    primary="Histórico"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
              <ListItem
                component={Link}
                to="/oil-changes/dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: drawerOpen ? "32px" : "10px 0",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="sm"
                  style={{ color: "white", marginRight: drawerOpen ? 8 : 0 }}
                />
                {drawerOpen && (
                  <ListItemText
                    primary="Dashboard de Custos"
                    sx={{ color: "white", fontSize: "0.875rem" }}
                  />
                )}
              </ListItem>
            </List>
          </Collapse>

          {[
            { to: "/tire-change-history", icon: faCar, label: "Trocas de Pneus" },
            { to: "/car-maintenance", icon: faWrench, label: "Manutenção de Veículos" },
          ].map((item) => (
            <ListItem
              key={item.to}
              component={Link}
              to={item.to}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: drawerOpen ? "flex-start" : "center",
                padding: drawerOpen ? "10px 16px" : "10px 0",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                size="lg"
                style={{ color: "white", marginRight: drawerOpen ? 16 : 0 }}
              />
              {drawerOpen && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};
