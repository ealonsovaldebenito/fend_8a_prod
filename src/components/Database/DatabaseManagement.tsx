import React, { useState, useEffect } from "react"
import { CheckCircle, Trash, Table as TableIcon, RefreshCw } from "lucide-react"
import {
  validateTables,
  createTables,
  deleteTable,
  truncateTables,
} from "../../api/common.ts"
import ConfirmationDialog from "../Common/ConfirmationDialog.tsx" // Importar el diálogo de confirmación

const DatabaseManagement = () => {
  const [selectedDeleteTables, setSelectedDeleteTables] = useState<string[]>([])
  const [selectedTruncateTables, setSelectedTruncateTables] = useState<
    string[]
  >([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [tables, setTables] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"delete" | "truncate">(
    "truncate"
  )

  // Cargar tablas desde la API
  const fetchTables = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await validateTables()
      if (response.error) {
        setMessage("Error al obtener las tablas.")
      } else {
        setTables(response.data.tables)
      }
    } catch (error) {
      setMessage("Error al obtener las tablas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const handleApiResponse = (response, successMessage) => {
    if (response.error) {
      setMessage(`Error: ${response.error}`)
    } else {
      setMessage(successMessage)
    }
    setLoading(false)
  }

  const handleValidateTables = async () => {
    setLoading(true)
    setMessage("")
    const response = await validateTables()
    handleApiResponse(response, "Validación completada.")
  }

  const handleCreateTables = async () => {
    setLoading(true)
    setMessage("")
    const response = await createTables()
    handleApiResponse(response, "Tablas creadas exitosamente.")
  }

  const handleDeleteTables = () => {
    if (selectedDeleteTables.length === 0) {
      setMessage("No hay tablas seleccionadas para eliminar.")
      return
    }
    setConfirmAction("delete")
    setDialogOpen(true) // Abrir el diálogo de confirmación
  }

  const handleTruncateTables = () => {
    if (selectedTruncateTables.length === 0) {
      setMessage("No hay tablas seleccionadas para truncar.")
      return
    }
    setConfirmAction("truncate")
    setDialogOpen(true) // Abrir el diálogo de confirmación
  }

  const handleConfirmAction = async () => {
    setDialogOpen(false)
    setLoading(true)
    if (confirmAction === "delete") {
      const response = await deleteTable(selectedDeleteTables)
      handleApiResponse(response, "Tablas eliminadas.")
    } else if (confirmAction === "truncate") {
      const response = await truncateTables(selectedTruncateTables)
      handleApiResponse(response, "Tablas truncadas.")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Gestión de Base de Datos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white p-4 shadow-md">
          <div className="flex items-center justify-center mb-4">
            <TableIcon className="h-8 w-8 text-blue-500" />
            <h2 className="text-lg font-medium ml-2">Validar Tablas</h2>
          </div>
          <button
            className={`btn ${loading ? "btn-disabled" : "btn-primary"} w-full`}
            onClick={handleValidateTables}
          >
            {loading ? "Validando..." : "Validar"}
          </button>
        </div>

        <div className="card bg-white p-4 shadow-md">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-lg font-medium ml-2">Crear Tablas</h2>
          </div>
          <button
            className={`btn ${loading ? "btn-disabled" : "btn-primary"} w-full`}
            onClick={handleCreateTables}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>

        <div className="card bg-white p-4 shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Trash className="h-8 w-8 text-red-500" />
            <h2 className="text-lg font-medium ml-2">Eliminar Tablas</h2>
          </div>
          <button
            className={`btn ${loading ? "btn-disabled" : "btn-danger"} w-full`}
            onClick={handleDeleteTables}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

        <div className="card bg-white p-4 shadow-md">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8 text-yellow-500" />
            <h2 className="text-lg font-medium ml-2">Truncar Tablas</h2>
          </div>
          <div className="card bg-white p-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Tablas Disponibles</h2>
            {tables.length > 0 ? (
              <ul>
                {tables.map((table) => (
                  <li key={table}>
                    <label>
                      <input
                        type="checkbox"
                        value={table}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTruncateTables((prev) => [
                              ...prev,
                              table,
                            ])
                          } else {
                            setSelectedTruncateTables((prev) =>
                              prev.filter((t) => t !== table)
                            )
                          }
                        }}
                      />
                      {table}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay tablas disponibles.</p>
            )}
          </div>

          <button
            className={`btn ${loading ? "btn-disabled" : "btn-warning"} w-full`}
            onClick={handleTruncateTables}
          >
            {loading ? "Truncando..." : "Truncar"}
          </button>
        </div>
      </div>

      {message && <p className="text-center mt-4 text-red-500">{message}</p>}

      {/* Diálogo de confirmación */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction === "delete"
            ? "Confirmar Eliminación"
            : "Confirmar Truncado"
        }
        message={
          confirmAction === "delete"
            ? "¿Estás seguro de que deseas eliminar las tablas seleccionadas?"
            : "¿Estás seguro de que deseas truncar las tablas seleccionadas?"
        }
      />
    </div>
  )
}

export default DatabaseManagement
