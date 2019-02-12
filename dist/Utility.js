/**
 * 日時のフォーマット
 * @param {string} datetime 日時文字列（省略した場合は現在日時）
 * @return {string} YYYY/MM/DD HH:MM:SS
 */
function formatDate(datetime) {
  datetime = datetime || '';
  var now = new Date(datetime);
  var dateText = now.getFullYear() + '/';
  dateText += ('0' + (now.getMonth() + 1)).slice(-2) + '/';
  dateText += ('0' + now.getDate()).slice(-2) + ' ';
  dateText += ('0' + now.getHours()).slice(-2) + ':';
  dateText += ('0' + now.getMinutes()).slice(-2) + ':';
  dateText += ('0' + now.getSeconds()).slice(-2);
  return dateText;
}

function getStore(key) {
  var properties = PropertiesService.getScriptProperties();
  return properties.getProperty(key);
}

function setStore(key, value) {
  var properties = PropertiesService.getScriptProperties();
  return properties.setProperty(key, value);
}
