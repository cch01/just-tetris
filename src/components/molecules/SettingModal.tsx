import { FormInputItem } from 'components/atoms/Form/FormInputItem'
import { Modal } from 'components/atoms/Modal'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useStores } from 'stores'

interface SettingModalProps {
  isModalOpen: boolean
  onCloseModal: () => void
}

export const SettingModal: React.FC<SettingModalProps> = observer(
  ({ isModalOpen, onCloseModal }) => {
    const {
      tetrisStore: {
        gameTimer,
        boardHeight,
        boardWidth,
        framePerSecond,
        setFramePerSecond,
        setHeight,
        setWidth
      }
    } = useStores()

    const onHandleUserInput = (
      type: 'framePerSecond' | 'boardWidth' | 'boardHeight',
      val: string | undefined
    ) => {
      if (!val) return
      const valInt = Math.floor(Number(val))
      if (Number.isNaN(valInt)) return
      setStates((oldVals) => ({
        ...oldVals,
        [type]: Math.min(valInt, 50)
      }))
    }

    const [states, setStates] = useState({
      boardHeight,
      boardWidth,
      framePerSecond
    })

    useEffect(() => {
      if (!isModalOpen) return
      setStates({
        boardHeight,
        boardWidth,
        framePerSecond
      })
    }, [boardHeight, boardWidth, framePerSecond, isModalOpen])

    const onOk = () => {
      setFramePerSecond(states.framePerSecond)
      setHeight(states.boardHeight)
      setWidth(states.boardWidth)
      onCloseModal()
    }

    return (
      <Modal
        onOk={onOk}
        title="Settings"
        isOpen={isModalOpen}
        onClose={onCloseModal}
      >
        <div className="flex flex-col gap-4">
          <FormInputItem
            description="Width:"
            disabled={!!gameTimer}
            decimalScale={0}
            max={50}
            onValueChange={(val) => onHandleUserInput('boardWidth', val)}
            value={states.boardWidth.toString()}
          />
          <FormInputItem
            description="Height:"
            disabled={!!gameTimer}
            max={50}
            decimalScale={0}
            onValueChange={(val) => onHandleUserInput('boardHeight', val)}
            value={states.boardHeight.toString()}
          />

          <FormInputItem
            description="Speed:"
            disabled={!!gameTimer}
            onValueChange={(val) => onHandleUserInput('framePerSecond', val)}
            value={states.framePerSecond.toString()}
            suffix=" fps"
            decimalScale={0}
            step={1}
          />
        </div>
      </Modal>
    )
  }
)
