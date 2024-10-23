// src/api/sucursales.ts
import { API_URL } from "./config.ts"

// Obtener token JWT almacenado
const getAuthToken = () => {
  return localStorage.getItem("token") // Asumiendo que el token JWT se almacena en localStorage
}

// Obtener todas las sucursales
export const getSucursales = async (): Promise<Sucursal[]> => {
  try {
    const token = getAuthToken() // Obtén el token almacenado
    console.log("Iniciando la solicitud de sucursales...") // Log inicial
    console.log("API_URL:", process.env.REACT_APP_API_URL) // Verificar si imprime el valor correcto

    const response = await fetch(`${API_URL}/sucursales/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
      },
    })

    if (!response.ok) {
      console.error(`Error al obtener sucursales: ${response.status}`)
      throw new Error(`Error al obtener sucursales: ${response.status}`)
    }

    const data = await response.json() // Cambiamos "result" por "data"
    console.log("Sucursales obtenidas exitosamente:", data) // Log de éxito con los datos

    return data.data // Retornamos "data.data" porque la estructura tiene el array de sucursales en "data"
  } catch (error) {
    console.error("Error al obtener sucursales:", error)
    throw error
  }
}

// Crear una nueva sucursal
export const createSucursal = async (sucursal: Sucursal): Promise<Sucursal> => {
  const token = getAuthToken() // Obtén el token almacenado

  console.log("Iniciando la creación de una nueva sucursal...", sucursal) // Log inicial con los datos de la sucursal

  const response = await fetch(`${API_URL}/sucursales/agregar/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
    },
    body: JSON.stringify(sucursal),
    credentials: "include",
  })

  if (!response.ok) {
    console.error(`Error al crear sucursal: ${response.status}`)
    throw new Error(`Error al crear sucursal: ${response.status}`)
  }

  const createdSucursal = await response.json()
  console.log("Sucursal creada exitosamente:", createdSucursal) // Log de éxito con la sucursal creada
  return createdSucursal
}

// Actualizar una sucursal
export const updateSucursal = async (
  id: string,
  sucursal: Sucursal
): Promise<Sucursal> => {
  const token = getAuthToken() // Obtén el token almacenado

  console.log("Iniciando la actualización de la sucursal con ID:", id, sucursal) // Log inicial

  const response = await fetch(`${API_URL}/sucursales/${id}/actualizar/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
    },
    body: JSON.stringify(sucursal),
    credentials: "include",
  })

  if (!response.ok) {
    console.error(`Error al actualizar sucursal: ${response.status}`)
    throw new Error(`Error al actualizar sucursal: ${response.status}`)
  }

  const updatedSucursal = await response.json()
  console.log("Sucursal actualizada exitosamente:", updatedSucursal) // Log de éxito con la sucursal actualizada
  return updatedSucursal
}

// Eliminar una sucursal
export const deleteSucursal = async (id: string): Promise<void> => {
  const token = getAuthToken() // Obtén el token almacenado

  console.log("Iniciando la eliminación de la sucursal con ID:", id) // Log inicial

  const response = await fetch(`${API_URL}/sucursales/${id}/eliminar/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // Incluir el token JWT en el encabezado
    },
    credentials: "include",
  })

  if (!response.ok) {
    console.error(`Error al eliminar sucursal: ${response.status}`)
    throw new Error(`Error al eliminar sucursal: ${response.status}`)
  }

  console.log(`Sucursal con ID ${id} eliminada exitosamente.`) // Log de éxito
}
