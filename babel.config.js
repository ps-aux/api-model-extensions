module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: true
                }
            }
        ],
        ['@babel/preset-react', {}],
        '@babel/typescript'
    ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        [
            'module-resolver',
            {
                extensions: ['.js', '.ts', '.tsx'],
                root: ['.']
            }
        ],
        '@babel/plugin-proposal-class-properties'
    ]
}
