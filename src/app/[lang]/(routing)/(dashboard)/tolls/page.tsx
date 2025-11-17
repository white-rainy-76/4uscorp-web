'use client'

import { useState } from 'react'
import { TollInspectorPanel } from '@/features/tolls/toll-inspector-panel'
import { TollMapWithSearch } from '@/widgets/toll-map'
import { Toll } from '@/entities/tolls'

export default function TollsPage() {
  const [draftTollPosition, setDraftTollPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [selectedToll, setSelectedToll] = useState<Toll | null>(null)
  const [tolls, setTolls] = useState<Toll[]>([])

  return (
    <div
      className="flex h-screen bg-foreground overflow-hidden"
      style={{ width: 'calc(100vw - 92px)' }}>
      <div className="w-[468px] px-6 flex flex-col gap-4 pt-6">
        <TollInspectorPanel
          selectedToll={selectedToll}
          onTollSelect={setSelectedToll}
          onDraftPositionChange={setDraftTollPosition}
          tolls={tolls}
          onTollsChange={setTolls}
        />
      </div>

      <TollMapWithSearch
        selectedToll={selectedToll}
        draftTollPosition={draftTollPosition}
        onTollSelect={setSelectedToll}
        tolls={tolls}
        onTollsChange={setTolls}
      />
    </div>
  )
}
