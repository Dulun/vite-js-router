import { useRef, useEffect } from 'react'

/**
 * Returns the previous value of a reference after a component update.
 *
 * @param value
 */
const usePrevious = (value) => {
  const ref = useRef(null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export { usePrevious }
export default usePrevious
