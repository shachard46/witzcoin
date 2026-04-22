import React from 'react'

import { formInputClass } from './form-input-classes'

type IconTextInputProps = {
  id: string
  name: string
  autoComplete?: string
  autoFocus?: boolean
  placeholder?: string
  value: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  icon: React.ReactNode
}

export const IconTextInput: React.FC<IconTextInputProps> = ({
  icon,
  id,
  ...inputProps
}) => (
  <div className='relative'>
    <span
      className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-tertiary'
      aria-hidden
    >
      {icon}
    </span>
    <input
      id={id}
      className={`${formInputClass} pl-10 pr-4`}
      type='text'
      {...inputProps}
    />
  </div>
)
