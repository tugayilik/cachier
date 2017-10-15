module.exports = {
    globals: {},
    'env': {
        'browser': true
    },
    rules: {
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off'
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {
            "jsx": true,
        }
    }
};