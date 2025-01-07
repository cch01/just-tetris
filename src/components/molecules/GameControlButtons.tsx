import {
  faGear,
  faPause,
  faPlay,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'components/atoms/Button'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'
interface GameControlButtonsProps {
  onToggleModal: () => void
}

export const GameControlButtons: React.FC<GameControlButtonsProps> = observer(
  ({ onToggleModal }) => {
    const {
      tetrisStore: { onGameStart, onPause, onGameReset, gameRunning }
    } = useStores()
    return (
      <div className="grid grid-flow-col gap-2 ">
        <Button isDisabled={gameRunning} onClick={onGameStart}>
          <FontAwesomeIcon
            className={gameRunning ? 'text-tertiary' : 'text-primary'}
            icon={faPlay}
          />
        </Button>
        <Button isDisabled={!gameRunning} onClick={onPause}>
          <FontAwesomeIcon
            className={gameRunning ? 'text-primary' : 'text-tertiary'}
            icon={faPause}
          />
        </Button>
        <Button onClick={onGameReset}>
          <FontAwesomeIcon className="text-primary" icon={faRotateRight} />
        </Button>
        <Button isDisabled={gameRunning} onClick={onToggleModal}>
          <FontAwesomeIcon
            className={gameRunning ? 'text-tertiary' : 'text-primary'}
            icon={faGear}
          />
        </Button>
      </div>
    )
  }
)
