import { BlockState } from 'constants/block'
import { Coordinate } from 'types/coordinate'

export const checkIsAboveABlock = (
  coordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  return coordinates.find(({ row, col }) => {
    const bottomBlock = { row: row + 1, col }
    if (
      coordinates.find(
        (coor) => coor.row === bottomBlock.row && coor.col === bottomBlock.col
      )
    ) {
      return false
    }

    return boardMatrix[row + 1]?.[col].locked
  })
}
