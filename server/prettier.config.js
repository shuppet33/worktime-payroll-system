export default {
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    printWidth: 80,
    tabWidth: 4,

    plugins: ['prettier-plugin-sql'],

    sqlDialect: 'postgresql',
    keywordCase: 'upper',
}