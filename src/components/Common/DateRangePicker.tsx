import React from "react"
import { Grid, TextField } from "@mui/material"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import { es } from "date-fns/locale"

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  setStartDate: (date: Date | null) => void
  setEndDate: (date: Date | null) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <MobileDatePicker
          label="Fecha de Inicio"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slotProps={{ textField: { label: "Fecha" } }}
          views={["year", "month", "day"]}
          inputFormat="dd/MM/yyyy"
          locale={es}
        />
      </Grid>
      <Grid item xs={6}>
        <MobileDatePicker
          label="Fecha de Fin"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{ textField: { label: "Fecha" } }}
          views={["year", "month", "day"]}
          inputFormat="dd/MM/yyyy"
          locale={es}
        />
      </Grid>
    </Grid>
  )
}

export default DateRangePicker
