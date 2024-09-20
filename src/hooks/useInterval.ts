import { useEffect, useRef } from 'react'

// Type definition for the callback, delay, and active flag
function useInterval(
  callback: () => void,
  delay: number | null,
  isActive: boolean
) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval with start/stop signaling
  useEffect(() => {
    if (!isActive || delay === null) {
      return
    }

    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [isActive, delay]) // Restart the interval if isActive or delay changes
}

export default useInterval
