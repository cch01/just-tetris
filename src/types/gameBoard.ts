import { ColorKeys } from 'constants/block'
import { Coordinate } from 'types/shape'

export type RefreshBoardInputs = {
  targetCoordinates: Coordinate[]
  targetColor: ColorKeys
  prevCoordinates: Coordinate[]
  callback?: () => void
}

export type OnChangeBlocksColorInputs = {
  coordinates: Coordinate[]
  color: ColorKeys
}
