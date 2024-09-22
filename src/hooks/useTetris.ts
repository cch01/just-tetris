import _ from 'lodash'
import { useCallback, useState } from 'react'
import { Coordinate, ShapeProperty } from 'types/coordinate'
import { checkCollisionStatus } from 'utils/checkCollisionStatus'
import { checkIsAboveABlock } from 'utils/checkIsAboveABlock'

import { useGameBoard } from './useGameBoard'
import useInterval from './useInterval'
import { useShapeMovements } from './useShapeMovements'
import { useShapeQueue } from './useShapeQueue'

export const useTetris = (
  rowCount = 24,
  colCount = 10,
  refreshPerSecond = 1
) => {
  const [gameRunning, setGameRunning] = useState(false)

  const [inBufferTime, setInBufferTime] = useState(false)

  const [justCollided, setJustCollided] = useState(false)

  const {
    boardMatrix,
    onChangeBlocksColor,
    onShapeTranslateRepaint,
    resetBoard
  } = useGameBoard(rowCount, colCount)

  const {
    onResetQueue,
    dequeueAndEnqueueShapes,
    checkCanSpawnShape,
    onUpdateCurrentShapeCoordinate,
    currentShapeState,
    nextShapeState
  } = useShapeQueue(colCount)

  const onUpdateShapeCoordinate = useCallback(
    (newCoordinates: Coordinate[], lock: boolean) => {
      onShapeTranslateRepaint({
        prevCoordinates: currentShapeState.blockCoordinates,
        targetColor: currentShapeState.color,
        targetCoordinates: newCoordinates,
        lockBlocks: lock,
        callback: () => onUpdateCurrentShapeCoordinate(newCoordinates)
      })
    },
    [
      currentShapeState.blockCoordinates,
      currentShapeState.color,
      onShapeTranslateRepaint,
      onUpdateCurrentShapeCoordinate
    ]
  )

  useShapeMovements({
    boardMatrix,
    currentShapeState,
    onUpdateShapeCoordinate,
    justCollided,
    gameRunning
  })

  const resetAll = useCallback(() => {
    resetBoard()
    onResetQueue()
  }, [onResetQueue, resetBoard])

  const onGameStop = useCallback(() => {
    if (gameRunning) {
      setGameRunning(false)
    }
    // resetAll()
  }, [gameRunning])

  const onGameStart = useCallback(() => {
    if (gameRunning) return

    resetAll()

    setGameRunning(true)
  }, [gameRunning, resetAll])

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
        lockBlocks: lockSankBlocks,
        callback: () =>
          onUpdateCurrentShapeCoordinate(nextShapeStates.blockCoordinates)
      })
    },
    [onShapeTranslateRepaint, onUpdateCurrentShapeCoordinate]
  )

  const checkIsGameOver = useCallback(() => {
    const canSpawnNextShape = checkCanSpawnShape(
      nextShapeState.blockCoordinates,
      boardMatrix
    )

    const overHeight = boardMatrix[4].some(({ locked }) => locked)

    return overHeight || !canSpawnNextShape
  }, [boardMatrix, checkCanSpawnShape, nextShapeState.blockCoordinates])

  const playKeyframe = useCallback(() => {
    if (justCollided) {
      setJustCollided(false)

      const isGameOver = checkIsGameOver()

      if (isGameOver) {
        alert('Game Over')
        return onGameStop()
      }

      dequeueAndEnqueueShapes()
      return
    }

    const currShapeIsAtBottom = currentShapeState.blockCoordinates.some(
      ({ row }) => row === boardMatrix.length - 1
    )

    const hasAdjacentBottomBlock = checkIsAboveABlock(
      currentShapeState.blockCoordinates,
      boardMatrix
    )

    if (hasAdjacentBottomBlock || currShapeIsAtBottom) {
      return setJustCollided(true)
    }

    const sankCurrShapeState = _.cloneDeep(currentShapeState)

    sankCurrShapeState.blockCoordinates =
      sankCurrShapeState.blockCoordinates.map(({ row, col }) => ({
        row: row + 1,
        col
      }))

    const { hasCollision } = checkCollisionStatus({
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
    checkIsGameOver,
    currentShapeState,
    justCollided,
    onGameStop,
    dequeueAndEnqueueShapes,
    sink
  ])

  const onTogglePause = useCallback(() => {
    setGameRunning((val) => !val)
  }, [])

  useInterval(playKeyframe, 1000 * refreshPerSecond, gameRunning)

  return { onGameStart, onGameStop, boardMatrix, onTogglePause }
}
