import React from 'react'
import Logo from './logo'
import {
  Group,
  Header as MantineHeader,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import { Link } from 'react-router-dom'

const HEADER_HEIGHT = 70

const Header = ({ name }) => {
  return (
    <MantineHeader height={HEADER_HEIGHT} p="lg" style={{ display: 'flex', alignItems: 'center' }}>
      <Paper>
        <Group position='apart'>
          <Group spacing="xs">
            <Link to='/'>
              <Logo />
            </Link>
            <Title order={3}>
              <Text variant="text" color={'cyan'}>Chef Recipe</Text>
            </Title>
          </Group>
          {name ? <Text>{name}</Text> : null}
        </Group>
      </Paper>
    </MantineHeader>
  )
}

export default Header

export { HEADER_HEIGHT }