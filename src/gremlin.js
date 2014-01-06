var _ = require("lodash");

module.exports = (function() {
  function Gremlin(argumentHandler) {
    this.script = 'g';
    this.argumentHandler = argumentHandler;
  }

  /**
   * @private
   * @param {String} script
   */
  Gremlin.prototype.appendScript = function(script) {
    this.script += script;
  };

  /**
   * Populate a Gremlin script string with default behavior. Used for most
   * commands.
   * This method optionally takes a new Pipeline object as second parameter.
   *
   * @param {String} methodName
   * @param {Array} args Method's arguments
   */
  Gremlin.prototype.queryMain = function(methodName, args) {
    var appendArg = '';

    //cater for select array parameters
    if (methodName == 'select') {
      this.appendScript('.' + methodName + this.argumentHandler.build(args, true));
    } else {
      args = _.isArray(args[0]) ? args[0] : args;

      //cater for idx param 2
      if (methodName == 'idx' && args.length > 1) {
        _.each(args[1], function(v, k) {
          appendArg = k + ":";
          appendArg += this.argumentHandler.parse(args[1][k]);
        }, this);

        appendArg = "[["+ appendArg + "]]";
        args.length = 1;
      }

      this.appendScript('.' + methodName + this.argumentHandler.build(args));
    }

    this.appendScript(appendArg);
  };

  /**
   * Alternative 'index' and 'range' commands, ie:
   *   index() => [i]
   *   range() => [1..2]
   *
   * Do not pass in method name, just string range.
   */
  Gremlin.prototype.queryIndex = function(methodName, arg) {
    this.appendScript('['+ arg[0].toString() + ']');
  };

  /**
   * Used for 'and', 'or' & 'put commands, ie:
   *   g.v(1).outE().or(g._().has('id', 'T.eq', 9), g._().has('weight', 'T.lt', '0.6f'))
   *
   * @param {String} methodName
   */
  Gremlin.prototype.queryPipes = function(methodName, args) {
    args = _.isArray(args[0]) ? args[0] : args;

    this.appendScript("." + methodName + "(");

    _.each(args, function(arg) {
      var partialScript = (arg.gremlin && arg.gremlin.script) || this.argumentHandler.parse(arg);
      this.appendScript(partialScript + ",");
    }, this);

    this.script = this.script.slice(0, -1); // Remove trailing comma
    this.appendScript(")");
  };

  /**
   * Used for retain & except commands, ie:
   *   g.V().retain([g.v(1), g.v(2), g.v(3)])
   *
   * @param {String} methodName
   */
  Gremlin.prototype.queryCollection = function(methodName, args) {
    var param = '';

    if (_.isArray(args[0])) {
      // Passing in an array of Pipeline with Gremlin script as arguments
      _.each(args[0], function(pipeline) {
        param += pipeline.gremlin.script;
        param += ",";
      });

      this.appendScript("." + methodName + "([" + param + "])");
    } else {
      this.appendScript("." + methodName + this.argumentHandler.build(args[0]));
    }
  };

  return Gremlin;

})();
