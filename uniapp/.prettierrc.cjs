// @see https://prettier.io/docs/en/options
module.exports = {
    $schema: 'https://json.schemastore.org/prettierrc',
    singleQuote: true,
    printWidth: 160,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    trailingComma: 'all',
    endOfLine: 'auto',
    overrides: [
        {
            files: '*.json',
            options: {
                trailingComma: 'none',
            },
        },
    ],
}
