import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config({ignores:['dist/**','_work/**','node_modules/**','.pnpm-store/**','.tools/**']},js.configs.recommended,...ts.configs.recommended);
