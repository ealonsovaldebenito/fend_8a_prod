// src/components/AddSucursalForm.tsx
import React, { useState } from "react"
import { Button } from "@mui/material"
import AddSucursalDialog from "./AddSucursalDialog.tsx"

const AddSucursalForm = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    console.log("Abriendo diálogo de añadir sucursal")
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    console.log("Cerrando diálogo de añadir sucursal")
    setOpenDialog(false)
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        className="bg-indigo-600 hover:bg-indigo-700"
      >
        Añadir Sucursal
      </Button>
      <AddSucursalDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onAddSuccess={() => {
          console.log("Sucursal añadida exitosamente")
          // Aquí podrías recargar la lista de sucursales o hacer otra acción
        }}
      />
    </div>
  )
}

export default AddSucursalForm
