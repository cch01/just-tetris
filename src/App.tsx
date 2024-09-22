import { GameBoard } from 'components/molecules/GameBoard'
import { useTetris } from 'hooks/useTetris'

const App = () => {
  const { onGameStart, onGameStop, boardMatrix, onTogglePause } = useTetris(
    10,
    24,
    0.5
  )

  return (
    <div className="flex items-center justify-center">
      <div>
        <GameBoard gameBoardState={boardMatrix} />
        <button onClick={onGameStart}>Start</button>
        <button onClick={onGameStop}>Stop</button>
        <button onClick={onTogglePause}>Pause/Unpause</button>
      </div>
    </div>
  )
}

export default App
