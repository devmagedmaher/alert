import React from 'react'
import {
  Table,
  Text,
  Group,
  Divider,
} from '@mantine/core'
import { IconKey, IconLemon, IconMeat, IconPizza } from '@tabler/icons'
import { useGame } from '..'
import moment from 'moment'

const PlayersList = ({ roundScore = true }) => {
  const { game } = useGame()

  return (
    <Table>
      <thead>
        <tr>
          <th>rank</th>
          <th>Name</th>
          {roundScore ? <th style={{ textAlign: 'center' }}>Round</th> : null}
          <th style={{ textAlign: 'center' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {game.players && game.players?.length
          ? game.players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => <Row player={player} index={index} roundScore={roundScore} />)

          : <tr>
            <td colSpan={roundScore ? 4 : 3} align="center">No one in the game yet</td>
          </tr>
        }
        <tr>
          <td colSpan={roundScore ? 4 : 3} style={{ padding: 0 }}>
            <Divider />
          </td>
        </tr>
        {game.offlinePlayers && game.offlinePlayers?.length
          ? game.offlinePlayers
            .map((player, index) => <Row player={player} index={index} roundScore={roundScore} isOffline />)

          : null
        }
      </tbody>
    </Table>
  )
}

const Row = ({ player, index, isOffline, roundScore }) => {
  const { id } = useGame()

  const renderRank = () => {
    if (isOffline) return null
    const rankNumber = index + 1

    return moment.localeData().ordinal(rankNumber)
  }

  const renderRankMedal = () => {
    if (isOffline) return null
    const rankNumber = index + 1

    return rankNumber === 1
      ? <IconLemon size={16} color="yellow" />
      : rankNumber === 2
        ? <IconPizza size={16} color="white" />
        : rankNumber === 3
          ? <IconMeat size={16} color="orange" />
          : null
  }

  const renderRightnessColor = () => {
    if (isOffline) return 'gray'
    const { isRight, roundScore: score } = player

    return isRight === true || score > 0
      ? 'green'
      : isRight === false
        ? 'red'
        : ''
  }

  const renderName = () => {
    const { name, isAdmin } = player
    if (isOffline) return name

    return <Group>{name} {isAdmin ? <IconKey size={16} /> : null}</Group>
  }

  const renderDeltaScore = () => {
    if (isOffline) return null
    const { roundScore: score } = player

    const sign = score > 0
      ? "+"
      : score < 0
        ? '-'
        : ''

    return `${sign}${Math.abs(score)}`
  }

  return (
    <tr key={player.id} style={player.id === id ? { backgroundColor: 'rgba(255, 255, 0, 0.1)' } : {}}>
      <td>
        <Group position='apart'>
          <Text pr="md">{renderRank()}</Text>
          {renderRankMedal()}
        </Group>
      </td>
      <td>
        <Text color={renderRightnessColor()}>
          {renderName()}
        </Text>
      </td>
      {roundScore ? <td align='center'>
        <Text color={renderRightnessColor()}>
          {renderDeltaScore()}
        </Text>
      </td> : null}
      <td align='center'>{player.score}</td>
    </tr>
  )
}

export default PlayersList