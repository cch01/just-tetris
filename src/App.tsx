import { Block } from 'components/atoms/Block'
import { Button } from 'components/atoms/Button'
import { FormContainer } from 'components/atoms/Form/FormContainer'
import { FormInputItem } from 'components/atoms/Form/FormInputItem'
import { GameBoard } from 'components/molecules/GameBoard'
import { blockColorSchemes } from 'constants/block'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useStores } from 'stores'
import { generateBoardMatrix } from 'stores/TetrisStore/logics/gameBoard'
import { ShapeProperty } from 'types/shape'

const App = observer(() => {
  const {
    tetrisStore: {
      rotateShape,
      moveBlock,
      moveBottom,
      onGameStart,
      onTogglePause,
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

  const nextBlocks = useCallback((shape: ShapeProperty) => {
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
    <div className="flex flex-row items-center justify-center gap-8">
      <GameBoard />
      <div className="mt-40 flex w-64 flex-col justify-between gap-4">
        <FormContainer title="Next">
          <div className="grid grid-flow-col grid-cols-[2] items-center justify-center gap-6 p-4">
            <div className="">
              {nextBlocks(shapeQueue[1]).map((row, rowIdx) => (
                <div key={`board-row-${rowIdx}`} className="flex">
                  {row.map((block, blockIdx) => {
                    return (
                      <Block
                        key={`block-${row}-${blockIdx}`}
                        color={block.colorScheme.schemeName}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="">
              {nextBlocks(shapeQueue[2]).map((row, rowIdx) => (
                <div key={`board-row-${rowIdx}`} className="flex">
                  {row.map((block, blockIdx) => {
                    return (
                      <Block
                        key={`block-${row}-${blockIdx}`}
                        color={block.colorScheme.schemeName}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </FormContainer>
        <FormContainer title="Settings">
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
        </FormContainer>
        <div className="flex flex-col gap-2">
          <Button isDisabled={gameRunning} onClick={onGameStart}>
            Start
          </Button>
          <Button onClick={onGameReset}>Reset</Button>
          <Button onClick={onTogglePause}>Pause/Resume</Button>
        </div>
      </div>
    </div>
  )
})

export default App
