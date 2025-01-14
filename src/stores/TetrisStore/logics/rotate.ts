import { BlockState } from 'constants/block'
import { KICK_OFFSETS } from 'constants/gameBoard'
import _cloneDeep from 'lodash/cloneDeep'
import { Coordinate, ShapeProperty } from 'types/shape'
import { checkCollisionStatus } from 'utils/checkCollisionStatus'
import { checkIsOutBound } from 'utils/checkIsOutBound'

const getBlockGeometricPivot = (blockShape: Coordinate[]): Coordinate => {
  let totalRows = 0
  let totalCols = 0

  blockShape.forEach((cell) => {
    totalRows += cell.row
    totalCols += cell.col
  })

  const avgRowIdx = totalRows / blockShape.length
  const avgColIdx = totalCols / blockShape.length

  return { row: Math.round(avgRowIdx), col: Math.round(avgColIdx) }
}

export const rotateShapeLogics = (
  direction: 'clockwise' | 'counterclockwise',
  currentShapeState: ShapeProperty,
  boardMatrix: BlockState[][]
) => {
  const prevCoordinates = currentShapeState.blockCoordinates

  let rotatedCoordinates: Coordinate[] = []
  let trials = 1
  let isRotatable = false

  const pivot = getBlockGeometricPivot(prevCoordinates)

  while (trials < 4 && !isRotatable) {
    rotatedCoordinates = rotatedBlockCoordinations(
      currentShapeState,
      pivot,
      direction
    )

    let isCurrentCoordinatesValid = checkIsRotatable(
      rotatedCoordinates,
      boardMatrix,
      currentShapeState
    )

    if (!isCurrentCoordinatesValid) {
      for (const offsets of KICK_OFFSETS) {
        const tempCoordinates = _cloneDeep(rotatedCoordinates)
        tempCoordinates.forEach((block) => {
          block.col += offsets.x
          block.row += offsets.y
        })

        isCurrentCoordinatesValid = checkIsRotatable(
          tempCoordinates,
          boardMatrix,
          currentShapeState
        )

        if (isCurrentCoordinatesValid) {
          rotatedCoordinates = tempCoordinates
          break
        }
      }
    }

    isRotatable = isCurrentCoordinatesValid

    trials++
  }

  if (!isRotatable) return { rotated: false, rotatedCoordinates: [] }

  return { rotated: true, rotatedCoordinates }
}

const adjustForZOrBOrIBlock = (rotatedBlock: Coordinate[]): Coordinate[] => {
  const minCol = Math.min(...rotatedBlock.map((cell) => cell.col))
  const maxCol = Math.max(...rotatedBlock.map((cell) => cell.col))

  const shiftAmount = Math.floor((maxCol - minCol) / 2)

  return rotatedBlock.map((cell) => ({
    row: cell.row,
    col: cell.col - shiftAmount
  }))
}

const rotatedBlockCoordinations = (
  blockShapeState: ShapeProperty,
  pivot: Coordinate,
  direction: 'clockwise' | 'counterclockwise' = 'clockwise'
): Coordinate[] => {
  const rotatedBlock: Coordinate[] = []

  blockShapeState.blockCoordinates.forEach((cell) => {
    if (direction === 'clockwise') {
      const newRowIdx = pivot.row + (cell.col - pivot.col)
      const newColIdx = pivot.col - (cell.row - pivot.row)

      rotatedBlock.push({ row: newRowIdx, col: newColIdx })
      return
    } else {
      const newRowIdx = pivot.row - (cell.col - pivot.col)
      const newColIdx = pivot.col + (cell.row - pivot.row)

      rotatedBlock.push({ row: newRowIdx, col: newColIdx })
    }
  })

  if (
    ['SShape', 'ZShape', 'IShape'].some(
      (shape) => blockShapeState.name === shape
    )
  ) {
    return adjustForZOrBOrIBlock(rotatedBlock)
  }

  return rotatedBlock
}

const checkIsRotatable = (
  rotatedCoordinates: Coordinate[],
  boardMatrix: BlockState[][],
  currentShapeState: ShapeProperty
) => {
  const boardWidth = boardMatrix[0].length
  const boardHeight = boardMatrix.length

  const isOutBound = checkIsOutBound(
    rotatedCoordinates,
    boardWidth,
    boardHeight
  )

  const { hasCollision } = checkCollisionStatus({
    boardMatrix,
    prevShapeCoordinates: currentShapeState.blockCoordinates,
    targetShapeCoordinates: rotatedCoordinates
  })

  return !hasCollision && !isOutBound
}
