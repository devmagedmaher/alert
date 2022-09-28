import React from 'react'
import { useGame } from '..'
import {
  Container,
  Stack,
} from '@mantine/core'
import ChefForm from '../components/ChefForm'
import FoodSelect from '../components/FoodSelect'

const GameStage = () => {
  const { game, id } = useGame()


  if (game.recipe) {
    return (
      <FoodSelect />
    )
  }

  if (game.chef?.id === id) {
    return (
      <ChefForm />
    )
  }

  return (
    <Container>
      <Stack>
        <h2>Round: {game.round}</h2>
        <h1>{game.countDown}</h1>
        <h3>Wait for Chef recipe</h3>
      </Stack>
    </Container>
  )
}

export default GameStage