import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { Key, useKeyInput } from '../useKeyInput'

// Helper function to simulate keyboard events
const simulateKeyPress = (key: string) => {
  const event = new KeyboardEvent('keydown', { key })
  window.dispatchEvent(event)
}

describe('useKeyInput', () => {
  it('should call the callback when the specified key is pressed', () => {
    const callback = vi.fn()
    const key = Key.ArrowUp

    // Render the hook
    renderHook(() => useKeyInput(key, callback))

    // Simulate pressing the specified key
    simulateKeyPress(key)

    // Assert that the callback was called
    expect(callback).toHaveBeenCalled()
  })

  it('should not call the callback when a different key is pressed', () => {
    const callback = vi.fn()
    const key = Key.ArrowUp

    // Render the hook
    renderHook(() => useKeyInput(key, callback))

    // Simulate pressing a different key
    simulateKeyPress(Key.ArrowDown)

    // Assert that the callback was not called
    expect(callback).not.toHaveBeenCalled()
  })

  it('should clean up event listeners on unmount', () => {
    const callback = vi.fn()
    const key = Key.ArrowUp

    const { unmount } = renderHook(() => useKeyInput(key, callback))

    // Unmount the hook
    unmount()

    // Simulate pressing the specified key
    simulateKeyPress(key)

    // Assert that the callback was not called after unmounting
    expect(callback).not.toHaveBeenCalled()
  })
})
