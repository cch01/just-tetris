import { ColorKeys } from 'constants/block'

export type Coordinate = {
  row: number
  col: number
}

export type ShapeProperty = {
  blockCoordinates: Coordinate[]
  name:
    | 'IShape'
    | 'JShape'
    | 'LShape'
    | 'OShape'
    | 'SShape'
    | 'TShape'
    | 'ZShape'

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
