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

const scalar = arr.map(({ x1, x2 }) => {
  return x1.concat(x2)
})

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
const invPI = 1 / PI
const inv180 = 1 / 180

function getDeltaE_CIEDE2000_1_1_10([L1, a1, b1], [L2, a2, b2], weights = {}) {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const dLPrime = L2 - L1

  const b1Pow2 = b1 * b1
  const b2Pow2 = b2 * b2

  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1Pow2)
  const C2 = sqrt(a2 * a2 + b2Pow2)

  const Lb = (L1 + L2) * 0.5
  const Cb = (C1 + C2) * 0.5

  const CbPow7 = Cb ** 7
  // hue rotation factor
  const G = (1 - sqrt(CbPow7 / (CbPow7 + 6103515625))) * 0.5

  const ap1 = a1 + a1 * G
  const ap2 = a2 + a2 * G

  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap2 * ap2 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5
  const dCp = Cp2 - Cp1

  // hue angles in degrees
  const hp1 = atan2(b1, ap1) * invPI * 180
  const hp2 = atan2(b2, ap2) * invPI * 180

  let dHp = 0
  let hbp = 0

  if (Cp1 === 0 || Cp2 === 0) {
    hbp = hp1 + hp2 // undefined hue, sum as placeholder
  } else {
    // half of shortest angular difference [-180,180]
    const dhp1_2 = (((hp2 - hp1 + 540) % 360) - 180) * 0.5 // normalize angle from [-360,360] to [-90,90]
    dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp1_2 * inv180 * PI)
    hbp = (hp1 + dhp1_2 + 360) % 360 // average hue, wrapped to [0,360]
  }

  // hue rotation term
  const T =
    1 +
    -0.17 * cos((hbp - 30) * inv180 * PI) +
    0.24 * cos(2 * hbp * inv180 * PI) +
    0.32 * cos((3 * hbp + 6) * inv180 * PI) +
    -0.2 * cos((4 * hbp - 63) * inv180 * PI)

  // lightness weighting
  const dLbPow2 = (Lb - 50) * (Lb - 50)
  const SL = 1 + (0.015 * dLbPow2) / sqrt(20 + dLbPow2)

  // chroma and hue weightings
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T

  const CbpPow7 = Cbp ** 7

  // rotation term for hue interaction
  const RT = -2 * sqrt(CbpPow7 / (CbpPow7 + 6103515625)) * sin(60 * exp(-(((hbp - 275) * 0.04) ** 2)) * inv180 * PI)

  const L = dLPrime / (kL * SL)
  const C = dCp / (kC * SC)
  const H = dHp / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}

// Deltae-js 1.1.11 (Takes Array)
function getDeltaE_CIEDE2000_1_1_11_array([L1, a1, b1], [L2, a2, b2], weights = {}) {
  return getDeltaE_CIEDE2000_1_1_11_object({ L: L1, A: a1, B: b1 }, { L: L2, A: a2, B: b2 }, weights)
}

// Deltae-js 1.1.11 (Takes Scalar)
function getDeltaE_CIEDE2000_1_1_11_scalar(L1, a1, b1, L2, a2, b2, weights = {}) {
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
  const Cp2 = sqrt(ap1 * ap1 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5

  let hp1 = Math.atan2(b1, ap1) * RAD2DEG
  let hp2 = Math.atan2(b2, ap2) * RAD2DEG

  if (hp1 < 0) hp1 += 360
  if (hp2 < 0) hp2 += 360

  let dhp = 0

  if (C1 !== 0 && C2 !== 0) {
    dhp = hp2 - hp1

    if (abs(dhp) > 180) {
      if (hp2 <= hp1) dhp += 360
      else dhp -= 360
    }
  }

  const dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp * DEG2RAD_2)

  let hbp = (hp1 + hp2) * 0.5
  if (abs(hp1 - hp2) > 180) hbp += 180

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

// Deltae-js 1.1.11 (Takes Object)
function getDeltaE_CIEDE2000_1_1_11_object(x1, x2, weights = {}) {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const b1Pow2 = x1.B * x1.B
  const b2Pow2 = x2.B * x2.B

  // chroma of each color
  const C1 = sqrt(x1.A * x1.A + b1Pow2)
  const C2 = sqrt(x2.A * x2.A + b2Pow2)

  const Lb = (x1.L + x2.L) * 0.5
  const Cb = (C1 + C2) * 0.5

  // hue rotation factor
  const CbPow3 = Cb * Cb * Cb
  const CbPow7 = CbPow3 * CbPow3 * Cb
  const G = (1 - sqrt(CbPow7 / (CbPow7 + POW25_7))) * 0.5

  const ap1 = x1.A * (G + 1)
  const ap2 = x2.A * (G + 1)

  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap1 * ap1 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5

  let hp1 = Math.atan2(x1.B, ap1) * RAD2DEG
  let hp2 = Math.atan2(x2.B, ap2) * RAD2DEG

  if (hp1 < 0) hp1 += 360
  if (hp2 < 0) hp2 += 360

  let dhp = 0

  if (C1 !== 0 && C2 !== 0) {
    dhp = hp2 - hp1

    if (abs(dhp) > 180) {
      if (hp2 <= hp1) dhp += 360
      else dhp -= 360
    }
  }

  const dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp * DEG2RAD_2)

  let hbp = (hp1 + hp2) * 0.5
  if (abs(hp1 - hp2) > 180) hbp += 180

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

  const L = (x2.L - x1.L) / (kL * SL)
  const C = (Cp2 - Cp1) / (kC * SC)
  const H = dHp / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}

function scalarToObject(x) {
  return { L: x[0], a: x[1], b: x[2] }
}

return {
  arr,
  obj,
  scalar,
  getDeltaE_CIEDE2000_1_1_10,
  getDeltaE_CIEDE2000_1_1_11_array,
  getDeltaE_CIEDE2000_1_1_11_scalar,
  getDeltaE_CIEDE2000_1_1_11_object,
  scalarToObject,
}
