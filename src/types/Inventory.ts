// Interfaz para los detalles de inventario en una bodega
export interface InventoryDetail {
  date: string // Fecha en formato ISO
  initial_inventory: number // Inventario inicial
  final_inventory: number // Inventario final
  is_taken: boolean // Si fue tomado
  use: number // Cantidad utilizada
  cost: number // Costo del inventario
  transformed: number // Cantidad transformada
  purchase: number // Cantidad comprada
}

// Interfaz para el inventario dentro de una bodega específica
export interface WarehouseInventory {
  warehouse_id: string // ID de la bodega
  inventory: InventoryDetail[] // Detalles de inventario para esa bodega
}

// Interfaz principal para un producto en el inventario
export interface Inventory {
  product_id: string // ID del producto
  product_name: string // Nombre del producto
  unit: string // Unidad de medida (ej: kg, litros)
  warehouses: WarehouseInventory[] // Lista de bodegas y sus inventarios
}
