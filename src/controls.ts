import { Actions } from './types'

type Config = {
  player1: Map<string, Actions>
  player2: Map<string, Actions>
  callback: (player: 1 | 2, action: Actions) => void
}
export const startControls = ({ player1, player2, callback }: Config) => {
  document.addEventListener('keypress', e => {
    if (e.repeat) return
    const key = e.key
    console.log(key)
    const action = player1.get(key) ?? player2.get(key)
    if (!action) return
    let player: 1 | 2 = player1.has(key) ? 1 : 2
    callback(player, action)
  })
}
