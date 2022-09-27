import React from 'react'
import {
  useParams,
  Navigate,
} from 'react-router-dom'
import Game from '../components/game';

const RoomPage = () => {
  const { room } = useParams()
  const name = localStorage.getItem('name')
  const id = localStorage.getItem('id')

  if (!name || !room) {
    return <Navigate to="/join" />
  }

  return (
    <div className="App">
      <header className="App-header">
        <Game room={room} name={name} id={id} />
      </header>
    </div>
  );
}

export default RoomPage;