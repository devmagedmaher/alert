import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom'
import { Button } from '@mantine/core';
import { useImperativeHandle } from 'react';

const Home = () => {
  const navigate = useNavigate()

  const goToJoinPage = () => {
    navigate('/join')
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='vertical-animation'>
          <img src={logo} className="App-logo horizontal-animation" alt="logo" />
        </div>
        <Button mt={50} onClick={goToJoinPage}>Join room</Button>
      </header>
    </div>
  );
}

export default Home;