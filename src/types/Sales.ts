// Modelo para Sales
export interface Sales {
  saleId: string // UUID corregido
  idSucursal: string // ID de la sucursal
  comment: string | null
  numberClients: number | null // Corrigiendo a numberClients
  tableName: string | null // Corrigiendo a tableName
  registerId: string | null
  totalWithGratuity: number | null
  registerName: string | null
  total: number | null
  fiscalAmt: number | null
  waiterId: string | null
  fiscalType: string | null
  gratuity: number | null
  zoneId: string | null
  discounts: number | null
  dateOpen: string | null
  dateClosed: string | null
  zoneName: string | null
  orderId: number | null
  paymentId: number | null
  waiterName: string | null
  difference: number | null
  subtotal: number | null
  fiscalId: string | null
  changeAmount: number | null
  tableCapacity: number | null // Corrigiendo a tableCapacity
  taxes: number | null
  fiscalPrinter: string | null
  payed: number | null
  tableId: string | null
  date: string | null
  client: Client | null // Relación con la interfaz Client
  products: ProductSales[] // Relación con la interfaz Product
  paymentForms: PaymentForm[] // Relación con la interfaz PaymentForm
}

// Modelo para Product
export interface ProductSales {
  id: number
  idSucursal: string
  saleId: string
  payed: number | null
  prodDiscounts: number | null // Corrigiendo a prodDiscounts
  hierarchyName: string | null // Corrigiendo a hierarchyName
  netPrice: number | null
  name: string
  prodId: string
  hierarchyId: string | null
  taxes: number | null
  quantity: number | null
  date: string | null
}

// Modelo para PaymentForm
export interface PaymentForm {
  id: number
  paymentId: number | null
  saleId: string
  idSucursal: string
  orderId: number | null // Añadiendo orderId
  amount: number | null
  name: string | null
  paymentFormId: number | null
  date: string | null
}

// Modelo para Client
export interface Client {
  id: number
  name: string
  phone: string | null
  email: string | null
  address: string | null
}
