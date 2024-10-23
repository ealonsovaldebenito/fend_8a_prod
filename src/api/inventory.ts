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
    const response = await axios(url, options)

    if (response.status !== 200) {
      const errorDetails = response.data
      console.error(`Error HTTP (${response.status}):`, errorDetails)
      handleError(errorDetails, `Error HTTP: ${response.status}`)
    }

    const data = response.data
    console.log(`Respuesta exitosa de ${url}:`, data)
    return { data, error: null }
  } catch (error) {
    handleError(error, `Error al realizar la solicitud a ${url}`)
  }
}

// Función para hacer polling del estado de la tarea de Celery
export const checkTaskStatus = async (taskId: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/inventory/task_status/${taskId}/`
    )
    return response.data
  } catch (error) {
    throw new Error(
      "Error al consultar el estado de la tarea: " + error.message
    )
  }
}

// Servicio para subir datos de inventario
export const uploadInventoryData = async (
  startDate: string,
  endDate: string,
  sucursalId: string
): Promise<any> => {
  try {
    console.log(
      `Iniciando subida de inventario para la sucursal ${sucursalId} entre ${startDate} y ${endDate}`
    )
    toast.info(
      `Subida de inventario para la sucursal ${sucursalId} en progreso`
    )

    // Iniciar la subida de inventario y obtener el task_id
    const { data } = await axios.post(`${API_URL}/inventory/upload/`, {
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
      toast.error("Error en la subida de inventario")
      return false
    }
  } catch (error) {
    console.error("Error en uploadInventoryData:", error)
    toast.error("Error al subir datos de inventario")
    throw new Error("Error al subir datos: " + error.message)
  }
}

// Servicio para subir los últimos datos de inventario de todas las sucursales
export const uploadLastInventoryForAllSucursales = async (): Promise<any> => {
  try {
    console.log(
      `Iniciando subida de inventario para todas las sucursales (últimos 2 días)`
    )
    toast.info("Subida de inventario en progreso para todas las sucursales")

    const { data, error } = await apiRequest("/inventory/upload_all/", "POST")
    if (error) throw new Error(error)

    toast.success("Subida exitosa de los inventarios de los últimos 2 días")
    return data
  } catch (error: any) {
    console.error("Error en uploadLastInventoryForAllSucursales:", error)
    toast.error("Error al subir los últimos inventarios")
    throw new Error("Error al subir los últimos inventarios: " + error.message)
  }
}
