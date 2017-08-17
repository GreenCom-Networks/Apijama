// Generated by CoffeeScript 1.12.5
var NyanCatReporter, logger, prettifyResponse, tty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

tty = require('tty');

logger = require('./../logger');

prettifyResponse = require('./../prettify-response');

NyanCatReporter = (function() {
  function NyanCatReporter(emitter, stats, tests) {
    this.rainbowify = bind(this.rainbowify, this);
    this.cursorHide = bind(this.cursorHide, this);
    this.cursorShow = bind(this.cursorShow, this);
    this.cursorDown = bind(this.cursorDown, this);
    this.cursorUp = bind(this.cursorUp, this);
    this.face = bind(this.face, this);
    this.drawNyanCat = bind(this.drawNyanCat, this);
    this.drawRainbow = bind(this.drawRainbow, this);
    this.appendRainbow = bind(this.appendRainbow, this);
    this.drawScoreboard = bind(this.drawScoreboard, this);
    this.draw = bind(this.draw, this);
    this.configureEmitter = bind(this.configureEmitter, this);
    var width, windowWidth;
    this.type = 'nyan';
    this.stats = stats;
    this.tests = tests;
    this.isatty = tty.isatty(1) && tty.isatty(2);
    if (this.isatty) {
      if (process.stdout.getWindowSize) {
        windowWidth = process.stdout.getWindowSize(1)[0];
      } else {
        windowWidth = tty.getWindowSize()[1];
      }
    } else {
      windowWidth = 75;
    }
    width = windowWidth * .75 | 0;
    this.rainbowColors = this.generateColors();
    this.colorIndex = 0;
    this.numberOfLines = 4;
    this.trajectories = [[], [], [], []];
    this.nyanCatWidth = 11;
    this.trajectoryWidthMax = width - this.nyanCatWidth;
    this.scoreboardWidth = 5;
    this.tick = 0;
    this.errors = [];
    this.configureEmitter(emitter);
    logger.verbose("Using '" + this.type + "' reporter.");
  }

  NyanCatReporter.prototype.configureEmitter = function(emitter) {
    emitter.on('start', (function(_this) {
      return function(rawBlueprint, callback) {
        _this.cursorHide();
        _this.draw();
        return callback();
      };
    })(this));
    emitter.on('end', (function(_this) {
      return function(callback) {
        var i, j, len, ref, test;
        _this.cursorShow();
        i = 0;
        while (i < _this.numberOfLines) {
          _this.write("\n");
          i++;
        }
        if (_this.errors.length > 0) {
          _this.write("\n");
          logger.info("Displaying failed tests...");
          ref = _this.errors;
          for (j = 0, len = ref.length; j < len; j++) {
            test = ref[j];
            logger.fail(test.title + (" duration: " + test.duration + "ms"));
            logger.fail(test.message);
            logger.request("\n" + prettifyResponse(test.request) + "\n");
            logger.expected("\n" + prettifyResponse(test.expected) + "\n");
            logger.actual("\n" + prettifyResponse(test.actual) + "\n\n");
          }
        }
        logger.complete(_this.stats.passes + " passing, " + _this.stats.failures + " failing, " + _this.stats.errors + " errors, " + _this.stats.skipped + " skipped");
        logger.complete("Tests took " + _this.stats.duration + "ms");
        return callback();
      };
    })(this));
    emitter.on('test pass', (function(_this) {
      return function(test) {
        return _this.draw();
      };
    })(this));
    emitter.on('test skip', (function(_this) {
      return function(test) {
        return _this.draw();
      };
    })(this));
    emitter.on('test fail', (function(_this) {
      return function(test) {
        _this.errors.push(test);
        return _this.draw();
      };
    })(this));
    return emitter.on('test error', (function(_this) {
      return function(error, test) {
        test.message = "\nError: \n" + error + "\nStacktrace: \n" + error.stack + "\n";
        _this.errors.push(test);
        return _this.draw();
      };
    })(this));
  };

  NyanCatReporter.prototype.draw = function() {
    this.appendRainbow();
    this.drawScoreboard();
    this.drawRainbow();
    this.drawNyanCat();
    return this.tick = !this.tick;
  };

  NyanCatReporter.prototype.drawScoreboard = function() {
    var colors, draw, stats, write;
    write = this.write;
    draw = function(color, n) {
      write(" ");
      write("\u001b[" + color + "m" + n + "\u001b[0m");
      return write("\n");
    };
    stats = this.stats;
    colors = {
      fail: 31,
      skipped: 36,
      pass: 32
    };
    draw(colors.pass, this.stats.passes);
    draw(colors.fail, this.stats.failures);
    draw(colors.fail, this.stats.errors);
    draw(colors.skipped, this.stats.skipped);
    this.write("\n");
    return this.cursorUp(this.numberOfLines + 1);
  };

  NyanCatReporter.prototype.appendRainbow = function() {
    var index, rainbowified, results, segment, trajectory;
    segment = (this.tick ? "_" : "-");
    rainbowified = this.rainbowify(segment);
    index = 0;
    results = [];
    while (index < this.numberOfLines) {
      trajectory = this.trajectories[index];
      if (trajectory.length >= this.trajectoryWidthMax) {
        trajectory.shift();
      }
      trajectory.push(rainbowified);
      results.push(index++);
    }
    return results;
  };

  NyanCatReporter.prototype.drawRainbow = function() {
    var scoreboardWidth, write;
    scoreboardWidth = this.scoreboardWidth;
    write = this.write;
    this.trajectories.forEach(function(line, index) {
      write("\u001b[" + scoreboardWidth + "C");
      write(line.join(""));
      return write("\n");
    });
    return this.cursorUp(this.numberOfLines);
  };

  NyanCatReporter.prototype.drawNyanCat = function() {
    var color, face, padding, startWidth, tail;
    startWidth = this.scoreboardWidth + this.trajectories[0].length;
    color = "\u001b[" + startWidth + "C";
    padding = "";
    this.write(color);
    this.write("_,------,");
    this.write("\n");
    this.write(color);
    padding = (this.tick ? "  " : "   ");
    this.write("_|" + padding + "/\\_/\\ ");
    this.write("\n");
    this.write(color);
    padding = (this.tick ? "_" : "__");
    tail = (this.tick ? "~" : "^");
    face = void 0;
    this.write(tail + "|" + padding + this.face() + " ");
    this.write("\n");
    this.write(color);
    padding = (this.tick ? " " : "  ");
    this.write(padding + "\"\"  \"\" ");
    this.write("\n");
    return this.cursorUp(this.numberOfLines);
  };

  NyanCatReporter.prototype.face = function() {
    var stats;
    stats = this.stats;
    if (stats.failures) {
      return "( x .x)";
    } else if (stats.skipped) {
      return "( o .o)";
    } else if (stats.passes) {
      return "( ^ .^)";
    } else {
      return "( - .-)";
    }
  };

  NyanCatReporter.prototype.cursorUp = function(n) {
    return this.write("\u001b[" + n + "A");
  };

  NyanCatReporter.prototype.cursorDown = function(n) {
    return this.write("\u001b[" + n + "B");
  };

  NyanCatReporter.prototype.cursorShow = function() {
    return this.isatty && this.write('\u001b[?25h');
  };

  NyanCatReporter.prototype.cursorHide = function() {
    return this.isatty && this.write('\u001b[?25l');
  };

  NyanCatReporter.prototype.generateColors = function() {
    var b, colors, g, i, n, pi3, r;
    colors = [];
    i = 0;
    while (i < (6 * 7)) {
      pi3 = Math.floor(Math.PI / 3);
      n = i * (1.0 / 6);
      r = Math.floor(3 * Math.sin(n) + 3);
      g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
      b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
      colors.push(36 * r + 6 * g + b + 16);
      i++;
    }
    return colors;
  };

  NyanCatReporter.prototype.rainbowify = function(str) {
    var color;
    color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
    this.colorIndex += 1;
    return "\u001b[38;5;" + color + "m" + str + "\u001b[0m";
  };

  NyanCatReporter.prototype.write = function(str) {
    return process.stdout.write(str);
  };

  return NyanCatReporter;

})();

module.exports = NyanCatReporter;
