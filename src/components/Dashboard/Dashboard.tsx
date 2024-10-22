import React from "react"
import { Grid, Card, CardContent, Typography, Button } from "@mui/material"
import DatabaseCard from "./DatabaseCard"
import SalesCard from "./SalesCard"
import WaiterSalesCard from "./WaiterSalesCard"
import InventoryCard from "./InventoryCard"
import CollectionCard from "./CollectionCard"
import AccountingCard from "./AccountingCard"
import MenuCard from "./MenuCard"

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" className="text-center my-8">
        Panel de Administración
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DatabaseCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <SalesCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <WaiterSalesCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <InventoryCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <CollectionCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <AccountingCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <MenuCard />
        </Grid>
      </Grid>
    </div>
  )
}

export default Dashboard
