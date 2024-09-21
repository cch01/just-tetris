import { BlockState } from 'constants/block'
import { ShapeSpawningPositions } from 'hooks/useGameBoard/types'
import { Coordinate } from 'types/coordinate'

export const getShapeSpawningPositions = (
  colCount = 10
): ShapeSpawningPositions => {
  const colMidIdx = colCount / 2
  const rowBottomIdx = 3

  return {
    IShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx + 1, row: rowBottomIdx },
        { col: colMidIdx + 2, row: rowBottomIdx }
      ],
      name: 'IShape',
      color: 'cyan'
    },
    JShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx - 1, row: rowBottomIdx + 1 },
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx + 1, row: rowBottomIdx }
      ],
      color: 'blue',
      name: 'JShape'
    },
    LShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx + 1, row: rowBottomIdx },
        { col: colMidIdx + 1, row: rowBottomIdx + 1 }
      ],
      name: 'LShape',
      color: 'orange'
    },
    OShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx + 1 },
        { col: colMidIdx - 1, row: rowBottomIdx + 1 }
      ],
      color: 'yellow',
      name: 'OShape'
    },
    SShape: {
      color: 'green',
      blockCoordinates: [
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx + 1 },
        { col: colMidIdx + 1, row: rowBottomIdx + 1 }
      ],
      name: 'SShape'
    },
    TShape: {
      color: 'purple',
      blockCoordinates: [
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx - 1, row: rowBottomIdx },
        { col: colMidIdx + 1, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx + 1 }
      ],
      name: 'TShape'
    },
    ZShape: {
      color: 'red',
      blockCoordinates: [
        { col: colMidIdx, row: rowBottomIdx },
        { col: colMidIdx, row: rowBottomIdx + 1 },
        { col: colMidIdx - 1, row: rowBottomIdx + 1 },
        { col: colMidIdx + 1, row: rowBottomIdx }
      ],
      name: 'ZShape'
    }
  }
}

export const checkCanSpawnShape = (
  coordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const collideAtSpawn = coordinates.some(
    ({ col, row }) => boardMatrix[row][col].occupied
  )
  return !collideAtSpawn
}
