import { BlockState } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/coordinate'

export const getBlockGeometricPivot = (
  blockShape: Coordinate[]
): Coordinate => {
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

export const rotatedBlockCoordinations = (
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

function adjustForZOrBOrIBlock(rotatedBlock: Coordinate[]): Coordinate[] {
  const minCol = Math.min(...rotatedBlock.map((cell) => cell.col))
  const maxCol = Math.max(...rotatedBlock.map((cell) => cell.col))

  const shiftAmount = Math.floor((maxCol - minCol) / 2)

  return rotatedBlock.map((cell) => ({
    row: cell.row,
    col: cell.col - shiftAmount
  }))
}

export const movedShapeHorizontal = (
  blockShapeState: ShapeProperty,
  direction: 'left' | 'right'
) => {
  const originalCoordinations = blockShapeState.blockCoordinates

  const adjustment = direction === 'left' ? -1 : 1

  const newCoordinations = originalCoordinations.map(({ row, col }) => ({
    row,
    col: col + adjustment
  }))

  return newCoordinations
}

export const moveShapeToBottom = (
  currentShapeCoordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const lastRowIdx = boardMatrix.length - 1

  const closestBlockToBottomPairs = getClosestBlockToBottomPairs(
    currentShapeCoordinates,
    lastRowIdx,
    boardMatrix
  )

  const pointHeightDiffs = closestBlockToBottomPairs.map(
    ({ base, block }) => Math.abs(base.row - block.row) - 1
  )

  const minRowDiff = Math.min(...pointHeightDiffs)

  const newCoordinates = currentShapeCoordinates.map(({ row, col }) => ({
    row: row + minRowDiff,
    col
  }))

  return newCoordinates
}

const getClosestBlockToBottomPairs = (
  currentShapeCoordinates: Coordinate[],
  lastRowIdx: number,
  boardMatrix: BlockState[][]
) => {
  const closestBlockToBottomPairs: {
    base: Coordinate
    block: Coordinate
  }[] = []

  currentShapeCoordinates.forEach((block) => {
    let closestBlockToBottomPair: { base: Coordinate; block: Coordinate } = {
      base: { row: lastRowIdx + 1, col: block.col },
      block
    }

    for (let iteratingRow = lastRowIdx; iteratingRow >= 0; iteratingRow--) {
      if (iteratingRow <= block.row) break

      const blockIsCurrentShape = currentShapeCoordinates.find(
        ({ row, col: _col }) => row === iteratingRow && block.col === _col
      )

      if (blockIsCurrentShape) {
        continue
      }

      const isBaseBlockHigherThanRecord =
        iteratingRow < closestBlockToBottomPair.base.row

      const isBaseBlockLocked = boardMatrix[iteratingRow][block.col].locked

      if (isBaseBlockHigherThanRecord && isBaseBlockLocked) {
        closestBlockToBottomPair = {
          block,
          base: { row: iteratingRow, col: block.col }
        }
      }
    }

    closestBlockToBottomPairs.push(closestBlockToBottomPair)
  })

  return closestBlockToBottomPairs
}
