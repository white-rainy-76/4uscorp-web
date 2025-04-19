'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/shared/ui'
import { TruckCard, TruckStatus } from '@/entities/truck'
import { Card } from '@/entities/truck'

// Фейковые данные
const fakeTrucks: Omit<TruckCard, 'isActive' | 'setIsActive'>[] = [
  {
    avatarImage: 'https://i.pravatar.cc/150?img=1',
    unitNumber: '1269',
    name: 'Юрий Виноградов',
    fuelPercentage: 78,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=2',
    unitNumber: '1270',
    name: 'Алексей Иванов',
    fuelPercentage: 45,
    status: TruckStatus.IDLE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=3',
    unitNumber: '1271',
    name: 'Сергей Петров',
    fuelPercentage: 92,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=4',
    unitNumber: '1672',
    name: 'Дмитрий Смирнов',
    fuelPercentage: 33,
    status: TruckStatus.MAINTENANCE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=1',
    unitNumber: '1569',
    name: 'Юрий Виноградов',
    fuelPercentage: 78,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=2',
    unitNumber: '9270',
    name: 'Алексей Иванов',
    fuelPercentage: 45,
    status: TruckStatus.IDLE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=3',
    unitNumber: '8271',
    name: 'Сергей Петров',
    fuelPercentage: 92,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=4',
    unitNumber: '7272',
    name: 'Дмитрий Смирнов',
    fuelPercentage: 33,
    status: TruckStatus.MAINTENANCE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=1',
    unitNumber: '6269',
    name: 'Юрий Виноградов',
    fuelPercentage: 78,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=2',
    unitNumber: '5270',
    name: 'Алексей Иванов',
    fuelPercentage: 45,
    status: TruckStatus.IDLE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=3',
    unitNumber: '4271',
    name: 'Сергей Петров',
    fuelPercentage: 92,
    status: TruckStatus.EN_ROUTE,
  },
  {
    avatarImage: 'https://i.pravatar.cc/150?img=4',
    unitNumber: '3272',
    name: 'Дмитрий Смирнов',
    fuelPercentage: 33,
    status: TruckStatus.MAINTENANCE,
  },
]

export const DriversList = () => {
  const [activeUnit, setActiveUnit] = useState<string | null>(null)
  const [filterText, setFilterText] = useState<string>('')
  const [filteredTrucks, setFilteredTrucks] =
    useState<Omit<TruckCard, 'isActive' | 'setIsActive'>[]>(fakeTrucks)

  useEffect(() => {
    if (!filterText) {
      setFilteredTrucks(fakeTrucks)
    } else {
      const lowerCaseFilter = filterText.toLowerCase()
      const filtered = fakeTrucks.filter((truck) =>
        truck.unitNumber.toLowerCase().includes(lowerCaseFilter),
      )
      setFilteredTrucks(filtered)
    }
  }, [filterText])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <Input
        showIcon={true}
        placeholder="Search by unit number"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto p-1 pr-2 custom-scroll">
        <div className="space-y-4">
          {filteredTrucks.length > 0 ? (
            filteredTrucks.map((truck) => (
              <Card
                key={truck.unitNumber}
                avatarImage={truck.avatarImage}
                unitNumber={truck.unitNumber}
                name={truck.name}
                fuelPercentage={truck.fuelPercentage}
                status={truck.status}
                isActive={activeUnit === truck.unitNumber}
                setIsActive={() => setActiveUnit(truck.unitNumber)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No trucks found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
