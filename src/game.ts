import { states } from './states'
import { GameContext, GameStates, Input } from './types'

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj

export const newGame = (
  setScores: (values: [number, number]) => void,
  setRound: (value: number) => void,
  setActions: (actions: { player1: string[]; player2: string[] }) => void,
  setOutput: (text: string) => void
) => {
  const initialContext: GameContext = {
    score: [0, 0],
    actions: { player1: [], player2: [] },
    round: 1,
    state: 'idle',
    setOutput: setOutput,
  }
  let currentState = states[initialContext.state]
  const ctx = new Proxy(initialContext, {
    set: (target, property, newValue) => {
      if (property === 'state') {
        if (!hasKey(target, property)) return false
        const newState = states[newValue as GameStates]
        const exitState = currentState.exit
        if (exitState) exitState(ctx)
        currentState = newState
        if (newState.start) newState.start(ctx)
        document.body.className = newValue
        console.log('state : ', newValue)
      }
      if (property === 'score') {
        setScores(newValue as [number, number])
      }
      if (property === 'round') {
        console.log('setround')
        setRound(newValue as number)
      }
      if (property === 'actions') {
        setActions(newValue as { player1: string[]; player2: string[] })
      }
      return Reflect.set(target, property, newValue)
    },
  })
  if (currentState.start) currentState.start(ctx)
  return {
    input: (action: Input) => {
      if (currentState.input) currentState.input(action, ctx)
    },
    ctx,
  }
}
