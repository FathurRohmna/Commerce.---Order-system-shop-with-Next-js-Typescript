import react, { useState } from 'react'

export function useForm(initialOfValues: any) {

  const [values, setValues] = useState<any>(initialOfValues)
  
  const handleInputChange = (event: React.ChangeEvent) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  const resetForm = () => {
    setValues(initialOfValues)
  }

  return {
    values,
    setValues,
    resetForm,
    handleInputChange
  }
}

interface Props {
  children: React.ReactNode
  other: any 
}

export function Form(props: Props) {

  const classes = useStyles()
  const { children, ...other } = props

  return (
    <form autoComplete="off" { ...other }>
      {children}
    </form>
  )
}

