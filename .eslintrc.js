module.exports = {
  'rules': {
    // インデントは2スペースに強制
    'indent': [
      2,
      2
    ],
    // シングルクオートを強制
    'quotes': [
      2,
      'single'
    ],
    'linebreak-style': [
      2,
      'unix'
    ],
    // 末尾セミコロンを強制
    'semi': [
      2,
      'always'
    ],
    // 厳密等価演算子を強制
    'eqeqeq': 2,
    // ループの中での関数定義を禁止
    'no-loop-func': 2,
    // 'a' + 'b' = 'ab'のような不要なconcatを禁止
    'no-useless-concat': 2,
    // if-elseの分岐の数が閾値以上を禁止
    'complexity': 2,
    // 関数の中の行数が閾値(default:10)以上を禁止
    'max-statements': [2, 16],
    // 配列の最終要素などに不要なコンマを禁止
    'comma-dangle': 2
  },
  'env': {
    'browser': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'require': true,
    '$': true,
    'jQuery': true,
    'module': true
  }
};
