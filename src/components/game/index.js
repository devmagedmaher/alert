import React from 'react'
import IntroStage from './stages/introStage'
import StartStage from './stages/startStage';

const GameContext = React.createContext({});

const Game = (props) => {
  const [stage, setStage] = React.useState()

  const renderStage = () => {
    switch(stage) {
      case 'start':
        return <StartStage />
      
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