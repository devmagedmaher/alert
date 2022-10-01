import React from 'react'
import Logo from './logo'
import {
  ActionIcon,
  createStyles,
  Group,
  Header as MantineHeader,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { Link, useMatch } from 'react-router-dom'
import { IconDoorExit } from '@tabler/icons'

const HEADER_HEIGHT = 70

const useStyles = createStyles((theme) => ({
  paper: {
    width: '100%',
  },
}))

const Header = () => {
  const { classes } = useStyles()
  const insideRoomPage = useMatch('/r/:room')
  const name = localStorage.getItem('name')

  const exitKitchen = () => {
    window.location.href = '/join'
  }

  return (
    <MantineHeader height={HEADER_HEIGHT} p="lg" style={{ display: 'flex', alignItems: 'center' }}>
      <Paper className={classes.paper}>
        <Group position='apart'>
          <Group spacing="xs">
            <Link to='/'>
              <Logo />
            </Link>
            <Title order={3}>
              <Text variant="text" color={'cyan'}>Chef Recipe</Text>
            </Title>
          </Group>
          <Group>
            {insideRoomPage ? <ActionIcon
              onClick={exitKitchen}
              variant="filled"
              color='red'
              size='md'
            >
              <IconDoorExit size={16} style={{ transform: 'scaleX(-1)' }} />
            </ActionIcon> : null}
            {name ? <Text>Hello, {name}</Text> : null}
          </Group>
        </Group>
      </Paper>
    </MantineHeader>
  )
}

export default Header

export { HEADER_HEIGHT }