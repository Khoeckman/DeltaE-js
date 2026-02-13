import { describe, expect, it } from 'vitest'
import { getDeltaE_CIEDE2000 } from '../src/index.ts'
import type { LAB, CIEDE2000 } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cie2000

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [36.23288178584245, 60.10930952982204, 41.22006831026425]
const x2f: LAB = [55.9588099835815, 66.47798295202801, 77.01211079141827]

describe('CIEDE2000 (1:1:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBe(22.394506952417903)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBe(22.9922547320809)
  })

  it('0.00 difference', () => {
    expect(getDeltaE_CIEDE2000([0, 0, 0], [0, 0, 0], weights)).toBe(0)
    expect(getDeltaE_CIEDE2000([99.5, 0.005, -0.01], [99.5, 0.005, -0.01], weights)).toBe(0)
  })
  it('100.00 difference', () => {
    expect(getDeltaE_CIEDE2000([100, 0, 0], [0, 0, 0], weights)).toBe(100)
  })

  function assertTestData(expected: number, x1: LAB, x2: LAB) {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)) //
      .toBeCloseTo(expected, 4)
  }

  /**
   * Sharma, G., Wencheng Wu, & Edul N. Dalal. (2004).
   * The CIEDE2000 Color-Difference Formula:
   * implementation notes, supplementary test data, and mathematical observations.
   *
   * (pp. 4) TABLE I. CIEDE2000 total color difference test data:
   * https://hajim.rochester.edu/ece/sites/gsharma/papers/CIEDE2000CRNAFeb05.pdf
   */
  it('True chroma difference (#1)', () => {
    assertTestData(2.0425, [50, 2.6772, -79.7751], [50, 0, -82.7485])
  })
  it('True chroma difference (#2)', () => {
    assertTestData(2.8615, [50, 3.1571, -77.2803], [50, 0, -82.7485])
  })
  it('True chroma difference (#3)', () => {
    assertTestData(3.4412, [50, 2.8361, -74.02], [50, 0, -82.7485])
  })
  it('True hue difference (#4)', () => {
    assertTestData(1, [50, -1.3802, -84.2814], [50, 0, -82.7485])
  })
  it('True hue difference (#5)', () => {
    assertTestData(1, [50, -1.1848, -84.8006], [50, 0, -82.7485])
  })
  it('True hue difference (#6)', () => {
    assertTestData(1, [50, -0.9009, -85.5211], [50, 0, -82.7485])
  })
  it('Arctangent computation (#7)', () => {
    assertTestData(2.3669, [50, 0, 0], [50, -1, 2])
  })
  it('Arctangent computation (#8)', () => {
    assertTestData(2.3669, [50, -1, 2], [50, 0, 0])
  })
  it('Arctangent computation (#9)', () => {
    assertTestData(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.0009])
  })
  it('Arctangent computation (#10)', () => {
    assertTestData(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.001])
  })
  it('Arctangent computation (#11)', () => {
    assertTestData(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0011])
  })
  it('Arctangent computation (#12)', () => {
    assertTestData(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0012])
  })
  it('Arctangent computation (#13)', () => {
    assertTestData(4.8045, [50, -0.001, 2.49], [50, 0.0009, -2.49])
  })
  it('Arctangent computation (#14)', () => {
    assertTestData(4.7461, [50, -0.001, 2.49], [50, 0.001, -2.49])
  })
  it('Arctangent computation (#15)', () => {
    assertTestData(4.7461, [50, -0.001, 2.49], [50, 0.0011, -2.49])
  })
  it('Arctangent computation (#16)', () => {
    assertTestData(4.3065, [50, 2.5, 0], [50, 0, -2.5])
  })
  it('Large color differences (#17)', () => {
    assertTestData(27.1492, [50, 2.5, 0], [73, 25, -18])
  })
  it('Large color differences (#18)', () => {
    assertTestData(22.8977, [50, 2.5, 0], [61, -5, 29])
  })
  it('Large color differences (#19)', () => {
    assertTestData(31.903, [50, 2.5, 0], [56, -27, -3])
  })
  it('Large color differences (#20)', () => {
    assertTestData(19.4535, [50, 2.5, 0], [58, 24, 15])
  })
  it('CIE technical report (#21)', () => {
    assertTestData(1, [50, 2.5, 0], [50, 3.1736, 0.5854])
  })
  it('CIE technical report (#22)', () => {
    assertTestData(1, [50, 2.5, 0], [50, 3.2972, 0])
  })
  it('CIE technical report (#23)', () => {
    assertTestData(1, [50, 2.5, 0], [50, 1.8634, 0.5757])
  })
  it('CIE technical report (#24)', () => {
    assertTestData(1, [50, 2.5, 0], [50, 3.2592, 0.335])
  })
  it('CIE technical report (#25)', () => {
    assertTestData(1.2644, [60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387])
  })
  it('CIE technical report (#26)', () => {
    assertTestData(1.263, [63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864])
  })
  it('CIE technical report (#27)', () => {
    assertTestData(1.8731, [61.2901, 3.7196, -5.3901], [61.4292, 2.248, -4.962])
  })
  it('CIE technical report (#28)', () => {
    assertTestData(1.8645, [35.0831, -44.1164, 3.7933], [35.0232, -40.0716, 1.5901])
  })
  it('CIE technical report (#29)', () => {
    assertTestData(2.0373, [22.7233, 20.0904, -46.694], [23.0331, 14.973, -42.5619])
  })
  it('CIE technical report (#30)', () => {
    assertTestData(1.4146, [36.4612, 47.858, 18.3852], [36.2715, 50.5065, 21.2231])
  })
  it('CIE technical report (#31)', () => {
    assertTestData(1.4441, [90.8027, -2.0831, 1.441], [91.1528, -1.6435, 0.0447])
  })
  it('CIE technical report (#32)', () => {
    assertTestData(1.5381, [90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239])
  })
  it('CIE technical report (#33)', () => {
    assertTestData(0.6377, [6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286])
  })
  it('CIE technical report (#34)', () => {
    assertTestData(0.9082, [2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514])
  })
})

describe('CIEDE2000 (2:1:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 2,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBe(15.966839123149132)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBe(16.064048964165973)
  })
})

describe('CIEDE2000 (1:2:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 2,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBe(21.814747434250933)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBe(22.426524253369486)
  })
})

describe('CIEDE2000 (1:1:2)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 1,
    hue: 2,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBe(19.939488746945784)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBe(20.698933318795095)
  })
})
