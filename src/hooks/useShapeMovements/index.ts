import { Key, useKeyInput } from 'hooks/useKeyInput'
import { useCallback, useMemo } from 'react'
import { Coordinate } from 'types/coordinate'
import { checkHasCollision } from 'utils/checkHasCollision'
import { checkIsOutBound } from 'utils/checkIsOutBound'

import { UseShapeMovementsInputs } from './types'
import {
  getBlockGeometricPivot,
  movedShapeCoordinations,
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
        console.log('justCollided in rotation func')
        return
      }
      console.log('rotated')

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

        // console.log('rotate', direction, { isOutBound })

        if (isOutBound) {
          trials++
          continue
        }

        const hasCollision = checkHasCollision({
          boardMatrix,
          prevShapeCoordinates: currentShapeCoordinates,
          targetShapeCoordinates: newCoordinates,
          mode: 'translation'
        })

        // console.log('rotate', direction, JSON.stringify(newCoordinates), {
        //   hasCollision
        // })

        ableToRotate = !hasCollision
        trials++
      }

      if (!ableToRotate) return

      // console.log('rotating to', JSON.stringify(newCoordinates!))
      onUpdateShapeCoordinate(newCoordinates!)
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
      if (!gameRunning) return

      const movedCoordinations = movedShapeCoordinations(
        currentShapeState,
        direction
      )

      const isOutBound = checkIsOutBound(
        movedCoordinations,
        boardWidth,
        boardHeight
      )

      if (isOutBound) return

      const hasCollision = checkHasCollision({
        boardMatrix,
        prevShapeCoordinates: currentShapeCoordinates,
        targetShapeCoordinates: movedCoordinations,
        mode: 'translation'
      })

      if (hasCollision) return

      onUpdateShapeCoordinate(movedCoordinations)
    },
    [
      boardHeight,
      boardMatrix,
      boardWidth,
      currentShapeCoordinates,
      currentShapeState,
      gameRunning,
      onUpdateShapeCoordinate
    ]
  )

  useKeyInput(Key.ArrowUp, () => {
    rotateShape('clockwise')
  })

  useKeyInput(Key.ArrowLeft, () => {
    moveBlock('left')
  })

  useKeyInput(Key.ArrowRight, () => {
    moveBlock('right')
  })
}
