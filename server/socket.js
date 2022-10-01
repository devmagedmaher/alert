const { IconBrandGoogle } = require('@tabler/icons')
const Utils = require('./utils')

const COUNT_DOWN_RECIPE = 20 // in seconds
const COUNT_DOWN_ANSWER = 20 // in seconds
const COUNT_DOWN_FOOD = 15 // in seconds
const MAX_ROUNDS = 5
let rooms = {}

module.exports = io => {
  return async socket => {
    try {
      const { room, name, id } = socket.handshake.query;
      console.log(`player: ${name} connected to room: ${room}`)

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

      socket.join(r.name)

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
        r.players = r.players.map(p => ({ ...p, score: 0 }))
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
                r.showFood = true
                resetCounter(COUNT_DOWN_FOOD)
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
          r.players = r.players.map(p => ({
            ...p,
            answered: false,
            answer: null,
            isRight: null,
            roundScore: 0,
          }))

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
        })
      }
    
      /**
       * Pause game if there are no players in the room
       * 
       */
      const pauseGame = () => {
        r.paused = true
        r.started = false
        r.players = r.players.map(p => ({ ...p, isRight: null }))
        io.to(room).emit('gamePaused')
        refreshGameData()
        stopCounter()
      }

      /**
       * SubmitRecipe: store food recipe from chef
       * 
       */
      const handleSubmitRecipeEvent = recipe => {
        // store recipe
        r.recipe = recipe
        refreshGameData()
    
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

        if (r.players.every(p => p.answered)) {
          r.showFood = true
          
          // restart counter
          resetCounter(COUNT_DOWN_FOOD)
        }
        
        refreshGameData()
      }
    
      /**
       * EnterGame: Enter player into the game
       * 
       */
      const handleEnterGameEvent = () => {
        console.log(`player: ${name} entered game ${room} with id: ${id}`)

        let player = { id, name, score: 0, roundScore: 0 }
        const wasOffline = r.offlinePlayers.find(p => p.id === id)
        if (wasOffline) {
          player = { ...wasOffline, name }
        }

        const isDuplicated = r.players.find(p => p.id === id)
        if (isDuplicated) {
          refreshGameData()
          return
        }

        r.players = [ ...r.players, player ]

        refreshGameData()
      }

      /**
       * StartGame: start the game
       * 
       */
      const handleStartGameEvent = () => {
        startGame()
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

      /**
       * SkipAnswer: skip answering for this round
       * 
       */
      const handleSkipAnswerEvent = () => {
        const player = r.players.find(p => p.id === id)

        player.answer = '(skipped)'
        player.answered = true

        if (r.players.every(p => p.answered)) {
          r.showFood = true
          
          // restart counter
          resetCounter(COUNT_DOWN_FOOD)
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
        const player = r.players.find(p => p.id === id)

        // add player to offline list if he w
        if (player) {
          r.offlinePlayers = [ ...r.offlinePlayers, player ]

          // remove from online list
          r.players = r.players.filter(p => p.id !== id)

          // skip round if disconnected user was a chef or a food
          if (r.chef?.id === id || r.food?.id === id) {
            nextRound(false)
          }

          // pause game if not enough players around
          if (!r.paused && r.players.length < 3) {
            pauseGame()
          }        
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

