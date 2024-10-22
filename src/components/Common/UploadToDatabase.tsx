import React from "react"
import { Button } from "@mui/material"

interface UploadToDatabaseProps {
  urls: string[]
}

const UploadToDatabase: React.FC<UploadToDatabaseProps> = ({ urls }) => {
  const handleUpload = async () => {
    if (urls.length === 0) {
      alert("No hay URLs generadas para subir.")
      return
    }

    try {
      for (const url of urls) {
        const response = await fetch(url)
        const data = await response.json()

        // Enviar los datos al backend para ser subidos a la base de datos
        await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
      }

      alert("Datos subidos correctamente a la base de datos.")
    } catch (error) {
      console.error("Error al subir los datos:", error)
      alert("Error al subir los datos a la base de datos.")
    }
  }

  return (
    <Button variant="contained" color="primary" onClick={handleUpload}>
      Subir a Base de Datos
    </Button>
  )
}

export default UploadToDatabase
