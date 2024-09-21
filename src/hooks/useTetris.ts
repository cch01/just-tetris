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
  const [gameRunning, setGameRunning] = useState(false)

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
        lockBlocks: lockSankBlocks
      })

      onUpdateCurrentShapeCoordinate(nextShapeStates.blockCoordinates)
    },
    [onShapeTranslateRepaint, onUpdateCurrentShapeCoordinate]
  )

  const checkIsGameOver = useCallback(() => {
    const canSpawnNextShape = checkCanSpawnShape(
      nextShapeState.blockCoordinates,
      boardMatrix
    )

    const overHeight = boardMatrix[4].some(({ locked }) => locked)

    console.log({ canSpawnNextShape, overHeight, boardMatrix })

    if (overHeight) console.log(JSON.stringify(boardMatrix[4], undefined, 2))

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
      console.log('just collided, locking')
    }

    const lockBlocks = hasCollision

    sink(currentShapeState, sankCurrShapeState, lockBlocks)
  }, [
    boardMatrix,
    checkIsGameOver,
    currentShapeState,
    justCollided,
    onGameStop,
    popAndEnqueueShape,
    sink
  ])

  const onTogglePause = useCallback(() => {
    setGameRunning((val) => !val)
  }, [])

  useInterval(playKeyframe, 1000 * refreshPerSecond, gameRunning)

  return { onGameStart, onGameStop, boardMatrix, onTogglePause }
}
