'use client'
import { connectionContext } from '@/shared/lib/context/socket-context'
import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  HubConnectionBuilder,
  HubConnection,
  HttpTransportType,
} from '@microsoft/signalr'
import signalRService from '@/shared/socket/signalRService'

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const connectionRef = useRef<HubConnection | null>(null)

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'

  useEffect(() => {
    const connect = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${serverUrl}/truckstracking-api/truck-tracking`, {
          skipNegotiation: true, // Optional: for same-origin or specific configurations
          transport: HttpTransportType.WebSockets, // Optional: specify transport
        })
        .withAutomaticReconnect()
        .build()

      connectionRef.current = newConnection
      setConnection(newConnection)

      signalRService.setConnection(newConnection)

      newConnection.onclose((error) => {
        setIsConnected(false)
        if (error) {
          console.error('SignalR connection closed with error:', error)
        } else {
          console.log('SignalR connection closed.')
        }
      })

      newConnection.onreconnecting((error) => {
        setIsConnected(false)
        console.warn('SignalR connection reconnecting...', error)
      })

      newConnection.onreconnected((connectionId) => {
        setIsConnected(true)
        console.log('SignalR reconnected. Connection ID:', connectionId)
      })

      try {
        await newConnection.start()
        setIsConnected(true)
      } catch (err) {
        setIsConnected(false)
        console.error('Error while starting SignalR connection:', err)
      }
    }

    connect()
    // Clear before unmount
    return () => {
      connectionRef.current?.stop()
    }
  }, [serverUrl])

  return (
    <connectionContext.Provider value={{ connection: connection, isConnected }}>
      {children}
    </connectionContext.Provider>
  )
}
