# DeltaE-JS - Quantify Color Differences in JavaScript/TypeScript

<span class="badge-npmversion"><a href="https://npmjs.org/package/deltae-js" title="View this project on NPM"><img src="https://img.shields.io/npm/v/deltae-js.svg" alt="NPM version" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/deltae-js" title="View this project on NPM"><img src="https://img.shields.io/npm/d18m/deltae-js.svg" alt="NPM downloads" /></a></span>
<span><a href="https://www.jsdelivr.com/package/npm/deltae-js" title="View this project on jsDelivr"><img src="https://data.jsdelivr.com/v1/package/npm/deltae-js/badge?style=rounded" alt="jsDelivr hits" /></a></span>
<span><a href="https://github.com/Khoeckman/deltae-js/actions" title="View GitHub workflows"><img src="https://github.com/Khoeckman/deltae-js/actions/workflows/node.js.yml/badge.svg" alt="GitHub workflows" /></a></span>

The best modern way to quantify the difference between two colors is by using the Delta E (ΔE) formulas. These formulas calculate the perceptual difference between two colors in the CIELAB (LAB) color space, which is designed to be more aligned with human vision.
These algorithms represent the hard work of the [International Commission on Illumination (CIE).](https://www.cie.co.at/)

## Performance

The source code is written to be as performant as possible and will likely outperform other packages.
This is achieved by:

- Precomputing and caching heavy constants (eg. 25^7)
- Branchless code (using `%` instead of `if else` statements)
- Keeping code unrolled instead of calling small helper functions for simple conversions
- Reduced arithmetic operations (eg. using `x * x` instead of `Math.pow(x, 2)`)
- Using inverted constants (eg. `x * invPI` instead of `x / PI`) to avoid floating point divisions

## Installation

```shell
npm i deltae-js
# or
pnpm add deltae-js
# or
bun add deltae-js
```

## Usage

```ts
import { getDeltaE_CIE76, getDeltaE_CMC, getDeltaE_CIE94, getDeltaE_CIEDE2000, type LAB } from 'deltae-js'

// Create two LAB colors to compare
const x1: LAB = [36, 60, 41]
const x2: LAB = [100, 40, 90]

// 1976 formula
getDeltaE_CIE76(x1, x2)

// 1984 formula
getDeltaE_CMC(x1, x2)

// 1994 formula
getDeltaE_CIE94(x1, x2)

// 2000 formula
getDeltaE_CIEDE2000(x1, x2)
```

### Usage With Weights

```ts
import type { CMC, CIE94, CIEDE2000 } from 'deltae-js'

const weights_CMC: CMC = {
  lightness: 1.35,
  chroma: 1.5,
}
getDeltaE_CMC(x1, x2, weights_CMC)

const weights_CIE94: CIE94 = {
  lightness: 2, // 1 = Graphic Arts | 2 = Textiles
  chroma: 1.25,
  hue: 1.5,
}
getDeltaE_CIE94(x1, x2, weights_CIE94)

const weights_CIEDE2000: CIEDE2000 = {
  lightness: 1.25,
  chroma: 1.5,
  hue: 1.75,
}
getDeltaE_CIEDE2000(x1, x2, weights_CIEDE2000)
```

## CIELAB (LAB) Color Space

CIELAB (commonly referred to as LAB) is a perceptually uniform color space defined by the International Commission on Illumination (CIE). Unlike RGB, which is device-dependent, LAB is device-independent and designed to approximate human vision.

In the LAB model:

- **L\*** represents lightness (0 = black, 100 = white)
- **a\*** represents the green–red axis (-128 = green, 127 = red)
- **b\*** represents the blue–yellow axis (-128 = blue, 127 = yellow)

Because LAB is perceptually uniform, the numerical distance between two colors in this space better reflects how different they appear to the human eye. This makes LAB particularly suitable for:

- Color difference calculations (ΔE formulas)
- Color sorting and clustering
- Image processing and color analysis

### Converting Color Formats to LAB

To convert colors from RGB (or other formats) to LAB, you can use the [`color-convert`](https://www.npmjs.com/package/color-convert) package:

```bash
npm i color-convert
# or
pnpm add color-convert
# or
bun add color-convert
```

#### Usage Example

The `getDeltaE_fromRGB` function returns the ΔE of the input RGB colors.

```ts
import convert, { type RGB, type LAB } from 'color-convert'
import { getDeltaE_CIEDE2000 } from 'deltae-js'

const getDeltaE_fromRGB = (a: RGB, b: RGB) => {
  const x1: LAB = convert.rgb.lab.raw(a) // Use .raw() to avoid rounding!
  const x2: LAB = convert.rgb.lab.raw(b)
  return getDeltaE_CIEDE2000(x1, x2)
}

const a: RGB = [255, 192, 63]
const b: RGB = [192, 63, 255]

getDeltaE_fromRGB(a, b) // 70.5183071276013
```

## Testing

The output of the `getDeltaE` functions are properly tested using [Vitest](https://vitest.dev/).

Tests may be run with one of the following commands:

```shell
npm test
# or
pnpm test
# or
bun run test
```
