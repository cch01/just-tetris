import { Coordinate } from 'types/shape'

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
