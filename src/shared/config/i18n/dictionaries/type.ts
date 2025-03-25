// This file defines the structure of the 'dictionary' object used in the application.
// This helps in getting type suggestions when using the 'dictionary' object provided by the Context API.

// Directly import the JSON file synchronously
import en from './en.json'
export type DictionaryType = typeof en
