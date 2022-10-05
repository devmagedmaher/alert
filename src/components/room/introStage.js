import React from 'react'
import {
  Button,
  Stack,
  Center,
  useMantineTheme,
  Text,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useRoom } from '.'
import PlayersList from './playersList'

const IntroStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { data: room, socket, status } = useRoom()
  const { game } = room

  const enterGame = () => {
    socket.emit('enterGame')
  }

  return (
    <Stack>
      <Center>
        <Text>
          {status ? status : null}
        </Text>
        {game.isFull ? <Text>
          Game is full of players
        </Text> : null}
      </Center>
      <Button
        onClick={enterGame}
        color='teal'
        disabled={status || game.isFull}
        loading={status === 'loading'}
        mb="md"
      >
        Enter the Game
      </Button>

      {sm ? <PlayersList inGameOnly /> : null}
    </Stack>
  )
}

export default IntroStage