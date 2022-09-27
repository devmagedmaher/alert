import React from 'react'
import { useGame } from '..'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Group,
  Stack,
  Loader,
  Center,
} from '@mantine/core'

const IntroStage = () => {
  const navigate = useNavigate()
  const { room, name, status, setStage } = useGame()

  const exitRoom = () => {
    navigate('/join')
  }

  const joinGame = () => {
    setStage('start')
  }

  return (
    <Stack>
      <Group>
        <p>
          Hello, <b>{name}</b>. Welcome to <b>{room}</b> room
        </p>
      </Group>
      <Button onClick={joinGame} color='teal'>
        Join game
      </Button>
      <Button onClick={exitRoom} color='red'>
        Exit room
      </Button>

      <Center mt={20}>
        {status === 'loading' ? <Loader /> : null}
      </Center>
      <Center>
        {status}
      </Center>
    </Stack>
  )
}

export default IntroStage