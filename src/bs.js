function getRandomLabPairs() {
  return {
    x1: [
      Math.random() * 100, // L: [   0, 100]
      Math.random() * 255 - 128, // a: [-128, 127]
      Math.random() * 255 - 128, // b: [-128, 127]
    ],
    x2: [Math.random() * 100, Math.random() * 255 - 128, Math.random() * 255 - 128],
  }
}

const arr = Array(100)
  .fill(0)
  .map((e) => getRandomLabPairs())
let obj = []

for (let { x1, x2 } of arr) {
  const [L1, a1, b1] = x1
  const [L2, a2, b2] = x2
  obj.push({ x1: { L: L1, a: a1, b: b1 }, x2: { L: L2, a: a2, b: b2 } })
}

// Deltae-js Hyper
const { abs, atan2, cos, exp, sin, sqrt, pow, PI } = Math
const DEG2RAD = PI / 180
const RAD2DEG = 180 / PI
const POW25_7 = 6103515625

function getDeltaE_CIEDE2000(x1, x2, weights = {}) {
  const { lightness: kL = 1, chroma: kC = 1, hue: kH = 1 } = weights

  const L1 = x1[0]
  const a1 = x1[1]
  const b1 = x1[2]

  const L2 = x2[0]
  const a2 = x2[1]
  const b2 = x2[2]

  const b1Pow2 = b1 * b1
  const b2Pow2 = b2 * b2
  // chroma of each color
  const C1 = sqrt(a1 * a1 + b1Pow2)
  const C2 = sqrt(a2 * a2 + b2Pow2)
  const Lb = (L1 + L2) * 0.5
  const Cb = (C1 + C2) * 0.5
  const Cb3 = Cb * Cb * Cb
  const CbPow7 = Cb3 * Cb3 * Cb
  // hue rotation factor
  const G = (1 - sqrt(CbPow7 / (CbPow7 + POW25_7))) * 0.5
  const Gp1 = G + 1
  const ap1 = a1 * Gp1
  const ap2 = a2 * Gp1
  const Cp1 = sqrt(ap1 * ap1 + b1Pow2)
  const Cp2 = sqrt(ap2 * ap2 + b2Pow2)
  const Cbp = (Cp1 + Cp2) * 0.5
  let dHp = 0
  let hbp = 0
  if (Cp1 !== 0 && Cp2 !== 0) {
    // hue angles in degrees, only needed when both colors have chroma
    const hp1 = atan2(b1, ap1) * RAD2DEG
    const hp2 = atan2(b2, ap2) * RAD2DEG
    // half of shortest angular difference [-180,180]
    const dhp1_2 = (((hp2 - hp1 + 540) % 360) - 180) * 0.5 // normalize angle from [-360,360] to [-90,90]
    dHp = 2 * sqrt(Cp1 * Cp2) * sin(dhp1_2 * DEG2RAD)
    hbp = (hp1 + dhp1_2 + 360) % 360 // average hue, wrapped to [0,360]
  }
  // hue rotation term
  const T =
    1 +
    -0.17 * cos((hbp - 30) * DEG2RAD) +
    0.24 * cos(2 * hbp * DEG2RAD) +
    0.32 * cos((3 * hbp + 6) * DEG2RAD) +
    -0.2 * cos((4 * hbp - 63) * DEG2RAD)
  // lightness weighting
  const dLb = Lb - 50
  const dLbPow2 = dLb * dLb
  const SL = 1 + (0.015 * dLbPow2) / sqrt(20 + dLbPow2)
  // chroma and hue weightings
  const SC = 1 + 0.045 * Cbp
  const SH = 1 + 0.015 * Cbp * T
  const Cbp3 = Cbp * Cbp * Cbp
  const CbpPow7 = Cbp3 * Cbp3 * Cbp
  // rotation term for hue interaction
  const dHbp = (hbp - 275) * 0.04
  const RT = -2 * sqrt(CbpPow7 / (CbpPow7 + POW25_7)) * sin(60 * exp(-(dHbp * dHbp)) * DEG2RAD)
  const L = (L2 - L1) / (kL * SL)
  const C = (Cp2 - Cp1) / (kC * SC)
  const H = dHp / (kH * SH)
  return sqrt(L * L + C * C + H * H + RT * C * H)
}

