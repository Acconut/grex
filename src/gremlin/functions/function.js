var _ = require('lodash');

var Argument = require('../arguments/argument');
var ClosureArgument = require('../arguments/closure');
var ObjectArgument = require('../arguments/object');
var ArrayArgument = require('../arguments/array');
var ClassArgument = require('../arguments/class');
var NumberArgument = require('../arguments/number');

module.exports = (function() {
  function GremlinFunction(name, args) {
    this.name = name;
    this.arguments = args;
    this.closures = [];
    this.parenthesizedArguments = [];
    this.buildArguments();
  }

  GremlinFunction.prototype.toGroovy = function() {
    return this.name + this.groovifyArguments();
  };

  GremlinFunction.prototype.groovifyArguments = function() {
    var args = [];

    // Append arguments between parentheses, if any
    groovy = '(' + _.map(this.parenthesizedArguments, function(argument) {
      return argument.toGroovy();
    }).join(',') + ')';

    // Append closures, if any
    groovy += _.map(this.closures, function(closure) {
      return closure.toGroovy();
    }).join(',');

    return groovy;
  };

  GremlinFunction.prototype.buildArguments = function() {
    _.each(this.arguments, function(argument) {
      if (this.isClosure(argument)) {
        built = new ClosureArgument(argument, this);
        this.closures.push(built);
      } else if (_.isArray(argument)) {
        built = new ArrayArgument(argument, this);
        this.parenthesizedArguments.push(built);
      } else if (this.isClass(argument)) {
        built = new ClassArgument(argument, this);
        this.parenthesizedArguments.push(built);
      } else if (_.isObject(argument)) {
        built = new ObjectArgument(argument, this);
        this.parenthesizedArguments.push(built);
      } else if (_.isNumber(argument)) {
        built = new NumberArgument(argument, this);
        this.parenthesizedArguments.push(built);
      } else {
        built = new Argument(argument, this);
        this.parenthesizedArguments.push(built);
      }
    }, this);
  };

  GremlinFunction.prototype.isClosure = function(val) {
    var closureRegex = /^\{.*\}$/;

    return _.isString(val) && closureRegex.test(val);
  };

  GremlinFunction.prototype.isClass = function(argument) {
    return !!argument.class;
  };

  GremlinFunction.prototype.stringifyArgument = function(argument) {
    return JSON.stringify(argument).replace('{', '[').replace('}', ']');
  };

  return GremlinFunction;
})();