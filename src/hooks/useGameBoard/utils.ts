import { blockColorSchemes, BlockState } from 'constants/block'
import _ from 'lodash'
import { Coordinate } from 'types/coordinate'

import { CheckHasCollisionInputs } from './types'

export const checkIsOutBound = (
  targetShapeCoordinates: Coordinate[],
  boardWidth: number,
  boardHeight: number
) => {
  const isOutBound = targetShapeCoordinates.some(
    ({ col, row }) =>
      col < 0 || col > boardWidth - 1 || row < 0 || row > boardHeight - 1
  )

  return isOutBound
}

export const generateBoardMatrix = (
  rowCount = 24,
  colCount = 10
): BlockState[][] => {
  const board = []

  for (let r = 0; r < rowCount; r++) {
    const row = []
    const colorScheme =
      r < 4 ? blockColorSchemes.transparent : blockColorSchemes.gray

    for (let c = 0; c < colCount; c++) {
      row.push({
        occupied: false,
        colorScheme
      })
    }
    board.push(row)
  }

  return board
}

export const checkHasCollision = ({
  boardMatrix,
  prevShapeCoordinates,
  targetShapeCoordinates
}: CheckHasCollisionInputs) => {
  const hasCollision = targetShapeCoordinates.some(
    ({ row: targetRow, col: targetCol }) => {
      const previouslyOccupied = prevShapeCoordinates.some(
        ({ row: prevRow, col: prevCol }) =>
          prevRow === targetRow && prevCol === targetCol
      )

      if (previouslyOccupied) return

      if (boardMatrix[targetRow + 1]?.[targetCol].occupied) return true

      if (targetRow === boardMatrix.length - 1) return true
    }
  )

  return hasCollision
}
