import { describe, expect, it } from 'vitest'
import { getDeltaE_CMC } from '../src/index.ts'
import type { LAB, CMC } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cmc

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [81.46616267819043, 11.143985285302138, 69.72016882033124]
const x2f: LAB = [54.007350272360895, 77.76507047052338, -71.51475624720828]

describe('CMC (2:1)', () => {
  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2)).toBeCloseTo(20.585495546195663, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f)).toBeCloseTo(96.77807167064532, 12)
  })
})

describe('CMC (1:1)', () => {
  const weights: CMC = {
    lightness: 1,
    chroma: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBeCloseTo(27.505547144725295, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBeCloseTo(98.32401743596745, 12)
  })
})

describe('CMC (1:2)', () => {
  const weights: CMC = {
    lightness: 1,
    chroma: 2,
  }

  it('Integers', () => {
    expect(getDeltaE_CMC(x1, x2, weights)).toBeCloseTo(26.2355448687314, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CMC(x1f, x2f, weights)).toBeCloseTo(97.79449963752903, 12)
  })
})
