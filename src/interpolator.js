/* input:  javascript source code with
           ${expression} placeholders
   output: javascript source code with placeholders replaced
           by the evaluated expressions

   exports: a function which takes a parsed package.json
            and returns a transform stream
*/
'use strict';

var babel = require('babel-core'),
    Transform = require('stream').Transform;

module.exports = function (context) {
  var code = '`',
      stream = new Transform({encoding: 'utf8'});


  stream._transform = function (chunk, enc, cb) {
    code += chunk;
    cb();
  };

  stream._flush = function (cb) {
    code += '`';
    var tokens = babel.transform(code).ast.tokens;

    tokens.filter(function (token) {
      return token.type.type === 'name';
    })
    .forEach(function (token) {
      token.value = context[token.value];
    });

    this.push(tokens.map(function (token) {
        return token.value;
    }).join(''));

    cb();
  };

  return stream;
};
