'use client'

import React, { useState } from 'react'

import { Driver } from '@/entities/driver'
import { UpdateDriverModal } from './update-driver-modal'

interface UpdateDriverButtonProps {
  driver?: Driver
  buttonText?: string
  buttonVariant?: 'edit' | 'add'
}

export const UpdateDriverButton: React.FC<UpdateDriverButtonProps> = ({
  driver,
  buttonText = 'изменить',
  buttonVariant = 'edit',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEditClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const buttonStyles =
    'font-nunito text-[#4964D8] font-extrabold text-base leading-6 tracking-[-0.04em] hover:underline cursor-pointer'

  return (
    <>
      <button
        onClick={handleEditClick}
        className={buttonStyles}
        disabled={!driver}>
        {buttonText}
      </button>

      <UpdateDriverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        driver={driver}
      />
    </>
  )
}
