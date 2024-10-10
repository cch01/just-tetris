import { BlockState } from 'constants/block'
import _ from 'lodash'
import { ShapeProperty } from 'types/shape'
import { checkCollisionStatus } from 'utils/checkCollisionStatus'
import { checkIsAboveABlock } from 'utils/checkIsAboveABlock'

export const sinkLogics = (
  currentShapeState: ShapeProperty,
  boardMatrix: BlockState[][],
  onCollided: () => void
) => {
  const currShapeIsAtBottom = currentShapeState.blockCoordinates.some(
    ({ row }) => row === boardMatrix.length - 1
  )

  const currHasAdjacentBottomBlock = checkIsAboveABlock(
    currentShapeState.blockCoordinates,
    boardMatrix
  )

  if (currHasAdjacentBottomBlock || currShapeIsAtBottom) {
    onCollided()
    return
  }

  const sankCurrShapeState = _.cloneDeep(currentShapeState)

  sankCurrShapeState.blockCoordinates = sankCurrShapeState.blockCoordinates.map(
    ({ row, col }) => ({
      row: row + 1,
      col
    })
  )

  const { hasCollision } = checkCollisionStatus({
    prevShapeCoordinates: currentShapeState.blockCoordinates,
    targetShapeCoordinates: sankCurrShapeState.blockCoordinates,
    boardMatrix: boardMatrix,
    mode: 'sink'
  })

  if (hasCollision) {
    onCollided()
  }

  const lockBlocks = hasCollision

  return { lockBlocks, sankCurrShapeState }
}
