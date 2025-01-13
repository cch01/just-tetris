import { FormContainer } from 'components/atoms/Form/FormContainer'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'

export const Level: React.FC = observer(() => {
  const {
    tetrisStore: { level }
  } = useStores()
  return (
    <FormContainer title="Level">
      <div className="text-center align-middle">
        <p className="cursor-default select-none text-2xl font-extrabold italic text-secondary md:text-7xl">
          {level}
        </p>
      </div>
    </FormContainer>
  )
})
