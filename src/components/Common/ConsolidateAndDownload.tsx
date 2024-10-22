import React from "react"
import { Button } from "@mui/material"
import * as XLSX from "xlsx"

interface ConsolidateAndDownloadProps {
  urls: string[]
}

const ConsolidateAndDownload: React.FC<ConsolidateAndDownloadProps> = ({
  urls,
}) => {
  const handleDownload = async () => {
    if (urls.length === 0) {
      alert("No hay URLs generadas para descargar.")
      return
    }

    try {
      const consolidatedData: any[] = []

      for (const url of urls) {
        const response = await fetch(url)
        const data = await response.json()
        consolidatedData.push(...data) // Consolida los datos
      }

      // Crear archivo Excel
      const worksheet = XLSX.utils.json_to_sheet(consolidatedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Consolidados")

      // Descargar el archivo Excel
      XLSX.writeFile(workbook, "ventas_consolidadas.xlsx")
    } catch (error) {
      console.error("Error al descargar o consolidar los datos:", error)
      alert("Error al descargar o consolidar los datos.")
    }
  }

  return (
    <Button variant="contained" color="secondary" onClick={handleDownload}>
      Descargar Consolidado
    </Button>
  )
}

export default ConsolidateAndDownload
