export type LAB = [L: number, a: number, b: number]

export interface LC {
  lightness: 1 | 2
  chroma: number
}

export interface LCH extends LC {
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
export function getDeltaE_CMC([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<LC> = {}): number {
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

  const h1 = (atan2(b1, a1) / PI) * 180 // rad to deg

  // hue rotation term
  const T =
    h1 >= 164 && h1 <= 345
      ? 0.56 + abs(0.2 * cos(((h1 + 168) * PI) / 180)) // deg to rad
      : 0.36 + abs(0.4 * cos(((h1 + 35) * PI) / 180)) // deg to rad

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
export function getDeltaE_CIE94([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<LCH> = {}): number {
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
export function getDeltaE_CIEDE2000([L1, a1, b1]: LAB, [L2, a2, b2]: LAB, weights: Partial<LCH> = {}): number {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const dLPrime = L2 - L1

  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1 * b1)
  const C2 = sqrt(a2 * a2 + b2 * b2)

  const LBar = (L1 + L2) / 2
  const CBar = (C1 + C2) / 2

  const CBarPow7 = CBar ** 7
  // hue rotation factor
  const G = 0.5 * (1 - sqrt(CBarPow7 / (CBarPow7 + 6103515625)))

  const aPrime1 = a1 + a1 * G
  const aPrime2 = a2 + a2 * G

  const CPrime1 = sqrt(aPrime1 * aPrime1 + b1 * b1)
  const CPrime2 = sqrt(aPrime2 * aPrime2 + b2 * b2)
  const CBarPrime = (CPrime1 + CPrime2) / 2
  const dCPrime = CPrime2 - CPrime1

  // hue angles in degrees
  const hPrime1 = ((atan2(b1, aPrime1) / PI) * 180 + 360) % 360 // rad to deg
  const hPrime2 = ((atan2(b2, aPrime2) / PI) * 180 + 360) % 360 // rad to deg

  let dHPrime = 0
  let hBarPrime = 0

  if (CPrime1 === 0 || CPrime2 === 0) {
    hBarPrime = hPrime1 + hPrime2 // undefined hue, sum as placeholder
  } else {
    // shortest angular difference [-180,180]
    const dhPrime = ((((hPrime2 - hPrime1 + 180) % 360) + 360) % 360) - 180 // normalize angle from [-360,360] to [-180,180]
    dHPrime = 2 * sqrt(CPrime1 * CPrime2) * sin((dhPrime / 360) * PI) // deg to rad
    hBarPrime = (hPrime1 + dhPrime / 2 + 360) % 360 // average hue, wrapped to [0,360]
  }

  // hue rotation term
  const T =
    1 +
    -0.17 * cos(((hBarPrime - 30) / 180) * PI) +
    0.24 * cos(((2 * hBarPrime) / 180) * PI) +
    0.32 * cos(((3 * hBarPrime + 6) / 180) * PI) +
    -0.2 * cos(((4 * hBarPrime - 63) / 180) * PI) // deg to rad

  // lightness weighting
  const dLBarPow2 = (LBar - 50) * (LBar - 50)
  const SL = 1 + (0.015 * dLBarPow2) / sqrt(20 + dLBarPow2)

  // chroma and hue weightings
  const SC = 1 + 0.045 * CBarPrime
  const SH = 1 + 0.015 * CBarPrime * T

  const CBarPrimePow7 = CBarPrime ** 7
  // rotation term for hue interaction
  const RT =
    -2 *
    sqrt(CBarPrimePow7 / (CBarPrimePow7 + 6103515625)) *
    sin(((60 * exp(-(((hBarPrime - 275) / 25) ** 2))) / 180) * PI) // deg to rad

  const L = dLPrime / (kL * SL)
  const C = dCPrime / (kC * SC)
  const H = dHPrime / (kH * SH)

  return sqrt(L * L + C * C + H * H + RT * C * H)
}
