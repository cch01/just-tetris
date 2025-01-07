export const BLOCK_COLOR_SCHEMES = {
  orange: {
    center: 'bg-orange-500',
    top: 'bg-orange-400',
    left: 'bg-orange-300',
    right: 'bg-orange-600',
    bottom: 'bg-orange-700',
    schemeName: 'orange'
  },
  blue: {
    center: 'bg-blue-500',
    top: 'bg-blue-400',
    left: 'bg-blue-300',
    right: 'bg-blue-600',
    bottom: 'bg-blue-700',
    schemeName: 'blue'
  },
  cyan: {
    center: 'bg-cyan-500',
    top: 'bg-cyan-400',
    left: 'bg-cyan-300',
    right: 'bg-cyan-600',
    bottom: 'bg-cyan-700',
    schemeName: 'cyan'
  },
  yellow: {
    center: 'bg-yellow-500',
    top: 'bg-yellow-400',
    left: 'bg-yellow-300',
    right: 'bg-yellow-600',
    bottom: 'bg-yellow-700',
    schemeName: 'yellow'
  },
  green: {
    center: 'bg-green-500',
    top: 'bg-green-400',
    left: 'bg-green-300',
    right: 'bg-green-600',
    bottom: 'bg-green-700',
    schemeName: 'green'
  },
  purple: {
    center: 'bg-purple-500',
    top: 'bg-purple-400',
    left: 'bg-purple-300',
    right: 'bg-purple-600',
    bottom: 'bg-purple-700',
    schemeName: 'purple'
  },
  red: {
    center: 'bg-red-500',
    top: 'bg-red-400',
    left: 'bg-red-300',
    right: 'bg-red-600',
    bottom: 'bg-red-700',
    schemeName: 'red'
  },
  gray: {
    center: 'bg-gray-500',
    top: 'bg-gray-400',
    left: 'bg-gray-300',
    right: 'bg-gray-600',
    bottom: 'bg-gray-700',
    schemeName: 'gray'
  },
  transparent: {
    center: 'bg-transparent',
    top: 'bg-transparent',
    left: 'bg-transparent',
    right: 'bg-transparent',
    bottom: 'bg-transparent',
    schemeName: 'transparent'
  }
} as const

export type ColorKeys = keyof typeof BLOCK_COLOR_SCHEMES

export type BlockState = {
  colorScheme: {
    center: string
    top: string
    left: string
    right: string
    bottom: string
    schemeName: ColorKeys
  }
  occupied: boolean
  locked: boolean
  hidden: boolean
}

type SizeClass = {
  size: string
  top: string
  bottom: string
  left: string
  right: string
}

export const sizeClassesMapper: Record<'sm' | 'md' | 'lg', SizeClass> = {
  sm: {
    size: 'h-3 w-3',
    top: 'bottom-[6px]',
    bottom: 'top-[6px]',
    left: 'right-[6px]',
    right: 'left-[6px]'
  },
  md: {
    size: 'h-6 w-6',
    top: 'bottom-[12px]',
    bottom: 'top-[12px]',
    left: 'right-[12px]',
    right: 'left-[12px]'
  },
  lg: {
    size: 'h-7 w-7',
    top: 'bottom-[14px]',
    bottom: 'top-[14px]',
    left: 'right-[14px]',
    right: 'left-[14px]'
  }
}
