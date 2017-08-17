// Generated by CoffeeScript 1.12.5
var flattenHeaders;

flattenHeaders = function(blueprintHeaders) {
  var flatHeaders, name, values;
  flatHeaders = {};
  for (name in blueprintHeaders) {
    values = blueprintHeaders[name];
    flatHeaders[name] = values['value'];
  }
  return flatHeaders;
};

module.exports = flattenHeaders;
