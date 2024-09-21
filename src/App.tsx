import { GameBoard } from 'components/molecules/GameBoard'
import { useTetris } from 'hooks/useTetris'

const App = () => {
  const { onGameStart, onGameStop, boardMatrix } = useTetris(24, 10, 0.1)

  return (
    <div className="my-24 flex w-screen items-center justify-center">
      <div>
        <GameBoard gameBoardState={boardMatrix} />
        <button onClick={onGameStart}>Start</button>
        <button onClick={onGameStop}>Stop</button>
      </div>
    </div>
  )
}

export default App
