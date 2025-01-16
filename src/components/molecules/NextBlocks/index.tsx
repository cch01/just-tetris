import { FormContainer } from 'components/atoms/Form/FormContainer'
import { BLOCK_COLOR_SCHEMES } from 'constants/block'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useStores } from 'stores'
import { generateBoardMatrix } from 'stores/TetrisStore/logics/gameBoard'
import { ShapeProperty } from 'types/shape'

import { NextBlockPreview } from './NextBlockPreview'

export const NextBlocks: React.FC = observer(() => {
  const {
    tetrisStore: { shapeQueue }
  } = useStores()

  const getNextBlocksMatrix = useCallback((shape: ShapeProperty) => {
    const coordinates = shape.blockCoordinates

    const rowOffset = Math.min(...coordinates.map(({ row }) => row))
    const colOffset = Math.min(...coordinates.map(({ col }) => col))

    const miniBoard = generateBoardMatrix(2, 4, 'transparent')

    coordinates.forEach((coor) => {
      const targetBlock = miniBoard[coor.row - rowOffset][coor.col - colOffset]
      targetBlock.colorScheme = BLOCK_COLOR_SCHEMES[shape.color]
      targetBlock.occupied = true
    })

    for (let col = 3; col > 0; col--) {
      const isColNotOccupied = miniBoard.every((row) => !row[col].occupied)
      if (isColNotOccupied) {
        miniBoard.forEach((row) => {
          row.pop()
        })
      }
    }

    miniBoard.forEach((row) => {
      if (row.every((col) => !col.occupied)) miniBoard.pop()
    })

    return miniBoard
  }, [])
  return (
    <FormContainer title="Next">
      <div className="grid grid-flow-col grid-cols-[2] items-center justify-around gap-1">
        <NextBlockPreview blocksMatrix={getNextBlocksMatrix(shapeQueue[1])} />
        <NextBlockPreview blocksMatrix={getNextBlocksMatrix(shapeQueue[2])} />
      </div>
    </FormContainer>
  )
})
