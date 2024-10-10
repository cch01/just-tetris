import clsx from 'clsx'

export const Hr: React.FC<{ className?: string }> = ({ className }) => (
  <div role="separator" className={clsx('h-0.5 w-full bg-border', className)} />
)
