import clsx from 'clsx'
import React, { memo } from 'react'

interface ButtonProps {
  children: React.ReactNode | string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isDisabled?: boolean
  size?: 'md' | 'sm'
}

export const Button: React.FC<ButtonProps> = memo(
  ({ size = 'md', children, onClick, isDisabled }) => {
    const child =
      typeof children === 'string' ? (
        <div
          className={clsx(
            'font-semibold',
            isDisabled ? 'text-tertiary' : 'text-highlight'
          )}
        >
          {children}
        </div>
      ) : (
        children
      )

    return (
      <button
        disabled={isDisabled}
        onClick={onClick}
        className={clsx(
          `min-w-10 rounded-md border border-border transition-colors duration-75 ease-in md:min-w-16`,
          isDisabled
            ? 'cursor-not-allowed bg-bg-alternative'
            : 'hover:bg-bg-secondary',
          size === 'md' ? 'p-2' : 'p-1'
        )}
      >
        {child}
      </button>
    )
  }
)

Button.displayName = 'Button'
