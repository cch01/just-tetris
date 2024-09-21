import { blockColorSchemes, BlockState } from 'constants/block'
import _ from 'lodash'

export const generateBoardMatrix = (
  rowCount = 24,
  colCount = 10
): BlockState[][] => {
  const board: BlockState[][] = []

  for (let r = 0; r < rowCount; r++) {
    const row: BlockState[] = []
    const colorScheme =
      r < 4 ? blockColorSchemes.transparent : blockColorSchemes.gray

    for (let c = 0; c < colCount; c++) {
      row.push({
        occupied: false,
        colorScheme,
        locked: false
      })
    }
    board.push(row)
  }

  return board
}
