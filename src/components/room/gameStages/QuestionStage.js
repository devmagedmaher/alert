import React from 'react'
import { useRoom } from '..'
import { Center, Radio, Stack, Title } from '@mantine/core'
import Counter from '../../counter'

const QuestionStage = () => {
  const { data: room, me, socket } = useRoom()
  const { game } = room
  const { question } = game

  const handleOnChange = (answer) => {
    socket.emit('submitAnswer', answer)
  }

  return (
    <Stack>
      <Center>
        <Counter count={game.counter} withWarning />
      </Center>
      <Title order={5}>{question.text}</Title>
      <Radio.Group
        name="answer"
        onChange={handleOnChange}
        orientation="vertical"
        label={`Select your answer:`}
      >
        {question.options.map(option => (
          <Radio
            value={option.id}
            label={option.text}
            disabled={me.hasAnswered}
          />
        ))}
      </Radio.Group>
    </Stack>
  )
}

export default QuestionStage