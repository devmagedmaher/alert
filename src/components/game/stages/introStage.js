import React from 'react'
import { useGame } from '..'
import {
  Button,
  Group,
  Stack,
  Loader,
  Center,
  Title,
} from '@mantine/core'
import PlayersList from '../components/playersList'

const IntroStage = () => {
  const { room, name, socket, status, setStage, game } = useGame()

  const exitRoom = () => {
    // navigate('/join')
    window.location.href = '/join'
  }

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