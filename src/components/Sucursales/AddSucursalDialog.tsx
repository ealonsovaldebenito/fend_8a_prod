// src/components/AddSucursalDialog.tsx
import React, { useState } from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
} from "@mui/material"
import { Sucursal } from "../../types/Sucursal.ts"
import { createSucursal } from "../../api/sucursales.ts"

interface AddSucursalDialogProps {
  open: boolean
  onClose: () => void
  onAddSuccess: () => void
}

const AddSucursalDialog: React.FC<AddSucursalDialogProps> = ({
  open,
  onClose,
  onAddSuccess,
}) => {
  const [Sucursal, setSucursal] = useState<Sucursal>({
    nombre: "",
    xir: "",
    xil: "",
    xiu: "",
    token: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSucursal({ ...Sucursal, [name]: value })
  }

  const handleAddSucursal = () => {
    // Validación básica
    if (!Sucursal.nombre.trim()) {
      setError("El nombre de la sucursal es requerido")
      return
    }

    createSucursal(Sucursal)
      .then((data) => {
        console.log("Sucursal agregada exitosamente:", data)
        onAddSuccess() // Recargar la lista de sucursales
        onClose() // Cerrar el diálogo
        setSucursal({ nombre: "", xir: "", xil: "", xiu: "", token: "" }) // Limpiar formulario
        setError(null) // Limpiar errores
      })
      .catch((error) => {
        console.error("Error al agregar la sucursal:", error)
        setError("Error al agregar la sucursal")
      })
  }

  return (
    <Dialog open={open} onClose={onClose} className="animate-fadeIn">
      <DialogTitle>Añadir Nueva Sucursal</DialogTitle>
      <DialogContent>
        <Box className="space-y-4">
          <TextField
            label="Nombre"
            name="nombre"
            value={Sucursal.nombre}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            required
            error={!!error}
            helperText={error}
          />
          <TextField
            label="XIR"
            name="xir"
            value={Sucursal.xir}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="XIL"
            name="xil"
            value={Sucursal.xil}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="XIU"
            name="xiu"
            value={Sucursal.xiu}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Token"
            name="token"
            value={Sucursal.token}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="text-red-500">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSucursal}
          className="bg-blue-600"
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSucursalDialog
