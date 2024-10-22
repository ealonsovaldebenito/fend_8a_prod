import { generateApiUrl } from "./common"

export const fetchCollection = async (
  date: string,
  xir: string,
  xil: string,
  xiu: string,
  token: string
) => {
  const url = generateApiUrl("collection", date, date, xir, xil, xiu, token)[0]

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Error fetching collection data")
  }

  return await response.json()
}
