export type LAB = [L: number, a: number, b: number]

export interface CMC {
  lightness: number
  chroma: number
}

export interface CIE94 {
  lightness: 1 | 2
  chroma: number
  hue: number
}

export interface CIEDE2000 {
  lightness: number
  chroma: number
  hue: number
}

const { abs, atan2, cos, exp, sin, sqrt, PI } = Math

/**
 * The CIE76 color difference algorithm: Euclidean distance in LAB space.
 * https://en.wikipedia.org/wiki/Color_difference#CIE76
 */
export function getDeltaE_CIE76(x1: LAB, x2: LAB): number {
  const dL = x2[0] - x1[0]
  const da = x2[1] - x1[1]
  const db = x2[2] - x1[2]

  return sqrt(dL * dL + da * da + db * db)
}

/**
 * The CMC l:c (1984) color difference algorithm.
 * https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_(1984)
 */
export function getDeltaE_CMC([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<CMC> = {}): number {
  const { lightness: l = 2, chroma: c = 1 } = weights

  const dL = L2 - L1
  const da = a2 - a1
  const db = b2 - b1

  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1 * b1)
  const C2 = sqrt(a2 * a2 + b2 * b2)
  const dC = C2 - C1

  // hue difference component
  const dH = sqrt(da * da + db * db - dC * dC) || 0

  // hue angle in degrees
  const h1 = (atan2(b1, a1) / PI) * 180

  // hue rotation term
  const T =
    h1 >= 164 && h1 <= 345
      ? 0.56 + abs(0.2 * cos(((h1 + 168) * PI) / 180))
      : 0.36 + abs(0.4 * cos(((h1 + 35) * PI) / 180))

  const C1Pow4 = C1 ** 4
  // reference chroma
  const F = sqrt(C1Pow4 / (C1Pow4 + 1900))

  // weighting functions
  const SL = L1 < 16 ? 0.511 : (0.040975 * L1) / (1 + 0.01765 * L1)
  const SC = (0.0638 * C1) / (1 + 0.0131 * C1) + 0.638
  const SH = SC * (F * T + 1 - F)

  const L = dL / (l * SL)
  const C = dC / (c * SC)
  const H = dH / SH

  return sqrt(L * L + C * C + H * H)
}

/**
 * The CIE94 color difference algorithm.
 * https://en.wikipedia.org/wiki/Color_difference#CIE94
 */
export function getDeltaE_CIE94([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<CIE94> = {}): number {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights
  const K1 = kL === 1 ? 0.045 : 0.048
  const K2 = kL === 1 ? 0.015 : 0.014

  const dL = L1 - L2
  const da = a1 - a2
  const db = b1 - b2

  const C1 = sqrt(a1 * a1 + b1 * b1)
  const C2 = sqrt(a2 * a2 + b2 * b2)
  const dC = C1 - C2

  // hue difference component
  const dH = sqrt(da * da + db * db - dC * dC) || 0

  // weighting functions
  // const SL = 1
  const SC = 1 + K1 * C1
  const SH = 1 + K2 * C1

  const L = dL / kL // const L = dL / (kC * SL)
  const C = dC / (kC * SC)
  const H = dH / (kH * SH)

  return sqrt(L * L + C * C + H * H)
}

/**
 * The CIEDE2000 color difference algorithm.
 * https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
 */
export function getDeltaE_CIEDE2000([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<CIEDE2000> = {}): number {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const dLPrime = L2 - L1

  const b1Pow2 = b1 * b1
  const b2Pow2 = b2 * b2

  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1Pow2)
  const C2 = sqrt(a2 * a2 + b2Pow2)

  const Lb = (L1 + L2) / 2
  const Cb = (C1 + C2) / 2

  const CbPow7 = Cb ** 7
  // hue rotation factor
  const G = 0.5 * (1 - sqrt(CbPow7 / (CbPow7 + 6103515625)))

  const ap1 = a1 + a1 * G
  const ap2 = a2 + a2 * G

  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap2 * ap2 + b2Pow2)
  const Cbp = (Cp1 + Cp2) / 2
  const dCp = Cp2 - Cp1

  // hue angles in degrees
  const hp1 = (atan2(b1, ap1) / PI) * 180
  const hp2 = (atan2(b2, ap2) / PI) * 180

  let dHp = 0
  let hbp = 0

  if (Cp1 === 0 || Cp2 === 0) {
    hbp = hp1 + hp2 // undefined hue, sum as placeholder
  } else {
    // half of shortest angular difference [-180,180]
    const dhp1_2 = (((hp2 - hp1 + 540) % 360) - 180) / 2 // normalize angle from [-360,360] to [-90,90]
    dHp = 2 * sqrt(Cp1 * Cp2) * sin((dhp1_2 / 180) * PI)
    hbp = (hp1 + dhp1_2 + 360) % 360 // average hue, wrapped to [0,360]
  }

  // hue rotation term
  const T =
    1 +
    -0.17 * cos(((hbp - 30) / 180) * PI) +
    0.24 * cos(((2 * hbp) / 180) * PI) +
    0.32 * cos(((3 * hbp + 6) / 180) * PI) +
    -0.2 * cos(((4 * hbp - 63) / 180) * PI)

  // lightness weighting
  const dLbPow2 = (Lb - 50) * (Lb - 50)
  const SL = 1 + (0.015 * dLbPow2) / sqrt(20 + dLbPow2)

  // chroma and hue weightings
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T

  const CbpPow7 = Cbp ** 7
  const RC = 2 * sqrt(CbpPow7 / (CbpPow7 + 6103515625))

  // rotation term for hue interaction
  const RT = -sin(((60 * exp(-(((hbp - 275) / 25) ** 2))) / 180) * PI) * RC

  const L = dLPrime / (kL * SL)
  const C = dCp / (kC * SC)
  const H = dHp / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}
