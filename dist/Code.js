function main() {

}

function getStore(key) {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty(key);
}

function setStore(key, value) {
  var properties = PropertiesService.getScriptProperties();
  return properties.setProperty(key, value);
}

function test() {
  notifyLine('test');
}
