import { Key, useKeyInput } from 'hooks/useKeyInput'
import { useCallback, useMemo } from 'react'
import { Coordinate } from 'types/coordinate'
import { checkHasCollision } from 'utils/checkHasCollision'
import { checkIsOutBound } from 'utils/checkIsOutBound'

import { UseShapeMovementsInputs } from './types'
import { getBlockGeometricPivot, rotatedBlockCoordinations } from './utils'

export const useShapeMovements = ({
  currentShapeState,
  onUpdateShapeCoordinate,
  boardMatrix,
  justCollided,
  gameStarted
}: UseShapeMovementsInputs) => {
  const currentShapeCoordinates = currentShapeState.blockCoordinates

  const pivot = useMemo(
    () => getBlockGeometricPivot(currentShapeCoordinates),
    [currentShapeCoordinates]
  )

  const rotateShape = useCallback(
    (direction: 'clockwise' | 'counterclockwise') => {
      if (currentShapeState.name === 'OShape' || justCollided || !gameStarted) {
        console.log('justCollided in rotation func')
        return
      }
      console.log('rotated')
      const boardWidth = boardMatrix[0].length
      const boardHeight = boardMatrix.length

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
          mode: 'rotate'
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
      boardMatrix,
      currentShapeCoordinates,
      currentShapeState,
      gameStarted,
      justCollided,
      onUpdateShapeCoordinate,
      pivot
    ]
  )

  useKeyInput(Key.ArrowUp, () => {
    // console.log('clockwise rotate')
    rotateShape('clockwise')
  })
}
