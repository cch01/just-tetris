import { memo, useCallback } from 'react'

export type SelectOption = {
  label: string
  value: string
}

interface FormSelectProps {
  options: SelectOption[]
  value: string
  disabled?: boolean
  onSelect: (option: SelectOption) => void
  description?: string
}

export const FormSelect: React.FC<FormSelectProps> = memo(
  ({ onSelect, options, value, disabled, description }) => {
    const _onSelect = useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        const selectedOption =
          options.find(({ value: _value }) => _value === selectedValue) ||
          options[0]
        return onSelect(selectedOption)
      },
      [onSelect, options]
    )

    return (
      <div className="flex w-full flex-row items-center justify-between gap-2">
        {description && (
          <div className="text-base text-secondary">{description}</div>
        )}
        <div className=" min-w-[200px] max-w-sm">
          <div className="relative">
            <select
              onChange={_onSelect}
              value={value}
              disabled={disabled}
              className="ease w-full cursor-pointer appearance-none rounded border border-tertiary bg-transparent py-1.5 pl-3 pr-8 text-sm text-primary shadow-sm transition duration-300 placeholder:text-secondary hover:border-secondary focus:border-highlight focus:shadow-md focus:outline-none"
            >
              {options.map((option) => (
                <option
                  className="bg-bg-tertiary"
                  key={`form-select-option-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="absolute right-2.5 top-2 ml-1 size-5 text-slate-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
