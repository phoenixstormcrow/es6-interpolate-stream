var interpolate = require('../index'),
    fs = require('fs'),
    context = {
      'hello': 'hello, world!',
      'bar': 5,
      'baz': function () { return 'abcdefg'; }
    };

//pipe it on through
fs.createReadStream('foo.template', {encoding: 'utf8'})
  .pipe(interpolate(context))
  .pipe(process.stdout);
