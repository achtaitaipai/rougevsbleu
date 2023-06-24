import { shakeScreen } from './fx'
import { Actions, GameContext } from './types'
import { VideoParams, playSequence } from './videos'
type Position = 1 | 0 | -1
export const parseActions = async (
  actions1: Actions[],
  actions2: Actions[],
  ctx: GameContext
) => {
  const length = Math.min(actions1.length, actions2.length)
  let pos1: Position = 0
  let pos2: Position = 0
  for (let i = 0; i < length; i++) {
    const action1 = actions1[i]
    const action2 = actions2[i]
    const newPos1 = updatePositions(action1, pos1) as Position
    const newPos2 = updatePositions(action2, pos2) as Position
    const goodPunch = isPunch(newPos1, newPos2, action1, action2)
    const anim1: VideoParams[] = [{ player: 1, anim: action1, position: pos1 }]
    const anim2: VideoParams[] = [{ player: 2, anim: action2, position: pos2 }]
    if (goodPunch) {
      if (action1 === 'punch' && action2 !== 'punch')
        anim2.push({ player: 2, anim: 'punched', position: newPos2 })
      if (action2 === 'punch' && action1 !== 'punch')
        anim1.push({ player: 1, anim: 'punched', position: newPos1 })
    }
    await playVideos(anim1, anim2)
    pos1 = newPos1
    pos2 = newPos2
    if (goodPunch) {
      await shakeScreen()
      if (action1 === 'punch') ctx.score = [ctx.score[0] + 1, ctx.score[1]]
      if (action2 === 'punch') ctx.score = [ctx.score[0], ctx.score[1] + 1]
    }
  }
}
const isPunch = (
  pos1: Position,
  pos2: Position,
  action1: Actions,
  action2: Actions
) => pos1 === pos2 && [action1, action2].includes('punch')

const updatePositions = (action: Actions, position: number) => {
  if (action === 'left') return Math.max(-1, position - 1)
  if (action === 'right') return Math.min(1, position + 1)
  return position
}

export const playVideos = async (
  anims1: VideoParams[],
  anims2: VideoParams[]
) => {
  const results = await Promise.all([
    playSequence(anims1),
    playSequence(anims2),
  ])
  return results
}
