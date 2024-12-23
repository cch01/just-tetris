import { faAngleUp, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Hr } from 'components/atoms/Hr'
import { useCallback, useState } from 'react'

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
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        'flex flex-col rounded-md border border-border p-2 transition-all duration-150 ease-in-out'
      )}
      style={{ maxHeight: currentIsCollapsed ? 48 : 1000 }}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div
          className="cursor-pointer text-lg font-bold italic text-primary"
          onClick={(e) => (collapsible ? onToggleCollapse(e) : null)}
          role="heading"
        >
          {title}
        </div>
        <div className="flex space-x-2">
          {onClearSection && (
            <div
              role="button"
              className="flex size-6 items-center justify-center"
              onClick={onClearSection}
            >
              <FontAwesomeIcon
                className="text-highlight"
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
                  'text-lg text-highlight transition-all ',
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
          'mb-2 transition-opacity',
          currentIsCollapsed ? '-z-10 opacity-0' : 'opacity-100'
        )}
      />
      <div
        className={clsx(
          'mb-2 transition-opacity',
          currentIsCollapsed ? '-z-10 opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}
