const shakeScreen = (duration = 800, intensity = 2) => {
  document.body.animate(
    [
      { transform: `translateX(0%)`},
      { transform: `translateX(${intensity}%)`},
      { transform: `translateX(-${intensity}%)`},
      { transform: `translateX(${intensity}%)`},
      { transform: `translateX(-${intensity}%)`},
      { transform: `translateX(${intensity}%)`},
      { transform: `translateX(0)`},
    ],
    { duration }
  )
}
