// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: './main.ts',
    output: {
        dir: 'output',
        format: 'iife',
        name: 'XXX',
        sourcemap: 'inline',
    },
    plugins: [typescript()]
};