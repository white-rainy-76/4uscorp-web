'use client'

import { useState, useCallback } from 'react'
import { TollInspectorPanel } from '@/features/tolls/toll-inspector-panel'
import { TollMapWithSearch } from '@/widgets/toll-map'
import { Toll } from '@/entities/tolls'

export default function TollsPage() {
  const [draftTollPosition, setDraftTollPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [selectedTolls, setSelectedTolls] = useState<Toll[]>([])
  const [tolls, setTolls] = useState<Toll[]>([])

  const handleTollSelect = useCallback(
    (clickedToll: Toll, isSingleSelect?: boolean) => {
      setSelectedTolls((prevSelected) => {
        // Если нажат Ctrl/Cmd, всегда выбираем только один маркер
        if (isSingleSelect) {
          const isAlreadySelected = prevSelected.some(
            (toll) => toll.id === clickedToll.id,
          )
          if (isAlreadySelected) {
            // Если уже выбран, снимаем выбор
            return prevSelected.filter((toll) => toll.id !== clickedToll.id)
          } else {
            // Если не выбран, выбираем только этот маркер
            return [clickedToll]
          }
        }

        // Обычный клик: если у маркера есть ключ, ищем все маркеры с таким же ключом
        if (clickedToll.key) {
          const tollsWithSameKey = tolls.filter(
            (toll) => toll.key === clickedToll.key,
          )
          const selectedIds = new Set(prevSelected.map((t) => t.id))
          const allWithSameKeySelected = tollsWithSameKey.every((toll) =>
            selectedIds.has(toll.id),
          )

          if (allWithSameKeySelected) {
            // Если все маркеры с таким ключом уже выбраны, снимаем выбор
            return prevSelected.filter((toll) => toll.key !== clickedToll.key)
          } else {
            // Если не все выбраны, выбираем все маркеры с таким ключом
            const newSelected = tollsWithSameKey.filter(
              (toll) => !selectedIds.has(toll.id),
            )
            return [...prevSelected, ...newSelected]
          }
        } else {
          // Если у маркера нет ключа, работаем как раньше (одиночный выбор)
          const isAlreadySelected = prevSelected.some(
            (toll) => toll.id === clickedToll.id,
          )
          if (isAlreadySelected) {
            return prevSelected.filter((toll) => toll.id !== clickedToll.id)
          } else {
            return [...prevSelected, clickedToll]
          }
        }
      })
    },
    [tolls],
  )

  const handleTollsDeselect = useCallback(() => {
    setSelectedTolls([])
  }, [])

  return (
    <div
      className="flex fixed inset-0 bg-foreground overflow-hidden"
      style={{ width: 'calc(100vw - 92px)', left: '92px', top: 0 }}>
      <div className="w-[468px] px-6 flex flex-col gap-4 pt-6 h-full">
        <TollInspectorPanel
          selectedTolls={selectedTolls}
          onTollsDeselect={handleTollsDeselect}
          onDraftPositionChange={setDraftTollPosition}
          tolls={tolls}
          onTollsChange={setTolls}
        />
      </div>

      <TollMapWithSearch
        selectedTolls={selectedTolls}
        draftTollPosition={draftTollPosition}
        onTollSelect={handleTollSelect}
        tolls={tolls}
        onTollsChange={setTolls}
        onTollsDeselect={handleTollsDeselect}
      />
    </div>
  )
}
