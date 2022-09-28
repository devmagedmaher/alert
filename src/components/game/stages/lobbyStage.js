import React from 'react'
import { useGame } from '..'
import PlayersList from '../components/playersList'
import {
  Container,
  Stack,
  Button,
} from '@mantine/core'

const LobbyStage = () => {
  const { game, socket, isAdmin } = useGame()
  
  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <Container>
      <Stack>
        <PlayersList />
        {isAdmin ? <Button 
          onClick={handleStartGame}
          disabled={game.players?.length < 3}
        >
          New Game
        </Button> : null}
      </Stack>
    </Container>
  )
}

export default LobbyStage