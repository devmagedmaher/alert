import React from 'react'
import { ActionIcon, createStyles, Divider, Group, Paper, ScrollArea, Text } from '@mantine/core'
import { useGame } from '..'
import { IconArrowDown, IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  paper: {
    width: '100%',
  },

  scrollArea: {
    transition: 'height 100ms ease-in-out',
    height: 240,
  },

  scrollAreaMini: {
    height: 80
  },

  scrollAreaClosed: {
    height: 0,
  }
}))

const Messages = () => {
  const { classes } = useStyles()
  const { messages } = useGame()
  const [mini, setMini] = React.useState(false)
  const [open, setOpen] = React.useState(true)

  const renderScrollAreaClasses = () => {
    return `${classes.scrollArea} ${
      !open 
        ? classes.scrollAreaClosed
        : mini
          ? classes.scrollAreaMini
          : ''
    }`
  }

  const toggleMiniMax = () => {
    setMini(mini => !mini)
  }

  const toggleOpenClose = () => {
    setOpen(open => !open)
  }

  return (
    <Paper className={classes.paper} withBorder>
      <Group position='apart' p="xs">
        <Text>Messages</Text>
        <Group position='right'>
          {open ? <ActionIcon
            onClick={toggleMiniMax}
            color="blue"
            size='md'
          >
            <IconArrowDown size={16} style={{ transform:`scaleY(${mini ? -1 : 1})` }} />
          </ActionIcon> : null}
          <ActionIcon
            onClick={toggleOpenClose}
            color="red"
            size='md'
          >
            {open ? <IconArrowsMinimize size={16} /> : <IconArrowsMaximize size={16} />}
          </ActionIcon>
        </Group>
      </Group>
      <Divider />
      <ScrollArea
        pt="sm"
        type="auto"
        offsetScrollbars
        className={renderScrollAreaClasses()}
      >
        {messages.map((message, index) => (
          <Message message={message} index={index} />
        ))}
      </ScrollArea>
    </Paper>
  )
}

const Message = ({ message, index }) => {
  return (
    <Text key={index} pl="sm">{message.text}</Text>
  )
}

export default Messages