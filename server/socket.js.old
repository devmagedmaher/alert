const Utils = require('./utils')

const COUNT_DOWN_RECIPE = 20 // in seconds
const COUNT_DOWN_ANSWER = 20 // in seconds
const COUNT_DOWN_FOOD = 15 // in seconds
const MAX_ROUNDS = 5
const MAX_PLAYERS = 16
let rooms = {}

module.exports = io => {
  return async socket => {
    try {
      const { room, name, id } = socket.handshake.query;
      console.log(`player: ${name} is joining room: ${room}`)
      let playerObject = { id, name, score: 0, roundScore: 0, connected: true }

      const selfMessage = (text, type) => {
        socket.emit('message', { text, type })
      }

      const broadcastMessage =(text, type) => {
        socket.broadcast.to(room).emit('message', { text, type })
      }

      const roomMessage =(text, type) => {
        io.to(room).emit('message', { text, type })
      }

      /**
       * Initialize room if it doesn't exist
       * 
       */
      if (!rooms[room]) {
        // initial room object
        rooms[room] = {
          name: room,
          players: [],
          offlinePlayers: [],
          round: 0,
          rounds: MAX_ROUNDS,
        }
      }
      const r = rooms[room]

      const playerOnline = r.players.find(p => p.id === id)
      const playerOffline = r.offlinePlayers.find(p => p.id === id)
      // if player id already connected
      if (playerOnline || playerOffline?.connected === true) {
        selfMessage('Your id is alread in use in this room', 'error')
        socket.disconnect()
        return
      }
      // if player id already exists but not connected
      else if (playerOffline) {
        r.offlinePlayers = r.offlinePlayers.map(p => {
          if (p.id === id) {
            p.name = name
            p.connected = true
          }
          return p
        })
      }
      // new player to the room
      else {
        r.offlinePlayers = [ ...r.offlinePlayers, playerObject ]
      }

      // join sockte room
      socket.join(r.name)

      selfMessage(`You have joined "${room}" kitchen`)
      broadcastMessage(`${name} has joined "${room}" kitchen`)

      /**
       * Update room players with newer game data
       * 
       */
      const refreshGameData = () => {
        const { counter, ...data } = r
        io.to(room).emit('refresh', data)
        // console.log('game', room, 'data', r)
      }
      // initial refresh
      refreshGameData()


      /**
       * Stop counter
       * 
       */
      const stopCounter = () => {
        if (r.counter) {
          clearInterval(r.counter)
          r.counter = undefined
        }
      }

      /**
       * Start the game
       * 
       */
      const startGame = () => {
        r.started = true
        r.paused = false
        r.round = 0
        r.lastRound = false
        r.players = r.players.map(p => {
          p.score = 0
          return p
        })
        refreshGameData()

        io.to(room).emit('gameStarted')
        nextRound()
      }

      /**
       * handle round count down
       * 
       */
      const handleCountDown = () => {
        process.nextTick(() => {
          // count down
          r.countDown -= 1

          // clear counter if counted down to zero
          if (r.countDown <= 0) {
            if (r.recipe) {
              if (r.showFood) {
                if (r.round >= MAX_ROUNDS) {
                  pauseGame()
                  return
                }
                else {
                  nextRound()
                }      
              }
              else {
                showFood()
              }
            }
            else {
              nextRound(false)
            }
          }
          
          refreshGameData()
        })
      }

      /**
       * Restart counter 
       * 
       */
      const resetCounter = (countFrom = COUNT_DOWN_RECIPE) => {
        // stop old tiemr if exists
        stopCounter()
        // restart counter
        r.countDown = countFrom
        // set new timer
        r.counter = setInterval(handleCountDown, 1000)    
      }

      /**
       * show food
       * 
       */
      const showFood = () => {
        r.showFood = true
        resetCounter(COUNT_DOWN_FOOD)
        refreshGameData()
        roomMessage(`recipe "${r.recipe}" is for ${r.food.name}`)
      }

      /**
       * iterate game rounds
       * 
       */
      const nextRound = (goNextRound = true) => {
        process.nextTick(() => {
          if (goNextRound) {
            r.round += 1
            if (r.round >= r.rounds) {
              r.lastRound = true
            }
          }
          // reset round
          r.recipe = null
          r.showFood = false
          r.players = r.players.map(p => {
            p.answered = false
            p.answer = null
            p.isRight = null
            p.roundScore = 0
            return p
          })

          const nonChefPlayers = r.chef
            ? r.players.filter(p => p.id !== r.chef?.id)
            : r.players

          const nonFoodPlayers = r.food
            ? r.players.filter(p => p.id !== r.food?.id)
            : r.players

          // get 2 random candidates chef & food
          const [chef] = Utils.getRandomElements(nonChefPlayers, 1)
          const [food] = Utils.getRandomElements(nonFoodPlayers, 1)
          r.chef = chef
          r.food = food

          // update client data
          refreshGameData()

          // set count down
          resetCounter()

          roomMessage(`Round ${r.round} started!`)
        })
      }
    
      /**
       * Pause game if there are no players in the room
       * 
       */
      const pauseGame = () => {
        r.paused = true
        r.started = false
        r.players = r.players.map(p => {
          p.isRight = null
          p.roundScore = 0
          return p
        })
        io.to(room).emit('gamePaused')
        refreshGameData()
        stopCounter()
        roomMessage(`Geme ended!`)
      }

      /**
       * SubmitRecipe: store food recipe from chef
       * 
       */
      const handleSubmitRecipeEvent = recipe => {
        // store recipe
        r.recipe = recipe
        refreshGameData()

        selfMessage(`You have submitted your recipe`)
        broadcastMessage(`Chef has submitted his recipe`)
    
        // restart counter
        resetCounter(COUNT_DOWN_ANSWER)
      }
    
      /**
       * SubmitFood: submit food answer
       * 
       */
      const handleSubmitFoodEvent = foodId => {
        // check answer
        const player = r.players.find(p => p.id === id)
        const chef = r.players.find(p => p.id === r.chef?.id)

        const answer = r.players.find(p => p.id === foodId)
        player.answer = answer?.name
        player.answered = true

        if (id !== r.chef?.id) {
          if (r.food?.id === foodId) {
            const points = r.players.filter(p => !p.answered && p.id !== r.chef?.id).length
            player.score += points + 1
            player.roundScore += points + 1

            chef.score += 1
            chef.roundScore += 1

            player.isRight = true
          }
          else {
            player.score -= 1
            player.roundScore -= 1

            player.isRight = false
          }
        }

        const pendingPlayers = r.players.filter(p => !p.answered).length
        selfMessage(`You have submitted your answer (wating: ${pendingPlayers})`)
        broadcastMessage(`${name} has submitted his answer (wating: ${pendingPlayers})`)

        if (pendingPlayers === 0) {
          showFood()
        }

        refreshGameData()
      }
    
      /**
       * EnterGame: Enter player into the game
       * 
       */
      const handleEnterGameEvent = () => {
        console.log(`player: ${name} entered game ${room} with id: ${id}`)

        // limit in-game players
        if (r.players.length >= MAX_PLAYERS) {
          selfMessage(`Maximum ${MAX_PLAYERS} players can be in the same game!`, 'error')
          return
        }
        
        // update information if player was offline in this room
        const wasOffline = r.offlinePlayers.find(p => p.id === id)
        if (wasOffline) {
          wasOffline.name = name
          playerObject = wasOffline
        }

        // add player to online list
        r.players = [ ...r.players, playerObject ]

        // remove player from offline list
        r.offlinePlayers = r.offlinePlayers.filter(p => p.id !== id)

        refreshGameData()
      }

      /**
       * StartGame: start the game
       * 
       */
      const handleStartGameEvent = () => {
        startGame()

        selfMessage(`You have started the game`)
        broadcastMessage(`${name} has started the game`)
      }

      /**
       * NextRound: go to next round and skip counter
       * 
       */
      const handleNextRoundEvent = () => {
        if (r.round >= MAX_ROUNDS) {
          pauseGame()
          return
        }
        nextRound()
      }

0      /**
       * SkipAnswer: skip answering for this round
       * 
       */
      const handleSkipAnswerEvent = () => {
        const player = r.players.find(p => p.id === id)

        player.answer = '(skipped)'
        player.answered = true

        const pendingPlayers = r.players.filter(p => !p.answered).length
        selfMessage(`You have skipped this round (wating: ${pendingPlayers})`)
        broadcastMessage(`${name} has skipped this round (wating: ${pendingPlayers})`)

        if (pendingPlayers === 0) {
          showFood()
        }

        refreshGameData()
      }

      /**
       * Disconnect: announce an player disconnection
       * 
       */
      const handleDisconnectEvent = () => {
        console.log(`player: ${name} disconnected from room: ${room}`)

        // find player on online list
        const playerOnline = r.players.find(p => p.id === id)
        const playerOffline = r.offlinePlayers.find(p => p.id === id)

        // add player to offline list if he was online
        if (playerOnline) {
          // add to offline list
          playerOnline.connected = false
          playerOnline.isRight = null
          playerOnline.roundScore = 0
          r.offlinePlayers = [ ...r.offlinePlayers, playerOnline ]

          // remove from online list
          r.players = r.players.filter(p => p.id !== id)

          broadcastMessage(`${name} been disconnected`, 'error')

          // pause game if not enough players around
          if (!r.paused && r.players.length < 3) {
            pauseGame()
          }
    
          // skip round if disconnected user was a chef or a food
          else if (r.chef?.id === id || r.food?.id === id) {
            nextRound(false)
          }
        }
        else if (playerOffline) {
          // update connected status
          r.offlinePlayers = r.offlinePlayers.map(p => {
            if (p.id === id) {
              p.connected = false
            }
            return p
          })
        }

        refreshGameData()
      }


      /**
       * Listen to events
       * 
       */
      socket.on('enterGame', handleEnterGameEvent)
      socket.on('startGame', handleStartGameEvent)
      socket.on('nextRound', handleNextRoundEvent)
      socket.on('skipAnswer', handleSkipAnswerEvent)
      
      socket.on('submitRecipe', handleSubmitRecipeEvent)
      socket.on('submitFood', handleSubmitFoodEvent)

      socket.on('disconnect', handleDisconnectEvent) 
    }
    catch(e) {
      console.log('[ERROR][SOCKET]', e);
      socket.disconnect();
      socket.leave(r.name)
    }
  }
}

