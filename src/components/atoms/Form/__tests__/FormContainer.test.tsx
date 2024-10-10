import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FormContainer } from '../FormContainer'

describe('FormContainer', () => {
  it('renders correctly', () => {
    const title = 'test'

    render(
      <FormContainer title={title}>
        <p>inside</p>
      </FormContainer>
    )
    const headerElement = screen.getByRole('heading', { name: title })
    expect(headerElement).toBeInTheDocument()
    const childrenElement = screen.getByText('inside')
    expect(childrenElement).toBeInTheDocument()
  })

  test('"clearSection" related logics', async () => {
    const user = userEvent.setup()
    const title = 'test'
    const onClearSection = vi.fn()
    render(
      <FormContainer onClearSection={onClearSection} title={title}>
        <p>inside</p>
      </FormContainer>
    )
    const onClearBtn = screen.getByRole('button')
    expect(onClearBtn).toBeInTheDocument()
    await user.click(onClearBtn)
    expect(onClearSection).toBeCalledTimes(1)
  })

  test('"collapse" related logics', async () => {
    const user = userEvent.setup()
    const title = 'test'
    const getIsCollapsed = vi.fn()
    render(
      <FormContainer collapsible getIsCollapsed={getIsCollapsed} title={title}>
        <p>inside</p>
      </FormContainer>
    )
    const collapseBtn = screen.getByRole('button')
    expect(collapseBtn).toBeInTheDocument()
    await user.click(collapseBtn)
    expect(getIsCollapsed).toBeCalledWith(true)
  })
})
