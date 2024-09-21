import _ from 'lodash'
import { useCallback, useState } from 'react'
import { Coordinate, ShapeProperty } from 'types/coordinate'
import { checkHasCollision } from 'utils/checkHasCollision'

import { useGameBoard } from './useGameBoard'
import useInterval from './useInterval'
import { useShapeMovements } from './useShapeMovements'
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
    onChangeBlocksColor,
    onShapeTranslateRepaint,
    resetBoard
  } = useGameBoard(rowCount, colCount)

  const {
    onResetQueue,
    popAndEnqueueShape,
    checkCanSpawnShape,
    onUpdateCurrentShapeCoordinate,
    currentShapeState,
    nextShapeState
  } = useShapeQueue(colCount)

  const onUpdateShapeCoordinate = useCallback(
    (newCoordinates: Coordinate[]) => {
      if (justCollided) return
      onShapeTranslateRepaint({
        prevCoordinates: currentShapeState.blockCoordinates,
        targetColor: currentShapeState.color,
        targetCoordinates: newCoordinates,
        lockBlocks: false
      })
      onUpdateCurrentShapeCoordinate(newCoordinates)
    },
    [
      currentShapeState.blockCoordinates,
      currentShapeState.color,
      justCollided,
      onShapeTranslateRepaint,
      onUpdateCurrentShapeCoordinate
    ]
  )

  useShapeMovements({
    boardMatrix,
    currentShapeState,
    onUpdateShapeCoordinate,
    justCollided,
    gameStarted
  })

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
    (
      prevShapeStates: ShapeProperty,
      nextShapeStates: ShapeProperty,
      lockSankBlocks: boolean
    ) => {
      onShapeTranslateRepaint({
        prevCoordinates: prevShapeStates.blockCoordinates,
        targetColor: nextShapeStates.color,
        targetCoordinates: nextShapeStates.blockCoordinates,
        lockBlocks: lockSankBlocks
      })

      onUpdateCurrentShapeCoordinate(nextShapeStates.blockCoordinates)
    },
    [onShapeTranslateRepaint, onUpdateCurrentShapeCoordinate]
  )

  const playKeyframe = useCallback(() => {
    if (justCollided) {
      setJustCollided(false)

      const canSpawnNextShape = checkCanSpawnShape(
        nextShapeState.blockCoordinates,
        boardMatrix
      )

      if (!canSpawnNextShape) {
        alert('Game Over')
        return onGameStop()
      }

      popAndEnqueueShape()
      return
    }

    const sankCurrShapeState = _.cloneDeep(currentShapeState)

    sankCurrShapeState.blockCoordinates =
      sankCurrShapeState.blockCoordinates.map(({ row, col }) => ({
        row: row + 1,
        col
      }))

    const hasCollision = checkHasCollision({
      prevShapeCoordinates: currentShapeState.blockCoordinates,
      targetShapeCoordinates: sankCurrShapeState.blockCoordinates,
      boardMatrix,
      mode: 'sink'
    })

    if (hasCollision) {
      setJustCollided(true)
    }

    const lockBlocks = hasCollision

    sink(currentShapeState, sankCurrShapeState, lockBlocks)
  }, [
    boardMatrix,
    checkCanSpawnShape,
    currentShapeState,
    justCollided,
    nextShapeState.blockCoordinates,
    onGameStop,
    popAndEnqueueShape,
    sink
  ])

  const onTogglePause = useCallback(() => {
    setGameStarted((val) => !val)
  }, [])

  useInterval(playKeyframe, 1000 * refreshPerSecond, gameStarted)

  return { onGameStart, onGameStop, boardMatrix, onTogglePause }
}
