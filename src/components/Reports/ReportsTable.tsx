import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Grid,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { validateTables } from "../../api/common.ts"
import { getTableData } from "../../api/reports.ts"

const MAX_TABLES = 3

const ReportsTable = () => {
  const [tables, setTables] = useState<string[]>([]) // Tablas disponibles
  const [selectedTables, setSelectedTables] = useState<string[]>([]) // Tablas seleccionadas
  const [tableData, setTableData] = useState<any>({}) // Datos de las tablas
  const [loading, setLoading] = useState<boolean>(false) // Estado de carga
  const [error, setError] = useState<string>("") // Manejo de errores
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false) // Snackbar

  // Obtener tablas disponibles desde la API
  const fetchTables = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await validateTables()
      if (response?.error) {
        setError("Error al obtener las tablas.")
        setOpenSnackbar(true)
      } else {
        setTables(response?.data?.tables || [])
      }
    } catch (err) {
      setError("Error al obtener las tablas.")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  // Obtener datos de una tabla seleccionada
  const fetchTableData = async (table: string) => {
    try {
      const response = await getTableData(table)
      if (response?.error) {
        setError(`Error al obtener los datos de la tabla ${table}.`)
        setOpenSnackbar(true)
      } else {
        return response?.data || []
      }
    } catch (err) {
      setError(`Error al obtener los datos de la tabla ${table}.`)
      setOpenSnackbar(true)
    }
  }

  // Obtener datos para las tablas seleccionadas
  const handleTableSelection = async (event: any) => {
    const newSelection = event.target.value
    if (newSelection.length <= MAX_TABLES) {
      setSelectedTables(newSelection)

      // Resetear los datos antes de cargar nuevas tablas
      setTableData({})

      setLoading(true)
      const dataPromises = newSelection.map((table: string) =>
        fetchTableData(table)
      )
      const results = await Promise.all(dataPromises)

      // Guardar los datos en un objeto con el nombre de la tabla como clave
      const newTableData = newSelection.reduce((acc, table, index) => {
        acc[table] = results[index] || []
        return acc
      }, {} as any)
      setTableData(newTableData)
      setLoading(false)
    } else {
      setError(`Solo puedes seleccionar hasta ${MAX_TABLES} tablas.`)
      setOpenSnackbar(true)
    }
  }

  // Cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  // Definir las columnas para el DataGrid
  const generateColumns = (data: any) => {
    if (data.length > 0) {
      const sampleRow = data[0]
      return Object.keys(sampleRow).map((key) => ({
        field: key,
        headerName: key.toUpperCase(),
        width: 150,
      }))
    }
    return []
  }

  // Cargar las tablas cuando el componente se monta
  useEffect(() => {
    fetchTables()
  }, [])

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona las Tablas para Ver los Datos
      </Typography>

      {/* Mostrar el estado de carga */}
      {loading && <CircularProgress />}

      {/* Mostrar error si lo hay */}
      {error && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Dropdown para seleccionar las tablas */}
      <Select
        multiple
        value={selectedTables}
        onChange={handleTableSelection}
        sx={{ minWidth: 300, marginBottom: "1rem" }}
      >
        {tables.map((table) => (
          <MenuItem key={table} value={table}>
            {table}
          </MenuItem>
        ))}
      </Select>

      {/* Mostrar los datos de las tablas seleccionadas */}
      <Grid container spacing={2}>
        {selectedTables.map((table) => (
          <Grid item xs={12} key={table}>
            <Typography variant="h6">{table}</Typography>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={(tableData[table] || []).map((row: any, idx: number) => ({
                  id: idx,
                  ...row,
                }))}
                columns={generateColumns(tableData[table] || [])}
                pageSize={5}
              />
            </div>
          </Grid>
        ))}
      </Grid>

      {/* Botón para recargar las tablas */}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchTables}
        sx={{ marginTop: "2rem" }}
      >
        Recargar Tablas
      </Button>
    </Box>
  )
}

export default ReportsTable
