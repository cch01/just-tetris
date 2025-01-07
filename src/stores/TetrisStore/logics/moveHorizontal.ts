import { BlockState } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/shape'
import { checkCollisionStatus } from 'utils/checkCollisionStatus'
import { checkIsOutBound } from 'utils/checkIsOutBound'

export const moveHorizontalLogics = (
  direction: 'left' | 'right',
  currentShapeState: ShapeProperty,
  boardMatrix: BlockState[][]
) => {
  const boardHeight = boardMatrix.length
  const boardWidth = boardMatrix[0].length

  const movedCoordinations = moveShapeHorizontal(
    currentShapeState.blockCoordinates,
    direction
  )

  const isOutBound = checkIsOutBound(
    movedCoordinations,
    boardWidth,
    boardHeight
  )

  if (isOutBound) return { moved: false, movedCoordinations: [] }

  const { hasCollision } = checkCollisionStatus({
    boardMatrix: boardMatrix,
    prevShapeCoordinates: currentShapeState.blockCoordinates,
    targetShapeCoordinates: movedCoordinations,
    mode: 'translation'
  })

  if (hasCollision) return { moved: false, movedCoordinations: [] }

  return { moved: true, movedCoordinations }
}

const moveShapeHorizontal = (
  blockCoordinates: Coordinate[],
  direction: 'left' | 'right'
) => {
  const adjustment = direction === 'left' ? -1 : 1

  const newCoordinations = blockCoordinates.map(({ row, col }) => ({
    row,
    col: col + adjustment
  }))

  return newCoordinations
}
