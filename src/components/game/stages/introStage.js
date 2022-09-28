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
import PlayersList from '../components/playersList'

const IntroStage = () => {
  const navigate = useNavigate()
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
      <Group>
        <p>
          Hello, <b>{name}</b>. Welcome to <b>{room}</b> room
        </p>
      </Group>

      <PlayersList players={game.players} />

      {status ? null : <Button onClick={enterGame} color='teal'>
        Enter Game
      </Button>}
      <Button onClick={exitRoom} color='red'>
        Exit Room
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