'use client'

import React, { useState } from 'react'
import { Driver } from '@/entities/driver'
import { DriverBonusModal } from './driver-bonus-modal'

interface DriverBonusButtonProps {
  driver?: Driver
  buttonText?: string
  actionType: 'increase' | 'decrease'
}

export const DriverBonusButton: React.FC<DriverBonusButtonProps> = ({
  driver,
  buttonText = 'изменить',
  actionType,
}) => {
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
      <button onClick={handleClick} className={buttonStyles} disabled={!driver}>
        {buttonText}
      </button>

      <DriverBonusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        driver={driver}
        actionType={actionType}
      />
    </>
  )
}
