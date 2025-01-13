import {
  faGear,
  faPause,
  faPlay,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Button } from 'components/atoms/Button'
import useDimensions from 'hooks/useDimensions'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'
interface GameControlButtonsProps {
  onToggleModal: () => void
}

export const GameControlButtons: React.FC<GameControlButtonsProps> = observer(
  ({ onToggleModal }) => {
    const { isMobile } = useDimensions()
    const {
      tetrisStore: { onGameStart, onPause, onGameReset, gameRunning }
    } = useStores()
    return (
      <div className="grid grid-flow-col gap-2 ">
        <Button
          size={isMobile ? 'sm' : 'md'}
          isDisabled={gameRunning}
          onClick={onGameStart}
        >
          <FontAwesomeIcon
            className={clsx(
              'text-xs md:text-base',
              gameRunning ? 'text-tertiary' : 'text-primary'
            )}
            icon={faPlay}
          />
        </Button>
        <Button
          size={isMobile ? 'sm' : 'md'}
          isDisabled={!gameRunning}
          onClick={onPause}
        >
          <FontAwesomeIcon
            className={clsx(
              'text-xs md:text-base',
              gameRunning ? 'text-primary' : 'text-tertiary'
            )}
            icon={faPause}
          />
        </Button>
        <Button size={isMobile ? 'sm' : 'md'} onClick={onGameReset}>
          <FontAwesomeIcon
            className="text-xs text-primary md:text-base"
            icon={faRotateRight}
          />
        </Button>
        <Button
          size={isMobile ? 'sm' : 'md'}
          isDisabled={gameRunning}
          onClick={onToggleModal}
        >
          <FontAwesomeIcon
            className={clsx(
              'text-xs md:text-base',
              gameRunning ? 'text-tertiary' : 'text-primary'
            )}
            icon={faGear}
          />
        </Button>
      </div>
    )
  }
)
