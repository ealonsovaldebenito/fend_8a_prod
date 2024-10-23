import axios from "axios"
import { API_URL } from "./config.ts"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
  toast.error(customMessage)
  throw new Error(customMessage)
}

// Login y obtención de token JWT
export const login = async (username: string, password: string) => {
  try {
    console.log(`Iniciando sesión para el usuario: ${username}`)
    const response = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    })

    if (response.status !== 200) {
      handleError(response.data, "Error en la autenticación")
    }

    const data = response.data
    setTokens(data.access, data.refresh)
    console.log(`Inicio de sesión exitoso para el usuario: ${username}`)
    toast.success("Inicio de sesión exitoso")
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
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh })

    if (response.status !== 200) {
      handleLogout("Error al refrescar el token")
      return
    }

    const data = response.data
    setTokens(data.access, refresh)
    console.log("Token de acceso renovado exitosamente")
    toast.success("Token renovado con éxito")
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
    return true
  }
}

// Cerrar sesión y redirigir a la página de login
export const handleLogout = (reason = "Sesión expirada") => {
  console.log(`Cerrando sesión: ${reason}`)
  localStorage.removeItem("token")
  localStorage.removeItem("refresh_token")
  toast.info(reason)
  window.location.href = "/login"
}

// Manejo de las solicitudes API con tokens
const apiRequest = async (
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
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  }

  if (body) options.body = JSON.stringify(body)

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorDetails = await response.text()
      if (response.status === 404) {
        console.warn(`No hay datos para esta sucursal: ${errorDetails}`)
        return { data: null, error: null } // Continuar con las siguientes sucursales
      }
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

// Función para hacer polling del estado de la tarea de Celery
export const checkTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/ventas/task_status/${taskId}/`)
    return response.data
  } catch (error) {
    throw new Error(
      "Error al consultar el estado de la tarea: " + error.message
    )
  }
}

// Servicio para subir datos de ventas
export const uploadSalesData = async (
  startDate: string,
  endDate: string,
  sucursalId: string
): Promise<any> => {
  try {
    console.log(
      `Iniciando subida de ventas para la sucursal ${sucursalId} entre ${startDate} y ${endDate}`
    )
    toast.info(`Subida de ventas para la sucursal ${sucursalId} en progreso`)

    // Iniciar la subida de ventas y obtener el task_id
    const { data } = await axios.post(`${API_URL}/ventas/upload/`, {
      start_date: startDate,
      end_date: endDate,
      sucursal_id: sucursalId,
    })

    const taskId = data.task_id
    console.log(`Task ID: ${taskId}`)

    // Polling para revisar el estado de la tarea
    let taskStatus = "PENDING"
    while (taskStatus !== "SUCCESS" && taskStatus !== "FAILURE") {
      await new Promise((resolve) => setTimeout(resolve, 5000)) // Esperar 5 segundos antes de la siguiente consulta
      const { status, result } = await checkTaskStatus(taskId)
      taskStatus = status
      console.log(`Estado de la tarea: ${taskStatus}`)
    }

    if (taskStatus === "SUCCESS") {
      toast.success("Subida exitosa")
      return true
    } else {
      toast.error("Error en la subida de ventas")
      return false
    }
  } catch (error) {
    console.error("Error en uploadSalesData:", error)
    toast.error("Error al subir datos")
    throw new Error("Error al subir datos: " + error.message)
  }
}

// Servicio para subir los últimos datos de ventas de todas las sucursales
export const uploadLastSalesForAllSucursales = async (): Promise<any> => {
  try {
    console.log(
      `Iniciando subida de ventas para todas las sucursales (últimos 2 días)`
    )
    toast.info("Subida de ventas en progreso para todas las sucursales")
    const { data, error } = await apiRequest(
      "/ventas/upload_all/",
      "POST",
      null
    )
    if (error) throw new Error(error)
    toast.success("Subida exitosa de las ventas de los últimos 2 días")
    return data
  } catch (error: any) {
    console.error("Error en uploadLastSalesForAllSucursales:", error)
    toast.error("Error al subir las últimas ventas")
    throw new Error("Error al subir las últimas ventas: " + error.message)
  }
}
