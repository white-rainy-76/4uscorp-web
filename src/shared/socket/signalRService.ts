import { HubConnection } from '@microsoft/signalr'
import { TruckStatsUpdate } from '../types'

type TruckStatsUpdateCallback = (update: TruckStatsUpdate) => void

class SignalRService {
  private connection: HubConnection | null = null
  // { [truckId: string]: Set<TruckStatsUpdateCallback> }
  private listeners: { [truckId: string]: Set<TruckStatsUpdateCallback> } = {}

  // Метод для установки соединения извне (из SocketProvider)
  public setConnection(connection: HubConnection): void {
    if (this.connection === connection) {
      return
    }
    this.connection = connection

    if (this.connection) {
      // Регистрируем ОДИН обработчик для всех обновлений статистики
      this.connection.on(
        'ReceiveTruckStatsUpdate',
        (update: TruckStatsUpdate) => {
          const subs = this.listeners[update.truckId]
          if (subs) {
            subs.forEach((cb) => cb(update))
          }
        },
      )
      // console.log(
      //   'SignalRService: Connection set. Listener for TruckStatsUpdate registered.',
      // )
    }
  }

  // Подписаться на обновления статистики конкретного трака
  public async subscribe(
    truckId: string,
    callback: TruckStatsUpdateCallback,
  ): Promise<void> {
    if (!this.connection) {
      // console.warn(
      //   'SignalRService: Connection is not yet established. Cannot subscribe to truck stats updates.',
      // )
      return
    }

    if (!this.listeners[truckId]) {
      this.listeners[truckId] = new Set()
      // Сервер добавит нас в группу для этого truckId
      try {
        await this.connection.invoke('JoinTruckGroup', truckId)
        // console.log(`SignalRService: Joined truck group ${truckId}`)
      } catch (error) {
        // console.error(
        //   `SignalRService: Error joining truck group ${truckId}:`,
        //   error,
        // )
        // Если произошла ошибка, возможно, стоит удалить созданный Set
        delete this.listeners[truckId]
        return
      }
    }
    this.listeners[truckId].add(callback)
    // console.log(
    //   `SignalRService: Subscribed a callback to truck ${truckId} stats updates.`,
    // )
  }

  // Отписаться от обновлений статистики
  public async unsubscribe(
    truckId: string,
    callback: TruckStatsUpdateCallback,
  ): Promise<void> {
    const subs = this.listeners[truckId]
    if (!subs) return

    subs.delete(callback)
    // console.log(
    //   `SignalRService: Unsubscribed a callback from truck ${truckId} stats updates. Remaining: ${subs.size}`,
    // )

    if (subs.size === 0) {
      delete this.listeners[truckId]
      // Сервер уберёт нас из группы
      try {
        await this.connection?.invoke('LeaveTruckGroup', truckId)
        // console.log(`SignalRService: Left truck group ${truckId}`)
      } catch (error) {
        // console.error(
        //   `SignalRService: Error leaving truck group ${truckId}:`,
        //   error,
        // )
      }
    }
  }
}

export default new SignalRService()
