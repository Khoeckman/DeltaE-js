import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE76 } from '../src/index.ts'
import type { LAB } from '../src/index.ts'

// https://colormine.org/delta-e-calculator

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [36.23288178584245, 60.10930952982204, 41.22006831026425]
const x2f: LAB = [55.9588099835815, 66.47798295202801, 77.01211079141827]

describe('CIE76', () => {
  it('Integers', () => {
    expect(getDeltaE_CIE76(x1, x2)).toBeCloseTo(41.14608122288197, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIE76(x1f, x2f)).toBeCloseTo(41.36112364762112, 12)
  })
})
