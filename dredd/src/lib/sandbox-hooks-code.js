// Generated by CoffeeScript 1.12.5
var Hooks, Pitboss, sandboxHooksCode;

Pitboss = require('pitboss-ng').Pitboss;

Hooks = require('./hooks');

sandboxHooksCode = function(hooksCode, callback) {
  var hooks, sandbox, wrappedCode;
  hooks = new Hooks();
  wrappedCode = "var _hooks = new _Hooks();\n\nvar before = _hooks.before;\nvar after = _hooks.after;\nvar beforeAll = _hooks.beforeAll;\nvar afterAll = _hooks.afterAll;\nvar beforeEach = _hooks.beforeEach;\nvar afterEach = _hooks.afterEach;\nvar beforeValidation = _hooks.beforeValidation;\nvar beforeEachValidation = _hooks.beforeEachValidation;\n\nvar log = _hooks.log;\n\n" + hooksCode + "\ntry {\n  var output = _hooks.dumpHooksFunctionsToStrings();\n} catch(e) {\n  console.log(e.message);\n  console.log(e.stack);\n  throw(e);\n}\n\noutput";
  sandbox = new Pitboss(wrappedCode);
  sandbox.run({
    libraries: {
      '_Hooks': '../../../lib/hooks',
      'console': 'console'
    }
  }, function(err, result) {
    sandbox.kill();
    if (err) {
      return callback(err);
    }
    callback(void 0, result);
  });
};

module.exports = sandboxHooksCode;
