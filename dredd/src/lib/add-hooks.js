// Generated by CoffeeScript 1.12.5
var Hooks, HooksWorkerClient, addHooks, async, basename, clone, fs, glob, logger, mergeSandboxedHooks, path, proxyquire, sandboxHooksCode;

require('coffee-script/register');

path = require('path');

proxyquire = require('proxyquire').noCallThru();

glob = require('glob');

fs = require('fs');

async = require('async');

clone = require('clone');

Hooks = require('./hooks');

logger = require('./logger');

sandboxHooksCode = require('./sandbox-hooks-code');

mergeSandboxedHooks = require('./merge-sandboxed-hooks');

HooksWorkerClient = require('./hooks-worker-client');

basename = process.platform === 'win32' ? path.win32.basename : path.basename;

addHooks = function(runner, transactions, callback) {
  var base, customConfigCwd, file, files, fixLegacyTransactionNames, hookfiles, hooksWorkerClient, i, j, len, len1, loadHookFile, loadSandboxHooksFromStrings, msg, ref, ref1, ref10, ref11, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, transaction;
  customConfigCwd = runner != null ? (ref = runner.configuration) != null ? (ref1 = ref.custom) != null ? ref1.cwd : void 0 : void 0 : void 0;
  fixLegacyTransactionNames = function(allHooks) {
    var hookType, hooks, i, len, newTransactionName, pattern, ref2, results, transactionName;
    pattern = /^\s>\s/g;
    ref2 = ['beforeHooks', 'afterHooks'];
    results = [];
    for (i = 0, len = ref2.length; i < len; i++) {
      hookType = ref2[i];
      results.push((function() {
        var ref3, results1;
        ref3 = allHooks[hookType];
        results1 = [];
        for (transactionName in ref3) {
          hooks = ref3[transactionName];
          if (transactionName.match(pattern) !== null) {
            newTransactionName = transactionName.replace(pattern, '');
            if (allHooks[hookType][newTransactionName] !== void 0) {
              allHooks[hookType][newTransactionName] = hooks.concat(allHooks[hookType][newTransactionName]);
            } else {
              allHooks[hookType][newTransactionName] = hooks;
            }
            results1.push(delete allHooks[hookType][transactionName]);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };
  loadHookFile = function(filePath) {
    var error;
    try {
      proxyquire(filePath, {
        'hooks': runner.hooks
      });
      return fixLegacyTransactionNames(runner.hooks);
    } catch (error1) {
      error = error1;
      return logger.warn("Skipping hook loading. Error reading hook file '" + filePath + "'. This probably means one or more of your hook files are invalid.\nMessage: " + error.message + "\nStack: " + error.stack);
    }
  };
  loadSandboxHooksFromStrings = function(callback) {
    if (typeof runner.configuration.hooksData !== 'object' || Array.isArray(runner.configuration.hooksData) !== false) {
      return callback(new Error("hooksData option must be an object e.g. {'filename.js':'console.log(\"Hey!\")'}"));
    }
    return async.eachSeries(Object.keys(runner.configuration.hooksData), function(key, nextHook) {
      var data;
      data = runner.configuration.hooksData[key];
      return sandboxHooksCode(data, function(sandboxError, result) {
        if (sandboxError) {
          return nextHook(sandboxError);
        }
        runner.hooks = mergeSandboxedHooks(runner.hooks, result);
        fixLegacyTransactionNames(runner.hooks);
        return nextHook();
      });
    }, callback);
  };
  if (runner.logs == null) {
    runner.logs = [];
  }
  runner.hooks = new Hooks({
    logs: runner.logs,
    logger: logger
  });
  if ((base = runner.hooks).transactions == null) {
    base.transactions = {};
  }
  for (i = 0, len = transactions.length; i < len; i++) {
    transaction = transactions[i];
    runner.hooks.transactions[transaction.name] = transaction;
  }
  if (!(runner != null ? (ref2 = runner.configuration) != null ? (ref3 = ref2.options) != null ? ref3.hookfiles : void 0 : void 0 : void 0)) {
    if (runner.configuration.hooksData != null) {
      if (runner.configuration.options.sandbox === true) {
        return loadSandboxHooksFromStrings(callback);
      } else {
        msg = 'Not sandboxed hooks loading from strings is not implemented, Sandbox mode must be enabled when loading hooks from strings.';
        return callback(new Error(msg));
      }
    } else {
      return callback();
    }
  } else {
    hookfiles = [].concat((ref4 = runner.configuration) != null ? (ref5 = ref4.options) != null ? ref5.hookfiles : void 0 : void 0);
    files = hookfiles.reduce(function(result, unresolvedPath) {
      var unresolvedPaths;
      unresolvedPaths = glob.hasMagic(unresolvedPath) ? glob.sync(unresolvedPath) : [unresolvedPath];
      return result.concat(unresolvedPaths).map(function(filepath) {
        return {
          basename: basename(filepath),
          path: filepath
        };
      }).sort(function(a, b) {
        return a.basename > b.basename;
      }).map(function(item) {
        return path.resolve(customConfigCwd || process.cwd(), item.path);
      });
    }, []);
    logger.info('Found Hookfiles:', files);
    runner.hooks.configuration = clone(runner != null ? runner.configuration : void 0);
    runner.hooks.configuration.options.hookfiles = files;
    if (!runner.configuration.options.sandbox === true) {
      if ((runner != null ? (ref6 = runner.configuration) != null ? (ref7 = ref6.options) != null ? ref7.language : void 0 : void 0 : void 0) === "" || (runner != null ? (ref8 = runner.configuration) != null ? (ref9 = ref8.options) != null ? ref9.language : void 0 : void 0 : void 0) === void 0 || (runner != null ? (ref10 = runner.configuration) != null ? (ref11 = ref10.options) != null ? ref11.language : void 0 : void 0 : void 0) === "nodejs") {
        for (j = 0, len1 = files.length; j < len1; j++) {
          file = files[j];
          loadHookFile(file);
        }
        return callback();
      } else {
        hooksWorkerClient = new HooksWorkerClient(runner);
        return hooksWorkerClient.start(callback);
      }
    } else {
      logger.info('Loading hook files in sandboxed context:', files);
      return async.eachSeries(files, function(resolvedPath, nextFile) {
        return fs.readFile(resolvedPath, 'utf8', function(readingError, data) {
          if (readingError) {
            return nextFile(readingError);
          }
          return sandboxHooksCode(data, function(sandboxError, result) {
            if (sandboxError) {
              return nextFile(sandboxError);
            }
            runner.hooks = mergeSandboxedHooks(runner.hooks, result);
            fixLegacyTransactionNames(runner.hooks);
            return nextFile();
          });
        });
      }, callback);
    }
  }
};

module.exports = addHooks;
