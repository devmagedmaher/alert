import React from 'react'
import {
  Table,
} from '@mantine/core'

const PlayersList = ({ players }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={player.id}>
            <td>{player.name}{index === 0 ? ` (admin)` : null}</td>
            <td>{player.score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

PlayersList.defaultProps = {
  players: [],
}

export default PlayersList