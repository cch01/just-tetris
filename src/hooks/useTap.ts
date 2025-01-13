import { useEffect } from 'react'

type UseTapHook = (onTap?: (event: TouchEvent) => void) => void

const DRAG_THRESHOLD = 10

export const useTap: UseTapHook = (onTap) => {
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let isDragging = false

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      isDragging = false
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (
        Math.abs(touch.clientX - touchStartX) > DRAG_THRESHOLD ||
        Math.abs(touch.clientY - touchStartY) > DRAG_THRESHOLD
      ) {
        isDragging = true
      }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isDragging && onTap) {
        onTap(event)
      }
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onTap])

  return null
}
