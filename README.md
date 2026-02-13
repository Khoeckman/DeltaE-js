# DeltaE-JS - Quantify Color Differences in JavaScript/TypeScript

This package gives access to three color difference algorithms.
These algorithms represent the hard work of the [International Commission on Illumination (CIE).](https://www.cie.co.at/)

Historically, each iterative algorithm has been used in print and textile industries to maintain consistency in machine calibration. These days, far more interesting use cases arise with media processing.

## Installation

```shell
npm i deltae-js
pnpm add deltae-js
```

### Usage

```ts
import * as DeltaE from 'deltae-js'
import type { LAB } from 'deltae-js'

// Create two LAB colors to compare
const lab1: LAB = [36, 60, 41]
const lab2: LAB = [100, 40, 90]

// 1976 formula
DeltaE.getDeltaE_CIE76(lab1, lab2)

// 1984 formula
DeltaE.getDeltaE_CMC(lab1, lab2)

// 1994 formula
DeltaE.getDeltaE_CIE94(lab1, lab2)

// 2000 formula
DeltaE.getDeltaE_CIEDE2000(lab1, lab2)
```

### Advanced Usage

```ts
import type { Weights_LC, Weights } from 'deltae-js'

const weights_LC: Weights_LC = {
  lightness: 2,
  chroma: 1,
}
DeltaE.getDeltaE_CMC(lab1, lab2, weights_LC)

const weights_LCH: Weights = {
  lightness: 1,
  chroma: 1,
  hue: 1,
}
DeltaE.getDeltaE_CIE94(lab1, lab2, weights_LCH)
DeltaE.getDeltaE_CIEDE2000(lab1, lab2, weights_LCH)
```

## CIELAB (LAB) Color Space

CIELAB (commonly referred to as LAB) is a perceptually uniform color space defined by the International Commission on Illumination (CIE). Unlike RGB, which is device-dependent, LAB is device-independent and designed to approximate human vision.

In the LAB model:

- **L\*** represents lightness (0 = black, 100 = white)
- **a\*** represents the green–red axis
- **b\*** represents the blue–yellow axis

Because LAB is perceptually uniform, the numerical distance between two colors in this space better reflects how different they appear to the human eye. This makes LAB particularly suitable for:

- Color difference calculations (e.g., ΔE formulas)
- Color sorting and clustering
- Image processing and color analysis

### Converting Colors to LAB

To convert colors from RGB (or other formats) to LAB in JavaScript/TypeScript, you can use the [`color-convert`](https://www.npmjs.com/package/color-convert) package:

```bash
npm i color-convert
```

```ts
import convert from 'color-convert'

const [l, a, b] = convert.rgb.lab(255, 0, 0)
```

This returns the LAB representation of the input RGB color.
