import { FormInputItem } from 'components/atoms/Form/FormInputItem'
import { FormSelect } from 'components/atoms/Form/FormSelect'
import { Modal } from 'components/atoms/Modal'
import { Key, useKeyInput } from 'hooks/useKeyInput'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useStores } from 'stores'

interface SettingModalProps {
  isModalOpen: boolean
  onCloseModal: () => void
}

const touchSensitivityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]

const blockSizeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' }
]

export const SettingModal: React.FC<SettingModalProps> = observer(
  ({ isModalOpen, onCloseModal }) => {
    const {
      tetrisStore: {
        gameTimer,
        boardHeight,
        boardWidth,
        setHeight,
        setWidth,
        setBlockSize,
        setTouchSensitivity,
        blockSize,
        touchSensitivity,
        difficulty,
        setDifficulty
      }
    } = useStores()

    const onHandleUserNumberInput = (
      type: 'boardWidth' | 'boardHeight',
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

    const onHandleUserSelectInput = (
      type: 'difficulty' | 'touchSensitivity' | 'blockSize',
      value: string
    ) => {
      setStates((oldVals) => ({
        ...oldVals,
        [type]: value
      }))
    }

    const [states, setStates] = useState({
      boardHeight,
      boardWidth,
      difficulty,
      touchSensitivity,
      blockSize
    })

    useEffect(() => {
      if (!isModalOpen) return
      setStates({
        boardHeight,
        boardWidth,
        touchSensitivity,
        blockSize,
        difficulty
      })
    }, [
      blockSize,
      boardHeight,
      boardWidth,
      difficulty,
      isModalOpen,
      touchSensitivity
    ])

    const onOk = () => {
      if (!isModalOpen) return
      setDifficulty(states.difficulty)
      setHeight(states.boardHeight)
      setWidth(states.boardWidth)
      setTouchSensitivity(states.touchSensitivity)
      setBlockSize(states.blockSize)
      onCloseModal()
    }

    useKeyInput(Key.Enter, onOk)
    useKeyInput(Key.Escape, onCloseModal)

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
            onValueChange={(val) => onHandleUserNumberInput('boardWidth', val)}
            value={states.boardWidth.toString()}
          />
          <FormInputItem
            description="Height:"
            disabled={!!gameTimer}
            max={50}
            decimalScale={0}
            onValueChange={(val) => onHandleUserNumberInput('boardHeight', val)}
            value={states.boardHeight.toString()}
          />

          <FormSelect
            options={touchSensitivityOptions}
            value={states.difficulty}
            onSelect={(selected) =>
              onHandleUserSelectInput('difficulty', selected.value)
            }
            description="Difficulty"
          />
          <FormSelect
            options={touchSensitivityOptions}
            value={states.touchSensitivity}
            onSelect={(selected) =>
              onHandleUserSelectInput('touchSensitivity', selected.value)
            }
            description="Touch Sensitivity"
          />
          <FormSelect
            options={blockSizeOptions}
            value={states.blockSize}
            onSelect={(selected) =>
              onHandleUserSelectInput('blockSize', selected.value)
            }
            description="Block Size"
          />
        </div>
      </Modal>
    )
  }
)
