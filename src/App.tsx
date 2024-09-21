import { GameBoard } from 'components/molecules/GameBoard'
import { useTetris } from 'hooks/useTetris'

const App = () => {
  const { onGameStart, onGameStop, boardMatrix, onTogglePause } = useTetris(
    9,
    10,
    0.3
  )

  return (
    <div className="my-24 flex items-center justify-center overflow-x-hidden">
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
