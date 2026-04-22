import React from 'react'

type LabeledFieldProps = {
  label: string
  htmlFor: string
  children: React.ReactNode
}

export const LabeledField: React.FC<LabeledFieldProps> = ({
  label,
  htmlFor,
  children,
}) => (
  <div className='flex flex-col gap-2'>
    <label
      className='font-label-caps text-label-caps text-on-surface-variant'
      htmlFor={htmlFor}
    >
      {label}
    </label>
    {children}
  </div>
)
