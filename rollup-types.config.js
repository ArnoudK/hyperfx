import typescript from '@rollup/plugin-typescript'

import dts from 'rollup-plugin-dts'

/*  make the .d.ts files build by tsc -b --declarations into
    a single index.d.ts file. 
 */
export default {
    input: 'build/index.d.ts',

    output: {
        format: 'esm',
        file: 'dist/index.d.ts',
    },

    plugins: [typescript({ tsconfig: './tsconfig.json' }), dts()],
}
