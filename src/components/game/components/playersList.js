import React from 'react'
import {
  Table,
  Text,
} from '@mantine/core'
import { useGame } from '..'

const PlayersList = ({ roundScore = false }) => {
  const { game } = useGame()

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>{roundScore ? 'Round Score' : 'Game Score'}</th>
        </tr>
      </thead>
      <tbody>
        {game.players && game.players?.length
          ? game.players 
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <tr key={player.id} color="red">
                <td>{index + 1}</td>
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
                <td>{roundScore ? player.roundScore : player.score}</td>
              </tr>
            ))
          
          : <tr>
            <td colSpan={3}>No one in the room</td>
          </tr>
        }
      </tbody>
    </Table>
  )
}

export default PlayersList