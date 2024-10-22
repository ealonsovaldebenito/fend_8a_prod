import { API_URL } from "./config.ts"
import { jwtDecode } from "jwt-decode"

// Función para manejar la autenticación con login y renovación de tokens.
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("token", access)
  localStorage.setItem("refresh_token", refresh)
}

const getTokens = () => ({
  token: localStorage.getItem("token"),
  refresh: localStorage.getItem("refresh_token"),
})

// Manejo de errores genéricos
const handleError = (error: any, customMessage: string) => {
  console.error(`${customMessage}:`, error)
  throw new Error(customMessage)
}

// Login y obtención de token JWT
export const login = async (username: string, password: string) => {
  try {
    console.log(`Iniciando sesión para el usuario: ${username}`)
    const response = await fetch(`${API_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

// Refrescar el token JWT
export const refreshToken = async () => {
  const { refresh } = getTokens()
  if (!refresh) {
    handleLogout("Token de refresco no disponible")
    return
  }

  try {
    console.log("Renovando token de acceso...")
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })

    if (!response.ok) {
      handleLogout("Error al refrescar el token")
      return
    }

    const data = await response.json()
    setTokens(data.access, refresh)
    console.log("Token de acceso renovado exitosamente")
    return data.access
  } catch (error) {
    handleLogout("Error al renovar el token")
    handleError(error, "Error al renovar el token")
  }
}

// Verificar si el token ha expirado
const isTokenExpired = (token: string) => {
  try {
    if (!token) return true
    const { exp }: any = jwtDecode(token)
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch (error) {
    console.error("Error al verificar la expiración del token:", error)
    return true // Si ocurre algún error, asumimos que está expirado.
  }
}

// Cerrar sesión y redirigir a la página de login
export const handleLogout = (reason = "Sesión expirada") => {
  console.log(`Cerrando sesión: ${reason}`)
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
  window.location.href = "/login" // Redirigir al login
}

// Manejo de las solicitudes API con tokens
export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  let { token } = getTokens()

  // Verificar si el token ha expirado y refrescarlo
  if (token && isTokenExpired(token)) {
    console.log("Token expirado, intentando renovar...")
    token = await refreshToken()
    if (!token) {
      handleLogout("No se pudo renovar el token.")
      return
    }
  }

  const url = `${API_URL}${endpoint}`
  console.log(`URL generada para la solicitud: ${url}`)
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Incluimos el token en el header
    },
    credentials: "include",
  }

  if (body) options.body = JSON.stringify(body)

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorDetails = await response.text()
      console.error(`Error HTTP (${response.status}):`, errorDetails)
      handleError(errorDetails, `Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Respuesta exitosa de ${url}:`, data)
    return { data, error: null }
  } catch (error) {
    handleError(error, `Error al realizar la solicitud a ${url}`)
  }
}

// Verificar el estado de la base de datos
export const checkDatabaseStatus = async () =>
  apiRequest("/core/check_database/")

// Validar tablas en la base de datos
export const validateTables = async () => apiRequest("/core/validate_tables/")

// Crear tablas en la base de datos
export const createTables = async () =>
  apiRequest("/core/create_tables/", "POST")

// Truncar tablas en la base de datos
export const truncateTables = async (tableNames: string[]) =>
  apiRequest("/core/truncate_tables/", "POST", { tables: tableNames })

// Eliminar tablas en la base de datos
export const deleteTable = async (tableNames: string[]) =>
  apiRequest(`/core/delete_table/?tables=${tableNames.join(",")}`, "DELETE")
