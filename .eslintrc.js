module.exports = {
  extends: '@alipay/eslint-config-zm-web',
  rules: {
    // 4 个空格, 默认 2 个空格
    // indent: ['error', 4],
    // 不要分号, 默认要分号
    // semi: ['error', 'never'],
    // 双引号, 默认单引号
    // quotes: ["error", "double"],
    // 需要尾逗号, 默认不要, 文档 https://github.com/airbnb/javascript#commas--dangling
    // 'comma-dangle': [
    //   'error',
    //   {
    //     arrays: 'always-multiline',
    //     objects: 'always-multiline',
    //     imports: 'always-multiline',
    //     exports: 'always-multiline',
    //     functions: 'always-multiline',
    //   },
    // ],
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-multi-assign': 'off',
    'prefer-rest-params': 'off',
    placeholder: ['off'],
  },
}
