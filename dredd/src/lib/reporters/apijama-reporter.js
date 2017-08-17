var ApijamaReporter, CONNECTION_ERRORS, clone, generateUuid, logger, os, packageData, request, url,
    bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

request = require('request');

os = require('os');

url = require('url');

clone = require('clone');

generateUuid = require('uuid').v4;

packageData = require('./../../package.json');

logger = require('./../logger');

CONNECTION_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE'];

ApijamaReporter = (function () {
    function ApijamaReporter(emitter, stats, tests, config, runner) {
        this.configureEmitter = bind(this.configureEmitter, this);
        var base;
        this.type = 'apijama';
        this.stats = stats;
        this.tests = tests;
        this.uuid = null;
        this.startedAt = null;
        this.endedAt = null;
        this.remoteId = null;
        this.config = config;
        this.runner = runner;
        this.reportUrl = null;
        this.configureEmitter(emitter);
        this.errors = [];
        this.serverError = false;
        this.configuration = {
            apiUrl: process.env.SERVER_URL || 'http://localhost:3000',
            apiToken: 'gnaeruigherih ruihg ozrhgzer',
            apiSuite: 'Vashnak'
        };
        logger.verbose("Using '" + this.type + "' reporter.");
        if (!this.configuration.apiToken && !this.configuration.apiSuite) {
            logger.warn('Apijama API Key or API Project Subdomain were not provided. Configure Dredd to be able to save test reports alongside your Apijama API project: https://dredd.readthedocs.io/en/latest/how-to-guides/#using-Apijama-reporter-and-Apijama-tests');
        }
        if ((base = this.configuration).apiSuite == null) {
            base.apiSuite = 'public';
        }
    }

    ApijamaReporter.prototype._get = function (customProperty, envProperty, defaultVal) {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, returnVal;
        returnVal = defaultVal;
        if (((ref = this.config.custom) != null ? ref[customProperty] : void 0) != null) {
            returnVal = this.config.custom[customProperty];
        } else if (((ref1 = this.config.options) != null ? (ref2 = ref1.custom) != null ? ref2[customProperty] : void 0 : void 0) != null) {
            returnVal = this.config.options.custom[customProperty];
        } else if (((ref3 = this.config.custom) != null ? (ref4 = ref3.ApijamaReporterEnv) != null ? ref4[customProperty] : void 0 : void 0) != null) {
            returnVal = this.config.custom.ApijamaReporterEnv[customProperty];
        } else if (((ref5 = this.config.custom) != null ? (ref6 = ref5.ApijamaReporterEnv) != null ? ref6[envProperty] : void 0 : void 0) != null) {
            returnVal = this.config.custom.ApijamaReporterEnv[envProperty];
        } else if (process.env[envProperty] != null) {
            returnVal = process.env[envProperty];
        }
        return returnVal;
    };

    ApijamaReporter.prototype._getKeys = function () {
        var ref, returnKeys;
        returnKeys = [];
        returnKeys = returnKeys.concat(Object.keys(((ref = this.config.custom) != null ? ref.ApijamaReporterEnv : void 0) || {}));
        return returnKeys.concat(Object.keys(process.env));
    };

    ApijamaReporter.prototype.configureEmitter = function (emitter) {
        var _createStep;
        emitter.on('start', (function (_this) {
            return function (blueprintsData, callback) {
                var blueprints, ciEnvVars, ciVars, data, envVarName, envVarNames, filename, i, len, path;
                if (_this.serverError === true) {
                    return callback();
                }
                _this.uuid = generateUuid();
                _this.startedAt = Math.round(new Date().getTime() / 1000);
                ciVars = /^(TRAVIS|CIRCLE|CI|DRONE|BUILD_ID)/;
                envVarNames = _this._getKeys();
                ciEnvVars = {};
                for (i = 0, len = envVarNames.length; i < len; i++) {
                    envVarName = envVarNames[i];
                    if (envVarName.match(ciVars) != null) {
                        ciEnvVars[envVarName] = _this._get(envVarName, envVarName);
                    }
                }
                blueprints = (function () {
                    var results;
                    results = [];
                    for (filename in blueprintsData) {
                        if (!hasProp.call(blueprintsData, filename)) continue;
                        data = blueprintsData[filename];
                        results.push(data);
                    }
                    return results;
                })();
                data = {
                    blueprints: blueprints,
                    endpoint: _this.config.server,
                    agent: _this._get('dreddAgent', 'DREDD_AGENT') || _this._get('user', 'USER'),
                    agentRunUuid: _this.uuid,
                    hostname: _this._get('dreddHostname', 'DREDD_HOSTNAME') || os.hostname(),
                    startedAt: _this.startedAt,
                    "public": true,
                    status: 'running',
                    agentEnvironment: ciEnvVars
                };
                if ((_this.configuration['apiToken'] != null) && (_this.configuration['apiSuite'] != null)) {
                    data["public"] = false;
                }
                path = '/runs';
                return _this._performRequestAsync(path, 'POST', data, function (error, response, parsedBody) {
                    if (error) {
                        return callback(error);
                    } else {
                        _this.remoteId = parsedBody['id'];
                        if (parsedBody['reportUrl']) {
                            _this.reportUrl = parsedBody['reportUrl'];
                        }
                        return callback();
                    }
                });
            };
        })(this));
        _createStep = (function (_this) {
            return function (test, callback) {
                var data, path;
                if (_this.serverError === true) {
                    return callback();
                }
                data = _this._transformTestToReporter(test);
                path = '/runs/' + _this.remoteId + '/steps';
                return _this._performRequestAsync(path, 'POST', data, function (error, response, parsedBody) {
                    if (error) {
                        return callback(error);
                    }
                    return callback();
                });
            };
        })(this);
        emitter.on('test pass', _createStep);
        emitter.on('test fail', _createStep);
        emitter.on('test skip', _createStep);
        emitter.on('test error', (function (_this) {
            return function (error, test, callback) {
                var base, base1, data, path, ref;
                if (_this.serverError === true) {
                    return callback();
                }
                data = _this._transformTestToReporter(test);
                if ((base = data.resultData).result == null) {
                    base.result = {};
                }
                if ((base1 = data.resultData.result).general == null) {
                    base1.general = [];
                }
                if (ref = error.code, indexOf.call(CONNECTION_ERRORS, ref) >= 0) {
                    data.resultData.result.general.push({
                        severity: 'error',
                        message: "Error connecting to server under test!"
                    });
                } else {
                    data.resultData.result.general.push({
                        severity: 'error',
                        message: "Unhandled error occured when executing the transaction."
                    });
                }
                path = '/runs/' + _this.remoteId + ' /steps';
                return _this._performRequestAsync(path, 'POST', data, function (error, response, parsedBody) {
                    if (error) {
                        return callback(error);
                    }
                    return callback();
                });
            };
        })(this));
        return emitter.on('end', (function (_this) {
            return function (callback) {
                var data, path, ref, ref1;
                if (_this.serverError === true) {
                    return callback();
                }
                data = {
                    endedAt: Math.round(new Date().getTime() / 1000),
                    result: _this.stats,
                    status: _this.stats['failures'] > 0 || _this.stats['errors'] > 0 ? 'failed' : 'passed',
                    logs: ((ref = _this.runner) != null ? (ref1 = ref.logs) != null ? ref1.length : void 0 : void 0) ? _this.runner.logs : void 0
                };
                path = '/runs/' + _this.remoteId;
                return _this._performRequestAsync(path, 'PATCH', data, function (error, response, parsedBody) {
                    if (error) {
                        return callback(error);
                    }
                    logger.complete("Data sent to database.");
                    return callback();
                });
            };
        })(this));
    };

    ApijamaReporter.prototype._transformTestToReporter = function (test) {
        var data;
        data = {
            testRunId: this.remoteId,
            origin: test['origin'],
            duration: test['duration'],
            result: test['status'],
            startedAt: test['startedAt'],
            resultData: {
                request: test['request'],
                realResponse: test['actual'],
                expectedResponse: test['expected'],
                result: test['results']
            }
        };
        return data;
    };

    ApijamaReporter.prototype._performRequestAsync = function (path, method, reqBody, callback) {
        var body, error, handleRequest, headers, options, protocol, system;
        handleRequest = (function (_this) {
            return function (err, res, resBody) {
                var info, parsedBody, ref;
                if (err) {
                    _this.serverError = true;
                    logger.debug('Requesting Apijama API errored:', ("" + err) || err.code);
                    if (ref = err.code, indexOf.call(CONNECTION_ERRORS, ref) >= 0) {
                        return callback(new Error('Apijama reporter could not connect to Apijama API'));
                    } else {
                        return callback(err);
                    }
                }
                logger.verbose('Handling HTTP response from Apijama API');
                try {
                    parsedBody = JSON.parse(resBody);
                } catch (error1) {
                    err = error1;
                    err = new Error("Apijama reporter failed to parse Apijama API response body: " + err.message + "\n" + resBody);
                    return callback(err);
                }
                info = {
                    headers: res.headers,
                    statusCode: res.statusCode,
                    body: parsedBody
                };
                logger.debug('Apijama reporter response:', JSON.stringify(info, null, 2));
                return callback(null, res, parsedBody);
            };
        })(this);
        body = reqBody ? JSON.stringify(reqBody) : '';
        system = os.type() + ' ' + os.release() + '; ' + os.arch();
        headers = {
            'User-Agent': "Dredd Apijama Reporter/" + packageData.version + " (" + system + ")",
            'Content-Type': 'application/json'
        };
        options = clone(this.config.http || {});
        options.uri = this.configuration.apiUrl + path;
        options.method = method;
        options.headers = headers;
        options.body = body;
        if (this.configuration.apiToken) {
            options.headers['Authentication'] = 'Token ' + this.configuration.apiToken;
        }
        try {
            protocol = options.uri.split(':')[0].toUpperCase();
            logger.verbose("About to perform an " + protocol + " request from Apijama reporter to Apijama API: " + options.method + " " + options.uri + " (" + (body ? 'with' : 'without') + " body)");
            logger.debug('Request details:', JSON.stringify({
                options: options,
                body: body
            }, null, 2));
            return request(options, handleRequest);
        } catch (error1) {
            error = error1;
            logger.debug('Requesting Apijama API errored:', error);
            return callback(error);
        }
    };

    return ApijamaReporter;

})();

module.exports = ApijamaReporter;
