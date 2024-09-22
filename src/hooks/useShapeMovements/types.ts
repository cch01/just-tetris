import { BlockState } from 'constants/block'
import { Coordinate, ShapeProperty } from 'types/coordinate'

export type UseShapeMovementsInputs = {
  currentShapeState: ShapeProperty
  onUpdateShapeCoordinate: (coordinates: Coordinate[], lock: boolean) => void
  boardMatrix: BlockState[][]
  justCollided: boolean
  gameRunning: boolean
}
