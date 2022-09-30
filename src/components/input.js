import React from 'react'
import { Input as MantineInput } from '@mantine/core'

const Input = ({
  name,
  label,
  value,
  error,
  size,
  onChange,
  onEnter,
  inputProps,
  wrapperProps,
}) => {

  const handleOnKeyDown = e => {
    if (e.keyCode === 13) {
      onEnter()
    }
  }

  return (
    <MantineInput.Wrapper
      error={error}
      label={label}
      size={size}
      {...wrapperProps}
    >
      <MantineInput
        name={name}
        placeholder={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        invalid={error}
        size={size}
        onKeyDown={handleOnKeyDown}
        {...inputProps}
      />
    </MantineInput.Wrapper>

  )
}

export default Input