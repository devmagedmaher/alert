

class Game {

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
  rounds = 4

  /**
   * Init game
   */
  constructor(name, description) {
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


  toObject() {
    const { ...object } = this

    // delete private props and methods
    Object.keys(object).forEach(key => {
      if (key.startsWith('__')) {
        delete object[key]
      }
    })

    return object
  }
}


module.exports = Game