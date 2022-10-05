import React from 'react'
import {
  Table,
  Text,
} from '@mantine/core'
import { IconKey, IconLemon, IconMeat, IconPizza } from '@tabler/icons'
import { useRoom } from '.'
import moment from 'moment'

const PlayersList = ({ inGameOnly }) => {
  const { data: room } = useRoom()

  const filterOptions = player => {
    if (inGameOnly) {
      return player.inGame
    }

    return true
  }

  return (
    <Table>
      <thead>
        <tr>
          <th colSpan={2}>rank</th>
          <th colSpan={2}>Name</th>
          <th style={{ textAlign: 'center' }}>Round</th>
          <th style={{ textAlign: 'center' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {room.players && room.players?.length
          ? 
          room.players
          // filter options
          .filter(filterOptions)
          // sort in game players by score
          .sort((a, b) => b.inGame - a.inGame || b.connected - a.connected || b.score - a.score)
          // render player row
          .map((player, index) => <PlayerRow player={player} rank={index + 1} />)

          : 
          <ZeroPlayersRow />
        }
      </tbody>
    </Table>
  )
}

const PlayerRow = ({ player, rank }) => {
  const { id } = useRoom()

  const renderRank = () => {
    if (player.inGame) {
      return moment.localeData().ordinal(rank)
    }

    return '#'
  }

  const renderRankMedal = () => {
    if (player.inGame) {
      return rank === 1
        ? <IconLemon size={16} color="yellow" />
        : rank === 2
          ? <IconPizza size={16} color="white" />
          : rank === 3
            ? <IconMeat size={16} color="orange" />
            : null
    }

    return null
  }

  const renderRightnessColor = () => {
    if (!player.connected) {
      return 'gray'
    }
    else if (player.inGame) {
      const { isRight, scoreInRound: score } = player
  
      return isRight === true || score > 0
        ? 'green'
        : isRight === false
          ? 'red'
          : ''
    }

    return null
  }

  const renderName = () => {
    const { name } = player

    return <Text color={renderRightnessColor()}>{name}</Text>
  }

  const renderDeltaScore = () => {
    if (player.inGame) {
      const { scoreInRound: score } = player
  
      const sign = score > 0
        ? "+"
        : score < 0
          ? '-'
          : ''
  
      return <Text color={renderRightnessColor()}>{sign}{Math.abs(score)}</Text>
    }

    return null
  }

  return (
    <tr key={player.id} style={player.id === id ? { backgroundColor: 'rgba(255, 255, 0, 0.1)' } : {}}>
      <td>
        <Text pr="md">{renderRank()}</Text>
      </td>
      <td>
        {renderRankMedal()}
      </td>
      <td>
        {renderName()}
      </td>
      <td>
        {player.admin ? <IconKey size={16} /> : null}
      </td>
      <td align='center'>
        {renderDeltaScore()}
      </td>
      <td align='center'>
        {player.score}
      </td>
    </tr>
  )
}

const ZeroPlayersRow = ({ colSpan = 6 }) => (
  <tr>
    <td colSpan={colSpan} align="center">No one in the game yet</td>
  </tr>
)

export default PlayersList