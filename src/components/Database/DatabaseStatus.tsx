import React, { useEffect, useState } from "react"
import { checkDatabaseStatus } from "../../api/common.ts" // Asegúrate de que esta ruta es correcta

const DatabaseStatus: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<{
    status: string
    message: string
  } | null>(null)

  useEffect(() => {
    console.log("Verificando el estado de la base de datos...")

    checkDatabaseStatus().then(({ data, error }) => {
      if (error) {
        console.error("Error al obtener el estado de la base de datos:", error)
        setDbStatus({ status: "error", message: error })
      } else {
        console.log("Estado de la base de datos:", data)
        setDbStatus(data)
      }
    })
  }, [])

  return (
    <div>
      {dbStatus ? (
        <div>
          <h2
            className={
              dbStatus.status === "success" ? "text-green-500" : "text-red-500"
            }
          >
            {dbStatus.status === "success"
              ? "Conexión OK"
              : "Error en la conexión"}
          </h2>
          <p>{dbStatus.message}</p>
        </div>
      ) : (
        <p>Cargando estado de la base de datos...</p>
      )}
    </div>
  )
}

export default DatabaseStatus
