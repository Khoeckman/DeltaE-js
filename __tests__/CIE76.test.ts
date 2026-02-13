import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE76 } from '../src/index.ts'
import type { LAB } from '../src/index.ts'

// https://colormine.org/delta-e-calculator

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [81.46616267819043, 11.143985285302138, 69.72016882033124]
const x2f: LAB = [54.007350272360895, 77.76507047052338, -71.51475624720828]

describe('CIE76', () => {
  it('Integers', () => {
    expect(getDeltaE_CIE76(x1, x2)).toBeCloseTo(41.14608122288197, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIE76(x1f, x2f)).toBeCloseTo(158.55490982252346, 12)
  })
})
