import clsx from 'clsx'
import React, { memo, useEffect, useState } from 'react'

import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export const Modal: React.FC<ModalProps> = memo(
  ({ isOpen, onClose, children, title }) => {
    const [showModal, setShowModal] = useState<boolean>(isOpen)

    const handleTransitionEnd = () => {
      if (!isOpen) {
        setShowModal(false)
      }
    }

    useEffect(() => {
      if (isOpen) {
        setShowModal(true)
      }
    }, [isOpen])

    if (!showModal) return null

    return (
      <div
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center bg-tertiary bg-opacity-75 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        <div
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
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'
