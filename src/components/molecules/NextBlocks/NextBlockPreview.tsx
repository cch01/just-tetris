import { Block } from 'components/atoms/Block'
import { BlockState } from 'constants/block'
import { memo } from 'react'

interface NextBlockPreviewProps {
  blocksMatrix: BlockState[][]
}

export const NextBlockPreview: React.FC<NextBlockPreviewProps> = memo(
  ({ blocksMatrix }) => {
    return (
      <div className="flex min-h-12 w-28 items-center justify-center md:min-h-20">
        <div className="p-2 md:p-3">
          {blocksMatrix.map((row, rowIdx) => (
            <div key={`board-row-${rowIdx}`} className="flex">
              {row.map((block, blockIdx) => {
                return (
                  <Block
                    key={`block-${row}-${blockIdx}`}
                    color={block.colorScheme.schemeName}
                    size="sm"
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
