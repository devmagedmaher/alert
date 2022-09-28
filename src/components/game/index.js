import React from 'react'
import { io } from 'socket.io-client'
import GameStage from './stages/gameStage';
import IntroStage from './stages/introStage'
import LobbyStage from './stages/lobbyStage';

const GameContext = React.createContext({
  setStage: () => false,
  status: null,
  game: {},
});

const Game = (props) => {
  const [stage, setStage] = React.useState()
  const [status, setStatus] = React.useState('loading')
  const [game, setGame] = React.useState({})
  const [isAdmin, setIsAdmin] = React.useState(false)
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
      socket.on('disconnect', handleDisconnect)
      socket.on('refresh', handleGameRefresh)
      socket.on('gameStarted', handleGameStarted)

      return () => {
        socket.disconnect()
        socket.off('connect')
        socket.off('disconnect')
        socket.off('refresh')
        socket.off('gameStarted')
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

  /**
   * handle socket disconnect
   * 
   */
  const handleDisconnect = () => {
    console.log('disconnect')
    setStatus('loading')
    setStage()
  }

  /**
   * handle refresh game data
   */
  const handleGameRefresh = data => {
    console.log('refreshed data', data)
    setGame(data)
    setIsAdmin(data.players[0]?.id === props.id)
  }

  /**
   * handle game started
   * 
   */
  const handleGameStarted = () => {
    console.log('game started')
    setStage('game')
  }


  /**
   * render game stages
   * 
   */
  const renderStage = () => {
    switch (stage) {
      case 'lobby':
        return <LobbyStage />

      case 'game':
        return <GameStage />

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
      isAdmin,
      ...props
    }}>
      {renderStage()}
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)