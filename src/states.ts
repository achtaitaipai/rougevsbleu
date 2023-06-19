import { GameStates, State } from './types'

export const statesList = ['idle', 'settings', 'animation', 'end'] as const
export const actions = ['left', 'right', 'punch'] as const

//Todo implementer ce bazar pour de vrai
const playAnim = (...anims: string[]) => new Promise(res => res(anims))

const idleState: State = {
  input: (_, ctx) => {
    ctx.state = 'settings'
  },
}

const settingsState: State = {
  input: (input, ctx) => {
    const { player, action } = input
    const { actions } = ctx
    if (player === 1) {
      actions.player1.push(action)
    } else {
      actions.player2.push(action)
    }
    if (actions.player1.length >= 10 && actions.player2.length >= 10)
      ctx.state = 'animation'
  },
}

const animState: State = {
  start: async ctx => {
    const { round, actions } = ctx
    const anims = [...actions.player1, ...actions.player2]
    await playAnim(...anims)
    if (round >= 3) {
      ctx.state = 'end'
      return
    }
    ctx.round = ctx.round + 1
    ctx.state = 'settings'
  },
}

const endState: State = {
  start: async ctx => {
    let anim = 'draw'
    if (ctx.score[0] > ctx.score[1]) anim = 'player1'
    else if (ctx.score[1] > ctx.score[0]) anim = 'player2'
    await playAnim(anim)
    ctx.state = 'idle'
  },
}

export const states: Record<GameStates, State> = {
  idle: idleState,
  settings: settingsState,
  animation: animState,
  end: endState,
}
