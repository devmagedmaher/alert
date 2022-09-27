import React from 'react'
import { useGame } from '..'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Group,
  Stack,
} from '@mantine/core'

const IntroStage = () => {
  const navigate = useNavigate()
  const { room, name } = useGame()

  const exitRoom = () => {
    navigate('/join')
  }

  return (
    <Stack>
      <Group>
        <p>
          Hello, <b>{name}</b>. Welcome to <b>{room}</b> room
        </p>
      </Group>
      <Button onClick={exitRoom}>
        Exit room
      </Button>
    </Stack>
  )
}

export default IntroStage