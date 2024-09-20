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

import { checkIsOutBound, getShapeSpawningPositions } from './utils'

const generateBoardMatrix = (rowCount = 24, colCount = 10): BlockState[][] => {
  const board = []

  for (let r = 0; r < rowCount; r++) {
    const row = []
    const colorScheme =
      r < 4 ? blockColorSchemes.transparent : blockColorSchemes.gray

    for (let c = 0; c < colCount; c++) {
      row.push({
        occupied: false,
        colorScheme
      })
    }
    board.push(row)
  }

  return board
}

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

  const checkCanSpawnShape = useCallback(
    (coordinates: Coordinate[]) => {
      const collideAtSpawn = coordinates.some(
        ({ col, row }) => boardMatrix[row][col].occupied
      )
      return !collideAtSpawn
    },
    [boardMatrix]
  )

  const popAndEnqueueShape = useCallback(() => {
    setShapeQueue((queue) => {
      const newShape = getRandomShape()
      if (!checkCanSpawnShape(newShape.blockCoordinates)) {
        onGameStop()
        console.log('Game Over')
        return queue
      }

      const queueCp = _.cloneDeep(queue)
      queueCp.shift()
      queueCp.push(newShape)

      return queueCp
    })
  }, [checkCanSpawnShape, getRandomShape, onGameStop])

  const checkHasCollision = useCallback(
    (
      prevShapeCoordinates: Coordinate[],
      targetShapeCoordinates: Coordinate[]
    ) => {
      const hasCollision = targetShapeCoordinates.some(
        ({ row: targetRow, col: targetCol }) => {
          const previouslyOccupied = prevShapeCoordinates.some(
            ({ row: prevRow, col: prevCol }) =>
              prevRow === targetRow && prevCol === targetCol
          )

          if (previouslyOccupied) return

          if (boardMatrix[targetRow + 1]?.[targetCol].occupied) return true

          if (targetRow === rowCount - 1) return true
        }
      )

      return hasCollision
    },
    [boardMatrix, rowCount]
  )

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

  const onShapeTranslateRepaint = useCallback(
    (
      targetCoordinates: Coordinate[],
      targetColor: ColorKeys,
      prevCoordinates: Coordinate[]
    ) => {
      setBoardMatrix((board) => {
        const boardCp = _.cloneDeep(board)

        prevCoordinates.forEach(({ col, row }) => {
          if (row <= 3) return
          boardCp[row][col].colorScheme = blockColorSchemes.gray
          boardCp[row][col].occupied = false
        })

        targetCoordinates.forEach(({ col, row }) => {
          console.log('painting', { col, row })
          boardCp[row][col].colorScheme = blockColorSchemes[targetColor]
          boardCp[row][col].occupied = ['gray', 'transparent'].some(
            (color) => color !== targetColor
          )
        })

        return boardCp
      })
    },
    [setBoardMatrix]
  )

  const sink = useCallback(() => {
    console.log('Sink')
    const prevCoordinates = shapeQueue[0].blockCoordinates

    const targetShapeCoordinates = _.cloneDeep(shapeQueue[0])

    targetShapeCoordinates.blockCoordinates =
      targetShapeCoordinates.blockCoordinates.map(({ row, col }) => ({
        row: row + 1,
        col
      }))

    console.log({ prevCoordinates, targetShapeCoordinates })

    onShapeTranslateRepaint(
      targetShapeCoordinates.blockCoordinates,
      targetShapeCoordinates.color,
      prevCoordinates
    )

    setShapeQueue((queue) => {
      const queueCp = [...queue]
      queueCp[0] = targetShapeCoordinates
      return queueCp
    })

    const hasCollision = checkHasCollision(
      prevCoordinates,
      targetShapeCoordinates.blockCoordinates
    )

    console.log({ hasCollision })

    return { hasCollision }
  }, [checkHasCollision, onShapeTranslateRepaint, shapeQueue])

  const sinkIntervalFn = useCallback(() => {
    if (justCollided) {
      console.log('just collision')
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

  useInterval(sinkIntervalFn, 100 * refreshPerSecond, gameStarted)

  return { boardMatrix, onGameStart, sinkIntervalFn, shapeQueue, onGameStop }
}
