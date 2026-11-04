import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default tseslint.config(
    { ignores: ['dist', 'public', 'node_modules'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: { 'react-hooks': reactHooks, react },
        rules: {
            // Classic hooks rules only — the react-hooks v7 compiler rules
            // (immutability, refs) reject this library's pattern of passing
            // the HTMLMediaElement into child controls.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            // Classic JSX runtime (tsconfig jsx: "react"): JSX counts as a use of React
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            // The reducer action payload and MUI style overrides are untyped by design
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                ignoreRestSiblings: true,
                argsIgnorePattern: '^_',
            }],
        },
    },
);
