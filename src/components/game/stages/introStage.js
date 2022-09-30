import React from 'react'
import { useGame } from '..'
import { useMediaQuery } from '@mantine/hooks'
import {
  Button,
  Stack,
  Center,
  useMantineTheme,
} from '@mantine/core'
import PlayersList from '../components/playersList'

const IntroStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
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
        mb="md"
      >
        Enter the Game
      </Button>

      {sm ? <PlayersList /> : null}
    </Stack>
  )
}

export default IntroStage