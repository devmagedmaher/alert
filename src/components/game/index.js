import React from 'react'
import { io } from 'socket.io-client'
import IntroStage from './stages/introStage'
import StartStage from './stages/startStage';

const GameContext = React.createContext({
  setStage: () => false,
  status: null,
  game: {},
});

const Game = (props) => {
  const [stage, setStage] = React.useState()
  const [status, setStatus] = React.useState('loading')
  const [game, setGame] = React.useState({})
  const [socket, setSocket] = React.useState()
  const connecting = React.useRef(false)

  /**
   * initialize connection to socket server
   */
  React.useEffect(() => {
    if (connecting.current === false) {
      connecting.current = true
      setSocket(() => {
        return io('https://bcab-156-204-69-112.eu.ngrok.io', {
          query: {
            room: props.room,
            name: props.name,
            id: props.id,
          }
        })
      })
    }
  }, [])

  /**
   * listen to socket events
   * 
   */
  React.useEffect(() => {
    if (socket) {

      socket.on('connect', handleConnect)
      socket.on('refresh', handleGameRefresh)

      return () => {
        socket.disconnect()
        socket.off('connect')
        socket.off('refresh')
      }
    }
  }, [socket])

  /**
   * handle socket connection
   * 
   */
  const handleConnect = () => {
    console.log('connected')
    setStatus()
  }

  const handleGameRefresh = data => {
    console.log('refreshed data', data)
    setGame(data)
  }

  /**
   * render game stages
   * 
   */
  const renderStage = () => {
    switch (stage) {
      case 'start':
        return <StartStage />

      default:
        return <IntroStage />
    }
  }

  /**
   * render game with game state/data
   * 
   */
  return (
    <GameContext.Provider value={{
      setStage,
      status,
      socket,
      game,
      ...props
    }}>
      {renderStage()}
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)