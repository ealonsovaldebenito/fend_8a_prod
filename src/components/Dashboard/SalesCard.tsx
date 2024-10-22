import React from "react"
import { Card, CardContent, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom" // Si usas react-router

const SalesCard: React.FC = () => {
  return (
    <Card className="bg-blue-600 text-white">
      <CardContent>
        <Typography variant="h5" align="center">
          Ventas Totales
        </Typography>
        <Button
          component={Link}
          to="/sales"
          variant="contained"
          className="mt-4 bg-white text-blue-600"
        >
          Gestionar
        </Button>
      </CardContent>
    </Card>
  )
}

export default SalesCard
