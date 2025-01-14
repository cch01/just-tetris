import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { Coordinate } from 'types/shape'
import { Mock, vi } from 'vitest'

import { useTouchMove } from '../useTouchMove'

describe('useTouchMove', () => {
  const colCount = 10
  let shapeCoordinates: Coordinate[]
  let onTouchMoveMock: Mock
  let onHardDropMock: Mock

  beforeEach(() => {
    shapeCoordinates = [
      { row: 0, col: 4 },
      { row: 0, col: 5 },
      { row: 1, col: 4 },
      { row: 1, col: 5 }
    ] // A simple square block
    onTouchMoveMock = vi.fn()
    onHardDropMock = vi.fn()
  })

  test('moves shape horizontally when dragging enough distance', () => {
    const { result } = renderHook(() =>
      useTouchMove(colCount, shapeCoordinates, onTouchMoveMock, onHardDropMock)
    )

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
      })
      document.dispatchEvent(touchStartEvent)

      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 95, clientY: 50 }] as unknown as Touch[] // Dragging 45px horizontally
      })
      document.dispatchEvent(touchMoveEvent)
    })

    expect(onTouchMoveMock).toHaveBeenCalledTimes(1)
    expect(onTouchMoveMock).toHaveBeenCalledWith([
      { row: 0, col: 5 },
      { row: 0, col: 6 },
      { row: 1, col: 5 },
      { row: 1, col: 6 }
    ])
  })

  test('fires hard drop when swiping downward enough', () => {
    const { result } = renderHook(() =>
      useTouchMove(colCount, shapeCoordinates, onTouchMoveMock, onHardDropMock)
    )

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
      })
      document.dispatchEvent(touchStartEvent)

      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 100 }] as unknown as Touch[] // Dragging downward 50px
      })
      document.dispatchEvent(touchMoveEvent)
    })

    expect(onHardDropMock).toHaveBeenCalledTimes(1)
    expect(onTouchMoveMock).not.toHaveBeenCalled()
  })

  test('respects boundaries and prevents moving out of bounds', () => {
    shapeCoordinates = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 }
    ] // A square block at the far-left boundary

    const { result } = renderHook(() =>
      useTouchMove(colCount, shapeCoordinates, onTouchMoveMock, onHardDropMock)
    )

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
      })
      document.dispatchEvent(touchStartEvent)

      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 10, clientY: 50 }] as unknown as Touch[] // Dragging left 40px
      })
      document.dispatchEvent(touchMoveEvent)
    })

    expect(onTouchMoveMock).not.toHaveBeenCalled()
  })

  test('prevents movements during hard drop cooldown', () => {
    const { result } = renderHook(() =>
      useTouchMove(colCount, shapeCoordinates, onTouchMoveMock, onHardDropMock)
    )

    act(() => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
      })
      document.dispatchEvent(touchStartEvent)

      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 100 }] as unknown as Touch[] // Hard drop
      })
      document.dispatchEvent(touchMoveEvent)

      const touchStartEventAfterCooldown = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 }] as unknown as Touch[]
      })
      document.dispatchEvent(touchStartEventAfterCooldown)

      const touchMoveEventAfterCooldown = new TouchEvent('touchmove', {
        touches: [{ clientX: 100, clientY: 50 }] as unknown as Touch[] // Dragging horizontally
      })
      document.dispatchEvent(touchMoveEventAfterCooldown)
    })

    expect(onHardDropMock).toHaveBeenCalledTimes(1)
    expect(onTouchMoveMock).toHaveBeenCalledTimes(1)
  })
})
