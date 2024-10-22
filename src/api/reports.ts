import { API_URL } from "./config.ts"

export const getTableData = async (table: string) => {
  const response = await fetch(`${API_URL}/core/get_table_data/?table=${table}`) // <-- Elimina el '/' final
  if (!response.ok) {
    throw new Error("Error al obtener los datos de la tabla")
  }
  return await response.json()
}
