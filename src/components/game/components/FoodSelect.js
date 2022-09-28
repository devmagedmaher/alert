import React from 'react'
import {
  Container,
  Stack,
  Button,
  Radio,
  Select,
} from '@mantine/core'
import { useGame } from '..'
import PlayersList from './playersList'

const FoodSelect = () => {
  const { game, socket, isAdmin } = useGame()
  const [values, setValues] = React.useState({ food: '' })
  const [errors, setErrors] = React.useState({})
  const [answer, setAnswer] = React.useState(null)

  const validator = () => {
    const e = {}

    if (values.food?.trim() === '') {
      e.food = 'Please select a food!'
    }

    setErrors(e)

    return Object.keys(e).length > 0
      ? false
      : true
  }

  const submitAnswer = () => {
    if (validator()) {
      // clear errors
      setErrors({})

      // emit answer
      socket.emit('submitFood', values.food)
      const selectedPlayer = game.players.find(p => p.id === values.food)
      setAnswer(selectedPlayer.name)
    }
  }

  const goNextRound = () => {
    socket.emit('nextRound')
  }

  if (game.showFood) {
    return (
      <Container>
        <Stack>
            <h1>{game.recipe} is {game.food.name}</h1>
            <PlayersList roundScore={true} />
            <p>next round in {game.countDown}</p>
            {isAdmin ? <Button
              onClick={goNextRound}
              size='md'
            >Next Round</Button> : null}
          </Stack>
      </Container>
    )
  }

  return (
    <Container>
      <Stack>
        <h1>Recipe: {game.recipe}</h1>

        {answer
          ? <p>Your answer is: {answer}. next round in {game.countDown}</p>
          : <Radio.Group
              name="food"
              value={values.food}
              onChange={value => setValues(v => ({ ...v, food: value }))}
              error={errors.food}
              orientation="vertical"
              label={`Guess the food from recipe before timeout: ${game.countDown}`}
            >
              {game.players.map(player => (
                <Radio value={player.id} label={player.name} />
              ))}
            </Radio.Group>
        }
        <Button
          onClick={submitAnswer}
          disabled={answer}
          size='md'
        >Submit Answer</Button>
      </Stack>
    </Container>
  )
}

export default FoodSelect