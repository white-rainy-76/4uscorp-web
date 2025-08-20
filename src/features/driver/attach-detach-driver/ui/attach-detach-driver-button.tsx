'use client'

import React, { useState } from 'react'
import { Driver } from '@/entities/driver'
import { AttachDetachDriverModal } from './attach-detach-driver-modal'

interface AttachDetachDriverButtonProps {
  driver?: Driver
  buttonText?: string
}

export const AttachDetachDriverButton: React.FC<
  AttachDetachDriverButtonProps
> = ({ driver, buttonText = 'изменить' }) => {
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

      <AttachDetachDriverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        driver={driver}
      />
    </>
  )
}
