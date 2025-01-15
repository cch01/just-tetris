import { FormContainer } from 'components/atoms/Form/FormContainer'
import React from 'react'

interface ScoreProps {
  score: number
  title: string
  onClear?: () => void
}

export const Score: React.FC<ScoreProps> = ({ score, title, onClear }) => {
  return (
    <FormContainer title={title} onClearSection={onClear}>
      <div className="text-center align-middle">
        <p className="cursor-default select-none text-2xl font-extrabold italic text-highlight md:text-7xl">
          {score}
        </p>
      </div>
    </FormContainer>
  )
}
