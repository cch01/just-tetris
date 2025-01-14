import { GameBoard } from 'components/molecules/GameBoard'
import { GameControlButtons } from 'components/molecules/GameControlButtons'
import { Level } from 'components/molecules/Level'
import { NextBlocks } from 'components/molecules/NextBlocks'
import { Score } from 'components/molecules/Score'
import { SettingModal } from 'components/molecules/SettingModal'
import useDimensions from 'hooks/useDimensions'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import { useTap } from 'hooks/useTap'
import { useTouchMove } from 'hooks/useTouchMove'
import _throttle from 'lodash/throttle'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
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
      touchMoveHorizontal
    }
  } = useStores()

  const { isMobile } = useDimensions()

  useKeyInput(Key.ArrowUp, () => {
    rotateShape('clockwise')
  })

  const throttledMove = useCallback(
    _throttle(moveBlock, 100, { leading: true, trailing: false }),
    [hardDrop]
  )

  useKeyInput(Key.ArrowLeft, () => throttledMove('left'))

  useKeyInput(Key.ArrowRight, () => throttledMove('right'))

  useKeyInput(Key.ArrowDown, hardDrop)

  const throttledHardDrop = useCallback(
    _throttle(hardDrop, 500, { leading: true, trailing: false }),
    [hardDrop]
  )
  useTouchMove(
    boardWidth,
    shapeQueue[0].blockCoordinates,
    touchMoveHorizontal,
    throttledHardDrop
  )

  const onTap = useCallback(() => {
    rotateShape('clockwise')
  }, [rotateShape])

  useTap(onTap)

  useEffect(() => {
    if (isMobile) {
      setWidth(12)
    }
  }, [isMobile, setWidth])

  return (
    <>
      <img src="./tetris_banner.png" className="m-auto max-h-40" />

      <div className="flex flex-row flex-wrap items-center justify-center overflow-hidden md:mt-20 md:gap-8">
        {isMobile && (
          <div className="grid w-full gap-2 p-2">
            <div className="grid grid-flow-col grid-cols-2 gap-4">
              <Score />
              <Level />
            </div>

            <div>
              <NextBlocks />
            </div>
          </div>
        )}

        <GameBoard />
        {!isMobile && (
          <div className="flex flex-col justify-between gap-4">
            <NextBlocks />

            <Score />

            <Level />

            <GameControlButtons onToggleModal={onToggleModal} />
          </div>
        )}
        {isMobile && (
          <div className="w-full p-2">
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
