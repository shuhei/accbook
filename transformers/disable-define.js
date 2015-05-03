/* eslint-env node */
'use strict';

var babel = require('babel-core');
var Transformer = babel.Transformer;

module.exports = new Transformer('disable-define', {
  Identifier: function Identifier(node) {
    if (node.name === 'define') {
      // Advice from @t_wada. Not to change source map.
      // https://twitter.com/t_wada/status/582560881533304833
      node.name = '__def_';
    }
  }
});
