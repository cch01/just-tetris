import { blockColorSchemes, BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import _ from 'lodash'
import { useCallback, useState } from 'react'

import {
  OnChangeBlocksColorInputs,
  OnShapeTranslationRepaintInputs
} from './types'
import { generateBoardMatrix } from './utils'

export const useGameBoard = (rowCount = 24, colCount = 10) => {
  const [boardMatrix, setBoardMatrix] = useState<BlockState[][]>(
    generateBoardMatrix(rowCount, colCount)
  )

  const resetBoard = useCallback(
    () => setBoardMatrix(generateBoardMatrix(rowCount, colCount)),
    [colCount, rowCount]
  )

  const onShapeTranslateRepaint = useCallback(
    ({
      prevCoordinates,
      targetColor,
      targetCoordinates,
      lockBlocks
    }: OnShapeTranslationRepaintInputs) => {
      setBoardMatrix((board) => {
        const targetPositionBlocked = targetCoordinates.some(
          ({ row, col }) => board[row][col].locked
        )

        if (targetPositionBlocked) return board

        const boardCp = _.clone(board)

        prevCoordinates.forEach(({ col, row }) => {
          const unSeenRow = row <= NON_PLAY_FIELD_BOTTOM_ROW_IDX

          boardCp[row][col].colorScheme = unSeenRow
            ? blockColorSchemes.transparent
            : blockColorSchemes.gray
          boardCp[row][col].occupied = false
        })

        targetCoordinates.forEach(({ col, row }) => {
          boardCp[row][col].colorScheme = blockColorSchemes[targetColor]
          boardCp[row][col].occupied = ['gray', 'transparent'].some(
            (color) => color !== targetColor
          )
          if (lockBlocks) boardCp[row][col].locked = true
        })

        return boardCp
      })
    },
    []
  )

  const onChangeBlocksColor = useCallback(
    ({ color, coordinates }: OnChangeBlocksColorInputs) => {
      setBoardMatrix((board) => {
        const boardCp = _.cloneDeep(board)
        coordinates.forEach(({ col, row }) => {
          boardCp[row][col].colorScheme = blockColorSchemes[color]
          boardCp[row][col].occupied = color !== 'gray'
        })
        return boardCp
      })
    },
    []
  )

  return {
    boardMatrix,
    resetBoard,
    onShapeTranslateRepaint,
    onChangeBlocksColor
  }
}
