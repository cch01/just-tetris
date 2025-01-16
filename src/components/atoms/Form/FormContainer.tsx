import { faAngleUp, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useCallback, useState } from 'react'

import { Hr } from '../Hr'

interface FormContainerProps {
  title: string
  children: React.ReactNode
  onClearSection?: () => void
  collapsible?: boolean
  defaultCollapsed?: boolean
  getIsCollapsed?: (val: boolean) => void
}
export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  onClearSection,
  children,
  collapsible,
  defaultCollapsed,
  getIsCollapsed
}) => {
  const [currentIsCollapsed, setCurrentIsCollapsed] = useState(defaultCollapsed)

  const onToggleCollapse = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      e.preventDefault()
      setCurrentIsCollapsed((val) => {
        getIsCollapsed?.(!val)
        return !val
      })
    },
    [getIsCollapsed]
  )

  return (
    <div
      className={clsx(
        'flex flex-col rounded-md border border-border p-1 transition-all duration-150 ease-in-out'
      )}
      style={{ maxHeight: currentIsCollapsed ? 48 : 1000 }}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <span
          className="cursor-pointer text-2xs font-bold italic text-primary md:text-sm"
          onClick={(e) => (collapsible ? onToggleCollapse(e) : null)}
          role="heading"
        >
          {title}
        </span>
        <div className="flex space-x-2">
          {onClearSection && (
            <div
              role="button"
              className="flex items-center justify-center"
              onClick={onClearSection}
            >
              <FontAwesomeIcon
                className="text-xs text-highlight"
                icon={faArrowRotateLeft}
              />
            </div>
          )}
          {collapsible && (
            <div
              role="button"
              className="flex size-6 items-center justify-center"
              onClick={onToggleCollapse}
            >
              <FontAwesomeIcon
                className={clsx(
                  'text-sm text-highlight transition-all md:text-base',
                  currentIsCollapsed && 'rotate-180'
                )}
                icon={faAngleUp}
              />
            </div>
          )}
        </div>
      </div>
      <Hr
        className={clsx(
          'mb-1 transition-opacity ',
          currentIsCollapsed ? '-z-10 opacity-0' : 'opacity-100'
        )}
      />
      <div
        className={clsx(
          'mb-1 flex flex-grow items-center justify-center transition-opacity',
          currentIsCollapsed ? '-z-10 opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}
