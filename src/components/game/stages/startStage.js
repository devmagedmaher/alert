import React from 'react'
import { useGame } from '..'
import PlayersList from '../components/playersList'

const StartStage = () => {
  const { game } = useGame()
  
  return (
    <div>
      Game inside
      <PlayersList players={game.players} />
    </div>
  )
}

export default StartStage