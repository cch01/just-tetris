import { useCallback, useEffect, useRef } from 'react'

export enum Key {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  G = 'g',
  H = 'h',
  I = 'i',
  J = 'j',
  K = 'k',
  L = 'l',
  M = 'm',
  N = 'n',
  O = 'o',
  P = 'p',
  Q = 'q',
  R = 'r',
  S = 's',
  T = 't',
  U = 'u',
  V = 'v',
  W = 'w',
  X = 'x',
  Y = 'y',
  Z = 'z'
}

type KeyInputOptions = {
  repeat?: boolean // Enable repeated callback execution
  repeatDelay?: number // Delay between repeated executions (ms)
}

export const useKeyInput = (
  key: Key,
  callback: () => void,
  options: KeyInputOptions = { repeat: true, repeatDelay: 150 }
) => {
  const { repeat, repeatDelay } = options
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault()
        if (repeat && !intervalRef.current) {
          callback()
          intervalRef.current = setInterval(callback, repeatDelay)
        } else callback()
      }
    },
    [key, callback, repeat, repeatDelay]
  )

  const handleKeyRelease = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    },
    [key]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: false })
    window.addEventListener('keyup', handleKeyRelease, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyRelease)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [handleKeyPress, handleKeyRelease])
}
