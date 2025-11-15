import { useMemo } from 'react'
import { Truck } from '@/entities/truck'

/**
 * Вычисляет максимальное значение для слайдера топлива на основе данных трака
 * Formula: Math.Min(((OverWeight - TruckWeight) / PoundPerGalon) + (CurrentFuelPercent * (TankCapacityG / 100.0), TankCapacityG)
 */
export const useFuelSliderMax = (
  truck: Truck | undefined,
  currentFuelPercent: number | undefined,
  currentWeight: number,
): number => {
  return useMemo(() => {
    if (!truck || currentFuelPercent === undefined) {
      return 100 // Default fallback
    }

    const { tankCapacityG, overWeight, poundPerGallon } = truck

    const calculatedMax = Math.min(
      (overWeight - currentWeight) / poundPerGallon +
        currentFuelPercent * (tankCapacityG / 100.0),
      tankCapacityG,
    )

    return calculatedMax
  }, [truck, currentFuelPercent, currentWeight])
}
