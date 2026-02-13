import { describe, expect, it } from 'vitest'
import { getDeltaE_CMC } from '../src/index.ts'
import type { LAB, Weights_LC } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cmc

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [53.23288178584245, 80.10930952982204, 67.22006831026425]
const x2f: LAB = [50.9588099835815, 77.47798295202801, 65.01211079141827]

describe('CMC (2:1)', () => {
  it('Return DeltaE with integers', () => {
    expect(getDeltaE_CMC(x1, x2)).toBe(20.585495546195663)
  })
  it('Return DeltaE with doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f)).toBe(1.418343560011064)
  })
})

describe('CMC (1:1)', () => {
  const weights: Weights_LC = {
    lightness: 1,
    chroma: 1,
  }

  it('Return DeltaE with integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBe(27.505547144725295)
  })
  it('Return DeltaE with doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBe(2.253541246515523)
  })
})

describe('CMC (1:2)', () => {
  const weights: Weights_LC = {
    lightness: 1,
    chroma: 2,
  }

  it('Return DeltaE with integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBe(26.2355448687314)
  })
  it('Return DeltaE with doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBe(2.082393270484363)
  })
})
