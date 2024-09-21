import { BlockState } from 'constants/block'
import { Coordinate } from 'types/coordinate'

export type CheckHasCollisionInputs = {
  prevShapeCoordinates: Coordinate[]
  targetShapeCoordinates: Coordinate[]
  boardMatrix: BlockState[][]
  mode: 'sink' | 'rotate'
}

export const checkHasCollision = ({
  boardMatrix,
  prevShapeCoordinates,
  targetShapeCoordinates,
  mode
}: CheckHasCollisionInputs) => {
  const hasCollision = targetShapeCoordinates.some(
    ({ row: targetRow, col: targetCol }) => {
      const isColliding = prevShapeCoordinates.some(
        ({ row: prevRow, col: prevCol }) => {
          const occupiedBySelf = prevRow === targetRow && prevCol === targetCol
          const occupiedByOther = boardMatrix[targetRow][targetCol].locked

          return occupiedByOther || (!occupiedBySelf && occupiedByOther)
        }
      )

      if (isColliding) return true

      if (mode === 'sink' && boardMatrix[targetRow + 1]?.[targetCol].occupied)
        return true

      if (targetRow === boardMatrix.length - 1) return true
    }
  )
  return hasCollision
}
