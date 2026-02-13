import { describe, expect, it } from 'vitest'
import { getDeltaE_CIEDE2000 } from '../src/index.ts'
import type { LAB, Weights } from '../src/index.ts'

// https://colormine.org/delta-e-calculator/cie2000

describe('CIEDE2000 (1:1:1)', () => {
  const weights: Weights = {
    lightness: 1,
    chroma: 1,
    hue: 1,
  }

  function assertDeltaE_CIEDE2000(expected: number, x1: LAB, x2: LAB) {
    expect(getDeltaE_CIEDE2000(x1, x2, weights)) //
      .toBeCloseTo(expected, 4)
  }

  it('0.00 difference', () => {
    assertDeltaE_CIEDE2000(0, [0, 0, 0], [0, 0, 0])
    assertDeltaE_CIEDE2000(0, [99.5, 0.005, -0.01], [99.5, 0.005, -0.01])
  })
  it('100.00 difference', () => {
    assertDeltaE_CIEDE2000(100, [100, 0.01, -0.01], [0, 0, 0])
  })

  /**
   * Sharma, G., Wencheng Wu, & Edul N. Dalal. (2004).
   * The CIEDE2000 Color-Difference Formula:
   * implementation notes, supplementary test data, and mathematical observations.
   *
   * (pp. 4) TABLE I. CIEDE2000 total color difference test data:
   * https://hajim.rochester.edu/ece/sites/gsharma/papers/CIEDE2000CRNAFeb05.pdf
   */
  it('True chroma difference (#1)', () => {
    assertDeltaE_CIEDE2000(2.0425, [50, 2.6772, -79.7751], [50, 0, -82.7485])
  })
  it('True chroma difference (#2)', () => {
    assertDeltaE_CIEDE2000(2.8615, [50, 3.1571, -77.2803], [50, 0, -82.7485])
  })
  it('True chroma difference (#3)', () => {
    assertDeltaE_CIEDE2000(3.4412, [50, 2.8361, -74.02], [50, 0, -82.7485])
  })
  it('True hue difference (#4)', () => {
    assertDeltaE_CIEDE2000(1, [50, -1.3802, -84.2814], [50, 0, -82.7485])
  })
  it('True hue difference (#5)', () => {
    assertDeltaE_CIEDE2000(1, [50, -1.1848, -84.8006], [50, 0, -82.7485])
  })
  it('True hue difference (#6)', () => {
    assertDeltaE_CIEDE2000(1, [50, -0.9009, -85.5211], [50, 0, -82.7485])
  })
  it('Arctangent computation (#7)', () => {
    assertDeltaE_CIEDE2000(2.3669, [50, 0, 0], [50, -1, 2])
  })
  it('Arctangent computation (#8)', () => {
    assertDeltaE_CIEDE2000(2.3669, [50, -1, 2], [50, 0, 0])
  })
  it('Arctangent computation (#9)', () => {
    assertDeltaE_CIEDE2000(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.0009])
  })
  it('Arctangent computation (#10)', () => {
    assertDeltaE_CIEDE2000(7.1792, [50, 2.49, -0.001], [50, -2.49, 0.001])
  })
  it('Arctangent computation (#11)', () => {
    assertDeltaE_CIEDE2000(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0011])
  })
  it('Arctangent computation (#12)', () => {
    assertDeltaE_CIEDE2000(7.2195, [50, 2.49, -0.001], [50, -2.49, 0.0012])
  })
  it('Arctangent computation (#13)', () => {
    assertDeltaE_CIEDE2000(4.8045, [50, -0.001, 2.49], [50, 0.0009, -2.49])
  })
  it('Arctangent computation (#14)', () => {
    assertDeltaE_CIEDE2000(4.7461, [50, -0.001, 2.49], [50, 0.001, -2.49])
  })
  it('Arctangent computation (#15)', () => {
    assertDeltaE_CIEDE2000(4.7461, [50, -0.001, 2.49], [50, 0.0011, -2.49])
  })
  it('Arctangent computation (#16)', () => {
    assertDeltaE_CIEDE2000(4.3065, [50, 2.5, 0], [50, 0, -2.5])
  })
  it('Large color differences (#17)', () => {
    assertDeltaE_CIEDE2000(27.1492, [50, 2.5, 0], [73, 25, -18])
  })
  it('Large color differences (#18)', () => {
    assertDeltaE_CIEDE2000(22.8977, [50, 2.5, 0], [61, -5, 29])
  })
  it('Large color differences (#19)', () => {
    assertDeltaE_CIEDE2000(31.903, [50, 2.5, 0], [56, -27, -3])
  })
  it('Large color differences (#20)', () => {
    assertDeltaE_CIEDE2000(19.4535, [50, 2.5, 0], [58, 24, 15])
  })
  it('CIE technical report (#21)', () => {
    assertDeltaE_CIEDE2000(1, [50, 2.5, 0], [50, 3.1736, 0.5854])
  })
  it('CIE technical report (#22)', () => {
    assertDeltaE_CIEDE2000(1, [50, 2.5, 0], [50, 3.2972, 0])
  })
  it('CIE technical report (#23)', () => {
    assertDeltaE_CIEDE2000(1, [50, 2.5, 0], [50, 1.8634, 0.5757])
  })
  it('CIE technical report (#24)', () => {
    assertDeltaE_CIEDE2000(1, [50, 2.5, 0], [50, 3.2592, 0.335])
  })
  it('CIE technical report (#25)', () => {
    assertDeltaE_CIEDE2000(1.2644, [60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387])
  })
  it('CIE technical report (#26)', () => {
    assertDeltaE_CIEDE2000(1.263, [63.0109, -31.0961, -5.8663], [62.8187, -29.7946, -4.0864])
  })
  it('CIE technical report (#27)', () => {
    assertDeltaE_CIEDE2000(1.8731, [61.2901, 3.7196, -5.3901], [61.4292, 2.248, -4.962])
  })
  it('CIE technical report (#28)', () => {
    assertDeltaE_CIEDE2000(1.8645, [35.0831, -44.1164, 3.7933], [35.0232, -40.0716, 1.5901])
  })
  it('CIE technical report (#29)', () => {
    assertDeltaE_CIEDE2000(2.0373, [22.7233, 20.0904, -46.694], [23.0331, 14.973, -42.5619])
  })
  it('CIE technical report (#30)', () => {
    assertDeltaE_CIEDE2000(1.4146, [36.4612, 47.858, 18.3852], [36.2715, 50.5065, 21.2231])
  })
  it('CIE technical report (#31)', () => {
    assertDeltaE_CIEDE2000(1.4441, [90.8027, -2.0831, 1.441], [91.1528, -1.6435, 0.0447])
  })
  it('CIE technical report (#32)', () => {
    assertDeltaE_CIEDE2000(1.5381, [90.9257, -0.5406, -0.9208], [88.6381, -0.8985, -0.7239])
  })
  it('CIE technical report (#33)', () => {
    assertDeltaE_CIEDE2000(0.6377, [6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286])
  })
  it('CIE technical report (#34)', () => {
    assertDeltaE_CIEDE2000(0.9082, [2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514])
  })
})
