import React from 'react'
import {
  Container,
  Stack,
  Button,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useRoom } from '.'
import PlayersList from './playersList'

const LobbyStage = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { data: room, socket, isAdmin } = useRoom()
  const { game } = room
  
  const handleStartGame = () => {
    socket.emit('startGame')
  }

  return (
    <Container>
      <Stack>
        <Text align='center'>
          {game.catStart
            ? "Minimum 3 players are required for game to start"
            : isAdmin
              ? "Other players are waiting for you to start the game."
              : "Wait for admin to start the game."
          }
        </Text>
        {isAdmin 
          ? <Button 
              onClick={handleStartGame}
              disabled={game.catStart}
              mb="md"
            >
              Start Game
            </Button> 
            
          : null
        }

        {sm ? <PlayersList inGameOnly /> : null}
      </Stack>
    </Container>
  )
}

export default LobbyStage