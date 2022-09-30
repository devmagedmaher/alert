import React from 'react'
import Logo from './logo'
import {
  createStyles,
  Group,
  Header as MantineHeader,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { Link } from 'react-router-dom'

const HEADER_HEIGHT = 70

const useStyles = createStyles((theme) => ({
  paper: {
    width: '100%',
  },
}))

const Header = () => {
  const { classes } = useStyles()
  const name = localStorage.getItem('name')

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
          {name ? <Text>Hello, {name}</Text> : null}
        </Group>
      </Paper>
    </MantineHeader>
  )
}

export default Header

export { HEADER_HEIGHT }