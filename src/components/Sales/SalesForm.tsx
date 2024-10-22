import React, { useState, useEffect } from "react"
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  FormControlLabel,
} from "@mui/material"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import { es } from "date-fns/locale"
import { getSucursales } from "../../api/sucursales.ts"
import {
  uploadSalesData,
  uploadLastSalesForAllSucursales, // Se importa la nueva función
} from "../../api/sales.ts"
import { Sucursal } from "../../types/Sucursal"
import { CheckCircle, Upload, XCircle } from "lucide-react"
import "../../assets/css/components/salesform.css"

const SalesForm: React.FC = () => {
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [sucursalStatuses, setSucursalStatuses] = useState<
    Record<string, "success" | "error" | "pending">
  >({})
  const [currentProcessingSucursal, setCurrentProcessingSucursal] = useState<
    string | null
  >(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  useEffect(() => {
    getSucursales()
      .then((data) => {
        setSucursales(data)
        const initialStatuses = data.reduce(
          (acc, sucursal) => ({
            ...acc,
            [sucursal.id]: "pending",
          }),
          {}
        )
        setSucursalStatuses(initialStatuses)
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Error al cargar sucursales: " + error.message,
          severity: "error",
        })
      })
  }, [])

  const handleToggle = (sucursalId: string) => {
    const currentIndex = selectedSucursales.indexOf(sucursalId)
    const newSelected = [...selectedSucursales]

    if (currentIndex === -1) {
      newSelected.push(sucursalId)
    } else {
      newSelected.splice(currentIndex, 1)
    }

    setSelectedSucursales(newSelected)
  }

  const handleSelectAllToggle = () => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      setSelectedSucursales(sucursales.map((sucursal) => sucursal.id))
    } else {
      setSelectedSucursales([])
    }
  }

  const handleUpload = async () => {
    if (!startDate || !endDate || selectedSucursales.length === 0) {
      setSnackbar({
        open: true,
        message: "Por favor, selecciona sucursales y fechas",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const formattedStartDate = startDate!.toISOString().split("T")[0]
      const formattedEndDate = endDate!.toISOString().split("T")[0]
      await Promise.all(
        selectedSucursales.map(async (sucursalId) => {
          setCurrentProcessingSucursal(sucursalId)
          try {
            await uploadSalesData(
              formattedStartDate,
              formattedEndDate,
              sucursalId
            )
            setSucursalStatuses((prevStatuses) => ({
              ...prevStatuses,
              [sucursalId]: "success",
            }))
          } catch (error) {
            setSucursalStatuses((prevStatuses) => ({
              ...prevStatuses,
              [sucursalId]: "error",
            }))
          } finally {
            setCurrentProcessingSucursal(null)
          }
        })
      )
      setSnackbar({
        open: true,
        message: "Datos subidos exitosamente",
        severity: "success",
      })
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: "Error al subir datos: " + error.message,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Nueva función para manejar la subida de los últimos datos de ventas
  const handleUploadLastSales = async () => {
    setLoading(true)
    try {
      await uploadLastSalesForAllSucursales()
      setSnackbar({
        open: true,
        message: "Últimos datos de ventas subidos exitosamente",
        severity: "success",
      })
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: "Error al subir últimos datos de ventas: " + error.message,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <Box className="salesFormContainer">
      <Typography variant="h4" gutterBottom className="salesFormTitle">
        Gestión de Ventas
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllToggle}
                color="primary"
              />
            }
            label="Seleccionar todas las sucursales"
          />
        </Grid>

        <Grid item xs={12}>
          <List>
            <Grid container spacing={2}>
              {sucursales.map((sucursal) => (
                <Grid item xs={6} key={sucursal.id}>
                  <ListItem
                    onClick={() => handleToggle(sucursal.id)}
                    className={`${
                      selectedSucursales.includes(sucursal.id)
                        ? "sucursalSelected"
                        : ""
                    }`}
                  >
                    <Checkbox
                      edge="start"
                      checked={selectedSucursales.indexOf(sucursal.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText primary={sucursal.nombre} />
                    <Box className="statusIcon">
                      {currentProcessingSucursal === sucursal.id ? (
                        <CircularProgress size={24} />
                      ) : sucursalStatuses[sucursal.id] === "success" ? (
                        <CheckCircle className="statusSuccess" size={24} />
                      ) : sucursalStatuses[sucursal.id] === "error" ? (
                        <XCircle className="statusError" size={24} />
                      ) : null}
                    </Box>
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </Grid>

        <Grid item xs={6}>
          <MobileDatePicker
            label="Fecha de Inicio"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { label: "Fecha" } }}
            views={["year", "month", "day"]}
            inputFormat="dd/MM/yyyy"
            locale={es}
          />
        </Grid>

        <Grid item xs={6}>
          <MobileDatePicker
            label="Fecha de Fin"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { label: "Fecha" } }}
            views={["year", "month", "day"]}
            inputFormat="dd/MM/yyyy"
            locale={es}
          />
        </Grid>

        <Grid item xs={12} className="buttonContainer">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Upload />}
            onClick={handleUpload}
            disabled={loading}
            className="salesFormButton"
          >
            {loading ? <CircularProgress size={24} /> : "Subir Datos"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadLastSales}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Subir Últimos Datos"}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SalesForm
