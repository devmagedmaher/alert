import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mantine/core';

const JoinPage = () => {
  const navigate = useNavigate()
  const [room, setRoom] = React.useState('')
  const [name, setName] = React.useState('')

  const goToRoom = () => {
    navigate(`/r/${room}`)    
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button mt={50} onClick={goToRoom}>Join</Button>
      </header>
    </div>
  );
}

export default JoinPage;