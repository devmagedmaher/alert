import React from 'react'
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom'
import { Box, Button, Center, Container, createStyles, Image, Stack } from '@mantine/core';

const useStyles = createStyles(theme => ({
  logo: {
    width: 250,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: '50vw',
      maxWidth: 250
    }
  }
}))

const HomePage = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const goToJoinPage = () => {
    navigate('/join')
  }

  return (
    <Container>
      <Center style={{ height: '100vh' }}>
        <Stack>
          <Box className='vertical-animation'>
            <Box className='horizontal-animation'>
              <div className={classes.logo}>
                <Image
                  src={logo}
                  radius={10}
                  alt="logo"
                />
              </div>
            </Box>
          </Box>
          <Button
            onClick={goToJoinPage}
            variant="subtle"
            size="lg"
            mt={40}
          >Join a room {" ->"}</Button>
        </Stack>
      </Center>
    </Container>
  );
}

export default HomePage;