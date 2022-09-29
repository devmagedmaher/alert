import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Stack,
} from '@mantine/core'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <div className="App">
      <header className="App-header">
        <Stack>
          <div className='vertical-animation'>
            <div className='horizontal-animation'>
              Page not found
            </div>
          </div>
          <Button onClick={goHome}>
            Go Home
          </Button>
        </Stack>
      </header>
    </div>
  );
}

export default NotFoundPage;