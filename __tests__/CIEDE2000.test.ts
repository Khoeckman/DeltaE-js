import { describe, expect, it } from 'vitest'
import { getDeltaE_CIEDE2000 } from '../src/index.ts'
import type { LAB, CIEDE2000 } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cie2000

const x1: LAB = [36, 60, 41]
const x2: LAB = [55, 66, 77]

const x1f: LAB = [81.46616267819043, 11.143985285302138, 69.72016882033124]
const x2f: LAB = [54.007350272360895, 77.76507047052338, -71.51475624720828]

describe('CIEDE2000 (1:1:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBeCloseTo(22.394506952417903, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBeCloseTo(70.5183071276013, 12)
  })

  it('0.00 difference', () => {
    expect(getDeltaE_CIEDE2000([0, 0, 0], [0, 0, 0], weights)).toBe(0)
    expect(getDeltaE_CIEDE2000([99.5, 0.005, -0.01], [99.5, 0.005, -0.01], weights)).toBe(0)
  })
  it('100.00 difference', () => {
    expect(getDeltaE_CIEDE2000([100, 0, 0], [0, 0, 0], weights)).toBe(100)
  })

  // Results in the paper only have 4 decimal precision
  function testDataFromPaper(expected: number, x1: LAB, x2: LAB) {
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
    testDataFromPaper(2.0425, [50, 2.6772, -79.7751], [50, 0, -82.7485])
  })
  it('True chroma difference (#2)', () => {
    testDataFromPaper(2.8615, [50, 3.1571, -77.2803], [50, 0, -82.7485])
  })
  it('True chroma difference (#3)', () => {
    testDataFromPaper(3.4412, [50, 2.8361, -74.02], [50, 0, -82.7485])
  })
  it('True hue difference (#4)', () => {
    testDataFromPaper(1, [50, -1.3802, -84.2814], [50, 0, -82.7485])
  })
  it('True hue difference (#5)', () => {
    testDataFromPaper(1, [50, -1.1848, -84.8006], [50, 0, -82.7485])
  })
  it('True hue difference (#6)', () => {
    testDataFromPaper(1, [50, -0.9009, -85.5211], [50, 0, -82.7485])
  })
  it('Arctangent computation (#7)', () => {
    testDataFromPaper(2.3669, [50, 0, 0], [50, -1, 2])
  })
  it('Arctangent computation (#8)', () => {
    testDataFromPaper(2.3669, [50, -1, 2], [50, 0, 0])
  })
  it('Arctangent computation (#9)', () => {
    testDataFromPaper(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.0009])
  })
  it('Arctangent computation (#10)', () => {
    testDataFromPaper(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.001])
  })
  it('Arctangent computation (#11)', () => {
    testDataFromPaper(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0011])
  })
  it('Arctangent computation (#12)', () => {
    testDataFromPaper(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0012])
  })
  it('Arctangent computation (#13)', () => {
    testDataFromPaper(4.8045, [50, -0.001, 2.49], [50, 0.0009, -2.49])
  })
  it('Arctangent computation (#14)', () => {
    testDataFromPaper(4.7461, [50, -0.001, 2.49], [50, 0.001, -2.49])
  })
  it('Arctangent computation (#15)', () => {
    testDataFromPaper(4.7461, [50, -0.001, 2.49], [50, 0.0011, -2.49])
  })
  it('Arctangent computation (#16)', () => {
    testDataFromPaper(4.3065, [50, 2.5, 0], [50, 0, -2.5])
  })
  it('Large color differences (#17)', () => {
    testDataFromPaper(27.1492, [50, 2.5, 0], [73, 25, -18])
  })
  it('Large color differences (#18)', () => {
    testDataFromPaper(22.8977, [50, 2.5, 0], [61, -5, 29])
  })
  it('Large color differences (#19)', () => {
    testDataFromPaper(31.903, [50, 2.5, 0], [56, -27, -3])
  })
  it('Large color differences (#20)', () => {
    testDataFromPaper(19.4535, [50, 2.5, 0], [58, 24, 15])
  })
  it('CIE technical report (#21)', () => {
    testDataFromPaper(1, [50, 2.5, 0], [50, 3.1736, 0.5854])
  })
  it('CIE technical report (#22)', () => {
    testDataFromPaper(1, [50, 2.5, 0], [50, 3.2972, 0])
  })
  it('CIE technical report (#23)', () => {
    testDataFromPaper(1, [50, 2.5, 0], [50, 1.8634, 0.5757])
  })
  it('CIE technical report (#24)', () => {
    testDataFromPaper(1, [50, 2.5, 0], [50, 3.2592, 0.335])
  })
  it('CIE technical report (#25)', () => {
    testDataFromPaper(1.2644, [60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387])
  })
  it('CIE technical report (#26)', () => {
    testDataFromPaper(1.263, [63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864])
  })
  it('CIE technical report (#27)', () => {
    testDataFromPaper(1.8731, [61.2901, 3.7196, -5.3901], [61.4292, 2.248, -4.962])
  })
  it('CIE technical report (#28)', () => {
    testDataFromPaper(1.8645, [35.0831, -44.1164, 3.7933], [35.0232, -40.0716, 1.5901])
  })
  it('CIE technical report (#29)', () => {
    testDataFromPaper(2.0373, [22.7233, 20.0904, -46.694], [23.0331, 14.973, -42.5619])
  })
  it('CIE technical report (#30)', () => {
    testDataFromPaper(1.4146, [36.4612, 47.858, 18.3852], [36.2715, 50.5065, 21.2231])
  })
  it('CIE technical report (#31)', () => {
    testDataFromPaper(1.4441, [90.8027, -2.0831, 1.441], [91.1528, -1.6435, 0.0447])
  })
  it('CIE technical report (#32)', () => {
    testDataFromPaper(1.5381, [90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239])
  })
  it('CIE technical report (#33)', () => {
    testDataFromPaper(0.6377, [6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286])
  })
  it('CIE technical report (#34)', () => {
    testDataFromPaper(0.9082, [2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514])
  })
})

describe('CIEDE2000 (2:1:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 2,
    chroma: 1,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBeCloseTo(15.966839123149132, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBeCloseTo(67.93742486169461, 12)
  })
})

describe('CIEDE2000 (1:2:1)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 2,
    hue: 1,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBeCloseTo(21.814747434250933, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBeCloseTo(70.25293589976195, 12)
  })
})

describe('CIEDE2000 (1:1:2)', () => {
  const weights: CIEDE2000 = {
    lightness: 1,
    chroma: 1,
    hue: 2,
  }

  it('Integers', () => {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)).toBeCloseTo(19.939488746945784, 12)
  })
  it('Doubles', () => {
    expect(getDeltaE_CIEDE2000(x1f, x2f, weights)).toBeCloseTo(40.47100802978132, 12)
  })
})
