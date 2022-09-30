import React from 'react'
import { io } from 'socket.io-client'
import GameStage from './stages/gameStage'
import IntroStage from './stages/introStage'
import LobbyStage from './stages/lobbyStage'
import Layout from '../Layout'
import Sidebar from './components/sidebar'

const GameContext = React.createContext({
  setStage: () => false,
  status: null,
  game: {},
});

const Game = (props) => {
  const [stage, setStage] = React.useState()
  const stageRef = React.useRef()
  const [status, setStatus] = React.useState('loading')
  const [game, setGame] = React.useState({})
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [socket, setSocket] = React.useState()
  const socketRef = React.useRef()
  const connecting = React.useRef(false)

  // update socket ref
  React.useEffect(() => { socketRef.current = socket }, [socket])

  // update stage ref
  React.useEffect(() => { stageRef.current = stage }, [stage])

  /**
   * initialize connection to socket server
   */
  const initializeConnection = () => {
    if (connecting.current === false) {
      connecting.current = true
      setStatus('loading')
      setSocket(() => io('https://bcab-156-204-69-112.eu.ngrok.io', {
        query: {
          room: props.room,
          name: props.name,
          id: props.id,
        }
      }))
    }
  }
  React.useEffect(() => { initializeConnection() }, [])

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
      socket.on('gamePaused', handleGamePaused)

      return () => {
        socket.disconnect()
        socket.off('connect')
        socket.off('disconnect')
        socket.off('refresh')
        socket.off('gameStarted')
        socket.off('gamePaused')
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
    setStatus('disconnected')
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
    if (stageRef.current === 'lobby') {
      console.log('game started')
      setStage('game')
    }
  }

  /**
   * handle game paused
   * 
   */
  const handleGamePaused = () => {
    if (stageRef.current === 'game') {
      console.log('game paused')
      setStage('lobby')
    }
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
      socket: socketRef.current,
      setStage,
      status,
      game,
      isAdmin,
      ...props
    }}>
      <Layout navbar={<Sidebar />}>
        {renderStage()}
      </Layout>
    </GameContext.Provider>
  )
}

export default Game

export const useGame = () => React.useContext(GameContext)