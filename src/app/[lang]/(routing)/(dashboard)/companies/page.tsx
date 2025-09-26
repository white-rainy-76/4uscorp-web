'use client'
import React from 'react'
import { useDictionary } from '@/shared/lib/hooks'

export default function CompanyPage() {
  const { dictionary } = useDictionary()

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-heading mb-2">
          {dictionary.home.companies.select_company}
        </h2>
        <p className="text-muted-foreground">
          {dictionary.home.companies.choose_company_message}
        </p>
      </div>
    </div>
  )
}
