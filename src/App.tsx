import {
  faGear,
  faPause,
  faPlay,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'components/atoms/Button'
import { FormContainer } from 'components/atoms/Form/FormContainer'
import { GameBoard } from 'components/molecules/GameBoard'
import { NextBlockPreview } from 'components/molecules/NextBlockPreview'
import { SettingModal } from 'components/molecules/SettingModal'
import { blockColorSchemes } from 'constants/block'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import { observer } from 'mobx-react-lite'
import { useCallback, useState } from 'react'
import { useStores } from 'stores'
import { generateBoardMatrix } from 'stores/TetrisStore/logics/gameBoard'
import { ShapeProperty } from 'types/shape'

const App = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const onToggleModal = useCallback(
    () => setIsModalOpen((val) => !val),
    [setIsModalOpen]
  )
  const {
    tetrisStore: {
      rotateShape,
      moveBlock,
      hardDrop,
      onGameStart,
      onPause,
      onGameReset,
      gameRunning,
      shapeQueue,
      score,
      level
    }
  } = useStores()

  useKeyInput(
    Key.ArrowUp,
    () => {
      rotateShape('clockwise')
    },
    { repeat: false, repeatDelay: 1000 }
  )

  useKeyInput(Key.ArrowLeft, () => {
    moveBlock('left')
  })

  useKeyInput(Key.ArrowRight, () => {
    moveBlock('right')
  })

  useKeyInput(Key.ArrowDown, () => {
    hardDrop()
  })

  const getNextBlocksMatrix = useCallback((shape: ShapeProperty) => {
    const coordinates = shape.blockCoordinates

    const rowOffset = Math.min(...coordinates.map(({ row }) => row))
    const colOffset = Math.min(...coordinates.map(({ col }) => col))

    const miniBoard = generateBoardMatrix(2, 4, 'transparent')

    coordinates.forEach((coor) => {
      const targetBlock = miniBoard[coor.row - rowOffset][coor.col - colOffset]
      targetBlock.colorScheme = blockColorSchemes[shape.color]
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
    <>
      <div className="flex flex-row items-center justify-center gap-8">
        <GameBoard />
        <div className="mt-40 flex  flex-col justify-between gap-4">
          <FormContainer title="Next">
            <div className="grid grid-flow-col grid-cols-[2] items-center justify-center gap-2">
              <NextBlockPreview
                blocksMatrix={getNextBlocksMatrix(shapeQueue[1])}
              />
              <NextBlockPreview
                blocksMatrix={getNextBlocksMatrix(shapeQueue[2])}
              />
            </div>
          </FormContainer>

          <FormContainer title="Score">
            <div className="text-center align-middle">
              <p className="cursor-default select-none text-7xl font-extrabold italic text-highlight">
                {score}
              </p>
            </div>
          </FormContainer>

          <FormContainer title="Level">
            <div className="text-center align-middle">
              <p className="cursor-default select-none text-7xl font-extrabold italic text-secondary">
                {level}
              </p>
            </div>
          </FormContainer>

          <div className="grid grid-flow-col gap-2">
            <Button isDisabled={gameRunning} onClick={onGameStart}>
              <FontAwesomeIcon
                className={gameRunning ? 'text-tertiary' : 'text-primary'}
                icon={faPlay}
              />
            </Button>
            <Button isDisabled={!gameRunning} onClick={onPause}>
              <FontAwesomeIcon
                className={gameRunning ? 'text-primary' : 'text-tertiary'}
                icon={faPause}
              />
            </Button>
            <Button onClick={onGameReset}>
              <FontAwesomeIcon className="text-primary" icon={faRotateRight} />
            </Button>
            <Button isDisabled={gameRunning} onClick={onToggleModal}>
              <FontAwesomeIcon
                className={gameRunning ? 'text-tertiary' : 'text-primary'}
                icon={faGear}
              />
            </Button>
          </div>
        </div>
      </div>
      <SettingModal
        onCloseModal={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
    </>
  )
})

export default App
