import { API_URL } from "./config.ts"
import jwtDecode from "jwt-decode"

// Función para almacenar tokens en localStorage
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("token", access)
  localStorage.setItem("refresh_token", refresh)
}

// Función para obtener tokens de localStorage
const getTokens = () => ({
  token: localStorage.getItem("token"),
  refresh: localStorage.getItem("refresh_token"),
})

// Manejo de errores con mensaje personalizado
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error)
  throw new Error(message)
}

// Función para hacer login y obtener el token JWT
export const login = async (username: string, password: string) => {
  try {
    console.log(`Intentando iniciar sesión para el usuario: ${username}`)
    const response = await fetch(`${API_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      handleError(errorDetails, "Error en la autenticación")
    }

    const data = await response.json()
    setTokens(data.access, data.refresh)
    console.log(`Inicio de sesión exitoso para el usuario: ${username}`)
    return data.access
  } catch (error) {
    handleError(error, "Error durante el inicio de sesión")
  }
}

// Función para refrescar el token JWT
export const refreshToken = async () => {
  const { refresh } = getTokens()

  if (!refresh) {
    console.error("No se encontró el token de refresco")
    handleLogout()
    throw new Error("Token de refresco no disponible")
  }

  try {
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    })

    if (!response.ok) {
      handleLogout()
      throw new Error("Error al refrescar el token")
    }

    const data = await response.json()
    setTokens(data.access, refresh)
    console.log("Token renovado exitosamente")
    return data.access
  } catch (error) {
    handleLogout()
    handleError(error, "Error al renovar el token")
  }
}

// Verificar si el token ha expirado
const isTokenExpired = (token: string) => {
  try {
    const { exp }: any = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch (error) {
    console.error("Error al verificar si el token ha expirado:", error)
    return true
  }
}

// Cerrar sesión
export const handleLogout = () => {
  console.log("Cerrando sesión...")
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
  window.location.href = "/login"
}

// Función para realizar solicitudes a la API con manejo de tokens
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  let { token } = getTokens()

  // Si el token ha expirado, se renueva automáticamente
  if (token && isTokenExpired(token)) {
    console.log("El token ha expirado, renovando...")
    token = await refreshToken()
  }

  const url = `${API_URL}${endpoint}`
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    console.log(`Realizando ${method} a ${url}`)
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorDetails = await response.text()
      console.error(`Error HTTP: ${response.status} - ${errorDetails}`)
      throw new Error(`Error HTTP: ${response.status} - ${errorDetails}`)
    }

    const data = await response.json()
    console.log(`Respuesta exitosa de ${url}:`, data)
    return { data, error: null }
  } catch (error) {
    console.error(`Error al realizar la solicitud a ${url}:`, error)
    return { data: null, error: error.message }
  }
}

// Verificar el estado de la base de datos
export const checkDatabaseStatus = async () =>
  apiRequest("/core/check_database")

// Validar tablas en la base de datos
export const validateTables = async () => apiRequest("/core/validate_tables")

// Crear tablas en la base de datos
export const createTables = async () =>
  apiRequest("/core/create_tables", "POST")

// Truncar tablas en la base de datos
export const truncateTables = async (tableNames: string[]) =>
  apiRequest("/core/truncate_tables/", "POST", { tables: tableNames })

// Eliminar tablas en la base de datos
export const deleteTable = async (tableNames: string[]) =>
  apiRequest(`/core/delete_table/?tables=${tableNames.join(",")}`, "DELETE")
