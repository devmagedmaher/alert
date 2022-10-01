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

const room = localStorage.getItem('room')
const name = localStorage.getItem('name')
const id = localStorage.getItem('id')
const socket = io('https://bcab-156-204-69-112.eu.ngrok.io', {
  autoConnect: false,
  query: { room, name, id }
})

const Game = (props) => {
  const [stage, setStage] = React.useState()
  const stageRef = React.useRef()
  const [status, setStatus] = React.useState('loading')
  const [game, setGame] = React.useState({})
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [me, setMe] = React.useState()

  // update stage ref
  React.useEffect(() => { stageRef.current = stage }, [stage])

  /**
   * connect and listen to socket events
   * 
   */
  React.useEffect(() => {
    console.log('socket established', socket)

    // connect to socket server
    setStatus('loading')
    socket.connect()


    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('refresh', handleGameRefresh)
    socket.on('gameStarted', handleGameStarted)
    socket.on('gamePaused', handleGamePaused)

    return () => {
      console.log('disconnect', socket)
      socket.disconnect()
      socket.off('connect')
      socket.off('disconnect')
      socket.off('refresh')
      socket.off('gameStarted')
      socket.off('gamePaused')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    // set admin flag
    if (data.players[0]) {
      data.players[0].isAdmin = true
    }

    setGame(data)
    setIsAdmin(data.players[0]?.id === props.id)

    // set self player data
    setMe(() => data.players.find(p => p.id === props.id))
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
      socket,
      setStage,
      status,
      game,
      isAdmin,
      me,
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