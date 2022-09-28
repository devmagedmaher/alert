import React from 'react'
import { useGame } from '..'
import PlayersList from '../components/playersList'
import {
  Container,
  Button,
} from '@mantine/core'

const LobbyStage = () => {
  const { game, socket, isAdmin } = useGame()
  
  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <Container>
      {isAdmin ? <Button 
        onClick={handleStartGame}
        disabled={game.players?.length < 2}
      >
        Start Game
      </Button> : null}
      <PlayersList players={game.players} />
    </Container>
  )
}

export default LobbyStage