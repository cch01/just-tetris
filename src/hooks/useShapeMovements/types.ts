import { BlockState } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/coordinate'

export type UseShapeMovementsInputs = {
  currentShapeState: ShapeProperty
  onUpdateShapeCoordinate: (coordinates: Coordinate[]) => void
  boardMatrix: BlockState[][]
  justCollided: boolean
  gameRunning: boolean
}
