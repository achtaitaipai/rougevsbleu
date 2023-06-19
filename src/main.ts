import { startControls } from './controls'
import { newGame } from './game'
import './style.css'

const game = newGame()

startControls({
  player1: new Map([
    ['q', 'left'],
    ['d', 'right'],
    ['s', 'punch'],
  ]),
  player2: new Map([
    ['j', 'left'],
    ['l', 'right'],
    ['k', 'punch'],
  ]),
  callback: (player, action) => game.input({ player, action }),
})
