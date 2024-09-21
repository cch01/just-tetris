import _ from 'lodash'
import { useCallback, useState } from 'react'
import { ShapeProperty } from 'types/coordinate'

import { useGameBoard } from './useGameBoard'
import { checkHasCollision } from './useGameBoard/utils'
import useInterval from './useInterval'
import { useShapeQueue } from './useShapeQueue'

export const useTetris = (
  rowCount = 24,
  colCount = 10,
  refreshPerSecond = 1
) => {
  const [gameStarted, setGameStarted] = useState(false)

  const [justCollided, setJustCollided] = useState(false)

  const {
    boardMatrix,
    checkIsOutBound,
    onChangeBlocksColor,
    onShapeTranslateRepaint,
    resetBoard
  } = useGameBoard(rowCount, colCount)

  const {
    onResetQueue,
    popAndEnqueueShape,
    shapeQueue,
    onUpdateCurrentShapeCoordinate,
    checkCanSpawnShape
  } = useShapeQueue(colCount)

  const resetAll = useCallback(() => {
    resetBoard()
    onResetQueue()
  }, [onResetQueue, resetBoard])

  const onGameStop = useCallback(() => {
    if (gameStarted) {
      setGameStarted(false)
    }
    // resetAll()
  }, [gameStarted])

  const onGameStart = useCallback(() => {
    if (gameStarted) return

    resetAll()

    setGameStarted(true)
  }, [gameStarted, resetAll])

  const sink = useCallback(
    (prevShapeStates: ShapeProperty, nextShapeStates: ShapeProperty) => {
      onShapeTranslateRepaint({
        prevCoordinates: prevShapeStates.blockCoordinates,
        targetColor: nextShapeStates.color,
        targetCoordinates: nextShapeStates.blockCoordinates
      })

      onUpdateCurrentShapeCoordinate(nextShapeStates.blockCoordinates)
    },
    [onShapeTranslateRepaint, onUpdateCurrentShapeCoordinate]
  )

  const playKeyframe = useCallback(() => {
    if (justCollided) {
      setJustCollided(false)

      const canSpawnNextShape = checkCanSpawnShape(
        shapeQueue[1].blockCoordinates,
        boardMatrix
      )

      if (!canSpawnNextShape) {
        console.log('Game Over')
        return onGameStop()
      }

      popAndEnqueueShape()
      return
    }

    const prevShapeStates = shapeQueue[0]

    const nextShapeStates = _.cloneDeep(shapeQueue[0])

    nextShapeStates.blockCoordinates = nextShapeStates.blockCoordinates.map(
      ({ row, col }) => ({
        row: row + 1,
        col
      })
    )

    sink(prevShapeStates, nextShapeStates)

    const hasCollision = checkHasCollision({
      prevShapeCoordinates: prevShapeStates.blockCoordinates,
      targetShapeCoordinates: nextShapeStates.blockCoordinates,
      boardMatrix
    })

    if (hasCollision) {
      setJustCollided(true)
    }
  }, [
    boardMatrix,
    checkCanSpawnShape,
    justCollided,
    onGameStop,
    popAndEnqueueShape,
    shapeQueue,
    sink
  ])

  useInterval(playKeyframe, 1000 * refreshPerSecond, gameStarted)

  return { onGameStart, onGameStop, boardMatrix }
}
