import { useEffect, useState } from "react"

/**
 * Custom React hook for setting initial state and updating it based on dependencies.
 *
 * @template T - Type of the state
 * @param {T | (() => T)} initialState - Initial state value or a function that returns the initial state.
 * @param {Array<any>} deps - Dependencies to trigger a state update.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - A tuple containing the current state and the state updater function.
 */
const useInitialChange = <T>(
  initialState: T | (() => T),
  deps: Array<any>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Use the useState hook to manage the state
  const [state, setState] = useState(initialState)

  // Use the useEffect hook to set the initial state and update it when dependencies change
  useEffect(() => {
    // If initialState is a function, invoke it to get the initial state value
    const initial =
      typeof initialState === "function"
        ? (initialState as () => T)()
        : initialState

    // Set the initial state
    setState(initial)
  }, [...deps])

  // Return a tuple containing the current state and the state updater function
  return [state, setState]
}

export default useInitialChange
