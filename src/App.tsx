import { GameBoard } from 'components/molecules/GameBoard'
import { useGameBoard } from 'hooks/useGameBoard'

const App = () => {
  const { boardMatrix, onGameStart, shapeQueue, onGameStop } = useGameBoard(
    20,
    50,
    0.1
  )

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
