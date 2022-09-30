import React from 'react'
import { AppShell, Center, Container } from '@mantine/core'
import Header, { height } from './header'

const Layout = ({
  header = true,
  headerProps = {},
  navbar,
  children,
}) => {
  return (
    <AppShell
      header={header ? <Header {...headerProps} /> : null}
      navbar={navbar}
    >
      <Container>
        <Center style={{ height: `calc(100vh - ${height + 32}px)` }}>
          {children}
        </Center>
      </Container>
    </AppShell>
  )
}

export default Layout