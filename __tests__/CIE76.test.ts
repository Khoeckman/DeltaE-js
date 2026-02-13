import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE76 } from '../src/index.ts'
import type { LAB } from '../src/index.ts'

// https://colormine.org/delta-e-calculator

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [53.23288178584245, 80.10930952982204, 67.22006831026425]
const x2f: LAB = [50.9588099835815, 77.47798295202801, 65.01211079141827]

describe('CIE76', () => {
  it('Return DeltaE with integers', () => {
    expect(getDeltaE_CIE76(x1, x2)).toBe(41.14608122288197)
  })
  it('Return DeltaE with doubles', () => {
    expect(getDeltaE_CIE76(x1f, x2f)).toBe(4.119509500641079)
  })
})
