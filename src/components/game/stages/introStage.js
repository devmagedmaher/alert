import React from 'react'
import { useGame } from '..'
import { useMediaQuery } from '@mantine/hooks'
import {
  Button,
  Stack,
  Center,
  useMantineTheme,
  Text,
} from '@mantine/core'
import PlayersList from '../components/playersList'

const MAX_PLAYERS = 16

const IntroStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { socket, status, game } = useGame()

  const enterGame = () => {
    socket.emit('enterGame')
  }

  return (
    <Stack>
      <Center>
        <Text>
          {status ? status : null}
        </Text>
        {game.players?.length >= MAX_PLAYERS ? <Text>
          Game is full of players
        </Text> : null}
      </Center>
      <Button
        onClick={enterGame}
        color='teal'
        disabled={status || game.players?.length >= MAX_PLAYERS}
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