import { GameBoard } from 'components/molecules/GameBoard'
import { GameControlButtons } from 'components/molecules/GameControlButtons'
import { Level } from 'components/molecules/Level'
import { NextBlocks } from 'components/molecules/NextBlocks'
import { Score } from 'components/molecules/Score'
import { SettingModal } from 'components/molecules/SettingModal'
import { MIN_HEIGHT, MIN_WIDTH } from 'constants/gameBoard'
import { TOUCH_SENSITIVITY_LEVELS } from 'constants/userSettings'
import useDimensions from 'hooks/useDimensions'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import useOutOfBounds from 'hooks/useOutOfBounds'
import { useTap } from 'hooks/useTap'
import { useTouchMove } from 'hooks/useTouchMove'
import _throttle from 'lodash/throttle'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import { useStores } from 'stores'

const App = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const onToggleModal = useCallback(
    () => setIsModalOpen((val) => !val),
    [setIsModalOpen]
  )
  const {
    tetrisStore: {
      rotateShape,
      moveBlock,
      hardDrop,
      setWidth,
      boardWidth,
      shapeQueue,
      touchMoveHorizontal,
      score,
      highScore,
      onClearHighScore,
      boardHeight,
      setHeight,
      onPause,
      onGameStart,
      gameRunning,
      touchSensitivity,
      blockSize,
      difficulty
    }
  } = useStores()

  const { isMobile } = useDimensions()
  const ref = useOutOfBounds({
    onOutOfBoundY: () => setHeight(Math.max(MIN_HEIGHT, boardHeight - 1)),
    onOutOfBoundX: () => setWidth(Math.max(MIN_WIDTH, boardWidth - 1)),
    offsetY: isMobile ? -65 : -20,
    offsetX: isMobile ? -10 : -20
  })

  useKeyInput(Key.ArrowUp, () => {
    rotateShape('clockwise')
  })

  const throttledMove = useCallback(
    _throttle(moveBlock, 50, { leading: true, trailing: false }),
    [hardDrop]
  )

  useKeyInput(Key.ArrowLeft, () => throttledMove('left'))

  useKeyInput(Key.ArrowRight, () => throttledMove('right'))

  useKeyInput(Key.ArrowDown, hardDrop)
  useKeyInput(Key.Space, gameRunning ? onPause : onGameStart)

  const throttledHardDrop = useCallback(
    _throttle(hardDrop, 500, { leading: true, trailing: false }),
    [hardDrop]
  )

  useTouchMove(
    boardWidth,
    shapeQueue[0].blockCoordinates,
    touchMoveHorizontal,
    throttledHardDrop,
    TOUCH_SENSITIVITY_LEVELS[touchSensitivity]
  )

  const onTap = useCallback(() => {
    rotateShape('clockwise')
  }, [rotateShape])

  useTap(onTap)

  const userSelectedBlockSize = useMemo(() => {
    if (blockSize === 'auto') {
      return isMobile ? 'sm' : 'lg'
    }
    return blockSize
  }, [blockSize, isMobile])

  const highScoreString = highScore + difficulty[0].toUpperCase()

  return (
    <>
      <img src="./tetris_banner.png" className="m-auto max-h-14 md:max-h-20" />

      <div className="flex flex-row flex-wrap items-center justify-center overflow-hidden md:mt-8 md:flex-nowrap md:gap-8">
        {isMobile && (
          <div className="grid w-full gap-2 p-2">
            <div className="grid grid-flow-col grid-cols-2 gap-2">
              <div className="grid grid-flow-col grid-cols-2 gap-2">
                <Score title="Score" score={score} />
                <Score
                  title="High Score"
                  score={highScoreString}
                  onClear={onClearHighScore}
                />
              </div>
              <Level />
            </div>

            <div>
              <NextBlocks />
            </div>
          </div>
        )}

        <GameBoard ref={ref} blockSize={userSelectedBlockSize} />
        {!isMobile && (
          <div className="flex flex-col justify-between gap-2">
            <NextBlocks />
            <div className="grid grid-flow-col grid-cols-2  gap-2">
              <Score title="Score" score={score} />
              <Score
                title="High Score"
                onClear={onClearHighScore}
                score={highScoreString}
              />
            </div>
            <Level />

            <GameControlButtons onToggleModal={onToggleModal} />
          </div>
        )}
        {isMobile && (
          <div className="absolute bottom-4 w-full p-2">
            <GameControlButtons onToggleModal={onToggleModal} />
          </div>
        )}
      </div>
      <SettingModal
        onCloseModal={() => setIsModalOpen(false)}
        isModalOpen={isModalOpen}
      />
    </>
  )
})

export default App
