import clsx from 'clsx'
import useClickOutside from 'hooks/useClickOutside'
import React, { memo, useLayoutEffect, useState } from 'react'

import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  clickOutsideToClose?: boolean
  onOk?: () => void
}

export const Modal: React.FC<ModalProps> = memo(
  ({ isOpen, onClose, children, title, clickOutsideToClose = true, onOk }) => {
    const [showModal, setShowModal] = useState<boolean>(isOpen)

    const modalRef = useClickOutside<HTMLDivElement>(onClose)

    const handleTransitionEnd = () => {
      if (!isOpen) {
        setShowModal(false)
      }
    }

    useLayoutEffect(() => {
      if (isOpen) {
        setShowModal(true)
      }
    }, [isOpen])

    return (
      <div
        className={clsx(
          'fixed inset-0  flex items-center justify-center bg-tertiary bg-opacity-75 transition-opacity duration-300',
          showModal ? 'z-50 opacity-100 ' : '-z-50 opacity-0'
        )}
      >
        <div
          ref={(clickOutsideToClose && modalRef) || undefined}
          className={clsx(
            'w-full max-w-lg transform rounded-lg bg-bg-primary p-6 shadow-xl transition-all duration-300',
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="mt-4">{children}</div>

          <div className="flex justify-between">
            {onOk && (
              <div className="mt-6 flex justify-start">
                <Button onClick={onOk}>OK</Button>
              </div>
            )}
            <div />
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'
