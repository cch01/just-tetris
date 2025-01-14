import { BlockState } from 'constants/block'
import { Coordinate } from 'types/shape'

export type CheckCollisionStatusInputs = {
  prevShapeCoordinates: Coordinate[]
  targetShapeCoordinates: Coordinate[]
  boardMatrix: BlockState[][]
}

export const checkCollisionStatus = ({
  boardMatrix,
  prevShapeCoordinates,
  targetShapeCoordinates
}: CheckCollisionStatusInputs) => {
  const hasCollision = targetShapeCoordinates.some(
    ({ row: targetRow, col: targetCol }) => {
      const isOccupiedBySelf = prevShapeCoordinates.some(
        ({ row: prevRow, col: prevCol }) => {
          const occupiedBySelf = prevRow === targetRow && prevCol === targetCol

          return occupiedBySelf
        }
      )

      if (isOccupiedBySelf) return false

      const isOccupiedByOther = boardMatrix[targetRow]?.[targetCol]?.locked

      if (isOccupiedByOther) {
        return true
      }
    }
  )
  return { hasCollision }
}
