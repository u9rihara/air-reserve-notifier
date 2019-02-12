/**
 * LINE通知用の文章作成
 * @param {object} data 予約データ
 * @param {boolean} is_rsv true:予約 false:キャンセル
 * @return {string} メッセージ本文
 */
function buildLineText(data, is_rsv) {
  var text = (is_rsv) ? ['修理予約が入りました。\n'] : ['以下の予約はキャンセルになりました。\n'];
  text.push('■日時：\n' + data['利用日'] + ' ' + data['利用時間']);
  text.push('■メニュー：\n' + data['メニュー名'] + '（' + data['ご利用の端末'] + '）');
  text.push('■名前：\n' + data['名前']);
  return text.join("\n");
}

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
    payload: 'message=' + "\n" + message
  });
}
