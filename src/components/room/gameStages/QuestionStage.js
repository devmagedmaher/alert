import React from 'react'
import { useRoom } from '..'
import { Center, createStyles, Image, Radio, Stack, Title } from '@mantine/core'
import Counter from '../../counter'

const useStyles = createStyles(theme => ({
  
  image: {
    width: 250,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '50vw',
      maxWidth: 250
    }
  }
}))

const QuestionStage = () => {
  const { classes } = useStyles()
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
      {question.image ? <Image src={question.image} alt={question.text} className={classes.image} /> : null}
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