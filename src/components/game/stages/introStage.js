import React from 'react'
import { useGame } from '..'
import {
  Button,
  Stack,
  Center,
} from '@mantine/core'

const IntroStage = () => {
  const { socket, status, setStage, game } = useGame()

  const enterGame = () => {
    if (game.started) {
      setStage('game')
    }
    else {
      setStage('lobby')
    }
    socket.emit('enterGame')
  }

  return (
    <Stack>
      <Center>
        {status ? status : null}
      </Center>
      <Button
        onClick={enterGame}
        color='teal'
        disabled={status}
        loading={status === 'loading'}
      >
        Enter the Game
      </Button>
    </Stack>
  )
}

export default IntroStage