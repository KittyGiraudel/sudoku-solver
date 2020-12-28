const Game = require('./Game')
const { GIANT, EXPERT } = require('./grids')

new Game(9, EXPERT, { colors: true }).solve().render().validate()
