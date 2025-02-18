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
    center: 'bg-zinc-600',
    top: 'bg-zinc-500',
    left: 'bg-zinc-400',
    right: 'bg-zinc-700',
    bottom: 'bg-zinc-800',
    schemeName: 'gray'
  },
  transparent: {
    center: 'bg-transparent',
    top: 'bg-transparent',
    left: 'bg-transparent',
    right: 'bg-transparent',
    bottom: 'bg-transparent',
    schemeName: 'transparent'
  },
  shadow: {
    center: 'bg-zinc-400',
    top: 'bg-zinc-300',
    left: 'bg-zinc-200',
    right: 'bg-zinc-500',
    bottom: 'bg-zinc-600',
    schemeName: 'shadow'
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
    size: 'h-4 w-4',
    top: 'bottom-[8px]',
    bottom: 'top-[8px]',
    left: 'right-[8px]',
    right: 'left-[8px]'
  },
  md: {
    size: 'h-5 w-5',
    top: 'bottom-[10px]',
    bottom: 'top-[10px]',
    left: 'right-[10px]',
    right: 'left-[10px]'
  },
  lg: {
    size: 'h-6 w-6',
    top: 'bottom-[12px]',
    bottom: 'top-[12px]',
    left: 'right-[12px]',
    right: 'left-[12px]'
  }
}
