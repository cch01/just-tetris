import { MutableRefObject, useEffect, useRef } from 'react'

type UseOutOfBoundsProps = {
  onOutOfBoundX?: () => void
  onOutOfBoundY?: () => void
  offsetX?: number
  offsetY?: number
}

function useOutOfBounds({
  onOutOfBoundX,
  onOutOfBoundY,
  offsetX = 0,
  offsetY = 0
}: UseOutOfBoundsProps): MutableRefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onOutOfBoundXRef = useRef(onOutOfBoundX)
  const onOutOfBoundYRef = useRef(onOutOfBoundY)

  // Update refs to ensure latest callback functions are used
  useEffect(() => {
    onOutOfBoundXRef.current = onOutOfBoundX
  }, [onOutOfBoundX])

  useEffect(() => {
    onOutOfBoundYRef.current = onOutOfBoundY
  }, [onOutOfBoundY])

  useEffect(() => {
    const checkBounds = () => {
      if (!ref.current) return

      const { left, right, top, bottom } = ref.current.getBoundingClientRect()
      const { innerWidth, innerHeight } = window

      const isOutOfBoundX = left < -offsetX || right > innerWidth + offsetX
      const isOutOfBoundY = top < -offsetY || bottom > innerHeight + offsetY

      if (isOutOfBoundX && onOutOfBoundXRef.current) {
        onOutOfBoundXRef.current()
      }

      if (isOutOfBoundY && onOutOfBoundYRef.current) {
        onOutOfBoundYRef.current()
      }
    }

    const startChecking = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(checkBounds, 10)
      }
    }

    const stopChecking = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const observer = new MutationObserver(() => {
      if (ref.current) {
        const { left, right, top, bottom } = ref.current.getBoundingClientRect()
        const { innerWidth, innerHeight } = window

        const isInBounds =
          left >= -offsetX &&
          right <= innerWidth + offsetX &&
          top >= -offsetY &&
          bottom <= innerHeight + offsetY

        if (isInBounds) {
          stopChecking()
        } else {
          startChecking()
        }
      }
    })

    const handleResize = () => {
      if (ref.current) {
        const { left, right, top, bottom } = ref.current.getBoundingClientRect()
        const { innerWidth, innerHeight } = window

        const isInBounds =
          left >= -offsetX &&
          right <= innerWidth + offsetX &&
          top >= -offsetY &&
          bottom <= innerHeight + offsetY

        if (isInBounds) {
          stopChecking()
        } else {
          startChecking()
        }
      }
    }

    window.addEventListener('resize', handleResize)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })
    checkBounds()
    return () => {
      stopChecking()
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [offsetX, offsetY])

  return ref
}

export default useOutOfBounds
