import React from 'react'
import {
  Table,
  Text,
  Indicator,
} from '@mantine/core'
import { useGame } from '..'
import moment from 'moment'

const PlayersList = ({ roundScore = true }) => {
  const { game, id } = useGame()

  const renderRank = (rankNumber) => {
    return moment.localeData().ordinal(rankNumber)
  }

  const renderRankMedal = (rank) => {
    return rank === 1
    ? 'yellow'
    : rank === 2
      ? 'white'
      : rank === 3
        ? 'orange'
        : 'dark'
  }

  const renderRightnessColor = (isRight, score) => {
    return isRight === true || score > 0
    ? 'green'
    : isRight === false
      ? 'red'
      : ''
  }

  const renderDeltaScore = (score) => {
    const sign = score > 0
    ? "+"
    : score < 0
      ? '-'
      : ''

    return `${sign}${Math.abs(score)}`
  }

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
            .map((player, index) => (
              <tr key={player.id} style={player.id === id ? { backgroundColor: 'rgba(255, 255, 0, 0.1)'} : {}}>
                <td>
                  <Indicator position="middle-start" size={10} offset={45} disabled={index > 2} color={renderRankMedal(index + 1)}>
                    <Text pr="md">{renderRank(index + 1)}</Text>
                  </Indicator>
                </td>
                <td>
                  <Text color={renderRightnessColor(player.isRight)}>
                    {player.name}{index === 0 ? ` (admin)` : null}
                  </Text>
                </td>
                {roundScore ? <td align='center'>
                  <Text color={renderRightnessColor(player.isRight, player.roundScore)}>
                    {renderDeltaScore(player.roundScore)}
                  </Text>
                </td> : null}
                <td align='center'>{player.score}</td>
              </tr>
            ))
          
          : <tr>
            <td colSpan={roundScore ? 4 : 3} align="center">No one in the game yet</td>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default PlayersList