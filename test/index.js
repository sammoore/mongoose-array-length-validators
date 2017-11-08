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

after(function () {
  db.close();
});
