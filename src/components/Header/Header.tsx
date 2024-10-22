import React from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { Link } from "react-router-dom"
import {
  Home,
  Store,
  Settings,
  Storage,
  ExitToApp,
  BarChart,
} from "@mui/icons-material" // BarChart icon for reports
import "../../assets/css/components/header.css"

interface HeaderProps {
  onLogout: () => void
  dbStatus: "success" | "error" | "loading"
}

const Header: React.FC<HeaderProps> = ({ onLogout, dbStatus }) => {
  return (
    <AppBar position="static" className="appBar">
      <Toolbar className="toolbar">
        <Typography variant="h6" className="header-title">
          Panel Administrativo
        </Typography>

        <Button
          color="inherit"
          startIcon={<Home />}
          component={Link}
          to="/"
          className="navLink"
        >
          Operaciones
        </Button>
        <Button
          color="inherit"
          startIcon={<Store />}
          component={Link}
          to="/sucursales"
          className="navLink"
        >
          Sucursales
        </Button>
        <Button
          color="inherit"
          startIcon={<Storage />}
          component={Link}
          to="/database"
          className="navLink"
        >
          Base de Datos
        </Button>
        <Button
          color="inherit"
          startIcon={<BarChart />}
          component={Link}
          to="/reportes"
          className="navLink"
        >
          Reportes
        </Button>
        <Button
          color="inherit"
          startIcon={<Settings />}
          component={Link}
          to="/configuracion"
          className="navLink"
        >
          Configuración
        </Button>

        <IconButton color="inherit" onClick={onLogout}>
          <ExitToApp />
        </IconButton>

        <Box ml={2}>
          {dbStatus === "loading" ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Box
              className={`statusIndicator ${
                dbStatus === "success" ? "statusSuccess" : "statusError"
              }`}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
