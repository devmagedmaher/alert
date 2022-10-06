import React from 'react'
import { useRoom } from '..'
import { Center, Stack } from '@mantine/core'
import Counter from '../../counter'

const AnswerStage = () => {
  const { data: room } = useRoom()
  const { game } = room

  return (
    <Stack>
      <Center>
        <Counter count={game.counter} color='dimmed' />
      </Center>
      {JSON.stringify(game.answer)}
    </Stack>
  )
}

export default AnswerStage