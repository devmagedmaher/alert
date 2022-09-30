import React from 'react'
import { useGame } from '..'
import { useMediaQuery } from '@mantine/hooks'
import {
  Container,
  Stack,
  Button,
  Text,
  useMantineTheme,
} from '@mantine/core'
import PlayersList from '../components/playersList'

const LobbyStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { game, socket, isAdmin } = useGame()
  
  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <Container>
      <Stack>
        <Text align='center'>
          {game.players?.length < 3
            ? "Minimum 3 players are required for game to start"
            : isAdmin
              ? "You are good to go!"
              : "Wait for admin to start the game."
          }
        </Text>
        {isAdmin 
          ? <Button 
              onClick={handleStartGame}
              disabled={game.players?.length < 3}
              mb="md"
            >
              Start Game
            </Button> 
            
          : null
        }

        {sm ? <PlayersList /> : null}
      </Stack>
    </Container>
  )
}

export default LobbyStage