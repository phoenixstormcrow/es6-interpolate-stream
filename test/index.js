'use strict';

var test = require('tape'),
    interpolator = require('../src/interpolator'),
    fs = require('fs'),
    template = fs.createReadStream('test/template.js', {encoding: 'utf8'}),
    context = {
      'name': 'Silent Bob',
      'version': 'infinity and beyond',
      'description': 'Nothing to say.',
      'year': 1996,
      'author': 'Kevin Smith',
      'license': 'to chill'
    },
    expected = fs.readFileSync('test/expected.txt', {encoding: 'utf8'}),
    actual = 'test/actual.txt';

/* remove the computed file for a clean test */
try {
  fs.unlinkSync(actual);
} catch (e) {
  if (e.code !== 'ENOENT') {
    throw (e);
  }
}

template.pipe(interpolator(context))
  .pipe(fs.createWriteStream(actual, {encoding: 'utf8'}))
  .on('finish', function () {

    test('actual equals expected', function (t) {
      var act = fs.readFileSync(actual, {encoding: 'utf8'});
      t.equal(act, expected, 'actual equals expected');
      t.end();
    });
  });
