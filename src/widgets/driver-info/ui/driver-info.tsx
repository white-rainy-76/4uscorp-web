import { Truck, TruckStatus } from '@/entities/truck'
import { useConnection } from '@/shared/lib/context'
import { useDictionary, useTruckSignalR } from '@/shared/lib/hooks'
import { TruckFuelUpdate } from '@/shared/types'
import { Avatar, AvatarImage, AvatarFallback, cn, Spinner } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { Phone, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'

type DriverInfoProps = {
  truck: Truck
}

export const DriverInfo = ({ truck }: DriverInfoProps) => {
  const { dictionary } = useDictionary()
  const { connection, isConnected } = useConnection()
  const [fuel, setFuel] = useState<TruckFuelUpdate | null>(null)

  const [isLoadingFuel, setIsLoadingFuel] = useState(true)

  // useTruckSignalR({
  //   connection,
  //   isConnected,
  //   truckId: truck.id,
  //   onFuelUpdate: (data) => {
  //     setFuel(data)
  //     setIsLoadingFuel(false)
  //   },
  // })

  useEffect(() => {
    if (!connection || !isConnected) return

    setIsLoadingFuel(true)

    const handleFuelUpdate = (data: TruckFuelUpdate) => {
      if (data.truckId === truck.id) {
        setFuel(data)
        setIsLoadingFuel(false)
      }
    }

    connection.on('ReceiveTruckFuelUpdate', handleFuelUpdate)

    return () => {
      connection.off('ReceiveTruckFuelUpdate', handleFuelUpdate)
    }
  }, [connection, isConnected, truck.id])

  return (
    <>
      {/* Top section with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DriverProfile
          avatarUrl={undefined}
          name="Алексей Попов"
          status="AVAILABLE"
          dictionary={dictionary}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <FuelIndicator
            percentage={fuel?.fuelPercentage}
            label={dictionary.home.driver_info.fuel}
            isLoadingFuel={isLoadingFuel}
          />
          <BonusPoints
            points={5000}
            label={dictionary.home.driver_info.bonus}
          />
        </div>

        <div className="flex gap-3 justify-start sm:justify-end">
          <ActionButton icon={<Phone className="w-5 h-5" />} />
          <ActionButton icon={<MessageSquare className="w-5 h-5" />} />
        </div>
      </div>

      <TruckDetails truck={truck} dictionary={dictionary} />
    </>
  )
}

type DriverProfileProps = {
  avatarUrl?: string
  name: string
  status: TruckStatus
  dictionary: ReturnType<typeof useDictionary>['dictionary']
}

const DriverProfile = ({
  avatarUrl,
  name,
  status,
  dictionary,
}: DriverProfileProps) => (
  <div className="flex items-center gap-4">
    <Avatar className="w-12 h-12">
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>
        {name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-extrabold text-text-heading">{name}</div>
      <div
        className={cn(
          'text-sm',
          status === 'AVAILABLE' ? 'text-green-600' : 'text-yellow-600',
        )}>
        ●{' '}
        {status === 'AVAILABLE'
          ? dictionary.home.status.available
          : dictionary.home.status.active}
      </div>
    </div>
  </div>
)

type FuelIndicatorProps = {
  percentage: string | undefined
  label: string
  isLoadingFuel: boolean
}

const FuelIndicator = ({
  percentage,
  label,
  isLoadingFuel,
}: FuelIndicatorProps) => (
  <div className="flex items-center gap-2 border border-dashed rounded-xl pl-[14px] pr-14 py-2 border-separator">
    <Icon
      name="common/fuel"
      width={26}
      height={31}
      className="text-text-muted"
    />
    <div>
      {isLoadingFuel ? (
        <Spinner size="sm" color="blue" />
      ) : (
        percentage && (
          <div className="text-sm font-extrabold text-text-strong">
            {percentage}%
          </div>
        )
      )}
      <div className="text-sm text-text-muted-alt">{label}</div>
    </div>
  </div>
)

type BonusPointsProps = {
  points: number
  label: string
}

const BonusPoints = ({ points, label }: BonusPointsProps) => (
  <div className="flex items-center gap-2">
    <Icon
      name="common/tag"
      width={20}
      height={20}
      className="text-text-muted"
    />
    <span className="text-base font-bold text-[#FFAF2A] whitespace-nowrap">
      {points} - {label}
    </span>
  </div>
)

type ActionButtonProps = {
  icon: React.ReactNode
}

const ActionButton = ({ icon }: ActionButtonProps) => (
  <button className="w-10 h-10 rounded-full border text-text-heading hover:bg-gray-100 flex items-center justify-center border-separator">
    {icon}
  </button>
)

type TruckDetailsProps = {
  truck: Truck
  dictionary: ReturnType<typeof useDictionary>['dictionary']
}

const TruckDetails = ({ truck, dictionary }: TruckDetailsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-4 text-sm">
    <div>
      <span className="text-xs text-text-muted font-medium">
        {dictionary.home.driver_info.unit_number}
      </span>
      <div className="text-xs font-bold text-text-heading">{truck.name}</div>
    </div>
    <div className="sm:border-l sm:pl-4">
      <span className="text-xs text-text-muted font-medium">
        {dictionary.home.driver_info.truck}
      </span>
      <div className="text-xs font-bold text-text-heading">
        {truck.year} {truck.make} {truck.model}
      </div>
    </div>
    <div />
  </div>
)
