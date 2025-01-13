import { renderHook } from '@testing-library/react'
import { MockInstance, vi } from 'vitest'

import { useTap } from '../useTap'

describe('useTap', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call onTap when a tap is detected', () => {
    const onTap = vi.fn()
    renderHook(() => useTap(onTap))

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
    })
    const touchEndEvent = new TouchEvent('touchend')

    document.dispatchEvent(touchStartEvent)
    document.dispatchEvent(touchEndEvent)

    expect(onTap).toHaveBeenCalledTimes(1)
  })

  it('should not call onTap when dragging occurs', () => {
    const onTap = vi.fn()
    renderHook(() => useTap(onTap))

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
    })
    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 70, clientY: 70 }] as unknown as Touch[]
    })
    const touchEndEvent = new TouchEvent('touchend')

    document.dispatchEvent(touchStartEvent)
    document.dispatchEvent(touchMoveEvent)
    document.dispatchEvent(touchEndEvent)

    expect(onTap).not.toHaveBeenCalled()
  })

  it('should attach event listeners on mount', () => {
    const onTap = vi.fn()
    renderHook(() => useTap(onTap))

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function)
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function)
    )
  })

  it('should remove event listeners on unmount', () => {
    const onTap = vi.fn()
    const { unmount } = renderHook(() => useTap(onTap))

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function)
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchend',
      expect.any(Function)
    )
  })
})
