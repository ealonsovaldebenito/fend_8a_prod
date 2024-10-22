import React, { useEffect, useState } from "react"
import { Container, Box } from "@mui/material"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import DatabaseManagement from "./components/Database/DatabaseManagement.tsx"
import SucursalList from "./components/Sucursales/SucursalList.tsx"
import AddSucursalForm from "./components/Sucursales/AddSucursalForm.tsx"
import OperacionesPanel from "./components/Operaciones/OperacionesPanel.tsx"
import SalesPanel from "./components/Sales/SalesPanel.tsx"
import ConfiguracionPanel from "./components/Configuracion/ConfiguracionPanel.tsx"
import InventoryForm from "./components/Inventory/InventoryForm.tsx"
import ErrorBoundary from "./components/Common/ErrorBoundary.tsx"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { checkDatabaseStatus } from "./api/common.ts"
import { es } from "date-fns/locale"
import Login from "./components/Login/Login.tsx"
import Header from "./components/Header/Header.tsx"
import ReportsTable from "./components/Reports/ReportsTable.tsx" // Importamos el componente nuevo

const App: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<"success" | "error" | "loading">(
    "loading"
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true) // Estado para gestionar la espera durante la autenticación

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
          console.log("El token ha expirado, cerrando sesión...")
          handleLogout()
        } else {
          console.log("Token válido, autenticando al usuario")
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error)
        handleLogout() // Cerrar sesión si hay un error al decodificar
      }
    } else {
      console.log("No se encontró token, redirigiendo al login")
      setIsAuthenticated(false)
    }
    setLoadingAuth(false) // Finalizar la espera de la autenticación
  }, [])

  const handleLogout = () => {
    console.log("Cerrando sesión y limpiando token")
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    setIsAuthenticated(false)
  }

  const handleLogin = () => {
    console.log("Autenticación exitosa")
    setIsAuthenticated(true)
  }

  useEffect(() => {
    checkDatabaseStatus()
      .then((res) => {
        if (res.data?.status === "success") {
          console.log("Base de datos verificada correctamente")
          setDbStatus("success")
        } else {
          console.log("Error en la base de datos")
          setDbStatus("error")
        }
      })
      .catch((error) => {
        console.error("Error al verificar la base de datos:", error)
        setDbStatus("error")
      })
  }, [])

  // Mostrar un spinner o mensaje de espera mientras se verifica la autenticación
  if (loadingAuth) {
    return <div>Cargando...</div>
  }

  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
        <Router>
          {isAuthenticated && (
            <Header onLogout={handleLogout} dbStatus={dbStatus} />
          )}
          <Container maxWidth="lg" className="contentContainer">
            <Box mt={4}>
              <Routes>
                {/* Ruta para login */}
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/" />
                    ) : (
                      <Login onLogin={handleLogin} />
                    )
                  }
                />
                {/* Rutas protegidas */}
                {isAuthenticated ? (
                  <>
                    <Route path="/database" element={<DatabaseManagement />} />
                    <Route
                      path="/sucursales"
                      element={
                        <>
                          <AddSucursalForm />
                          <SucursalList />
                        </>
                      }
                    />
                    <Route path="/operaciones" element={<OperacionesPanel />} />
                    <Route path="/ventas" element={<SalesPanel />} />
                    <Route path="/inventario" element={<InventoryForm />} />
                    <Route
                      path="/configuracion"
                      element={<ConfiguracionPanel />}
                    />
                    <Route path="/reportes" element={<ReportsTable />} />{" "}
                    {/* Ruta correcta para reportes */}
                    <Route path="/" element={<OperacionesPanel />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} />
                )}
              </Routes>
            </Box>
          </Container>
        </Router>
      </LocalizationProvider>
    </ErrorBoundary>
  )
}

export default App
