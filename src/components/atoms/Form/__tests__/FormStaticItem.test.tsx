import { render, screen } from '@testing-library/react'

import { FormStaticItem } from '../FormStaticItem'

const testDescription = 'test description'

describe('FormStaticItem', () => {
  it('renders properly', () => {
    render(<FormStaticItem description={testDescription} value="test value" />)

    const descriptionElement = screen.getByText(testDescription)
    expect(descriptionElement).toBeInTheDocument()

    const valueElement = screen.getByText(/test value/)
    expect(valueElement).toBeInTheDocument()
  })
})
