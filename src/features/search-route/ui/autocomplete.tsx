import React, { FormEvent, useCallback, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Input } from '@/shared/ui/input'
import { GooglePlace, GoogleSuggestion } from '@/shared/types/place'
import { useAutocompleteSuggestions } from '../lib/hooks'

interface Props {
  onPlaceSelect: (place: GooglePlace | null) => void
  value: string
  onChange: (value: string) => void
}

export const AutocompleteCustom = ({
  onPlaceSelect,
  value,
  onChange,
}: Props) => {
  const places = useMapsLibrary('places')
  const [isOpen, setIsOpen] = useState(false)
  const { suggestions, resetSession } = useAutocompleteSuggestions(value)

  const handleInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const newValue = (event.target as HTMLInputElement).value
      onChange(newValue)
      setIsOpen(newValue.length > 0 && suggestions.length > 0)
    },
    [suggestions, onChange],
  )

  const handleSuggestionClick = useCallback(
    async (suggestion: GoogleSuggestion) => {
      if (!places || !suggestion.placePrediction) return

      const place = suggestion.placePrediction.toPlace()

      await place.fetchFields({
        fields: [
          'viewport',
          'location',
          'svgIconMaskURI',
          'iconBackgroundColor',
        ],
      })

      const selectedText = suggestion.placePrediction?.text.text || ''
      onChange(selectedText)
      setIsOpen(false)
      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession()
      onPlaceSelect(place)
    },
    [places, onPlaceSelect, onChange],
  )

  return (
    <div className="flex flex-col w-full md:w-96">
      <Input
        value={value}
        onInput={(event) => handleInput(event)}
        placeholder="Search for a place"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="relative z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.placePrediction?.text.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
