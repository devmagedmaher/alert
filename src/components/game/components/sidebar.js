import React from 'react'
import { useGame } from '..'
import { useMediaQuery } from '@mantine/hooks'
import { createStyles, Divider, Navbar, ScrollArea, Text, Title, useMantineTheme } from '@mantine/core'
import { HEADER_HEIGHT } from '../../header'
import PlayersList from './playersList'

const SIDEBAR_WIDTH = 400
const SIDEBAR_WIDTH_MOBILE = 60

const useStyles = createStyles((theme) => ({
  scrollArea: {
    height: '100%',
  },
}))

const Sidebar = () => {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
  const { game, room } = useGame()

  const renderGameStage = () => {
    const stage = game.started
      ? game.recipe
        ? game.showFood
          ? 'Food in display'
          : 'Dilemma of choices'
        : 'Recipe is being prepared'
      : null

      return stage ? `${stage} (${game.countDown})` : null
  }

  return sm ? null : (
    <Navbar width={{ base: SIDEBAR_WIDTH }} height={`calc(100% - ${HEADER_HEIGHT}px)`}>
      <ScrollArea className={classes.scrollArea} type="always">
        <Navbar.Section p='lg'>
          <Title order={4} mb="sm">Kitchen "{room}" {game.started ? '(Started)' : null}</Title>
          <Text>Round: {game.round}/{game.rounds}</Text>
          {game.started ? <Text>Stage: {renderGameStage()}</Text> : null}
        </Navbar.Section>

        <Divider />

        <Navbar.Section grow>
            <PlayersList />
        </Navbar.Section>

        <Navbar.Section>
          {/* FOOTER */}
        </Navbar.Section>
      </ScrollArea>
    </Navbar>
  )
}

export default Sidebar

export { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE }