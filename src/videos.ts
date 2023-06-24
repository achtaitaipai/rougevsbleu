import { actions } from './settings'
export type VideoParams = {
  player: 1 | 2
  position?: -1 | 0 | 1
  anim: Anim
}

const wrappers = document.querySelectorAll<HTMLElement>('.videoWrapper')

const anims = [...actions, 'punched'] as const
type Anim = (typeof anims)[number] | 'start' | 'fight' | 'win' | 'loose'

export const loadVideos = () => {
  wrappers.forEach((element, i) => {
    createVideoElement(element, `/player${i + 1}/start`)
    createVideoElement(element, `/player${i + 1}/fight`)
    createVideoElement(element, `/player${i + 1}/win`)
    createVideoElement(element, `/player${i + 1}/loose`)
    for (let position = -1; position <= 1; position++) {
      anims.forEach(anim => {
        if (position === -1 && anim === 'left') return
        if (position === 1 && anim === 'right') return
        const url = `/player${i + 1}/${position}-${anim}`
        createVideoElement(element, url)
      })
    }
  })
}

const createVideoElement = (wrapper: HTMLElement, videoName: string) => {
  const url ='.' + videoName + '.mov'
  const type = 'video/mp4'
  const video = document.createElement('video')
  const source = document.createElement('source')
  source.src = url
  source.type = type
  video.appendChild(source)
  video.setAttribute('data-video', videoName)
  wrapper.appendChild(video)
}

export const playSequence = async (videos: VideoParams[]) => {
  for (let index = 0; index < videos.length; index++) {
    await playVideo(videos[index])
  }
  return true
}

export const playVideo = async ({ player, position, anim }: VideoParams) =>
  new Promise((res, rej) => {
    anim =
      (position === -1 && anim === 'left') ||
      (position === 1 && anim === 'right')
        ? 'await'
        : anim
    const element = wrappers[player - 1]
    const name =
      position !== undefined
        ? `/player${player}/${position}-${anim}`
        : `/player${player}/${anim}`

    const currentVideo = element.querySelector<HTMLVideoElement>(
      `video[data-video="${name}"]`
    )
    if (!currentVideo) return rej(Error(`pas de vidéo pour ${name}`))
    const oldVideo =
      element.querySelector<HTMLVideoElement>('video.currentVideo')
    if (oldVideo) {
      oldVideo.classList.remove('currentVideo')
      oldVideo.currentTime = 0
    }
    currentVideo.classList.add('currentVideo')
    currentVideo.play()
    currentVideo.onended = () => res(true)
  })
