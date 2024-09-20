import clsx from 'clsx'
import { blockColorSchemes, sizeClassesMapper } from 'constants/block'

type BlocKProps = {
  color: keyof typeof blockColorSchemes
  size?: 'sm' | 'md' | 'lg'
}

export const Block: React.FC<BlocKProps> = ({ color, size = 'lg' }) => {
  const colors = blockColorSchemes[color]

  const sizeClasses = sizeClassesMapper[size]

  return (
    <div
      className={clsx(
        'relative  block  perspective-[100px]',
        colors.center,
        sizeClasses.size
      )}
    >
      <div
        className={clsx(
          'absolute  rotate-x-90 transform',
          colors.top,
          sizeClasses.size,
          sizeClasses.top
        )}
      />
      <div
        className={clsx(
          'absolute  -rotate-x-90 transform',
          colors.bottom,
          sizeClasses.size,
          sizeClasses.bottom
        )}
      />
      <div
        className={clsx(
          'absolute  rotate-y-90 transform',
          colors.right,
          sizeClasses.size,
          sizeClasses.right
        )}
      />
      <div
        className={clsx(
          'absolute  -rotate-y-90 transform',
          colors.left,
          sizeClasses.size,
          sizeClasses.left
        )}
      />
    </div>
  )
}
