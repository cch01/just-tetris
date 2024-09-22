import { ColorKeys } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/coordinate'

export type OnShapeTranslationRepaintInputs = {
  targetCoordinates: Coordinate[]
  targetColor: ColorKeys
  prevCoordinates: Coordinate[]
  lockBlocks: boolean
  callback: () => void
}

export type OnChangeBlocksColorInputs = {
  coordinates: Coordinate[]
  color: ColorKeys
}
