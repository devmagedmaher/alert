import React, { useState } from 'react'
import { useForm } from '@mantine/form'
import {
  Container,
  Stack,
  Button,
  Radio,
  Title,
  Text,
  Group,
} from '@mantine/core'
import { useGame } from '..'

const FoodSelect = () => {
  const { game, socket, isAdmin } = useGame()
  // make a copy of current game players array
  const [options] = useState(() => Array.from(game.players.sort((a, b) => a.name.localeCompare(b.name))))
  const [answer, setAnswer] = React.useState(null)
  const form = useForm({
    initialValues: {
      food: '',
    },
    validate: {
      food: val => val === '' ? 'Please select an answer' : null, 
    }
  })

  const submitAnswer = () => {
    form.validate()
    if (form.isValid()) {
      const { food } = form.values

      // send answer
      socket.emit('submitFood', food)

      // display answer
      const selectedPlayer = game.players.find(p => p.id === food)
      setAnswer(selectedPlayer.name)
    }
  }

  const goNextRound = () => {
    socket.emit('nextRound')
  }

  const skipAnswer = () => {
    setAnswer('(Skipped)')
    socket.emit('skipAnswer')
  }

  if (game.showFood) {
    return (
      <Container>
        <Stack>
            <Title order={2}>{game.recipe} is {game.food.name}</Title>
            <Text align='center'>{game.lastRound ? 'Game ends' : 'Next round'} in {game.countDown} seconds</Text>
            {isAdmin ? <Button
              onClick={goNextRound}
              variant="light"
              size='md'
            >{game.lastRound ? 'End Game' : 'Next Round'}</Button> : null}
          </Stack>
      </Container>
    )
  }

  return (
    <Container>
      <Stack>
        <Title order={3}>Recipe: {game.recipe}</Title>

        {answer
          ? <Text>Your answer is: {answer}. wait for other players {game.countDown}</Text>
          : <Radio.Group
              name="food"
              value={form.values.food}
              onChange={value => form.setFieldValue('food', value)}
              error={form.errors.food}
              orientation="vertical"
              label={`Guess the food from recipe before timeout: ${game.countDown}`}
            >
              {options.map(player => (
                <Radio value={player.id} label={player.name} />
              ))}
            </Radio.Group>
        }

        {answer ? null : <Group>
          <Button
            onClick={skipAnswer}
            variant="subtle"
            size='md'
          >
            Skip?
          </Button>
          <Button
            onClick={submitAnswer}
            disabled={form.values.food === ''}
            variant="light"
            size='md'
          >Submit Answer</Button>
        </Group>}
      </Stack>
    </Container>
  )
}

export default FoodSelect