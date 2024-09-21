import { blockColorSchemes, BlockState, ColorKeys } from 'constants/block'
import _ from 'lodash'
import React from 'react'
import { Coordinate, ShapeProperty } from 'types/coordinate'

type ShapeSpawningPositions = {
  IShape: ShapeProperty
  JShape: ShapeProperty
  LShape: ShapeProperty
  OShape: ShapeProperty
  SShape: ShapeProperty
  TShape: ShapeProperty
  ZShape: ShapeProperty
}

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

export const checkCanSpawnShape = (
  coordinates: Coordinate[],
  boardMatrix: BlockState[][]
) => {
  const collideAtSpawn = coordinates.some(
    ({ col, row }) => boardMatrix[row][col].occupied
  )
  return !collideAtSpawn
}

type CheckHasCollisionInputs = {
  prevShapeCoordinates: Coordinate[]
  targetShapeCoordinates: Coordinate[]
  boardMatrix: BlockState[][]
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

type OnShapeTranslationRepaintInputs = {
  targetCoordinates: Coordinate[]
  targetColor: ColorKeys
  prevCoordinates: Coordinate[]
  setBoardMatrix: React.Dispatch<React.SetStateAction<BlockState[][]>>
}

export const onShapeTranslateRepaint = ({
  setBoardMatrix,
  prevCoordinates,
  targetColor,
  targetCoordinates
}: OnShapeTranslationRepaintInputs) => {
  setBoardMatrix((board) => {
    const boardCp = _.clone(board)

    prevCoordinates.forEach(({ col, row }) => {
      if (row <= 3) return
      boardCp[row][col].colorScheme = blockColorSchemes.gray
      boardCp[row][col].occupied = false
    })

    targetCoordinates.forEach(({ col, row }) => {
      boardCp[row][col].colorScheme = blockColorSchemes[targetColor]
      boardCp[row][col].occupied = ['gray', 'transparent'].some(
        (color) => color !== targetColor
      )
    })

    return boardCp
  })
}
