import React, { useState, useEffect } from "react"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import { getSucursales, deleteSucursal } from "../../api/sucursales.ts"
import EditSucursalDialog from "./EditSucursalDialog.tsx"
import ConfirmationDialog from "../Common/ConfirmationDialog.tsx"
import "../../assets/css/components/sucursal.css"

interface Sucursal {
  id: string
  nombre: string
  xir: string
  xil: string
  xiu: string
  token: string
}

interface SnackbarState {
  open: boolean
  message: string
  severity: "success" | "error"
}

const SucursalList = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(
    null
  )
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    getSucursales()
      .then((data) => setSucursales(data))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Error al cargar sucursales",
          severity: "error",
        })
      )
  }, [])

  const handleEditClick = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedSucursal) {
      deleteSucursal(selectedSucursal.id)
        .then(() => {
          setSucursales(sucursales.filter((s) => s.id !== selectedSucursal.id))
          setDeleteDialogOpen(false)
          setSnackbar({
            open: true,
            message: "Sucursal eliminada exitosamente",
            severity: "success",
          })
        })
        .catch(() =>
          setSnackbar({
            open: true,
            message: "Error al eliminar sucursal",
            severity: "error",
          })
        )
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <div className="sucursalListContainer">
      <Typography variant="h5">Lista de Sucursales</Typography>
      {sucursales.length > 0 ? (
        <List>
          {sucursales.map((sucursal) => (
            <ListItem key={sucursal.id} className="sucursalItem">
              <ListItemText
                primary={sucursal.nombre}
                secondary={`XIR: ${sucursal.xir} | XIL: ${sucursal.xil} | XIU: ${sucursal.xiu} | Token: ${sucursal.token}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleEditClick(sucursal)}
                  className="sucursalButton"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteClick(sucursal)}
                  className="sucursalButton"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No hay sucursales registradas</Typography>
      )}

      {selectedSucursal && (
        <EditSucursalDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          sucursal={selectedSucursal}
          onEditSuccess={() => getSucursales().then(setSucursales)}
        />
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la sucursal ${selectedSucursal?.nombre}?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SucursalList
