import { parseActions } from './playActions'
import { GameStates, State } from './types'
import { playSequence } from './videos'

const idleState: State = {
  start: () => {
    playSequence([{ player: 1, anim: 'await', position: 0 }]),
      playSequence([{ player: 2, anim: 'await', position: 0 }])
    console.log('deb')
  },
  input: (_, ctx) => {
    ctx.state = 'settings'
  },
}

const settingsState: State = {
  start: async ctx => {
    if (ctx.round === 1)
      await Promise.all([
        playSequence([
          { player: 1, anim: 'start' },
          { player: 1, anim: 'fight' },
        ]),
        playSequence([
          { player: 2, anim: 'start' },
          { player: 2, anim: 'fight' },
        ]),
      ])
    ctx.setOutput('enter your commands')
  },
  input: (input, ctx) => {
    const { player, action } = input
    if (player === 1) {
      if (ctx.actions.player1.length < 10)
        ctx.actions = {
          ...ctx.actions,
          player1: [...ctx.actions.player1, action],
        }
    }
    if (player === 2) {
      if (ctx.actions.player2.length < 10)
        ctx.actions = {
          ...ctx.actions,
          player2: [...ctx.actions.player2, action],
        }
    }
    console.log(ctx.actions.player1.length, ctx.actions.player2.length)
    if (ctx.actions.player1.length >= 10 && ctx.actions.player2.length >= 10)
      ctx.state = 'animation'
  },
}

const animState: State = {
  start: async ctx => {
    ctx.setOutput('fight')
    const { round, actions } = ctx
    await parseActions(actions.player1, actions.player2, ctx)
    if (round >= 3) {
      ctx.state = 'end'
      return
    }
    ctx.round = ctx.round + 1
    ctx.state = 'settings'
    ctx.actions = { player1: [], player2: [] }
  },
}

const endState: State = {
  start: async ctx => {
    const { score } = ctx
    const anim1 = score[0] >= score[1] ? 'win' : 'loose'
    const anim2 = score[1] >= score[0] ? 'win' : 'loose'
    let output = 'draw'
    if (score[0] > score[1]) output = 'player 1 wins'
    if (score[1] > score[0]) output = 'player 2 wins'
    await Promise.all([
      playSequence([{ player: 1, anim: anim1 }]),
      playSequence([{ player: 2, anim: anim2 }]),
    ])
    ctx.setOutput(output)
  },
  input: (_, ctx) => {
    ctx.score = [0, 0]
    ctx.actions = {
      player1: [],
      player2: [],
    }
    ctx.round = 1
    ctx.state = 'settings'
  },
}

export const states: Record<GameStates, State> = {
  idle: idleState,
  settings: settingsState,
  animation: animState,
  end: endState,
}
