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

  const points = []

  for (const { row, col } of currentShapeCoordinates) {
    let highestContactingFixedBlock: { base: Coordinate; block: Coordinate } = {
      base: { row: lastRowIdx + 1, col },
      block: { row, col }
    }

    for (let r = lastRowIdx; r >= 0; r--) {
      if (r <= row) break
      console.log([r, col], boardMatrix[r][col])
      if (
        currentShapeCoordinates.find(
          ({ row, col: _col }) => row === r && col === _col
        )
      ) {
        continue
      }
      const isBlockLocked = boardMatrix[r][col].occupied

      if (r < highestContactingFixedBlock.base.row && isBlockLocked) {
        highestContactingFixedBlock = {
          block: { row, col },
          base: { row: r, col }
        }
      }
    }

    points.push(highestContactingFixedBlock)
  }

  const pointDiffs = points.map(
    ({ base, block }) => Math.abs(base.row - block.row) - 1
  )

  const minRowDiff = Math.min(...pointDiffs)

  const newCoordinates = currentShapeCoordinates.map(({ row, col }) => ({
    row: row + minRowDiff,
    col
  }))

  return newCoordinates
}
