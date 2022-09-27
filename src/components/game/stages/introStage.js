import React, { useState } from 'react'

const IntroStage = ({ room, name }) => {
  return (
    <div>
      Hello, <b>{name}</b>. Welcome to <b>{room}</b> room
    </div>
  )
}

export default IntroStage