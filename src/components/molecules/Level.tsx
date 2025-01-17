import { FormContainer } from 'components/atoms/Form/FormContainer'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'

export const Level: React.FC = observer(() => {
  const {
    tetrisStore: { level }
  } = useStores()
  return (
    <FormContainer title="Level">
      <div className="align-middle">
        <p className="cursor-default select-none text-center text-lg font-extrabold italic text-secondary md:text-3xl">
          {level}
        </p>
      </div>
    </FormContainer>
  )
})
