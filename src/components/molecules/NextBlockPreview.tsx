import { Block } from 'components/atoms/Block'
import { BlockState } from 'constants/block'
import { memo } from 'react'

interface NextBlockPreviewProps {
  blocksMatrix: BlockState[][]
}

export const NextBlockPreview: React.FC<NextBlockPreviewProps> = memo(
  ({ blocksMatrix }) => {
    return (
      <div className="flex h-20 w-32 items-center justify-center">
        <div>
          {blocksMatrix.map((row, rowIdx) => (
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
      </div>
    )
  }
)

NextBlockPreview.displayName = 'NextBlockPreviewF'
