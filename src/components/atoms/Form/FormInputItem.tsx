import { useRef } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { CurrencyInputOnChangeValues } from 'react-currency-input-field/dist/components/CurrencyInputProps'

interface FormInputItemProps {
  description: string
  value: string
  suffix?: string
  prefix?: string
  decimalScale?: number
  onValueChange: (
    value: string | undefined,
    name?: string | undefined,
    values?: CurrencyInputOnChangeValues | undefined
  ) => void
  selectOnFocus?: boolean
  disabled?: boolean
  step?: number
  min?: number
  max?: number
}
export const FormInputItem: React.FC<FormInputItemProps> = ({
  suffix,
  prefix,
  description,
  value,
  onValueChange,
  decimalScale = 2,
  selectOnFocus = true,
  disabled,
  step = 1,
  min,
  max
}) => {
  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) =>
    selectOnFocus && e.target.select()

  const currencyInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-base text-secondary">{description}</div>
      <CurrencyInput
        ref={currencyInputRef}
        {...(suffix && { suffix })}
        {...(prefix && { prefix })}
        decimalsLimit={2}
        step={step}
        allowNegativeValue={false}
        onValueChange={onValueChange}
        value={value.replaceAll(',', '')}
        className="w-24 bg-bg-secondary text-right text-lg font-semibold text-primary"
        decimalSeparator="."
        groupSeparator=","
        decimalScale={decimalScale}
        onFocus={handleFocus}
        disabled={disabled}
        min={min}
        max={max}
      />
    </div>
  )
}
