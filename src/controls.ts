import { Actions } from './types'

type Config = {
  player1: Map<string, Actions>
  player2: Map<string, Actions>
  callback: (player: 1 | 2, action: Actions) => void
}

const keys = new Map<string,boolean>()

export const startControls = ({ player1, player2, callback }: Config) => {
  document.addEventListener('keypress', e => {
    const key = e.key
    if(keys.get(key))return
    const action = player1.get(key) ?? player2.get(key)
    if (!action) return
    let player: 1 | 2 = player1.has(key) ? 1 : 2
    callback(player, action)
    keys.set(key,true)
    setTimeout(()=>keys.set(key,false),400)
  })
}
