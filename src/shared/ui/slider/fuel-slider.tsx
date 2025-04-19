'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from './slider'
import { useFormContext } from 'react-hook-form'

interface FuelSliderProps {
  defaultValue?: number[]
  onChange: (value: number) => void
  max?: number
  step?: number
}

export const FuelSlider = ({
  defaultValue,
  onChange,
  max,
  step,
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
    <div className="w-full max-w-md flex items-center">
      <span className="mr-4">{fuelLevel[0]}%</span>
      <Slider
        value={fuelLevel}
        onValueChange={handleValueChange}
        max={max}
        min={0}
        step={step}
      />
    </div>
  )
}
