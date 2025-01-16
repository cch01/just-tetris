export const NON_PLAY_FIELD_BOTTOM_ROW_IDX = 3 as const

export const KICK_OFFSETS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 }
] as const

export const HIDDEN_TOP_BUFFER_BLOCKS = 4 as const

export const MIN_WIDTH = 8 as const
export const MIN_HEIGHT = 10 as const
