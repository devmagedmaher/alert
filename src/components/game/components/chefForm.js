import React from 'react'
import {
  Container,
  Stack,
  Group,
  Input,
  Button,
  Text,
} from '@mantine/core'
import { useGame } from '..'

const ChefForm = () => {
  const { game, socket } = useGame()
  const [values, setValues] = React.useState({
    recipe: '',
  })
  const [errors, setErrors] = React.useState({})

  const validator = () => {
    const e = {}

    if (values.recipe?.trim() === '') {
      e.recipe = 'Please enter a recipe!'
    }

    setErrors(e)

    return Object.keys(e).length > 0
      ? false
      : true
  }

  const submitRecipe = () => {
    if (validator()) {
      // clear errors
      setErrors({})

      // emit recipe
      socket.emit('submitRecipe', values.recipe)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    setErrors(e => ({ ...e, [name]: null}))
  }

  return (
    <Container>
      <Stack>
        <h1>{game.countDown}</h1>

        <Group>
          <Text>{game.food.name} is: </Text>
          <Input.Wrapper
            error={errors.recipe}
            size="lg"
          >
            <Input
              name="recipe"
              placeholder='Your recipe'
              value={values.recipe}
              onChange={handleChange}
              invalid={errors.recipe}
              size='lg'
            />
          </Input.Wrapper>
        </Group>

        <Button
          onClick={submitRecipe}
          size='md'
        >Submit</Button>
      </Stack>
    </Container>
  )
}

export default ChefForm