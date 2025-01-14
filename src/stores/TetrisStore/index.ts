import { BLOCK_COLOR_SCHEMES, BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import {
  LEVEL_UP_SCORE_THRESHOLD,
  SCORES,
  SUCCESSIVE_COMBO_BONUS
} from 'constants/scoring'
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
import { getHardDropCoordinates } from './logics/hardDrop'
import { moveHorizontalLogics } from './logics/moveHorizontal'
import { rotateShapeLogics } from './logics/rotate'
import { sinkLogics } from './logics/sink'

export class TetrisStore {
  score = 0
  combo = 0
  level = 1
  boardHeight: number
  boardWidth: number
  framePerSecond: number
  userSelectedFramePerSecond: number
  gameRunning = false
  gameTimer: NodeJS.Timeout | null = null

  boardMatrix: BlockState[][]
  shapeQueue: ShapeProperty[]
  private justCollided = false

  constructor(boardHeight: number, boardWidth: number, framePerSecond: number) {
    this.boardHeight = boardHeight
    this.boardWidth = boardWidth
    this.framePerSecond = framePerSecond
    this.userSelectedFramePerSecond = framePerSecond
    this.boardMatrix = this.generateInitialBoard()
    this.shapeQueue = this.generateInitialQueue()

    makeAutoObservable(this, {}, { autoBind: true })
  }

  private generateInitialBoard(): BlockState[][] {
    return generateBoardMatrix(this.boardHeight, this.boardWidth, 'init')
  }

  private generateInitialQueue(): ShapeProperty[] {
    return [
      getRandomShape(this.boardWidth),
      getRandomShape(this.boardWidth),
      getRandomShape(this.boardWidth)
    ]
  }

  private resetAll() {
    this.boardMatrix = this.generateInitialBoard()
    this.shapeQueue = this.generateInitialQueue()
    this.score = 0
    this.combo = 0
    this.level = 1
    this.justCollided = false
  }

  private refreshBoard({
    prevCoordinates,
    targetColor,
    targetCoordinates
  }: RefreshBoardInputs) {
    if (this.isPositionBlocked(targetCoordinates)) return

    this.clearPreviousCoordinates(prevCoordinates)
    this.removeAllShadows()
    this.showHardDropShadow(targetCoordinates)
    this.updateBoardWithNewCoordinates(targetCoordinates, targetColor)
    this.updateCurrentShapeCoordinates(targetCoordinates)
  }

  private isPositionBlocked(targetCoordinates: Coordinate[]): boolean {
    return targetCoordinates.some(
      ({ row, col }) => this.boardMatrix[row][col].locked
    )
  }

  private clearPreviousCoordinates(prevCoordinates: Coordinate[]) {
    for (const { row, col } of prevCoordinates) {
      const isAboveVisibleField = row <= NON_PLAY_FIELD_BOTTOM_ROW_IDX
      this.boardMatrix[row][col].colorScheme = isAboveVisibleField
        ? BLOCK_COLOR_SCHEMES.transparent
        : BLOCK_COLOR_SCHEMES.gray
      this.boardMatrix[row][col].occupied = false
    }
  }

  private removeAllShadows() {
    this.boardMatrix.forEach((row) =>
      row.forEach((block) => {
        if (block.colorScheme.schemeName === 'shadow') {
          block.colorScheme = BLOCK_COLOR_SCHEMES.gray
        }
      })
    )
  }

  private showHardDropShadow(targetCoordinates: Coordinate[]) {
    const hardDropCoords = getHardDropCoordinates(
      targetCoordinates,
      this.boardMatrix
    )
    for (const { row, col } of hardDropCoords) {
      this.boardMatrix[row][col].colorScheme = BLOCK_COLOR_SCHEMES.shadow
    }
  }

  private updateBoardWithNewCoordinates(
    targetCoordinates: Coordinate[],
    targetColor: string
  ) {
    for (const { row, col } of targetCoordinates) {
      this.boardMatrix[row][col].colorScheme =
        BLOCK_COLOR_SCHEMES[targetColor as keyof typeof BLOCK_COLOR_SCHEMES]
      this.boardMatrix[row][col].occupied = true
    }
  }

  private updateCurrentShapeCoordinates(targetCoordinates: Coordinate[]) {
    this.shapeQueue[0].blockCoordinates = targetCoordinates
  }

  private lockAllOccupiedBlocks() {
    this.boardMatrix.forEach((row) =>
      row.forEach((block) => {
        if (block.occupied) block.locked = true
      })
    )
  }

  private handleRowClearing() {
    const burstedRows = checkBurstedRows(this.boardMatrix)
    if (burstedRows.length) {
      this.boardMatrix = burstAndInsertBlankLines(this.boardMatrix, burstedRows)
      this.updateScore(burstedRows.length)
      this.combo++
      this.checkLevelUp()
    } else {
      this.combo = 0
    }
  }

  private updateScore(clearedRows: number) {
    this.score +=
      (SCORES[clearedRows] || SCORES[4]) + this.combo * SUCCESSIVE_COMBO_BONUS
  }

  private checkLevelUp() {
    if (Math.floor(this.score / LEVEL_UP_SCORE_THRESHOLD) > this.level) {
      this.level++
      this.framePerSecond += 1.5
    }
  }

  private dequeueAndEnqueueShapes() {
    this.shapeQueue.shift()
    this.shapeQueue.push(getRandomShape(this.boardWidth))
  }

  rotateShape(direction: 'clockwise' | 'counterclockwise') {
    if (
      !this.gameRunning ||
      this.justCollided ||
      this.shapeQueue[0].name === 'OShape'
    )
      return

    const prevCoordinates = this.shapeQueue[0].blockCoordinates
    const { rotated, rotatedCoordinates } = rotateShapeLogics(
      direction,
      this.shapeQueue[0],
      this.boardMatrix
    )
    if (!rotated) return

    this.refreshBoard({
      prevCoordinates,
      targetColor: this.shapeQueue[0].color,
      targetCoordinates: rotatedCoordinates
    })
  }

  moveBlock(direction: 'left' | 'right', distance = 1) {
    if (!this.gameRunning || this.justCollided) return

    const prevCoordinates = this.shapeQueue[0].blockCoordinates
    const { moved, movedCoordinations } = moveHorizontalLogics(
      direction,
      this.shapeQueue[0],
      this.boardMatrix,
      distance
    )

    if (!moved) return

    this.refreshBoard({
      prevCoordinates,
      targetColor: this.shapeQueue[0].color,
      targetCoordinates: movedCoordinations
    })
  }

  hardDrop() {
    if (!this.gameRunning || this.justCollided) return

    const hardDropCoords = getHardDropCoordinates(
      this.shapeQueue[0].blockCoordinates,
      this.boardMatrix
    )
    this.refreshBoard({
      prevCoordinates: this.shapeQueue[0].blockCoordinates,
      targetColor: this.shapeQueue[0].color,
      targetCoordinates: hardDropCoords
    })
    this.justCollided = true
  }

  sink() {
    if (this.justCollided) {
      this.justCollided = false
      this.lockAllOccupiedBlocks()
      this.handleRowClearing()
      if (
        checkIsGameOver(this.shapeQueue[1].blockCoordinates, this.boardMatrix)
      ) {
        alert('Game Over')
        this.onGameReset()
        return
      }
      this.dequeueAndEnqueueShapes()
      return
    }

    const sankResult = sinkLogics(
      this.shapeQueue[0],
      this.boardMatrix,
      this.onCollided
    )

    if (!sankResult) return

    this.refreshBoard({
      prevCoordinates: this.shapeQueue[0].blockCoordinates,
      targetColor: sankResult.sankCurrShapeState.color,
      targetCoordinates: sankResult.sankCurrShapeState.blockCoordinates
    })
  }
  private onCollided() {
    this.justCollided = true
  }

  onGameReset() {
    this.gameRunning = false
    if (this.gameTimer) clearInterval(this.gameTimer)
    this.gameTimer = null
    this.resetAll()
  }

  onGameStart() {
    if (this.gameRunning) return

    this.gameRunning = true
    this.gameTimer = setInterval(() => this.sink(), 1000 / this.framePerSecond)
  }

  onPause() {
    if (this.gameRunning && this.gameTimer) {
      clearInterval(this.gameTimer)
      this.gameTimer = null
      this.gameRunning = false
    }
  }

  touchMoveHorizontal(targetCoordinates: Coordinate[]) {
    if (!this.gameRunning || this.justCollided) return

    this.refreshBoard({
      prevCoordinates: this.shapeQueue[0].blockCoordinates,
      targetColor: this.shapeQueue[0].color,
      targetCoordinates
    })
  }

  setWidth(width: number) {
    if (!width || width === this.boardWidth) return
    this.boardWidth = width
    this.resetAll()
  }

  setHeight(height: number) {
    if (!height || height === this.boardHeight) return
    this.boardHeight = height
    this.resetAll()
  }

  setFramePerSecond(fps: number) {
    if (!fps || fps === this.userSelectedFramePerSecond) return
    this.framePerSecond = fps
    this.userSelectedFramePerSecond = fps
  }
}
