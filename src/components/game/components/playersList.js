import React from 'react'
import {
  Table,
  Text,
  Indicator,
} from '@mantine/core'
import { useGame } from '..'

const PlayersList = ({ roundScore = true }) => {
  const { game, id } = useGame()

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
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
                <Indicator position="middle-start" size={10} offset={25} disabled={index > 2} color={index === 0
                    ? 'yellow'
                    : index === 1
                      ? 'white'
                      : index === 2
                        ? 'orange'
                        : 'dark'
                  }>
                    <Text>{index + 1}#</Text>
                  </Indicator>
                </td>
                <td>
                  <Text color={player.isRight === true 
                    ? 'green'
                    : player.isRight === false
                      ? 'red'
                      : ''
                  }>
                    {player.name}{index === 0 ? ` (admin)` : null}
                  </Text>
                </td>
                {roundScore ? <td align='center'>{player.roundScore > 0
                  ? <Text color="green">+{player.roundScore}</Text>
                  : <Text>{player.roundScore}</Text>
                }</td> : null}
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