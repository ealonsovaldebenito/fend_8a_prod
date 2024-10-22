import React from "react"
import { Grid } from "@mui/material"
import SalesForm from "./SalesForm.tsx"

const SalesPanel: React.FC = () => {
  return (
    <Grid item xs={12} md={6}>
      <SalesForm />
    </Grid>
  )
}

export default SalesPanel
