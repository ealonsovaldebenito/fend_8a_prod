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
  uploadInventoryData,
  uploadLastInventoryForAllSucursales, // Nueva función importada
} from "../../api/inventory.ts"
import { Sucursal } from "../../types/Sucursal"
import { CheckCircle, Upload, XCircle } from "lucide-react"
import "../../assets/css/components/salesform.css"

const InventoryForm: React.FC = () => {
  const [selectedSucursales, setSelectedSucursales] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: "success" | "error"
  }>({ open: false, message: "", severity: "success" })

  useEffect(() => {
    getSucursales()
      .then((data) => setSucursales(data))
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
        selectedSucursales.map((sucursalId) =>
          uploadInventoryData(formattedStartDate, formattedEndDate, sucursalId)
        )
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

  const handleUploadLastInventory = async () => {
    setLoading(true)
    try {
      await uploadLastInventoryForAllSucursales() // Llamada a la nueva función para los últimos 2 días
      setSnackbar({
        open: true,
        message: "Últimos datos de inventario subidos exitosamente",
        severity: "success",
      })
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: "Error al subir últimos datos de inventario: " + error.message,
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
    <Box className="inventoryFormContainer">
      <Typography variant="h4" gutterBottom className="inventoryFormTitle">
        Gestión de Inventario
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <List>
            {sucursales.map((sucursal) => (
              <ListItem
                key={sucursal.id}
                onClick={() => handleToggle(sucursal.id)}
              >
                <Checkbox
                  edge="start"
                  checked={selectedSucursales.indexOf(sucursal.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={sucursal.nombre} />
              </ListItem>
            ))}
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
            onClick={handleUpload}
            disabled={loading}
            className="inventoryFormButton"
          >
            {loading ? <CircularProgress size={24} /> : "Subir Datos"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadLastInventory} // Nuevo botón para los últimos 2 días
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

export default InventoryForm
