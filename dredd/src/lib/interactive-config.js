// Generated by CoffeeScript 1.12.5
var fs, inquirer, interactiveConfig, packageData, yaml;

inquirer = require('inquirer');

fs = require('fs');

yaml = require('js-yaml');

packageData = require('../package.json');

interactiveConfig = {};

interactiveConfig.prompt = function(config, callback) {
  var questions, ref, ref1;
  if (config == null) {
    config = {};
  }
  questions = [];
  questions.push({
    type: "input",
    name: "blueprint",
    message: "Location of the API description document",
    "default": config['blueprint'] || "apiary.apib"
  });
  questions.push({
    type: "input",
    name: "server",
    message: "Command to start API backend server e.g. (bundle exec rails server)",
    "default": config['server']
  });
  questions.push({
    type: "input",
    name: "endpoint",
    message: "URL of tested API endpoint",
    "default": config['endpoint'] || "http://127.0.0.1:3000"
  });
  questions.push({
    type: "list",
    name: "language",
    message: "Programming language of hooks",
    "default": "nodejs",
    choices: ["ruby", "python", "nodejs", "php", "perl", "go"]
  });
  questions.push({
    type: "confirm",
    name: "apiary",
    message: "Do you want to use Apiary test inspector?",
    "default": true,
    when: function(answers) {
      return config['reporter'] !== 'apiary';
    }
  });
  questions.push({
    type: "input",
    name: "apiaryApiKey",
    message: "Please enter Apiary API key or leave empty for anonymous reporter",
    "default": (ref = config['custom']) != null ? ref['apiaryApiKey'] : void 0,
    when: function(answers) {
      var ref1;
      return answers['apiary'] === true && (((ref1 = config['custom']) != null ? ref1['apiaryApiKey'] : void 0) == null);
    }
  });
  questions.push({
    type: "input",
    name: "apiaryApiName",
    message: "Please enter Apiary API name",
    "default": (ref1 = config['custom']) != null ? ref1['apiaryApiName'] : void 0,
    when: function(answers) {
      var ref2;
      return (answers['apiary'] === true && (((ref2 = config['custom']) != null ? ref2['apiaryApiName'] : void 0) == null)) && (answers['apiary'] === true && answers['apiaryApiKey'] !== '');
    }
  });
  questions.push({
    type: "confirm",
    name: "travisAdd",
    message: "Found Travis CI configuration, do you want to add Dredd to the build?",
    "default": true,
    when: function() {
      return fs.existsSync('.travis.yml');
    }
  });
  questions.push({
    type: "confirm",
    name: "circleAdd",
    message: "Found CircleCI configuration, do you want to add Dredd to the build?",
    "default": true,
    when: function() {
      return fs.existsSync('circle.yml');
    }
  });
  questions.push({
    type: "confirm",
    name: "circleCreate",
    message: "Dredd is best served with Continuous Integration. Create CircleCI config for Dredd?",
    when: function(answers) {
      return !fs.existsSync('circle.yml') && !fs.existsSync('.travis.yml');
    }
  });
  return inquirer.prompt(questions).then(callback);
};

interactiveConfig.processAnswers = function(config, answers, callback) {
  if (config == null) {
    config = {};
  }
  if (config['_'] == null) {
    config['_'] = [];
  }
  config['_'][0] = answers['blueprint'];
  config['_'][1] = answers['endpoint'];
  config['server'] = answers['server'] || null;
  config['language'] = answers['language'];
  if (answers['apiary'] === true) {
    config['reporter'] = "apiary";
  }
  if (config['custom'] == null) {
    config['custom'] = {};
  }
  if (answers['apiaryApiKey'] != null) {
    config['custom']['apiaryApiKey'] = answers['apiaryApiKey'];
  }
  if (answers['apiaryApiName'] != null) {
    config['custom']['apiaryApiName'] = answers['apiaryApiName'];
  }
  if (answers['circleAdd'] || answers['circleCreate']) {
    interactiveConfig.updateCircle();
  }
  if (answers['travisAdd'] === true) {
    interactiveConfig.updateTravis();
  }
  callback(config);
};

interactiveConfig.run = function(config, callback) {
  interactiveConfig.prompt(config, function(answers) {
    return interactiveConfig.processAnswers(config, answers, callback);
  });
};

interactiveConfig.updateCircle = function() {
  var base, base1, config, file, yamlData;
  file = "circle.yml";
  if (fs.existsSync(file)) {
    config = yaml.safeLoad(fs.readFileSync(file));
  } else {
    config = {};
  }
  if (config['dependencies'] == null) {
    config['dependencies'] = {};
  }
  if ((base = config['dependencies'])['pre'] == null) {
    base['pre'] = [];
  }
  if (config['dependencies']['pre'].indexOf("npm install -g dredd") === -1) {
    config['dependencies']['pre'].push("npm install -g dredd@" + packageData.version);
  }
  if (config['test'] == null) {
    config['test'] = {};
  }
  if ((base1 = config['test'])['pre'] == null) {
    base1['pre'] = [];
  }
  if (config['test']['pre'].indexOf("dredd") === -1) {
    config['test']['pre'].push("dredd");
  }
  yamlData = yaml.safeDump(config);
  fs.writeFileSync(file, yamlData);
};

interactiveConfig.updateTravis = function() {
  var config, file, yamlData;
  file = ".travis.yml";
  if (fs.existsSync(file)) {
    config = yaml.safeLoad(fs.readFileSync(file));
  } else {
    config = {};
  }
  if (config['before_install'] == null) {
    config['before_install'] = [];
  }
  if (config['before_install'].indexOf("npm install -g dredd") === -1) {
    config['before_install'].push("npm install -g dredd@" + packageData.version);
  }
  if (config['before_script'] == null) {
    config['before_script'] = [];
  }
  if (config['before_script'].indexOf("dredd") === -1) {
    config['before_script'].push("dredd");
  }
  yamlData = yaml.safeDump(config);
  fs.writeFileSync(file, yamlData);
};

module.exports = interactiveConfig;
