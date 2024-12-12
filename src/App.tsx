import {
  faGear,
  faPause,
  faPlay,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'components/atoms/Button'
import { FormContainer } from 'components/atoms/Form/FormContainer'
import { FormInputItem } from 'components/atoms/Form/FormInputItem'
import { Modal } from 'components/atoms/Modal'
import { GameBoard } from 'components/molecules/GameBoard'
import { NextBlockPreview } from 'components/molecules/NextBlockPreview'
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
      moveBottom,
      onGameStart,
      onPause,
      onGameReset,
      gameRunning,
      gameTimer,
      boardHeight,
      boardWidth,
      framePerSecond,
      setFramePerSecond,
      setHeight,
      setWidth,
      shapeQueue
    }
  } = useStores()

  useKeyInput(Key.ArrowUp, () => {
    rotateShape('clockwise')
  })

  useKeyInput(Key.ArrowLeft, () => {
    moveBlock('left')
  })

  useKeyInput(Key.ArrowRight, () => {
    moveBlock('right')
  })

  useKeyInput(Key.ArrowDown, () => {
    moveBottom()
  })

  const onSetHandleNumberInput = (
    val: string | undefined,
    callback: (val: number) => void
  ) => {
    if (!val) return
    const valInt = Math.floor(Number(val))
    if (Number.isNaN(valInt)) return
    callback(valInt)
  }

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
              <p className="text-7xl font-extrabold text-primary">12</p>
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
      <Modal
        title="Settings"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <FormInputItem
            description="Width:"
            disabled={!!gameTimer}
            decimalScale={0}
            onValueChange={(val) => onSetHandleNumberInput(val, setWidth)}
            value={boardWidth.toString()}
          />
          <FormInputItem
            description="Height:"
            disabled={!!gameTimer}
            decimalScale={0}
            onValueChange={(val) => onSetHandleNumberInput(val, setHeight)}
            value={boardHeight.toString()}
          />

          <FormInputItem
            description="Speed:"
            disabled={!!gameTimer}
            onValueChange={(val) =>
              onSetHandleNumberInput(val, setFramePerSecond)
            }
            value={framePerSecond.toString()}
            suffix=" fps"
            decimalScale={0}
            step={1}
          />
        </div>
      </Modal>
    </>
  )
})

export default App
