import React, { useState } from 'react'
import IntroStage from './stages/introStage'

const GameContext = React.createContext({});

const Game = (props) => {
  const [stage, setStage] = useState()

  const renderStage = () => {
    switch(stage) {
      case 'view':
        return 'view game stage'
      
      default:
        return <IntroStage {...props} />
    }  
  }

  return (
    <GameContext.Provider value={{ setStage, ...props }}>
      {renderStage()}
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)