const BOXES = {
  TOP: ['┯', '┳', '┏', '┓'],
  BOTTOM: ['┷', '┻', '┗', '┛'],
  SEPARATOR: ['┼', '╂', '┠', '┨'],
  THICK_SEPARATOR: ['┿', '╋', '┣', '┫'],
  MIDDLE: ['│', '┃', '┃', '┃'],
}
const SYMBOLS = '123456789ABCDEFG'.split('')
const COLORS = [
  'greenBright',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'grey',
]

module.exports = { SYMBOLS, COLORS, BOXES }
