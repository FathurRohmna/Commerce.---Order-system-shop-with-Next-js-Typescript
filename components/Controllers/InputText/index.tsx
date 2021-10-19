import React from 'react'

interface Props {
  name?: string
  label?: string
  value?: string
  error?: string | null
  placeholder?: string
  small?: boolean 
  onChange?: () => void
  other?: any
}

const InputText: React.FC<Props> = ({
  name,
  id,
  label,
  type,
  value,
  error,
  small,
  onChange,
  placeholder,
  ...other
}) => {
  return (
    <div className={`${small ? 'my-1' : 'my-4'} relative`}>
      <input 
        className={`leading-10 px-4 ${small ? 'py-2' : 'py-3 mb-2 '} w-full border border-solid border-border rounded-lg focus:outline-none`}
        type={type}
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...other}
      />
      <label htmlFor={id} className="absolute left-0 mx-4 -my-2 top-0 text-xs bg-white px-1 -z-1">{label}</label>
      <p className="text-error">{error}</p>
    </div>
  )
}

export default InputText
