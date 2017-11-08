'use strict';

const { assign } = Object;

function minlength(option) {
  return function validator(value) {
    // not a required validator
    if (!value) return true;
    
    if (value.length < option) {
      return false;
    }
    return true;
  };
}

function maxlength(option) {
  return function validator(value) {
    // not a required validator
    if (!value) return true;

    if (value.length > option) {
      return false;
    }
    return true;
  };
}

module.exports = {
  minlength,
  maxlength
};
