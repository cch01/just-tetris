import { blockColorSchemes, BlockState, ColorKeys } from 'constants/block'
import useInterval from 'hooks/useInterval'
import _ from 'lodash'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { Coordinate, ShapeProperty } from 'types/coordinate'

import {
  checkCanSpawnShape,
  checkHasCollision,
  checkIsOutBound,
  generateBoardMatrix,
  getShapeSpawningPositions,
  onShapeTranslateRepaint
} from './utils'

export const useGameBoard = (
  rowCount = 24,
  colCount = 10,
  refreshPerSecond = 1
) => {
  const [gameStarted, setGameStarted] = useState(false)

  const [justCollided, setJustCollided] = useState(false)

  const [boardMatrix, setBoardMatrix] = useState<BlockState[][]>(
    generateBoardMatrix(rowCount, colCount)
  )

  const shapeSpawningPositions = useMemo(
    () => getShapeSpawningPositions(colCount),
    [colCount]
  )

  const getRandomShape = useCallback(
    () => _.values(shapeSpawningPositions)[Math.floor(Math.random() * 7)],
    [shapeSpawningPositions]
  )

  const [shapeQueue, setShapeQueue] = useState<ShapeProperty[]>([
    getRandomShape(),
    getRandomShape(),
    getRandomShape()
  ])
  const resetAll = useCallback(() => {
    setBoardMatrix(generateBoardMatrix(rowCount, colCount))
    setShapeQueue([getRandomShape(), getRandomShape(), getRandomShape()])
  }, [colCount, getRandomShape, rowCount])

  const onGameStop = useCallback(() => {
    if (gameStarted) {
      setGameStarted(false)
    }
    // resetAll()
  }, [gameStarted])

  const popAndEnqueueShape = useCallback(() => {
    if (!checkCanSpawnShape(shapeQueue[1].blockCoordinates, boardMatrix)) {
      onGameStop()
      console.log('Game Over')
      return
    }

    setShapeQueue((queue) => {
      const queueCp = _.cloneDeep(queue)
      queueCp.shift()

      const newShape = getRandomShape()

      queueCp.push(newShape)

      return queueCp
    })
  }, [boardMatrix, getRandomShape, onGameStop, shapeQueue])

  const onChangeBlocksColor = useCallback(
    (coordinates: Coordinate[], color: ColorKeys) => {
      setBoardMatrix((board) => {
        const boardCp = _.cloneDeep(board)
        coordinates.forEach(({ col, row }) => {
          boardCp[row][col].colorScheme = blockColorSchemes[color]
          boardCp[row][col].occupied = color !== 'gray'
        })

        return boardCp
      })
    },
    [setBoardMatrix]
  )

  const sink = useCallback(() => {
    const prevCoordinates = shapeQueue[0].blockCoordinates

    const targetShapeCoordinates = _.cloneDeep(shapeQueue[0])

    targetShapeCoordinates.blockCoordinates =
      targetShapeCoordinates.blockCoordinates.map(({ row, col }) => ({
        row: row + 1,
        col
      }))

    onShapeTranslateRepaint({
      prevCoordinates,
      setBoardMatrix,
      targetColor: targetShapeCoordinates.color,
      targetCoordinates: targetShapeCoordinates.blockCoordinates
    })

    setShapeQueue((queue) => {
      const queueCp = [...queue]
      queueCp[0] = targetShapeCoordinates
      return queueCp
    })

    const hasCollision = checkHasCollision({
      prevShapeCoordinates: prevCoordinates,
      targetShapeCoordinates: targetShapeCoordinates.blockCoordinates,
      boardMatrix
    })

    return { hasCollision }
  }, [boardMatrix, shapeQueue])

  const playKeyframe = useCallback(() => {
    if (justCollided) {
      setJustCollided(false)
      popAndEnqueueShape()
      return
    }

    const { hasCollision } = sink()

    if (hasCollision) {
      setJustCollided(true)
    }
  }, [justCollided, popAndEnqueueShape, sink])

  const onGameStart = useCallback(() => {
    if (gameStarted) return

    resetAll()

    setGameStarted(true)
  }, [gameStarted, resetAll])

  useInterval(playKeyframe, 1000 * refreshPerSecond, gameStarted)

  return { boardMatrix, onGameStart, shapeQueue, onGameStop }
}
