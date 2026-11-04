import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2017',
    // Peer deps (react, @mui/*, @emotion/*) are auto-externalized by tsup;
    // the regexes also cover deep imports like @mui/material/Card.
    external: [/^react($|\/)/, /^react-dom($|\/)/, /^@mui\//, /^@emotion\//],
});
