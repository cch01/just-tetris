import { useEffect, useRef } from 'react'

interface PanEvent {
  deltaX: number
  deltaY: number
  event: TouchEvent
}

type UseTouchActionsHook = (
  onPan?: (panEvent: PanEvent) => void,
  onTap?: (event: TouchEvent) => void,
  interval?: number
) => void

const DRAG_THRESHOLD = 10 as const

const useTouchActions: UseTouchActionsHook = (onPan, onTap, interval = 100) => {
  const touchStartRef = useRef<Touch | null>(null)
  const lastPanRef = useRef<Touch | null>(null)
  const isPanRef = useRef(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0]
      lastPanRef.current = event.touches[0]
      isPanRef.current = false

      if (onPan && interval > 0) {
        intervalRef.current = window.setInterval(() => {
          if (
            !isPanRef.current ||
            !touchStartRef.current ||
            !lastPanRef.current
          )
            return

          const deltaX =
            lastPanRef.current.clientX - touchStartRef.current.clientX
          const deltaY =
            lastPanRef.current.clientY - touchStartRef.current.clientY

          onPan({ deltaX, deltaY, event })
        }, interval)
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartRef.current || !lastPanRef.current) return

      const currentTouch = event.touches[0]
      const deltaX = currentTouch.clientX - touchStartRef.current.clientX
      const deltaY = currentTouch.clientY - touchStartRef.current.clientY

      if (
        Math.abs(deltaX) > DRAG_THRESHOLD ||
        Math.abs(deltaY) > DRAG_THRESHOLD
      ) {
        isPanRef.current = true
        lastPanRef.current = currentTouch
      }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current) return

      if (!isPanRef.current) {
        if (onTap) onTap(event)
      }

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      touchStartRef.current = null
      lastPanRef.current = null
      isPanRef.current = false
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [onPan, onTap, interval])

  return null
}

export default useTouchActions
