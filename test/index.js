'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const plugin = require('../');

mongoose.Promise = Promise;

const DATABASE = 'mongoose-array-length-validators-test';

function model(name, schema = new mongoose.Schema()) {
  return mongoose.model(name, schema);
}

var db = null;

before(function () {
  mongoose.connect(`mongodb:\/\/localhost:27017\/${DATABASE}`);
  db = model('__db').db;
});

beforeEach(function (done) {
  db.dropDatabase(done);
});

describe('module', function () {
  it('exports a function', function () {
    assert.ok(typeof plugin == 'function');
  });
});

describe('plugin', function () {
  var Model;

  before(function () {
    const schema = new mongoose.Schema({
      at_least_one: {
        type: [String],
        default: undefined,
        minlength: 1
      },
      at_most_two: {
        type: [String],
        default: undefined,
        maxlength: 2
      },
      always_two: {
        type: [String],
        default: undefined,
        minlength: 2,
        maxlength: 2
      }
    });

    schema.plugin(plugin);
    Model = model('Plugin', schema);
  });

  describe('#minlength', function () {
    it('causes a validation error', function () {
      const doc = new Model({ at_least_one: [] });

      return doc.validate()
      .then(() => assert.fail('Array minlength validator failed'))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.at_least_one.path, 'at_least_one');
      });
    });

    it('validates conforming values', function () {
      const doc = new Model({ at_least_one: ['Hello, world!'] });

      return doc.validate();
    });
  });

  describe('#maxlength', function () {
    it('causes a validation error', function () {
      const doc = new Model({ at_most_two: ['Hello', 'there', 'friend'] });

      return doc.validate()
      .then(() => assert.fail('Array maxlength validator failed'))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.at_most_two.path, 'at_most_two');
      });
    });

    it('validates conforming values', function () {
      const doc = new Model({ at_most_two: ['Hello', 'world!'] });

      return doc.validate();
    });
  });
});

after(function () {
  db.close();
});
