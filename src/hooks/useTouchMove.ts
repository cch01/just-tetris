import { useEffect, useRef } from 'react'
import { Coordinate } from 'types/shape'

const START_THRESHOLD = 45
const MIN_THRESHOLD = 5
const THRESHOLD_DECAY = 8
const HARD_DROP_COOLDOWN = 500

/**
 * Hook to handle touch dragging logic for moving shapes in a Tetris-like game.
 * @param colCount Number of columns in the board
 * @param shapeCoordinates The current shape's coordinates relative to its center
 * @param onTouchMove Callback function invoked after determining the target shape's position
 * @param onHardDrop Callback function invoked when a downward swipe is detected
 */
export const useTouchMove = (
  colCount: number,
  shapeCoordinates: Coordinate[],
  onTouchMove: (targetCoordinates: Coordinate[]) => void,
  onHardDrop: () => void,
  touchSensitivity = START_THRESHOLD
) => {
  const initialTouch = useRef<Touch | null>(null)
  const lastTouch = useRef<Touch | null>(null)
  const isDragging = useRef(false)
  const isHorizontal = useRef(false)
  const accumulatedDeltaX = useRef(0)
  const moveCount = useRef(0)
  const lastHardDrop = useRef(0)

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const now = Date.now()

      if (now - lastHardDrop.current < HARD_DROP_COOLDOWN) return

      initialTouch.current = event.touches[0]
      lastTouch.current = event.touches[0]
      isDragging.current = false
      isHorizontal.current = false
      accumulatedDeltaX.current = 0
      moveCount.current = 0
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!initialTouch.current || !lastTouch.current) return

      const currentTouch = event.touches[0]
      const deltaX = currentTouch.clientX - lastTouch.current.clientX
      const deltaY = currentTouch.clientY - initialTouch.current.clientY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontal.current = true
      }

      if (!isHorizontal.current && Math.abs(deltaY) > 30) {
        onHardDrop()
        lastHardDrop.current = Date.now()
        return
      }

      const currentThreshold = Math.max(
        MIN_THRESHOLD,
        touchSensitivity - moveCount.current * THRESHOLD_DECAY
      )

      accumulatedDeltaX.current += deltaX

      if (Math.abs(accumulatedDeltaX.current) >= currentThreshold) {
        const direction = accumulatedDeltaX.current > 0 ? 1 : -1

        const minCol = Math.min(...shapeCoordinates.map((c) => c.col))
        const maxCol = Math.max(...shapeCoordinates.map((c) => c.col))
        if (minCol + direction >= 0 && maxCol + direction < colCount) {
          const targetCoordinates = shapeCoordinates.map((c) => ({
            row: c.row,
            col: c.col + direction
          }))
          onTouchMove(targetCoordinates)
          moveCount.current++
        }

        accumulatedDeltaX.current = 0
      }

      lastTouch.current = currentTouch
    }

    const handleTouchEnd = () => {
      initialTouch.current = null
      lastTouch.current = null
      isDragging.current = false
      isHorizontal.current = false
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [colCount, shapeCoordinates, onTouchMove, onHardDrop, touchSensitivity])
}
