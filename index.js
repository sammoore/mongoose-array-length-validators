'use strict';

const { keys } = Object;

const mongoose = require('mongoose');
const validators = require('./validators');

const MESSAGES = {
  minlength: 'Path `{PATH}` is shorter than the minimum allowed length `{LEN}`',
  maxlength: 'PATH `{PATH}` is longer than the maximum allowed length `{LEN}`'
};

module.exports = function (schema) {
  const arrayPaths = keys(schema.paths).filter((path) => {
    return schema.paths[path].$isMongooseArray;
  });

  const pathsWith = ['minlength', 'maxlength'].reduce((out, rule) => {
    out[rule] = arrayPaths.filter((path) => {
      return typeof schema.paths[path].options[rule] == 'number';
    });
    return out;
  }, {});

  keys(pathsWith).forEach((rule) => {
    pathsWith[rule].forEach((path) => {
      let message = MESSAGES[rule].replace('{PATH}', path);

      const option = schema.paths[path].options[rule];
      message = message.replace('{LEN}', option);

      const validator = validators[rule](option);

      schema.path(path).validate({
        validator,
        message
      });
    });
  });
};
