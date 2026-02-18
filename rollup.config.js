import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'DeltaE',
      plugins: [terser({ format: { comments: false } })],
    },
    { file: 'dist/index.mjs', format: 'es' },
    { file: 'dist/index.cjs', format: 'cjs' },
  ],
  plugins: [del({ targets: 'dist/*' }), commonjs(), typescript({ tsconfig: './tsconfig.json', rootDir: 'src' })],
}
