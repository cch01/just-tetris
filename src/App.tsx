import { Button } from 'components/atoms/Button'
import { FormContainer } from 'components/atoms/Form/FormContainer'
import { FormInputItem } from 'components/atoms/Form/FormInputItem'
import { Hr } from 'components/atoms/Hr'
import { GameBoard } from 'components/molecules/GameBoard'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'

const App = observer(() => {
  const {
    tetrisStore: {
      rotateShape,
      moveBlock,
      moveBottom,
      onGameStart,
      onTogglePause,
      onGameStop,
      gameRunning,
      gameTimer,
      boardHeight,
      boardWidth,
      framePerSecond,
      setFramePerSecond,
      setHeight,
      setWidth
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

  return (
    <div className="flex flex-row items-center justify-center gap-8">
      <GameBoard />
      <div className="flex w-60 flex-col justify-between gap-8">
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
          <Button isDisabled={!gameRunning} onClick={onGameStop}>
            Stop
          </Button>
          <Button onClick={onTogglePause}>Pause/Resume</Button>
        </div>
      </div>
    </div>
  )
})

export default App
