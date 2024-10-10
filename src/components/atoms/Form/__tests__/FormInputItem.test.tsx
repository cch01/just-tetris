import { render, screen } from '@testing-library/react'

import { FormInputItem } from '../FormInputItem'

const onValueChange = vi.fn()

describe('FormInputItem', () => {
  it('renders correctly', () => {
    render(
      <FormInputItem
        description="description"
        onValueChange={onValueChange}
        value="1000"
      />
    )
    const descriptionDiv = screen.getByText('description')
    expect(descriptionDiv).toBeInTheDocument()
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toHaveValue('1,000.00')
  })

  it('render prefix and suffix', async () => {
    render(
      <FormInputItem
        description="description"
        onValueChange={onValueChange}
        value="1000"
        prefix="$ "
        suffix=" %"
      />
    )
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toHaveValue('$ 1,000.00 %')
  })
})
