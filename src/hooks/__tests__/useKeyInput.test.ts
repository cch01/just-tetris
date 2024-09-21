import { renderHook } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'

import { Key, useKeyInput } from '../useKeyInput' // Adjust the import path

// Mock the window's addEventListener and removeEventListener
const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

describe('useKeyInput', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should call callback when specified key is pressed', () => {
    const callback = vi.fn()

    // Render the hook with key 'ArrowUp'
    const { unmount } = renderHook(() => useKeyInput(Key.ArrowUp, callback))

    // Simulate pressing the 'ArrowUp' key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      window.dispatchEvent(event)
    })

    // Verify that the callback was called
    expect(callback).toHaveBeenCalledTimes(1)

    // Clean up
    unmount()
  })

  it('should not call callback when different key is pressed', () => {
    const callback = vi.fn()

    // Render the hook with key 'ArrowUp'
    const { unmount } = renderHook(() => useKeyInput(Key.ArrowUp, callback))

    // Simulate pressing the 'ArrowDown' key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      window.dispatchEvent(event)
    })

    // Verify that the callback was not called
    expect(callback).not.toHaveBeenCalled()

    // Clean up
    unmount()
  })

  it('should add and remove event listeners', () => {
    const callback = vi.fn()

    // Render the hook with key 'ArrowUp'
    const { unmount } = renderHook(() => useKeyInput(Key.ArrowUp, callback))

    // Check if the event listener was added with the correct parameters
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      { passive: true }
    )

    // Unmount the hook and check if the event listener was removed
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )
  })

  it('should not call callback after unmounting', () => {
    const callback = vi.fn()

    // Render the hook with key 'ArrowUp'
    const { unmount } = renderHook(() => useKeyInput(Key.ArrowUp, callback))

    // Unmount the hook
    unmount()

    // Simulate pressing the 'ArrowUp' key after unmount
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      window.dispatchEvent(event)
    })

    // Verify that the callback was not called after unmounting
    expect(callback).not.toHaveBeenCalled()
  })
})
