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

export const useKeyInput = (key: Key, callback: () => void) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault()
        callback()
      }
    },
    [key, callback]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}
