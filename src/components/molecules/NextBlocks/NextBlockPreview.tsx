import { Block } from 'components/atoms/Block'
import { BlockState } from 'constants/block'
import useDimensions from 'hooks/useDimensions'
import { memo } from 'react'

interface NextBlockPreviewProps {
  blocksMatrix: BlockState[][]
}

export const NextBlockPreview: React.FC<NextBlockPreviewProps> = memo(
  ({ blocksMatrix }) => {
    const { isMobile } = useDimensions()
    return (
      <div className="flex w-32 items-center justify-center">
        <div className="p-2 md:p-4">
          {blocksMatrix.map((row, rowIdx) => (
            <div key={`board-row-${rowIdx}`} className="flex">
              {row.map((block, blockIdx) => {
                return (
                  <Block
                    key={`block-${row}-${blockIdx}`}
                    color={block.colorScheme.schemeName}
                    size={isMobile ? 'sm' : 'md'}
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