// Bullshit
function dE00(x1, x2, weights = {}) {
  this.x1 = x1
  this.x2 = x2

  const { lightness: ksubL = 1, chroma: ksubC = 1, hue: ksubH = 1 } = weights
  this.ksubL = ksubL
  this.ksubC = ksubC
  this.ksubH = ksubH

  this.deltaLPrime = x2.L - x1.L

  this.LBar = (x1.L + x2.L) / 2

  this.C1 = sqrt(pow(x1.A, 2) + pow(x1.B, 2))
  this.C2 = sqrt(pow(x2.A, 2) + pow(x2.B, 2))

  this.CBar = (this.C1 + this.C2) / 2

  const CbPow3 = this.CBar * this.CBar * this.CBar
  const CbPow7 = CbPow3 * CbPow3 * this.CBar

  this.aPrime1 = x1.A + (x1.A / 2) * (1 - sqrt(CbPow7 / (CbPow7 + POW25_7)))
  this.aPrime2 = x2.A + (x2.A / 2) * (1 - sqrt(CbPow7 / (CbPow7 + POW25_7)))

  // C Prime 1
  this.CPrime1 = sqrt(pow(this.aPrime1, 2) + pow(x1.B, 2))
  this.CPrime2 = sqrt(pow(this.aPrime2, 2) + pow(x2.B, 2))

  this.CBarPrime = (this.CPrime1 + this.CPrime2) / 2

  this.SsubL = 1 + (0.015 * pow(this.LBar - 50, 2)) / sqrt(20 + pow(this.LBar - 50, 2))
  this.SsubC = 1 + 0.045 * this.CBarPrime

  /**
   * Properties set in getDeltaE method, for access to convenience functions
   */
  this.hPrime1 = 0
  this.hPrime2 = 0
  this.deltahPrime = 0
  this.deltaHPrime = 0
  this.HBarPrime = 0
  this.T = 0
  this.SsubH = 0
  this.RsubT = 0
}

dE00.prototype.getDeltaE = function () {
  this.hPrime1 = this.gethPrime1()
  this.hPrime2 = this.gethPrime2()

  this.deltahPrime = this.getDeltahPrime()
  this.deltaHPrime = 2 * sqrt(this.CPrime1 * this.CPrime2) * sin((this.deltahPrime * DEG2RAD) / 2)

  this.HBarPrime = this.getHBarPrime()

  this.T = this.getT()

  this.SsubH = 1 + 0.015 * this.CBarPrime * this.T
  this.RsubT = this.getRsubT()

  const lightness = this.deltaLPrime / (this.ksubL * this.SsubL)
  const chroma = (this.CPrime2 - this.CPrime1) / (this.ksubC * this.SsubC)
  const hue = this.deltaHPrime / (this.ksubH * this.SsubH)

  return sqrt(pow(lightness, 2) + pow(chroma, 2) + pow(hue, 2) + this.RsubT * chroma * hue)
}

dE00.prototype.getRsubT = function () {
  const CbpPow3 = this.CBarPrime * this.CBarPrime * this.CBarPrime
  const CbpPow7 = CbpPow3 * CbpPow3 * this.CBarPrime

  return -2 * sqrt(CbpPow7 / (CbpPow7 + POW25_7)) * sin(60 * exp(-pow((this.HBarPrime - 275) * 0.04, 2)) * DEG2RAD)
}

dE00.prototype.getT = function () {
  return (
    1 -
    0.17 * cos((this.HBarPrime - 30) * DEG2RAD) +
    0.24 * cos(2 * this.HBarPrime * DEG2RAD) +
    0.32 * cos((3 * this.HBarPrime + 6) * DEG2RAD) -
    0.2 * cos((4 * this.HBarPrime - 63) * DEG2RAD)
  )
}

dE00.prototype.getHBarPrime = function () {
  if (abs(this.hPrime1 - this.hPrime2) > 180) return (this.hPrime1 + this.hPrime2 + 360) / 2

  return (this.hPrime1 + this.hPrime2) / 2
}

dE00.prototype.getDeltahPrime = function () {
  // When either C′1 or C′2 is zero, then Δh′ is irrelevant and may be set to
  // zero.
  if (0 === this.C1 || 0 === this.C2) return 0

  if (abs(this.hPrime1 - this.hPrime2) <= 180) return this.hPrime2 - this.hPrime1

  if (this.hPrime2 <= this.hPrime1) return this.hPrime2 - this.hPrime1 + 360
  else return this.hPrime2 - this.hPrime1 - 360
}

dE00.prototype.gethPrime1 = function () {
  return this.getHPrimeFn(this.x1.B, this.aPrime1)
}

dE00.prototype.gethPrime2 = function () {
  return this.getHPrimeFn(this.x2.B, this.aPrime2)
}

dE00.prototype.getHPrimeFn = function (x, y) {
  if (x === 0 && y === 0) return 0

  const hueAngle = Math.atan2(x, y) * RAD2DEG

  if (hueAngle >= 0) return hueAngle
  else return hueAngle + 360
}

function getDeltaE00(x1, x2, weights = {}) {
  const deltaE = new dE00(x1, x2, weights)
  return deltaE.getDeltaE()
}

return { arr, obj, getDeltaE_CIEDE2000, getDeltaE00 }
