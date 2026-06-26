const getRandomLab = () => [
  Math.random() * 100, //       L: [   0, 100]
  Math.random() * 255 - 128, // a: [-128, 127]
  Math.random() * 255 - 128, // b: [-128, 127]
]

const arr = Array(1000)
  .fill(0)
  .map(() => ({
    x1: getRandomLab(),
    x2: getRandomLab(),
  }))

const obj = arr.map(({ x1, x2 }) => {
  const [L1, a1, b1] = x1
  const [L2, a2, b2] = x2
  x1 = { L: L1, a: a1, b: b1 }
  x2 = { L: L2, a: a2, b: b2 }
  return { x1, x2 }
})

// Global constants
const { abs, atan2, cos, exp, sin, sqrt, pow, PI } = Math
const DEG2RAD = PI / 180
const DEG2RAD_2 = PI / 360
const RAD2DEG = 180 / PI
const POW25_7 = 6103515625

// Deltae-js 1.1.10
function getDeltaE_CIEDE2000_1_1_10([L1, a1, b1], [L2, a2, b2], weights = {}) {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const b1Pow2 = b1 * b1
  const b2Pow2 = b2 * b2

  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1Pow2)
  const C2 = sqrt(a2 * a2 + b2Pow2)

  const Lb = (L1 + L2) * 0.5
  const Cb = (C1 + C2) * 0.5

  // hue rotation factor
  const CbPow3 = Cb * Cb * Cb
  const CbPow7 = CbPow3 * CbPow3 * Cb

  const G = (1 - sqrt(CbPow7 / (CbPow7 + POW25_7))) * 0.5

  const ap1 = a1 * (G + 1)
  const ap2 = a2 * (G + 1)

  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap2 * ap2 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5

  let dHp = 0
  let hbp = 0

  if (Cp1 !== 0 && Cp2 !== 0) {
    // hue angles in degrees
    const hp1 = atan2(b1, ap1) * RAD2DEG
    const hp2 = atan2(b2, ap2) * RAD2DEG

    // half of shortest angular difference [-180,180]
    const dhp1_2 = (((hp2 - hp1 + 540) % 360) - 180) * 0.5 // normalize angle from [-360,360] to [-90,90]
    dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp1_2 * DEG2RAD)
    hbp = (hp1 + dhp1_2 + 360) % 360 // average hue, wrapped to [0,360]
  }

  // hue rotation term
  const T =
    1 -
    0.17 * cos((hbp - 30) * DEG2RAD) +
    0.24 * cos(2 * hbp * DEG2RAD) +
    0.32 * cos((3 * hbp + 6) * DEG2RAD) -
    0.2 * cos((4 * hbp - 63) * DEG2RAD)

  // lightness weighting
  const dLb = Lb - 50
  const dLbPow2 = dLb * dLb
  const SL = 1 + (0.015 * dLbPow2) / sqrt(20 + dLbPow2)

  // chroma and hue weightings
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T

  // rotation term for hue interaction
  const CbpPow3 = Cbp * Cbp * Cbp
  const CbpPow7 = CbpPow3 * CbpPow3 * Cbp

  const dHbp = (hbp - 275) * 0.04

  const RT = -2 * sqrt(CbpPow7 / (CbpPow7 + POW25_7)) * sin(60 * exp(-(dHbp * dHbp)) * DEG2RAD)

  const L = (L2 - L1) / (kL * SL)
  const C = (Cp2 - Cp1) / (kC * SC)
  const H = dHp / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}

// Deltae-js 1.1.11
function getDeltaE_CIEDE2000_1_1_11(x1, x2, weights = {}) {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const b1Pow2 = x1.b * x1.b
  const b2Pow2 = x2.b * x2.b

  // chroma of each color
  const C1 = sqrt(x1.a * x1.a + b1Pow2)
  const C2 = sqrt(x2.a * x2.a + b2Pow2)

  const Lb = (x1.L + x2.L) * 0.5
  const Cb = (C1 + C2) * 0.5

  // hue rotation factor
  const CbPow3 = Cb * Cb * Cb
  const CbPow7 = CbPow3 * CbPow3 * Cb

  const G = (1 - sqrt(CbPow7 / (CbPow7 + POW25_7))) * 0.5

  const ap1 = x1.a * (G + 1)
  const ap2 = x2.a * (G + 1)

  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap2 * ap2 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5

  // hue angles in degrees
  const hp1 = atan2(x1.b, ap1) * RAD2DEG
  if (hp1 < 0) hp1 += 360

  const hp2 = atan2(x2.b, ap2) * RAD2DEG
  if (hp2 < 0) hp2 += 360

  let dhp = 0

  if (abs(hp1 - hp2) <= 180) dhp = hp2 - hp1
  else {
    if (hp2 <= hp1) dhp = hp2 - hp1 + 360
    else dhp = hp2 - hp1 - 360
  }

  const dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp * DEG2RAD_2)

  let hbp = (hp1 + hp2) * 0.5
  if (abs(hp1 - hp2) > 180) hbp += 180

  const T =
    1 -
    0.17 * cos((hbp - 30) * DEG2RAD) +
    0.24 * cos(2 * hbp * DEG2RAD) +
    0.32 * cos((3 * hbp + 6) * DEG2RAD) -
    0.2 * cos((4 * hbp - 63) * DEG2RAD)

  // lightness weighting
  const dLb = Lb - 50
  const dLbPow2 = dLb * dLb
  const SL = 1 + (0.015 * dLbPow2) / sqrt(20 + dLbPow2)

  // chroma and hue weightings
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T

  // rotation term for hue interaction
  const CbpPow3 = Cbp * Cbp * Cbp
  const CbpPow7 = CbpPow3 * CbpPow3 * Cbp

  const dHbp = (hbp - 275) * 0.04

  const RT = -2 * sqrt(CbpPow7 / (CbpPow7 + POW25_7)) * sin(60 * exp(-(dHbp * dHbp)) * DEG2RAD)

  const L = (x2.L - x1.L) / (kL * SL)
  const C = (Cp2 - Cp1) / (kC * SC)
  const H = dHp / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}

return { arr, obj, getDeltaE_CIEDE2000_1_1_10, getDeltaE_CIEDE2000_1_1_11 }
