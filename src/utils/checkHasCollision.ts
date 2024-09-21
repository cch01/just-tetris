import { BlockState } from 'constants/block'
import { Coordinate } from 'types/coordinate'

export type CheckHasCollisionInputs = {
  prevShapeCoordinates: Coordinate[]
  targetShapeCoordinates: Coordinate[]
  boardMatrix: BlockState[][]
  mode: 'sink' | 'translation'
}

export const checkHasCollision = ({
  boardMatrix,
  prevShapeCoordinates,
  targetShapeCoordinates,
  mode
}: CheckHasCollisionInputs) => {
  const hasCollision = targetShapeCoordinates.some(
    ({ row: targetRow, col: targetCol }) => {
      const isOccupiedBySelf = prevShapeCoordinates.some(
        ({ row: prevRow, col: prevCol }) => {
          const occupiedBySelf = prevRow === targetRow && prevCol === targetCol

          return occupiedBySelf
        }
      )

      if (isOccupiedBySelf) return false

      const isOccupiedByOther = boardMatrix[targetRow][targetCol].locked

      if (isOccupiedByOther) {
        return true
      }

      if (mode === 'sink' && boardMatrix[targetRow + 1]?.[targetCol].occupied) {
        return true
      }

      if (targetRow === boardMatrix.length - 1) return true
    }
  )
  return hasCollision
}
