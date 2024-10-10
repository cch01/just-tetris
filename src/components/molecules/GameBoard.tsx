import { Block } from 'components/atoms/Block'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'

export const GameBoard: React.FC = observer(() => {
  const { tetrisStore } = useStores()

  return (
    <div>
      {tetrisStore.boardMatrix.map((row, rowIdx) => (
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
  )
})

GameBoard.displayName = 'GameBoard'
