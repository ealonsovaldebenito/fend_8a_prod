import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"

interface Props {
  urls: string[]
}

const GeneratedUrlsTable: React.FC<Props> = ({ urls }) => {
  return (
    <div className="mt-8">
      <Typography variant="h6">URLs Generadas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Rango de Fechas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {urls.map((url, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{url}</TableCell>
              <TableCell>{/* Extraer las fechas del URL */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default GeneratedUrlsTable
