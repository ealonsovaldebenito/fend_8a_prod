import { API_URL } from "./config.ts"

// Obtener token JWT almacenado
const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Obtener todas las sucursales
export const getSucursales = async (): Promise<Sucursal[]> => {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/sucursales/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener sucursales: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    throw error
  }
}

// Actualizar la configuración de una sucursal (incluye autoSync)
export const updateSucursalConfig = async (
  id: string,
  config: Partial<Sucursal>
): Promise<Sucursal> => {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}/sucursales/${id}/actualizar/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    throw new Error(
      `Error al actualizar la configuración de la sucursal: ${response.status}`
    )
  }

  const updatedSucursal = await response.json()
  return updatedSucursal
}
