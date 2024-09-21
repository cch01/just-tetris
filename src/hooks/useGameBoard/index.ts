import { blockColorSchemes, BlockState, ColorKeys } from 'constants/block'
import _ from 'lodash'
import { useCallback, useState } from 'react'

import {
  OnChangeBlocksColorInputs,
  OnShapeTranslationRepaintInputs
} from './types'
import { checkIsOutBound, generateBoardMatrix } from './utils'

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
    onChangeBlocksColor,
    checkIsOutBound
  }
}
