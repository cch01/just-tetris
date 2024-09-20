import { Block } from 'components/atoms/Block'
import { BlockState } from 'constants/block'

type GameBoardProps = {
  gameBoardState: BlockState[][]
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameBoardState }) => {
  return (
    <>
      {gameBoardState.map((row, rowIdx) => (
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
    </>
  )
}
