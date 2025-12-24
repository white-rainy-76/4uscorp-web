'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from '@/shared/ui/slider'

interface FuelSliderProps {
  defaultValue?: number[]
  onChange: (value: number) => void
  max?: number
  step?: number
}

export const FuelSlider = ({
  defaultValue,
  onChange,
  max = 100,
  step = 1,
}: FuelSliderProps) => {
  const [fuelLevel, setFuelLevel] = useState(defaultValue || [0])

  useEffect(() => {
    if (defaultValue) {
      setFuelLevel(defaultValue)
    }
  }, [defaultValue])

  const handleValueChange = (value: number[]) => {
    setFuelLevel(value)
    onChange(value[0])
  }

  return (
    <div className="w-full max-w-md">
      <Slider
        value={fuelLevel}
        onValueChange={handleValueChange}
        max={max}
        min={0}
        step={step}
        showValueLabel={true}
      />
    </div>
  )
}
