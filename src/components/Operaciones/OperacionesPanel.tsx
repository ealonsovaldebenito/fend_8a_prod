// src/components/Operaciones/OperacionesPanel.tsx
import React from "react"
import { Grid, Card, CardContent, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import {
  BarChart,
  Person,
  Inventory2,
  Receipt,
  AttachMoney,
  Restaurant,
} from "@mui/icons-material"

const panels = [
  {
    name: "Ventas Totales",
    path: "/ventas",
    icon: <BarChart fontSize="large" />,
    bgColor: "bg-blue-500", // Fondo base
    hoverColor: "hover:bg-blue-600", // Fondo al hacer hover
  },
  {
    name: "Ventas Garzón",
    path: "/ventas-garzon",
    icon: <Person fontSize="large" />,
    bgColor: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
  {
    name: "Inventario",
    path: "/inventario",
    icon: <Inventory2 fontSize="large" />,
    bgColor: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
  },
  {
    name: "Cierre de Caja",
    path: "/cierre-caja",
    icon: <AttachMoney fontSize="large" />,
    bgColor: "bg-white-500",
    hoverColor: "hover:bg-pink-600",
  },
  {
    name: "Movimientos Contables",
    path: "/contabilidad",
    icon: <Receipt fontSize="large" />,
    bgColor: "bg-teal-500",
    hoverColor: "hover:bg-teal-600",
  },
  {
    name: "Menú",
    path: "/menu",
    icon: <Restaurant fontSize="large" />,
    bgColor: "bg-white-500",
    hoverColor: "hover:bg-purple-600",
  },
]

const OperacionesPanel: React.FC = () => (
  <Grid container spacing={3}>
    {panels.map((panel, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card
          className={`${panel.bgColor} ${panel.hoverColor} transform hover:scale-105 transition-transform duration-300 shadow-lg`}
        >
          <CardContent className="text-center text-black">
            <div className="flex justify-center items-center mb-4 animate-fadeIn">
              {panel.icon}
            </div>
            <Typography variant="h6" className="mb-2 font-semibold text-black">
              {panel.name}
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              component={Link}
              to={panel.path}
              className="bg-white text-black hover:bg-white hover:text-black transition-colors duration-300"
            >
              Gestionar
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)

export default OperacionesPanel
