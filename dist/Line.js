/**
 * LINE通知
 * tokenはスクリプトプロパティ LINE_NOTIFY_TOKEN に格納する
 * @param {string} message メッセージ本文
 */
function notifyLine(message) {
  var token = getStore('LINE_NOTIFY_TOKEN');
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token
    },
    payload: 'message=' + message
  });
}
