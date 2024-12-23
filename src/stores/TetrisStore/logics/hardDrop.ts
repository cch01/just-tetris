import { BlockState } from 'constants/block'
import { Coordinate } from 'types/shape'

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

export const hardDrop = (
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
