import React from 'react'

import { formInputClass } from './form-input-classes'

type TextInputProps = {
  id: string
  name: string
  autoComplete?: string
  autoFocus?: boolean
  placeholder?: string
  value: string | number
  onChange: React.ChangeEventHandler<HTMLInputElement>
  type?: React.HTMLInputTypeAttribute
  step?: string
  className?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  className = '',
  type = 'text',
  ...props
}) => (
  <input
    className={`${formInputClass} px-4 ${className}`.trim()}
    type={type}
    {...props}
  />
)
