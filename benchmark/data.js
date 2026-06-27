const getRandomLab = () => [
  Math.random() * 100, //       L: [   0, 100]
  Math.random() * 255 - 128, // a: [-128, 127]
  Math.random() * 255 - 128, // b: [-128, 127]
]

export const arr = Array(1000)
  .fill(0)
  .map(() => ({
    x1: getRandomLab(),
    x2: getRandomLab(),
  }))

export const obj = arr.map(({ x1, x2 }) => {
  const [L1, a1, b1] = x1
  const [L2, a2, b2] = x2
  x1 = { L: L1, a: a1, b: b1 }
  x2 = { L: L2, a: a2, b: b2 }
  return { x1, x2 }
})
