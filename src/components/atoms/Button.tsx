import clsx from 'clsx'
import React, { memo } from 'react'

interface ButtonProps {
  children: React.ReactNode | string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isDisabled?: boolean
}

export const Button: React.FC<ButtonProps> = memo(
  ({ children, onClick, isDisabled }) => {
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
          `rounded-md border border-border p-2 transition-colors duration-75 ease-in`,
          isDisabled
            ? 'cursor-not-allowed bg-bg-alternative'
            : 'hover:bg-bg-secondary'
        )}
      >
        {child}
      </button>
    )
  }
)

Button.displayName = 'Button'
