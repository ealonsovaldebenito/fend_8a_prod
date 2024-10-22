import React, { useState, useEffect } from "react"
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
import { updateSucursal } from "../../api/sucursales.ts"
import ConfirmationDialog from "../Common/ConfirmationDialog.tsx"

interface EditSucursalDialogProps {
  open: boolean
  onClose: () => void
  sucursal: Sucursal | null
  onEditSuccess: () => void
}

const EditSucursalDialog: React.FC<EditSucursalDialogProps> = ({
  open,
  onClose,
  sucursal,
  onEditSuccess,
}) => {
  const [Sucursal, setSucursal] = useState<Sucursal>({
    nombre: "",
    xir: "",
    xil: "",
    xiu: "",
    token: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  useEffect(() => {
    if (sucursal) {
      setSucursal(sucursal)
    }
  }, [sucursal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSucursal({ ...Sucursal, [name]: value })
  }

  const handleEditSucursal = () => {
    // Validación básica
    if (!Sucursal.nombre.trim()) {
      setError("El nombre de la sucursal es requerido")
      return
    }
    setConfirmDialogOpen(true) // Mostrar diálogo de confirmación
  }

  const handleConfirmEdit = () => {
    if (sucursal) {
      updateSucursal(sucursal.id, Sucursal)
        .then((data) => {
          console.log("Sucursal editada exitosamente:", data)
          onEditSuccess() // Recargar la lista de sucursales
          setConfirmDialogOpen(false) // Cerrar el diálogo de confirmación
          onClose() // Cerrar el diálogo de edición
          setError(null) // Limpiar errores
        })
        .catch((error) => {
          console.error("Error al editar la sucursal:", error)
          setError("Error al editar la sucursal")
        })
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} className="animate-fadeIn">
        <DialogTitle>Editar Sucursal</DialogTitle>
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
            onClick={handleEditSucursal}
            className="bg-blue-600"
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmEdit}
        title="Confirmar Edición"
        message={`¿Estás seguro de que deseas guardar los cambios para la sucursal ${Sucursal.nombre}?`}
      />
    </>
  )
}

export default EditSucursalDialog
