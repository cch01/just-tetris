import clsx from 'clsx'
import { BLOCK_COLOR_SCHEMES, sizeClassesMapper } from 'constants/block'
import { memo } from 'react'

type BlocKProps = {
  color: keyof typeof BLOCK_COLOR_SCHEMES
  size?: 'sm' | 'md' | 'lg'
  hidden?: boolean
}

const Block: React.FC<BlocKProps> = memo(({ hidden, color, size = 'lg' }) => {
  const colors = BLOCK_COLOR_SCHEMES[color]

  const sizeClasses = sizeClassesMapper[size]

  return (
    <div
      className={clsx(
        'relative  block  perspective-[100px]',
        colors.center,
        sizeClasses.size,
        hidden && 'hidden'
      )}
    >
      <div
        className={clsx(
          'absolute  transform rotate-x-90',
          colors.top,
          sizeClasses.size,
          sizeClasses.top
        )}
      />
      <div
        className={clsx(
          'absolute  transform -rotate-x-90',
          colors.bottom,
          sizeClasses.size,
          sizeClasses.bottom
        )}
      />
      <div
        className={clsx(
          'absolute  transform rotate-y-90',
          colors.right,
          sizeClasses.size,
          sizeClasses.right
        )}
      />
      <div
        className={clsx(
          'absolute  transform -rotate-y-90',
          colors.left,
          sizeClasses.size,
          sizeClasses.left
        )}
      />
    </div>
  )
})

Block.displayName = 'Block'

export { Block }
