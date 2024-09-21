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

  if (['SShape', 'ZShape'].some((shape) => blockShapeState.name === shape)) {
    return adjustForZorSBlock(rotatedBlock)
  }

  return rotatedBlock
}

// / Adjust the rotated block to prevent right/left shift
function adjustForZorSBlock(rotatedBlock: Coordinate[]): Coordinate[] {
  // Calculate the minimum and maximum column indices
  const minCol = Math.min(...rotatedBlock.map((cell) => cell.col))
  const maxCol = Math.max(...rotatedBlock.map((cell) => cell.col))

  // Center the block horizontally if needed
  const shiftAmount = Math.floor((maxCol - minCol) / 2)

  // Shift all columns left or right based on the calculated shift amount
  return rotatedBlock.map((cell) => ({
    row: cell.row,
    col: cell.col - shiftAmount
  }))
}
