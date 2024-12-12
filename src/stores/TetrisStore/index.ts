import { blockColorSchemes, BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import { makeAutoObservable } from 'mobx'
import { RefreshBoardInputs } from 'types/gameBoard'
import { Coordinate, ShapeProperty } from 'types/shape'

import {
  burstAndInsertBlankLines,
  checkBurstedRows,
  checkIsGameOver,
  generateBoardMatrix,
  getRandomShape
} from './logics/gameBoard'
import { moveHorizontalLogics } from './logics/moveHorizontal'
import { moveBottomLogics } from './logics/moveToBottom'
import { rotateShapeLogics } from './logics/rotate'
import { sinkLogics } from './logics/sink'

export class TetrisStore {
  constructor(boardHeight = 24, boardWidth = 10, framePerSecond = 5) {
    this.boardHeight = boardHeight
    this.boardWidth = boardWidth
    this.framePerSecond = framePerSecond
    this.resetAll()
    makeAutoObservable(this, {}, { autoBind: true })
  }

  private justCollided = false

  boardHeight = 24
  boardWidth = 10
  gameRunning = false
  framePerSecond = 1
  gameTimer: NodeJS.Timeout | null = null

  boardMatrix: BlockState[][] = generateBoardMatrix(
    this.boardHeight,
    this.boardWidth,
    'init'
  )

  shapeQueue: ShapeProperty[] = [
    getRandomShape(this.boardWidth),
    getRandomShape(this.boardWidth),
    getRandomShape(this.boardWidth)
  ]

  private resetAll() {
    this.boardMatrix = generateBoardMatrix(
      this.boardHeight,
      this.boardWidth,
      'init'
    )
    this.resetQueue()
  }

  private refreshBoard({
    prevCoordinates,
    targetColor,
    targetCoordinates,
    lockBlocks
  }: RefreshBoardInputs) {
    const targetPositionBlocked = targetCoordinates.some(
      ({ row, col }) => this.boardMatrix[row][col].locked
    )

    if (targetPositionBlocked) return

    for (const { col, row } of prevCoordinates) {
      const unSeenRow = row <= NON_PLAY_FIELD_BOTTOM_ROW_IDX

      this.boardMatrix[row][col].colorScheme = unSeenRow
        ? blockColorSchemes.transparent
        : blockColorSchemes.gray
      this.boardMatrix[row][col].occupied = false
    }

    for (const { col, row } of targetCoordinates) {
      this.boardMatrix[row][col].colorScheme = blockColorSchemes[targetColor]
      this.boardMatrix[row][col].occupied = ['gray', 'transparent'].some(
        (color) => color !== targetColor
      )
      if (lockBlocks) this.boardMatrix[row][col].locked = true
    }

    this.updateCurrentShapeCoordinate(targetCoordinates)
  }

  private lockAllOccupiedBlocks() {
    this.boardMatrix.forEach((row) =>
      row.forEach((block) => {
        if (block.occupied) block.locked = true
      })
    )
  }

  private updateCurrentShapeCoordinate(targetCoordinate: Coordinate[]) {
    this.shapeQueue[0].blockCoordinates = targetCoordinate
  }

  private resetQueue() {
    this.shapeQueue = [
      getRandomShape(this.boardWidth),
      getRandomShape(this.boardWidth),
      getRandomShape(this.boardWidth)
    ]
  }

  private dequeueAndEnqueueShapes() {
    this.shapeQueue.shift()

    const newShape = getRandomShape(this.boardWidth)

    this.shapeQueue.push(newShape)
  }

  rotateShape(direction: 'clockwise' | 'counterclockwise') {
    const currentShapeState = this.shapeQueue[0]

    if (
      currentShapeState.name === 'OShape' ||
      this.justCollided ||
      !this.gameRunning
    ) {
      return
    }

    const prevCoordinates = this.shapeQueue[0].blockCoordinates

    const { rotated, rotatedCoordinates } = rotateShapeLogics(
      direction,
      currentShapeState,
      this.boardMatrix
    )

    if (!rotated) return

    this.refreshBoard({
      prevCoordinates,
      targetColor: currentShapeState.color,
      targetCoordinates: rotatedCoordinates,
      lockBlocks: false
    })
  }

  moveBlock(direction: 'left' | 'right') {
    if (!this.gameRunning || this.justCollided) return

    const currentShapeState = this.shapeQueue[0]

    const prevCoordinates = this.shapeQueue[0].blockCoordinates

    const { moved, movedCoordinations } = moveHorizontalLogics(
      direction,
      currentShapeState,
      this.boardMatrix
    )

    if (!moved) return

    this.refreshBoard({
      prevCoordinates,
      targetColor: currentShapeState.color,
      targetCoordinates: movedCoordinations,
      lockBlocks: false
    })
  }

  moveBottom() {
    if (!this.gameRunning || this.justCollided) return

    const newCoordinates = moveBottomLogics(
      this.shapeQueue[0].blockCoordinates,
      this.boardMatrix
    )

    this.refreshBoard({
      lockBlocks: true,
      prevCoordinates: this.shapeQueue[0].blockCoordinates,
      targetColor: this.shapeQueue[0].color,
      targetCoordinates: newCoordinates
    })

    this.justCollided = true
  }

  onCollided() {
    this.justCollided = true
  }

  sink() {
    if (this.justCollided) {
      this.justCollided = false

      this.lockAllOccupiedBlocks()

      const burstedRowIdxs = checkBurstedRows(this.boardMatrix)

      if (burstedRowIdxs.length) {
        const newBoard = burstAndInsertBlankLines(
          this.boardMatrix,
          burstedRowIdxs
        )
        this.boardMatrix = newBoard
      }

      const nextShape = this.shapeQueue[1].blockCoordinates

      const isGameOver = checkIsGameOver(nextShape, this.boardMatrix)

      if (isGameOver) {
        alert('Game Over')
        return this.onGameReset()
      }

      this.dequeueAndEnqueueShapes()
      return
    }

    const currentShapeState = this.shapeQueue[0]

    const response = sinkLogics(
      currentShapeState,
      this.boardMatrix,
      this.onCollided
    )

    if (!response) return

    const { lockBlocks, sankCurrShapeState } = response

    this.refreshBoard({
      prevCoordinates: currentShapeState.blockCoordinates,
      targetCoordinates: sankCurrShapeState.blockCoordinates,
      targetColor: sankCurrShapeState.color,
      lockBlocks
    })
  }

  setWidth(width: number) {
    if (!width) return
    this.boardWidth = width
    this.resetAll()
  }

  setHeight(height: number) {
    if (!height) return
    this.boardHeight = height
    this.resetAll()
  }

  setFramePerSecond(fps: number) {
    if (!fps) return
    this.framePerSecond = fps
  }

  onGameReset() {
    this.gameRunning = false
    this.gameTimer && clearInterval(this.gameTimer)
    this.gameTimer = null
    this.resetAll()
  }

  onGameStart() {
    if (this.gameRunning) return

    this.gameRunning = true
    this.gameTimer = setInterval(() => {
      this.sink()
    }, 1000 / this.framePerSecond)
  }

  onPause() {
    if (!this.gameRunning) return
    if (this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
    }
    this.gameRunning = false
    return
  }
}
