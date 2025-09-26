'use client'

import React, { useState } from 'react'
import { Button } from '@/shared/ui'
import { AddCompanyModal } from './add-company-modal'
import { useDictionary } from '@/shared/lib/hooks'

export const AddCompanyButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { dictionary } = useDictionary()

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const buttonStyles =
    'font-nunito text-[#4964D8] font-extrabold text-base leading-6 tracking-[-0.04em] hover:underline cursor-pointer'

  return (
    <>
      <button onClick={handleClick} className={buttonStyles}>
        {dictionary.home.companies.add}
      </button>

      <AddCompanyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
