import { BlockState, ColorKeys } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/coordinate'

export type OnShapeTranslationRepaintInputs = {
  targetCoordinates: Coordinate[]
  targetColor: ColorKeys
  prevCoordinates: Coordinate[]
}

export type CheckHasCollisionInputs = {
  prevShapeCoordinates: Coordinate[]
  targetShapeCoordinates: Coordinate[]
  boardMatrix: BlockState[][]
}

export type OnChangeBlocksColorInputs = {
  coordinates: Coordinate[]
  color: ColorKeys
}

export type ShapeSpawningPositions = {
  IShape: ShapeProperty
  JShape: ShapeProperty
  LShape: ShapeProperty
  OShape: ShapeProperty
  SShape: ShapeProperty
  TShape: ShapeProperty
  ZShape: ShapeProperty
}
