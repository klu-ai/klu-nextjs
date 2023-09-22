import { useCallback, useEffect, useState } from "react"

// Custom event to trigger updates in other components
const storageEvent = new Event("storageEvent")

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): {
  data: T
  save: (value: T | ((val: T) => T)) => void
  isLoading: boolean
} => {
  const [isLoading, setLoaded] = useState(true)
  const [data, setData] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const save = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(data) : value
        setData(valueToStore)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          // Trigger the custom event when local storage changes
          window.dispatchEvent(storageEvent)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [key, data]
  )

  useEffect(() => {
    setLoaded(false)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        const newValue = item ? (JSON.parse(item) as T) : initialValue
        setData(newValue)
      } catch (error) {
        console.error(error)
      }
    }

    // Add listener for the custom event to handle changes
    window.addEventListener("storageEvent", handleStorageChange)

    return () => {
      window.removeEventListener("storageEvent", handleStorageChange)
    }
  }, [key, initialValue])

  return { data, save, isLoading }
}
