'use client'

import React, { useState } from 'react'
import { AddDriverModal } from './add-driver-modal'
import { useDictionary } from '@/shared/lib/hooks'

export const AddDriverButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { dictionary } = useDictionary()

  const handleAddClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const buttonStyles =
    'font-nunito text-[#4964D8] font-extrabold text-base leading-6 tracking-[-0.04em] hover:underline cursor-pointer'

  return (
    <>
      <button onClick={handleAddClick} className={buttonStyles}>
        {dictionary.home.drivers.add}
      </button>

      <AddDriverModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
