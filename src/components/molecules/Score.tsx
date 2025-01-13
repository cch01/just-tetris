import { FormContainer } from 'components/atoms/Form/FormContainer'
import { observer } from 'mobx-react-lite'
import { useStores } from 'stores'

export const Score: React.FC = observer(() => {
  const {
    tetrisStore: { score }
  } = useStores()

  return (
    <FormContainer title="Score">
      <div className="text-center align-middle">
        <p className="cursor-default select-none text-2xl font-extrabold italic text-highlight md:text-7xl">
          {score}
        </p>
      </div>
    </FormContainer>
  )
})
