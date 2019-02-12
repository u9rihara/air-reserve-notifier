/**
 * 行追加
 * @param {object} data 予約データ
 */
function addRow(data) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var keys = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var sortedData = [false];
  for (var key in data) {
    var colIndex = keys.indexOf(key);
    if (colIndex >= 0) {
      sortedData[colIndex] = data[key];
    }
  }
  sheet.insertRowAfter(lastRow).getRange((lastRow + 1), 1, 1, lastCol).setValues([sortedData]);
}

/**
 * 行を非アクティブ化
 * @param {string} rsv_id 予約番号
 */
function deactivateRow(rsv_id) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var keys = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var colIndex = keys.indexOf('予約番号');
  if (colIndex === -1) {
    return;
  }
  var rsv_ids = sheet.getRange(2, (colIndex + 1), (lastRow - 1)).getValues();
  rsv_ids = Array.prototype.concat.apply([], rsv_ids);
  var rowIndex = rsv_ids.indexOf(rsv_id);
  if (rowIndex === -1) {
    return;
  }
  sheet.getRange((rowIndex + 2), 1).setValue(true);
}
