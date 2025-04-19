import React, {
  FormEvent,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Input } from '@/shared/ui/input'
import { GooglePlace, GoogleSuggestion } from '@/shared/types/place'
import { useAutocompleteSuggestions } from '../lib/hooks'

interface Props {
  /** Callback function that is called when a place is selected from the autocomplete suggestions. */
  onPlaceSelect: (place: GooglePlace | null) => void
  /** The current value of the input field. */
  value: string
  /** Callback function that is called when the input value changes. */
  onChange: (value: string) => void
  placeholder: string
}

export const AutocompleteCustom = ({
  onPlaceSelect,
  value,
  onChange,
  placeholder,
}: Props) => {
  const places = useMapsLibrary('places')
  const [isOpen, setIsOpen] = useState(false)
  const { suggestions, resetSession } = useAutocompleteSuggestions(value)

  /** State to track if a place has been selected from the suggestions. */
  const [hasSelectedPlace, setHasSelectedPlace] = useState(false)

  /** Ref to track if the input has been manually edited after a selection. */
  const hasManuallyEditedRef = useRef(false)

  /**
   * Effect to reset the `hasSelectedPlace` flag when the input value changes
   * AND the input was manually edited after a selection.
   */
  useEffect(() => {
    if (hasSelectedPlace && hasManuallyEditedRef.current) {
      setHasSelectedPlace(false)
      hasManuallyEditedRef.current = false
    }
  }, [value, hasSelectedPlace])

  /**
   * Handles the input change event.
   * Updates the input value, and opens the suggestions if there are any and the input is not empty.
   * Also resets the selected place if the input changes after a selection.
   */
  const handleInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const newValue = (event.target as HTMLInputElement).value

      onChange(newValue)
      setIsOpen(newValue.length > 0 && suggestions.length > 0)

      // If the text changed after a selection, mark as manually edited
      if (hasSelectedPlace) {
        hasManuallyEditedRef.current = true
        onPlaceSelect(null)
      }
    },
    [suggestions, onChange, onPlaceSelect, hasSelectedPlace],
  )

  /**
   * Handles the click event when a suggestion is selected.
   * Fetches detailed information about the selected place, updates the input value,
   * closes the suggestions, resets the autocomplete session token, and notifies the parent component
   * about the selected place.
   */
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
          'displayName',
        ],
      })

      const selectedText = suggestion.placePrediction?.text.text || ''
      onChange(selectedText)
      setIsOpen(false)
      resetSession()
      onPlaceSelect(place)
      setHasSelectedPlace(true)
      hasManuallyEditedRef.current = false
    },
    [places, onPlaceSelect, onChange, resetSession],
  )

  return (
    <div className="relative flex flex-col w-full md:w-96">
      <Input
        variant="gray"
        value={value}
        onInput={(event) => handleInput(event)}
        placeholder={placeholder}
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-14 z-10 w-full bg-white border border-gray-300 rounded-md shadow-md ">
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
