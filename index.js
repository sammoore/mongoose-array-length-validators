'use strict';

const { keys } = Object;

const mongoose = require('mongoose');
const validators = require('./validators');

const MESSAGES = {
  minlength: 'Path `{PATH}` is shorter than the minimum allowed length `{LEN}`',
  maxlength: 'PATH `{PATH}` is longer than the maximum allowed length `{LEN}`'
};

const RULES = keys(MESSAGES);

module.exports = function (schema) {
  const arrayPaths = keys(schema.paths).filter((path) => {
    return schema.paths[path].$isMongooseArray;
  });

  keys(schema.paths).forEach((path) => {
    const type = schema.paths[path];

    descriptors(path, type.options).forEach(d => type.validate(d))
  });
};

function descriptors(path, options) {
  return RULES
  .filter(r => typeof options[r] == 'number')
  .map(r => descriptor(path, r, options[r]));
}
module.exports.descriptors = descriptors;

function descriptor(path, rule, option) {
  let message = MESSAGES[rule]
  .replace('{PATH}', path)
  .replace('{LEN}', option);
  
  return {
    validator: validators[rule](option),
    message: message
  };
}
module.exports.descriptor = descriptor;
