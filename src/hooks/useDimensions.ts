import { BREAK_POINTS } from 'constants/window'
import { useEffect, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface UseDimensionsResult {
  windowWidth: number
  windowHeight: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  deviceType: DeviceType
}

const getDeviceType = (width: number): DeviceType => {
  if (width <= BREAK_POINTS.tablet) {
    return 'mobile'
  } else if (width <= BREAK_POINTS.desktop) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

const useDimensions = (): UseDimensionsResult => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)
  const [deviceType, setDeviceType] = useState<DeviceType>(
    getDeviceType(window.innerWidth)
  )

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth
      const currentHeight = window.innerHeight
      setWindowWidth(currentWidth)
      setWindowHeight(currentHeight)
      setDeviceType(getDeviceType(currentWidth))
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    windowWidth,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    windowHeight,
    deviceType
  }
}

export default useDimensions
