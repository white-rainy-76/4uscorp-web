import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[]
  isLoading: boolean
  resetSession: () => void
}

/**
 * A reusable hook to retrieve autocomplete suggestions from the Google Places API.
 * It utilizes the new Autocomplete Data API.
 * (https://developers.google.com/maps/documentation/javascript/place-autocomplete-data)
 *
 * @param inputString The input string for which to fetch autocomplete suggestions.
 * @param requestOptions Additional options for the autocomplete request.
 *   (See {@link https://developers.google.com/maps/documentation/javascript/reference/autocomplete-data#AutocompleteRequest}).
 *
 * @returns An object containing:
 *   - `suggestions`: An array of autocomplete suggestions.
 *   - `isLoading`: A boolean indicating whether a request is in progress.
 *   - `resetSession`: A function to reset the current session.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [input, setInput] = useState('');
 *   const { suggestions, isLoading, resetSession } = useAutocompleteSuggestions(input, {
 *     includedPrimaryTypes: ['restaurant']
 *   });
 *
 *   return (
 *     <div>
 *       <input value={input} onChange={(e) => setInput(e.target.value)} />
 *       <ul>
 *         {suggestions.map(({ placePrediction }) => (
 *           <li key={placePrediction.placeId}>{placePrediction.text.text}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {},
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary('places')

  // Stores the current session token (now managed with useState)
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null)

  // Stores the autocomplete suggestions
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([])

  // Indicates if an API request is in progress
  const [isLoading, setIsLoading] = useState(false)

  // Effect that runs when the Places library is loaded or the input changes
  useEffect(() => {
    if (!placesLib) return

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib

    // Create a new session token if it doesn't exist
    if (!sessionToken) {
      setSessionToken(new AutocompleteSessionToken())
    }

    // If input is empty, reset suggestions and exit
    if (inputString === '') {
      if (suggestions.length > 0) setSuggestions([])
      return
    }

    // Create a request object with the input string and session token
    const request: google.maps.places.AutocompleteRequest = {
      ...requestOptions,
      input: inputString,
      sessionToken: sessionToken!, // Ensure token is not null before using
    }

    setIsLoading(true)

    // Fetch autocomplete suggestions from the API
    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res) => {
        setSuggestions(res.suggestions)
      })
      .catch((error) => {
        console.error('Failed to fetch autocomplete suggestions:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [placesLib, inputString, sessionToken])

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      setSessionToken(null)
      setSuggestions([])
    },
  }
}
