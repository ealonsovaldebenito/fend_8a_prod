import React, { useState, useEffect } from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  Box,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material"
import { getSucursales, updateSucursalConfig } from "../../api/configuracion.ts"
import "../../assets/css/components/configuracion.css"

interface Sucursal {
  id: string
  nombre: string
  autoSync: boolean
  lastSync: string
  nextSync: string
  lastDataObtain: string
  syncInterval: number // Campo de intervalo de sincronización
}

const ConfiguracionPanel: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar datos de las sucursales
    getSucursales()
      .then((data) => {
        console.log("Sucursales obtenidas exitosamente:", data)
        setSucursales(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error al obtener las sucursales:", error)
        setError("Error al obtener los datos de las sucursales.")
        setLoading(false)
      })
  }, [])

  const handleAutoSyncToggle = (
    sucursalId: string,
    currentAutoSync: boolean
  ) => {
    const updatedSucursal = sucursales.find((s) => s.id === sucursalId)
    if (!updatedSucursal) return

    console.log(
      `Actualizando autoSync de ${updatedSucursal.nombre}: ${!currentAutoSync}`
    )

    updateSucursalConfig(sucursalId, {
      autoSync: !currentAutoSync,
    })
      .then(() => {
        console.log(
          `autoSync actualizado para ${
            updatedSucursal.nombre
          }: ${!currentAutoSync}`
        )
        setSucursales((prevSucursales) =>
          prevSucursales.map((s) =>
            s.id === sucursalId ? { ...s, autoSync: !currentAutoSync } : s
          )
        )
      })
      .catch((error) => {
        console.error("Error al actualizar AutoSync:", error)
        setError("Error al actualizar el estado de AutoSync.")
      })
  }

  const handleSyncIntervalChange = (
    sucursalId: string,
    newInterval: number
  ) => {
    const updatedSucursal = sucursales.find((s) => s.id === sucursalId)
    if (!updatedSucursal) return

    console.log(
      `Actualizando intervalo de sincronización de ${updatedSucursal.nombre} a ${newInterval} minutos.`
    )

    updateSucursalConfig(sucursalId, {
      syncInterval: newInterval,
    })
      .then(() => {
        console.log(
          `Intervalo de sincronización actualizado para ${updatedSucursal.nombre}: ${newInterval} minutos`
        )
        setSucursales((prevSucursales) =>
          prevSucursales.map((s) =>
            s.id === sucursalId ? { ...s, syncInterval: newInterval } : s
          )
        )
      })
      .catch((error) => {
        console.error(
          "Error al actualizar el intervalo de sincronización:",
          error
        )
        setError("Error al actualizar el intervalo de sincronización.")
      })
  }

  const calculateTimeRemaining = (nextSync: string) => {
    const nextSyncTime = new Date(nextSync).getTime()
    const currentTime = Date.now()
    const timeDiff = nextSyncTime - currentTime

    if (timeDiff <= 0) {
      return "Actualización pendiente."
    }

    const minutes = Math.floor(timeDiff / 60000)
    return `${minutes} minutos restantes`
  }

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Grid container spacing={3}>
      {sucursales.map((sucursal) => (
        <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
          <Card className="sucursalCard">
            <CardContent>
              <Typography variant="h6" className="sucursalName">
                {sucursal.nombre}
              </Typography>
              <Box className="syncStatus">
                <Typography variant="body1">
                  AutoSync:{" "}
                  <Switch
                    checked={sucursal.autoSync}
                    onChange={() =>
                      handleAutoSyncToggle(sucursal.id, sucursal.autoSync)
                    }
                  />
                </Typography>
                <Typography variant="body2">
                  Última sincronización: {sucursal.lastSync || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Próxima sincronización: {sucursal.nextSync || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Últimos datos obtenidos: {sucursal.lastDataObtain || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Intervalo de sincronización (minutos):
                  <TextField
                    type="number"
                    value={sucursal.syncInterval}
                    onChange={(e) =>
                      handleSyncIntervalChange(
                        sucursal.id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                </Typography>
                <Typography variant="body2">
                  {sucursal.nextSync &&
                    calculateTimeRemaining(sucursal.nextSync)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ConfiguracionPanel
