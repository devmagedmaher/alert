import React from 'react'
import { useGame } from '..'
import PlayersList from '../components/playersList'
import {
  Container,
  Button,
} from '@mantine/core'

const GameStage = () => {
  const { game, socket } = useGame()

  return (
    <Container>
        Game Started
      {/* <PlayersList players={game.players} /> */}
    </Container>
  )
}

export default GameStage