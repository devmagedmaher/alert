import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Center, Container, Stack } from '@mantine/core';
import { FullSizeLogo } from '../components/logo';
import Layout from '../components/Layout';

const HomePage = () => {
  const navigate = useNavigate()

  const goToJoinPage = () => {
    navigate('/join')
  }

  return (
    <Layout>
      <Stack>
        <FullSizeLogo />
        <Button onClick={goToJoinPage}
          variant="subtle"
          size="lg"
          mt={40}
        >Join a room {" ->"}</Button>
      </Stack>
    </Layout>
  );
}

export default HomePage;