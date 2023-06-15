const statesList = ["idle", "settings", "animation", "end"] as const
const actions = ['left','right','punch'] as const

type GameStates = (typeof statesList)[number]
type Actions = typeof actions[number]

type Input = {
  player: 1|2,
  action:Actions
}

type GameContext = {
  round: number
  state: GameStates
  score: [number, number]
  actions: {
    player1:Actions[],
    player2:Actions[]
  }
}

type State = {
  start?: (ctx: GameContext) => GameContext | Promise<GameContext>
  input?: (inputType: Input, ctx: GameContext) => GameContext | Promise<GameContext>
  exit?: (ctx: GameContext) => GameContext | Promise<GameContext>
}

type GameMachine = {
  ctx: GameContext
  states: Record<GameStates, State>
}

//Todo implementer ce bazar pour de vrai
const playAnim = (...anims:string[])=>new Promise((res)=>res(anims))

const idleState: State = {
  input: (_, ctx) => {
    return { ...ctx, state: "settings" }
  },
}

const settingsState: State = {
  input: (input,ctx) => {
    const {player,action} = input
    const {actions} = ctx
    if(player === 1){
      actions.player1.push(action)
    }
    else {
      actions.player2.push(action)
    }
    if(actions.player1.length >= 10 && actions.player2.length >= 10)
      return {...ctx, state:'animation'}
    return ctx
  }
}

const animState:State = {
  start: async (ctx)=>{
    const {round,actions} = ctx
    const anims = [...actions.player1,...actions.player2]
    await playAnim(...anims)
    if(round >=3){
      return {...ctx,state:'end'}
    }
    return {...ctx,state:'settings',round:ctx.round+1}
  }
}

const endState:State = {
  start: async (ctx)=>{
    let anim = 'draw'
    if(ctx.score[0]>ctx.score[1])anim='player1'
    else if (ctx.score[1]>ctx.score[0])anim='player2'
    await playAnim(anim)
    return {...ctx, state:'idle'}
  }
}
