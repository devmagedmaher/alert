const getRandom = require('./getRandomElements')

const COUNT_DOWN_FROM = 20 // in seconds

/**
 * Start the game loop
 * 
 */
module.exports = (io, socket, rooms, { room, name, id }) => {
  const g = rooms[room]
  g.started = true
  g.paused = false
  g.round = 0

  /**
   * Update room players with newer game data
   * 
   */
  const refreshGameData = () => {
    const { counter, ...data } = g
    io.to(room).emit('refresh', data)
    // console.log('game', room, 'data', g)

    // pause game if not enough players around
    if (!g.paused && g.players.length < 2) {
      pauseGame()
    }
  }
  refreshGameData()
  io.to(room).emit('gameStarted')

  /**
   * handle round count down
   * 
   */
  const handleCountDown = () => {
    process.nextTick(() => {
      // count down
      g.countDown -= 1

      // clear counter if counted down to zero
      if (g.countDown <= 0) {
        if (g.recipe) {
          if (g.showFood) {
            nextRound()
          }
          else {
            g.showFood = true
            resetCounter(10)
          }
        }
        else {
          nextRound()
        }
      }
      
      refreshGameData()
    })
  }


  /**
   * Stop counter
   * 
   */
   const stopCounter = () => {
    if (g.counter) {
      clearInterval(g.counter)
      g.counter = undefined
    }
  }

  /**
   * Restart counter 
   * 
   */
  const resetCounter = (countFrom = COUNT_DOWN_FROM) => {
    // stop old tiemr if exists
    stopCounter()
    // restart counter
    g.countDown = countFrom
    // set new timer
    g.counter = setInterval(handleCountDown, 1000)    
  }

  /**
   * iterate game rounds
   * 
   */
  const nextRound = () => {
    process.nextTick(() => {
      // reset round
      g.recipe = null
      g.showFood = false
      g.players = g.players.map(p => ({ ...p, answered: false }))
  
      // get 2 random candidates chef & food
      const [chef, food] = getRandom(g.players, 2)
      g.chef = chef
      g.food = food
  
      // set round data
      g.round += 1
      refreshGameData()
      
      // set count down
      resetCounter(10)
    })
  }
  nextRound()

  /**
   * Pause game if there are no players in the room
   * 
   */
  const pauseGame = () => {
    console.log('pause room', room)
    g.paused = true
    g.started = false
    io.to(room).emit('gamePaused')
    refreshGameData()
    stopCounter()
  }

  /**
   * SubmitRecipe: store food recipe from chef
   * 
   */
  const handleSubmitRecipeEvent = (eventRoom, recipe) => {
    console.log({ eventRoom, recipe })
    if (eventRoom !== room) return
    console.log('recipe submitted')
    // store recipe
    g.recipe = recipe
    refreshGameData()

    // restart counter
    resetCounter()
  }

  /**
   * SubmitFood: submit food answer
   * 
   */
  const handleSubmitFoodEvent = foodId => {
    console.log('answer submitted')
    // store recipe
    if (g.food.id === foodId) {
      const player = g.players.find(p => p.id === id)
      if (player) {
        player.score += 1
        player.answered = true
      }
    }

    console.log('all answered', g.players.every(p => p.answered))
    if (g.players.every(p => p.answered)) {
      g.showFood = true
      refreshGameData()
      
      // restart counter
      resetCounter(10)
    }
    
  }

  /**
   * Listeners
   * 
   */
  socket.on('submitRecipe', handleSubmitRecipeEvent)
  socket.on('submitFood', handleSubmitFoodEvent)
}

