import { createContext, useContext } from 'react'

type contextType = {
  connection: any | null
  isConnected: boolean
}

export const connectionContext = createContext<contextType>({
  connection: null,
  isConnected: false,
})

export const useConnection = () => {
  return useContext(connectionContext)
}
