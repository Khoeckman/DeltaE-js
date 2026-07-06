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
