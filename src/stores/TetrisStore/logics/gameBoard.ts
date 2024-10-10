import { blockColorSchemes, BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import _ from 'lodash'
import { Coordinate, ShapeSpawningPositions } from 'types/shape'

export const checkIsGameOver = (
  nextShapeCoordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const canSpawnNextShape = checkCanSpawnShape(
    nextShapeCoordinates,
    boardMatrix
  )

  const overHeight = boardMatrix[4].some(({ locked }) => locked)

  return overHeight || !canSpawnNextShape
}

export const getRandomShape = (colCount: number) =>
  _.clone(
    _.values(getShapeSpawningPositions(colCount))[Math.floor(Math.random() * 7)]
  )

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

const getShapeSpawningPositions = (colCount = 10): ShapeSpawningPositions => {
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

const checkCanSpawnShape = (
  coordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const collideAtSpawn = coordinates.some(({ col, row }) => {
    if (boardMatrix[row + 1][col].locked) return true
  })

  return !collideAtSpawn
}
