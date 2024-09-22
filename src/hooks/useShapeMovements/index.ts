import { Key, useKeyInput } from 'hooks/useKeyInput'
import { useCallback, useMemo } from 'react'
import { Coordinate } from 'types/coordinate'
import { checkCollisionStatus } from 'utils/checkCollisionStatus'
import { checkIsOutBound } from 'utils/checkIsOutBound'

import { UseShapeMovementsInputs } from './types'
import {
  getBlockGeometricPivot,
  movedShapeHorizontal,
  moveShapeToBottom,
  rotatedBlockCoordinations
} from './utils'

export const useShapeMovements = ({
  currentShapeState,
  onUpdateShapeCoordinate,
  boardMatrix,
  justCollided,
  gameRunning
}: UseShapeMovementsInputs) => {
  const currentShapeCoordinates = currentShapeState.blockCoordinates

  const pivot = useMemo(
    () => getBlockGeometricPivot(currentShapeCoordinates),
    [currentShapeCoordinates]
  )
  const boardWidth = boardMatrix[0].length
  const boardHeight = boardMatrix.length

  const rotateShape = useCallback(
    (direction: 'clockwise' | 'counterclockwise') => {
      if (currentShapeState.name === 'OShape' || justCollided || !gameRunning) {
        return
      }

      let newCoordinates: Coordinate[]
      let trials = 1
      let ableToRotate = false

      while (trials < 4 && !ableToRotate) {
        newCoordinates = rotatedBlockCoordinations(
          currentShapeState,
          pivot,
          direction
        )

        const isOutBound = checkIsOutBound(
          newCoordinates,
          boardWidth,
          boardHeight
        )

        if (isOutBound) {
          trials++
          continue
        }

        const { hasCollision } = checkCollisionStatus({
          boardMatrix,
          prevShapeCoordinates: currentShapeCoordinates,
          targetShapeCoordinates: newCoordinates,
          mode: 'translation'
        })

        ableToRotate = !hasCollision
        trials++
      }

      if (!ableToRotate) return

      onUpdateShapeCoordinate(newCoordinates!, false)
    },
    [
      boardHeight,
      boardMatrix,
      boardWidth,
      currentShapeCoordinates,
      currentShapeState,
      gameRunning,
      justCollided,
      onUpdateShapeCoordinate,
      pivot
    ]
  )

  const moveBlock = useCallback(
    (direction: 'left' | 'right') => {
      if (!gameRunning || justCollided) return

      const movedCoordinations = movedShapeHorizontal(
        currentShapeState,
        direction
      )

      const isOutBound = checkIsOutBound(
        movedCoordinations,
        boardWidth,
        boardHeight
      )

      if (isOutBound) return

      const { hasCollision } = checkCollisionStatus({
        boardMatrix,
        prevShapeCoordinates: currentShapeCoordinates,
        targetShapeCoordinates: movedCoordinations,
        mode: 'translation'
      })

      if (hasCollision) return

      onUpdateShapeCoordinate(movedCoordinations, false)
    },
    [
      boardHeight,
      boardMatrix,
      boardWidth,
      currentShapeCoordinates,
      currentShapeState,
      gameRunning,
      justCollided,
      onUpdateShapeCoordinate
    ]
  )

  const moveBottom = useCallback(() => {
    if (!gameRunning || justCollided) return

    const newCoordinates = moveShapeToBottom(
      currentShapeCoordinates,
      boardMatrix
    )

    onUpdateShapeCoordinate(newCoordinates, true)
  }, [
    boardMatrix,
    currentShapeCoordinates,
    gameRunning,
    justCollided,
    onUpdateShapeCoordinate
  ])

  useKeyInput(Key.ArrowUp, () => {
    rotateShape('clockwise')
  })

  useKeyInput(Key.ArrowLeft, () => {
    moveBlock('left')
  })

  useKeyInput(Key.ArrowRight, () => {
    moveBlock('right')
  })

  useKeyInput(Key.ArrowDown, () => {
    moveBottom()
  })
}
