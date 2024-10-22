import React, { useState, useEffect } from "react"
import { validateTables } from "../../api/common" // Asegúrate de que la ruta de importación sea correcta
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material"

const TableList = () => {
  const [tables, setTables] = useState<string[]>([]) // Estado para almacenar las tablas
  const [loading, setLoading] = useState(false) // Estado para manejar el indicador de carga
  const [error, setError] = useState("") // Estado para manejar errores

  // Función para obtener la lista de tablas desde la API
  const fetchTables = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await validateTables()
      if (response.error) {
        setError("Error al obtener las tablas.")
        console.error("Error:", response.error) // Log de error
      } else {
        // Asegúrate de acceder al array de tablas correctamente
        setTables(response.data.tables || [])
        console.log("Tablas obtenidas:", response.data.tables) // Log de éxito
      }
    } catch (err) {
      setError("Error al listar las tablas.")
      console.error("Error al listar tablas:", err)
    } finally {
      setLoading(false)
    }
  }

  // Llama a la función de fetchTables al montar el componente
  useEffect(() => {
    fetchTables()
  }, [])

  return (
    <Box>
      {/* Título principal */}
      <Typography variant="h4" align="center" gutterBottom>
        Listado de Tablas en la Base de Datos
      </Typography>

      {/* Indicador de carga */}
      {loading && <CircularProgress />}

      {/* Mensaje de error si ocurre */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Muestra la lista de tablas si no hay errores y las tablas están cargadas */}
      {!loading && !error && tables.length > 0 && (
        <List>
          {tables.map((table, index) => (
            <ListItem key={index}>{table}</ListItem>
          ))}
        </List>
      )}

      {/* Muestra mensaje si no hay tablas */}
      {!loading && tables.length === 0 && (
        <Typography>No se encontraron tablas.</Typography>
      )}

      {/* Botón para recargar la lista de tablas */}
      <Button variant="contained" color="primary" onClick={fetchTables}>
        Recargar Tablas
      </Button>
    </Box>
  )
}

export default TableList
