import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE94 } from '../dist/index.mjs'
import type { LAB, CIE94 } from '../dist/index.d.ts'

// https://colormine.org/delta-e-calculator/cie94

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [36.23288178584245, 60.10930952982204, 41.22006831026425]
const x2f: LAB = [55.9588099835815, 66.47798295202801, 77.01211079141827]

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
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(23.371175890043208, 12)
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
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(16.07074019495419, 12)
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
    expect(getDeltaE_CIE94(x1f, x2f, weights)).toBeCloseTo(22.630282843176676, 12)
  })
})
