// Generated by CoffeeScript 1.12.5
var EventEmitter, MarkdownReporter, file, fs, logger, prettifyResponse,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

EventEmitter = require('events').EventEmitter;

fs = require('fs');

file = require('file');

logger = require('./../logger');

prettifyResponse = require('./../prettify-response');

MarkdownReporter = (function(superClass) {
  extend(MarkdownReporter, superClass);

  function MarkdownReporter(emitter, stats, tests, path, details) {
    MarkdownReporter.__super__.constructor.call(this);
    this.type = 'markdown';
    this.stats = stats;
    this.tests = tests;
    this.path = this.sanitizedPath(path);
    this.buf = '';
    this.level = 1;
    this.details = details;
    this.configureEmitter(emitter);
    logger.verbose("Using '" + this.type + "' reporter.");
  }

  MarkdownReporter.prototype.sanitizedPath = function(path) {
    var filePath;
    filePath = path != null ? file.path.abspath(path) : file.path.abspath("./report.md");
    if (fs.existsSync(filePath)) {
      logger.info("File exists at " + filePath + ", will be overwritten...");
    }
    return filePath;
  };

  MarkdownReporter.prototype.configureEmitter = function(emitter) {
    var title;
    title = (function(_this) {
      return function(str) {
        return Array(_this.level).join("#") + " " + str;
      };
    })(this);
    emitter.on('start', (function(_this) {
      return function(rawBlueprint, callback) {
        _this.level++;
        _this.buf += title('Dredd Tests') + "\n";
        return callback();
      };
    })(this));
    emitter.on('end', (function(_this) {
      return function(callback) {
        return fs.writeFile(_this.path, _this.buf, function(err) {
          if (err) {
            logger.error(err);
          }
          return callback();
        });
      };
    })(this));
    emitter.on('test start', (function(_this) {
      return function(test) {
        return _this.level++;
      };
    })(this));
    emitter.on('test pass', (function(_this) {
      return function(test) {
        _this.buf += title("Pass: " + test.title) + "\n";
        if (_this.details) {
          _this.level++;
          _this.buf += title("Request") + "\n```\n" + prettifyResponse(test.request) + "\n```\n\n";
          _this.buf += title("Expected") + "\n```\n" + prettifyResponse(test.expected) + "\n```\n\n";
          _this.buf += title("Actual") + "\n```\n" + prettifyResponse(test.actual) + "\n```\n\n";
          _this.level--;
        }
        return _this.level--;
      };
    })(this));
    emitter.on('test skip', (function(_this) {
      return function(test) {
        _this.buf += title("Skip: " + test.title) + "\n";
        return _this.level--;
      };
    })(this));
    emitter.on('test fail', (function(_this) {
      return function(test) {
        _this.buf += title("Fail: " + test.title + "\n");
        _this.level++;
        _this.buf += title("Message") + "\n```\n" + test.message + "\n```\n\n";
        _this.buf += title("Request") + "\n```\n" + prettifyResponse(test.request) + "\n```\n\n";
        _this.buf += title("Expected") + "\n```\n" + prettifyResponse(test.expected) + "\n```\n\n";
        _this.buf += title("Actual") + "\n```\n" + prettifyResponse(test.actual) + "\n```\n\n";
        _this.level--;
        return _this.level--;
      };
    })(this));
    return emitter.on('test error', (function(_this) {
      return function(error, test) {
        _this.buf += title("Error: " + test.title + "\n");
        _this.buf += "\n```\n";
        _this.buf += "\nError: \n" + error + "\nStacktrace: \n" + error.stack + "\n";
        _this.buf += "```\n\n";
        return _this.level--;
      };
    })(this));
  };

  return MarkdownReporter;

})(EventEmitter);

module.exports = MarkdownReporter;
