'use client'

import React, { useState } from 'react'
import { TruckGroup } from '@/entities/truck'
import { SetTruckGroupWeightFuelModal } from './set-truck-group-weight-fuel-modal'

interface SetTruckGroupWeightFuelButtonProps {
  truckGroup?: TruckGroup
  buttonText?: string
}

export const SetTruckGroupWeightFuelButton: React.FC<
  SetTruckGroupWeightFuelButtonProps
> = ({ truckGroup, buttonText = 'изменить' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const buttonStyles =
    'font-nunito text-[#4964D8] font-extrabold text-base leading-6 hover:underline cursor-pointer'

  return (
    <>
      <button
        onClick={handleClick}
        className={buttonStyles}
        disabled={!truckGroup}>
        {buttonText}
      </button>

      <SetTruckGroupWeightFuelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        truckGroup={truckGroup}
      />
    </>
  )
}
