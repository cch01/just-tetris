import { BLOCK_COLOR_SCHEMES, BlockState } from 'constants/block'
import { NON_PLAY_FIELD_BOTTOM_ROW_IDX } from 'constants/gameBoard'
import {
  DIFFICULTY_LEVELUP_FPS_MAP,
  DIFFICULTY_SCORE_THRESHOLD_MAP,
  SCORES,
  SUCCESSIVE_COMBO_BONUS
} from 'constants/scoring'
import { DIFFICULTY_FPS_MAP } from 'constants/userSettings'
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
import { getLocalStorageNumber } from './logics/getLocalStorageNumber'
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
  blockSize: 'sm' | 'md' | 'lg' | 'auto' = 'auto'
  difficulty: 'low' | 'medium' | 'high' = 'medium'
  touchSensitivity: 'low' | 'medium' | 'high' = 'medium'
  private framePerSecond: number
  gameRunning = false
  gameTimer: NodeJS.Timeout | null = null

  highScore = Number(localStorage.getItem('highScore')?.slice(0, -1)) || 0

  boardMatrix: BlockState[][]
  shapeQueue: ShapeProperty[]
  private justCollided = false

  constructor(boardHeight: number, boardWidth: number) {
    this.boardHeight = getLocalStorageNumber('boardHeight', boardHeight)
    this.boardWidth = getLocalStorageNumber('boardWidth', boardWidth)

    this.touchSensitivity =
      (localStorage.getItem('touchSensitivity') as any) || 'medium'
    this.blockSize = (localStorage.getItem('blockSize') as any) || 'auto'
    this.difficulty = (localStorage.getItem('difficulty') as any) || 'medium'

    this.framePerSecond = DIFFICULTY_FPS_MAP[this.difficulty]

    this.boardMatrix = this.generateInitialBoard()
    this.shapeQueue = this.generateInitialQueue()

    makeAutoObservable(this, {}, { autoBind: true })
  }

  private generateInitialBoard(): BlockState[][] {
    return generateBoardMatrix(this.boardHeight + 4, this.boardWidth, 'init')
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

    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem(
        'highScore',
        String(this.highScore + this.difficulty[0].toUpperCase())
      )
    }
  }

  onClearHighScore() {
    localStorage.removeItem('highScore')
    this.highScore = 0
  }

  private checkLevelUp() {
    const threshold = DIFFICULTY_SCORE_THRESHOLD_MAP[this.difficulty]
    const additionalFPS = DIFFICULTY_LEVELUP_FPS_MAP[this.difficulty]
    if (Math.floor(this.score / threshold) > this.level - 1) {
      this.level++
      this.framePerSecond += additionalFPS
      this.onPause()
      this.onGameStart()
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
    localStorage.setItem('boardWidth', width.toString())
  }

  setHeight(height: number) {
    if (!height || height === this.boardHeight) return
    this.boardHeight = height
    this.resetAll()
    localStorage.setItem('boardHeight', height.toString())
  }

  setBlockSize(size: 'sm' | 'md' | 'lg' | 'auto') {
    this.blockSize = size
    localStorage.setItem('blockSize', size)
  }

  setDifficulty(difficulty: 'low' | 'medium' | 'high') {
    this.difficulty = difficulty
    localStorage.setItem('difficulty', difficulty)
    this.framePerSecond = DIFFICULTY_FPS_MAP[difficulty]
  }

  setTouchSensitivity(sensitivity: 'low' | 'medium' | 'high') {
    this.touchSensitivity = sensitivity
    localStorage.setItem('touchSensitivity', sensitivity)
  }
}
