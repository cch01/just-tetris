import { GameBoard } from 'components/molecules/GameBoard'
import { useTetris } from 'hooks/useTetris'

const App = () => {
  const { onGameStart, onGameStop, boardMatrix, onTogglePause } = useTetris(
    20,
    24,
    0.05
  )

  return (
    <div className="flex items-center justify-center">
      <div>
        <GameBoard gameBoardState={boardMatrix} />
        <div className="flex flex-row gap-4">
          <button onClick={onGameStart}>Start</button>
          <button onClick={onGameStop}>Stop</button>
          <button onClick={onTogglePause}>Pause/Unpause</button>
        </div>
      </div>
    </div>
  )
}

export default App
