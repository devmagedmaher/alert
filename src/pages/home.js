import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack } from '@mantine/core';
import { FullSizeLogo } from '../components/logo';
import Layout from '../components/layout';

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
        >Join a kitchen room {" ->"}</Button>
      </Stack>
    </Layout>
  );
}

export default HomePage;