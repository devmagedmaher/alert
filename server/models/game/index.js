const SocketIO = require("../socketIO")


class Game extends SocketIO {

  /**
   * game unique name
   * 
   * @type {String}
   */
  name = ''

   /**
    * short description
    * 
    * @type {String}
    */
  description = '' 

  /**
   * default minimum players required to start the game
   * 
   * @type {Integer}
   */
  max_players = 3

  /**
   * default maximum players can join the game
   * 
   * @type {Integer}
   */
  min_players = 2

  /**
   * Game status (started|ended)
   * 
   * @type {Boolean}
   */
  started = false

  /**
   * is game loading
   * 
   * @type {Boolean}
   */
  isLoading = false

  /**
   * current round of the game
   * 
   * @type {Integer}
   */
  round = 0

  /**
   * total rounds of the game
   * 
   * @type {Integer}
   */
  rounds = 2

  /**
   * questions
   * 
   * @type {Array}
   */
  __questions = []

  /**
   * current question
   * 
   * @type {Object}
   */
  question

  /**
   * current answer
   * 
   * @type {Object}
   */
  answer

  /**
   * Timer interval
   * 
   */
  __timer

  /**
   * count down
   * 
   * @type {integer}
   */
  counter = 0

  /**
   * Init game
   * 
   */
  constructor(name, description, { room, io } = {}) {
    super({ room, io })

    this.name = name
    this.description = description
  }

  /**
   * get game basic information
   * 
   * @returns {Object}
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      max_players: this.max_players,
      min_players: this.min_players,
    }
  }

  /**
   * start the game
   * 
   */
  start() {
    this.started = true
    this.round = 0
    this.isLoading = true

    this.roomMessage(`Game "${this.name}" is loading!`, 'info')
    this.refresh(this.toObject(true))

    this.loadGame()
  }

  /**
   * load game data
   * 
   */
  async loadGame() {
    // fetch questions
    this.__questions = await this.fetchQuestions()

    // load round data
    this.nextRound()

    // set loading is false after fetching questions and loading round
    this.isLoading = false

    this.refresh(this.toObject(true))
  }

  /**
   * end the game
   * 
   */
  endGame() {
    this.started = false
    this.clearTimer()
  }

  /**
   * go to the next round
   * 
   */
  nextRound() {
    if (this.round < this.rounds) {
      this.__question = this.__questions[this.round]
      const { answer, ...q } = this.__question
      this.question = q
      this.answer = null
      
      this.round += 1
      this.resetTimer(5)
      this.roomMessage(`Round "${this.round}" started!`, 'info')
    }
    else {
      this.endGame()
      this.roomMessage(`Game "${this.name}" ended!`, 'success')
    }

    this.refresh(this.toObject(true))
  }

  /**
   * show answer
   * 
   */
  showAnswer() {
    this.answer = this.__question.answer
    this.resetTimer(6)

    this.roomMessage(`Round "${this.round}" ended!`, 'success')
    this.refresh(this.toObject(true))
  }

  /**
   * handle timer (every second)
   * 
   */
  handleTimer() {
    this.counter -= 1
    // if counter ended
    if (this.counter <= 0) {
      // if answer was displayed
      if (this.answer) {
        // go to next round
        this.nextRound()
      }
      // if answer was NOT displayed
      else {
        // show answer
        this.showAnswer()
      }
    }
    else {

      this.refresh(this.toObject(true))
    }
  }

  /**
   * clear count down timer
   * 
   */
  clearTimer() {
    if (this.__timer) {
      clearInterval(this.__timer)
      this.__timer = null
    }
  }

  /**
   * reset count down timer from specific point
   * 
   * @param {Integer} from count down starting from
   * 
   */
  resetTimer(from = 15) {
    this.counter = from
    this.clearTimer()
    this.__timer = setInterval(this.handleTimer.bind(this), 1000)
  }

  async fetchQuestions() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            question: {
              text: 'What is the larges country ?',
            },
            answer: { text: 'China', id: 2 },
            options: [
              { text: 'Egypt', id: 1 },
              { text: 'China', id: 2 },
              { text: 'Germany', id: 3 },
              { text: 'japan', id: 4 },
            ]
          },
          {
            question: {
              text: 'What is the smallest country ?',
            },
            answer: { text: 'Bahrain', id: 3 },
            options: [
              { text: 'Italy', id: 1 },
              { text: 'Australia', id: 2 },
              { text: 'Bahrain', id: 3 },
              { text: 'Sudan', id: 4 },
            ]
          },
        ])
      }, 2000)
    })
  }

  toObject(insideObject) {
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    if (insideObject) {
      return { game: object }
    }

    return object
  }
}


module.exports = Game