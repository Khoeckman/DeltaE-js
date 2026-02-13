import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE94 } from '../src/index.ts'
import type { LAB, CIE94 } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cie94

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [81.46616267819043, 11.143985285302138, 69.72016882033124]
const x2f: LAB = [54.007350272360895, 77.76507047052338, -71.51475624720828]

describe('CIE94 (1:1:1)', () => {
  const weights: CIE94 = {
    lightness: 1,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIE94(x1, x2, weights)).toBeCloseTo(22.849281934529994, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(79.28630646631358, 12)
  })
})

describe('CIE94 (2:1:1)', () => {
  const weights: CIE94 = {
    lightness: 2,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIE94(x1, x2, weights)).toBeCloseTo(15.985487841950448, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(78.1598574160527, 12)
  })
})

describe('CIE94 (1:2:1)', () => {
  const weights: CIE94 = {
    lightness: 1,
    chroma: 2,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIE94(x1, x2, weights)).toBeCloseTo(22.09310415823928, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(78.95272657693889, 12)
  })
})
