import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Input,
  Stack,
} from '@mantine/core';

const JoinPage = () => {
  const navigate = useNavigate()
  const [values, setValues] = React.useState({
    room: '',
    name: localStorage.getItem('name') || '',
  })
  const [errors, setErrors] = React.useState({})

  const validator = () => {
    const e = {}

    if (values.room?.trim() === '') {
      e.room = 'Please enter the room code!'
    }

    if (values.name?.trim() === '') {
      e.name = 'Please enter your name!'
    }

    setErrors(e)

    return Object.keys(e).length > 0
      ? false
      : true
  }

  const goToRoom = () => {
    if (validator()) {
      // clear errors
      setErrors({})

      // store name in local storage
      localStorage.setItem('name', values.name)

      // go to room page
      navigate(`/r/${values.room}`)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    setErrors(e => ({ ...e, [name]: null}))
  }

  return (
    <div className="App">
      <header className="App-header">
        <Stack>
          <Input.Wrapper
            error={errors.room}
            size="lg"
            >
            <Input
              name="room"
              placeholder='Room Code'
              value={values.room}
              onChange={handleChange}
              invalid={errors.room}
              size='lg'
            />
          </Input.Wrapper>

          <Input.Wrapper
            error={errors.name}
            size="lg"
            >
            <Input
              name="name"
              placeholder='Your name'
              value={values.name}
              onChange={handleChange}
              invalid={errors.name}
              size='lg'
            />
          </Input.Wrapper>

          <Button
            onClick={goToRoom}
            size='md'
          >Join</Button>
        </Stack>
      </header>
    </div>
  );
}

export default JoinPage;