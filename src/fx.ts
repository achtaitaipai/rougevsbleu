export const shakeScreen = async (duration = 400, intensity = 3) => {
  const anim = document.body.animate(
    [
      { transform: `translateX(0%)` },
      { transform: `translateX(${intensity}%)` },
      { transform: `translateX(-${intensity}%)` },
      { transform: `translateX(${intensity}%)` },
      { transform: `translateX(-${intensity}%)` },
      { transform: `translateX(${intensity}%)` },
      { transform: `translateX(0)` },
    ],
    { duration }
  )
  return new Promise(res => {
    anim.onfinish = () => {
      res(true)
    }
  })
}
