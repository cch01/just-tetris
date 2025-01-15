import { Block } from 'components/atoms/Block'
import useDimensions from 'hooks/useDimensions'
import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'
import { useStores } from 'stores'

interface GameBoardProps {
  blockSize?: 'md' | 'sm' | 'lg'
}

const GameBoardComponent = forwardRef<HTMLDivElement, GameBoardProps>(
  ({ blockSize = 'lg' }, ref) => {
    const { tetrisStore } = useStores()

    const { isMobile } = useDimensions()

    return (
      <div ref={ref}>
        {tetrisStore.boardMatrix.map((row, rowIdx) => (
          <div key={`board-row-${rowIdx}`} className="flex">
            {row.map((block, blockIdx) => {
              return (
                <Block
                  key={`block-${row}-${blockIdx}`}
                  color={block.colorScheme.schemeName}
                  hidden={block.hidden}
                  size={blockSize || (isMobile && 'sm') || 'lg'}
                />
              )
            })}
          </div>
        ))}
      </div>
    )
  }
)

GameBoardComponent.displayName = 'GameBoard'

export const GameBoard = observer(GameBoardComponent)
