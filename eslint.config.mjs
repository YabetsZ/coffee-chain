// FIXME: learn how flat eslint works and apply it here

import tseslint from "typescript-eslint";

export default [
    {
        files: ["src/**/*.{ts,tsx}"],
        ignores: ["dist/**", "node_modules/**"],
        ...tseslint.config({
            parserOptions: {
                project: "./tsconfig.json",
            },
        })[0], // the base config
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
];
