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

// Cerrar sesión y redirigir a la página de login
export const handleLogout = (reason = "Sesión expirada") => {
  console.log(`Cerrando sesión: ${reason}`)
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
  window.location.href = "/login" // Redirigir al login
}

// Función genérica para hacer las solicitudes API con manejo de tokens
// Función genérica para hacer las solicitudes API con manejo de tokens
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
      return { data: null, error: "No se pudo renovar el token.", status: 401 }
    }
  }

  const url = `${API_URL}${endpoint}`
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
    const status = response.status // Obtener el status HTTP directamente

    if (!response.ok) {
      const errorDetails = await response.text()

      if (status === 404) {
        console.warn(`No hay datos para esta sucursal: ${errorDetails}`)
        return { data: null, error: null, status } // Continuar con las siguientes sucursales
      }

      console.error(`Error HTTP (${status}):`, errorDetails)
      return { data: null, error: errorDetails, status } // Retornar status aquí también
    }

    const data = await response.json()
    return { data, error: null, status }
  } catch (error) {
    return { data: null, error: String(error), status: 500 }
  }
}

// Servicio para subir datos de inventario de forma segmentada y controlada
export const uploadInventoryData = async (
  startDate: string,
  endDate: string,
  sucursalId: string,
  maxRetries: number = 3
): Promise<any> => {
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      console.log(
        `Iniciando subida de inventario para la sucursal ${sucursalId} entre ${startDate} y ${endDate}`
      )
      const { data, error, status } = await apiRequest(
        "/inventory/upload/",
        "POST",
        {
          start_date: startDate,
          end_date: endDate,
          sucursal_id: sucursalId,
        }
      )

      if (status === 404) {
        console.warn(
          `No hay datos para la sucursal ${sucursalId} en el periodo ${startDate} - ${endDate}`
        )
        return null // Continuar con la siguiente sucursal
      }

      if (status !== 200 || error) {
        throw new Error(`Error en el servidor: ${error || status}`)
      }

      console.log(`Subida exitosa para ${startDate} - ${endDate}:`, data)
      return data
    } catch (error: any) {
      attempts++
      console.error(
        `Error en subida de datos de inventario, intento ${attempts} de ${maxRetries}:`,
        error
      )

      if (attempts >= maxRetries) {
        console.error(
          `Error al subir datos de inventario después de ${maxRetries} intentos`
        )
        return null // Continuar con la siguiente sucursal
      }
    }
  }
}

// Subir datos de los últimos 2 días de todas las sucursales
export const uploadLastInventoryForAllSucursales = async (): Promise<void> => {
  try {
    console.log(
      "Iniciando subida de inventario para todas las sucursales (últimos 2 días)"
    )
    const { data, error, status } = await apiRequest(
      "/inventory/upload-last-inventory/",
      "POST"
    )

    if (status !== 200 || error) {
      throw new Error(`Error en el servidor: ${error || status}`)
    }

    console.log("Subida exitosa de los últimos 2 días de inventario:", data)
  } catch (error: any) {
    console.error("Error en uploadLastInventoryForAllSucursales:", error)
    throw new Error(
      "Error al subir los últimos datos de inventario: " + error.message
    )
  }
}
