import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { Coordinate, ShapeProperty } from 'types/coordinate'

import { checkCanSpawnShape, getShapeSpawningPositions } from './utils'

export const useShapeQueue = (colCount = 10) => {
  const shapeSpawningPositions = useMemo(
    () => getShapeSpawningPositions(colCount),
    [colCount]
  )

  const getRandomShape = useCallback(
    () =>
      _.clone(_.values(shapeSpawningPositions)[Math.floor(Math.random() * 7)]),
    [shapeSpawningPositions]
  )

  const [shapeQueue, setShapeQueue] = useState<ShapeProperty[]>([
    getRandomShape(),
    getRandomShape(),
    getRandomShape()
  ])

  const popAndEnqueueShape = useCallback(() => {
    setShapeQueue((queue) => {
      const queueCp = _.cloneDeep(queue)
      queueCp.shift()

      const newShape = getRandomShape()

      queueCp.push(newShape)

      return queueCp
    })
  }, [getRandomShape])

  const onResetQueue = useCallback(() => {
    setShapeQueue([getRandomShape(), getRandomShape(), getRandomShape()])
  }, [getRandomShape])

  const onUpdateCurrentShapeCoordinate = useCallback(
    (targetCoordinate: Coordinate[]) => {
      setShapeQueue((queue) => {
        const queueCp = _.cloneDeep(queue)
        queueCp[0].blockCoordinates = targetCoordinate
        return queueCp
      })
    },
    []
  )

  return {
    shapeQueue,
    popAndEnqueueShape,
    onResetQueue,
    onUpdateCurrentShapeCoordinate,
    checkCanSpawnShape,
    currentShapeState: shapeQueue[0],
    nextShapeState: shapeQueue[1]
  }
}
