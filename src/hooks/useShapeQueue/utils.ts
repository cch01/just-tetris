import { BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import { Coordinate } from 'types/coordinate'

import { ShapeSpawningPositions } from './types'

export const getShapeSpawningPositions = (
  colCount = 10
): ShapeSpawningPositions => {
  const colMidIdx = colCount / 2

  return {
    IShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 2, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX }
      ],
      name: 'IShape',
      color: 'cyan'
    },
    JShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX }
      ],
      color: 'blue',
      name: 'JShape'
    },
    LShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 }
      ],
      name: 'LShape',
      color: 'orange'
    },
    OShape: {
      blockCoordinates: [
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 },
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 }
      ],
      color: 'yellow',
      name: 'OShape'
    },
    SShape: {
      color: 'green',
      blockCoordinates: [
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 }
      ],
      name: 'SShape'
    },
    TShape: {
      color: 'purple',
      blockCoordinates: [
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 }
      ],
      name: 'TShape'
    },
    ZShape: {
      color: 'red',
      blockCoordinates: [
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX },
        { col: colMidIdx, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 },
        { col: colMidIdx - 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX + 1 },
        { col: colMidIdx + 1, row: NON_PLAY_FIELD_BOTTOM_ROW_IDX }
      ],
      name: 'ZShape'
    }
  }
}

export const checkCanSpawnShape = (
  coordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const collideAtSpawn = coordinates.some(({ col, row }) => {
    if (boardMatrix[row + 1][col].locked) return true
  })

  return !collideAtSpawn
}
