import { describe, expect, it } from 'vitest'
import { getDeltaE_CMC } from '../dist/index.mjs'
import type { LAB, CMC } from '../dist/index.d.ts'

// https://colormine.org/delta-e-calculator/cmc

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [36.23288178584245, 60.10930952982204, 41.22006831026425]
const x2f: LAB = [55.9588099835815, 66.47798295202801, 77.01211079141827]

describe('CMC (2:1)', () => {
  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2)).toBe(20.585495546195663)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f)).toBe(20.60831444571369)
  })
})

describe('CMC (1:1)', () => {
  const weights: CMC = {
    lightness: 1,
    chroma: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBe(27.505547144725295)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBe(27.93916148779591)
  })
})

describe('CMC (1:2)', () => {
  const weights: CMC = {
    lightness: 1,
    chroma: 2,
  }

  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBe(26.2355448687314)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBe(26.683379730941457)
  })
})
