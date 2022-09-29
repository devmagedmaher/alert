import React from 'react'
import {
  Table,
  Text,
  Indicator,
} from '@mantine/core'
import { useGame } from '..'

const PlayersList = ({ roundScore = false }) => {
  const { game, id } = useGame()

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          {roundScore ? <th>Round Score</th> : null}
          <th>Game Score</th>
        </tr>
      </thead>
      <tbody>
        {game.players && game.players?.length
          ? game.players 
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <tr key={player.id} style={player.id === id ? { backgroundColor: 'rgba(255, 255, 0, 0.1)'} : {}}>
                <td>{index + 1}</td>
                <td>
                  <Indicator position="middle-end" size={20} offset={-20} disabled={index > 2} withBorder color={index === 0
                    ? 'yellow'
                    : index === 1
                      ? 'white'
                      : index === 2
                        ? 'orange'
                        : 'dark'
                  }>
                    <Text color={player.isRight === true 
                      ? 'green'
                      : player.isRight === false
                        ? 'red'
                        : ''
                    }>
                      {player.name}{index === 0 ? ` (admin)` : null}
                    </Text>
                  </Indicator>
                </td>
                {roundScore ? <td>{player.roundScore > 0
                  ? <Text color="green">+{player.roundScore}</Text>
                  : <Text>{player.roundScore}</Text>
                }</td> : null}
                <td>{player.score}</td>
              </tr>
            ))
          
          : <tr>
            <td colSpan={3}>No one in the game yet</td>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default PlayersList