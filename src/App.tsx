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
      onGameStop
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

  return (
    <div className="flex items-center justify-center">
      <div>
        <GameBoard />
        <div className="flex flex-row gap-4">
          <button onClick={onGameStart}>Start</button>
          <button onClick={onGameStop}>Stop</button>
          <button onClick={onTogglePause}>Pause/Unpause</button>
        </div>
      </div>
    </div>
  )
})

export default App
