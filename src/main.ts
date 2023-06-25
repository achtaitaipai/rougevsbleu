import { startControls } from './controls'
import { newGame } from './game'
import { loadVideos } from './videos'
import './style.css'

const scoresElement = document.querySelectorAll('.score')
const roundElement = document.querySelector('.round')
const cursorsElement = document.querySelectorAll('.cursor')
const setScore = (scores: [number, number]) => {
  scoresElement[0].textContent = scores[0].toString()
  scoresElement[1].textContent = scores[1].toString()
}

const setRound = (round: number) => {
  if (!roundElement) return
  roundElement.textContent = round.toString() + '/3'
}

const setCursor = (actions: { player1: string[]; player2: string[] }) => {
  Array.from(cursorsElement[0].children).forEach((el, i) => {
    el.classList.toggle('active', i < actions.player1.length)
  })
  Array.from(cursorsElement[1].children).forEach((el, i) => {
    el.classList.toggle('active', i < actions.player2.length)
  })
}

const setOutput = (text: string) => {
  const outputElement = document.querySelector('output')
  if (!outputElement) return
  outputElement.textContent = text
  const clone = outputElement.cloneNode(true)
  outputElement.parentNode?.replaceChild(clone, outputElement)
}
loadVideos()
const game = newGame(setScore, setRound, setCursor, setOutput)

startControls({
  player1: new Map([
    ['R', 'left'],
    ['A', 'right'],
    ['D', 'punch'],
  ]),
  player2: new Map([
    ['Q', 'left'],
    ['P', 'right'],
    ['T', 'punch'],
  ]),
  callback: (player, action) => game.input({ player, action }),
})
