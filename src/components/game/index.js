import React from 'react'
import { io } from 'socket.io-client'
import IntroStage from './stages/introStage'
import StartStage from './stages/startStage';

const GameContext = React.createContext({});

const Game = (props) => {
  const [stage, setStage] = React.useState()
  const [socket, setSocket] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const renderStage = () => {
    switch(stage) {
      case 'start':
        return <StartStage />
        
      default:
        return <IntroStage {...props} />
    }  
  }

  React.useEffect(() => {
    if (socket) {
      
      socket.on('connect', handleConnect)

      return () => {
        socket.disconnect()
        socket.off('connect', handleConnect)
      }
    }
  }, [socket])

  React.useEffect(() => {
    const s = io('http://localhost:5000', {
      query: {
        room: props.room,
        name: props.name,
      }
    });

    setSocket(s)
  }, [])

  const handleConnect = () => {
    setStatus()
  }

  return (
    <GameContext.Provider value={{
      setStage,
      status,
      ...props
    }}>
      {renderStage()}
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)