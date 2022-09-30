import React from 'react'
import { useGame } from '..'
import PlayersList from '../components/playersList'
import {
  Container,
  Stack,
  Button,
  Title,
  Text,
} from '@mantine/core'

const LobbyStage = () => {
  const { game, socket, isAdmin } = useGame()
  
  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <Container>
      <Stack>
        <Text>
          {game.players?.length < 3
            ? "at least 3 players are required for game to start"
            : isAdmin
              ? "You are good to go!"
              : "Wait for admin to start the game."
          }
        </Text>
        {isAdmin 
          ? <Button 
              onClick={handleStartGame}
              disabled={game.players?.length < 3}
            >
              Start Game
            </Button> 
            
          : null
        }
      </Stack>
    </Container>
  )
}

export default LobbyStage