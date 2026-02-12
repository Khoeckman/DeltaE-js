import { describe, expect, it } from 'vitest'
import { getDeltaE_CIE94 } from '../src/index.ts'
import type { LAB } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cie94

const c1Int: LAB = [36, 60, 41]
const c2Int: LAB = [55, 66, 77]

const c1Double: LAB = [53.23288178584245, 80.10930952982204, 67.22006831026425]
const c2Double: LAB = [50.9588099835815, 77.47798295202801, 65.01211079141827]

describe('CIE94', () => {
  it('Return DeltaE with integers', () => {
    expect(getDeltaE_CIE94(c1Int, c2Int)).toBe(22.849281934529994)
  })
  it('Return DeltaE with doubles', () => {
    expect(getDeltaE_CIE94(c1Double, c2Double)).toBe(2.3524048718867823)
  })
})
