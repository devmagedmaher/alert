import React from 'react'
import { useRoom } from '..'
import { Center, Stack } from '@mantine/core'
import Counter from '../../counter'

const QuestionStage = () => {
  const { data: room } = useRoom()
  const { game } = room

  return (
    <Stack>
      <Center>
        <Counter count={game.counter} withWarning />
      </Center>
      {JSON.stringify(game.question)}
    </Stack>
  )
}

export default QuestionStage