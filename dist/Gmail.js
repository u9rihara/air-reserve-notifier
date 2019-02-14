/**
 * 新着メール確認
 * アーカイブされていないスレッド内にある、
 * 受信日時が「GMAIL_LAST_CHECK」以降のメッセージ取得する
 * @return {Object} 受信メールデータ
 */
function checkNewMail() {
  var last_check = new Date(getStore('GMAIL_LAST_CHECK'));
  var mailData = {
    reserve: [],
    cancel: []
  };

  var query = 'label:inbox from:(reservation@airreserve.net|reservation_cancel@airreserve.net)';
  var threads = GmailApp.search(query, 0, 30);
  setStore('GMAIL_LAST_CHECK', formatDate()); // 最終チェック日時のアップデート
  var messages = GmailApp.getMessagesForThreads(threads);

  for (var i = messages.length - 1; i >= 0; i--) { // スレッド古い順（日跨ぎでスレッド分かれる？対策）
    for (var j = 0; j < messages[i].length; j++) { // メッセージ新しい順
      var msg = messages[i][j];
      var date = msg.getDate();
      var from = msg.getFrom();
      if (date > last_check) {
        var row = {};
        switch (from) {
          case 'reservation@airreserve.net':
            row = analyzeReserveMessage(pullDataText(msg.getPlainBody(), 'reserve'));
            row['予約受付日時'] = formatDate(msg.getDate());
            mailData.reserve.push(row);
            break;
          case 'reservation_cancel@airreserve.net':
            row = analyzeReserveMessage(pullDataText(msg.getPlainBody(), 'cancel'));
            mailData.cancel.push(row);
            break;
        }
      }
    }
  }

  GmailApp.moveThreadsToArchive(threads);
  return mailData;
}

/**
 * 予約・キャンセルメール本文から必要な文字列を抜き出す
 * @param {string} bodytext 本文テキスト
 * @param {string} type 対象のメールタイプ 'reserve' or 'cancel'
 * @return {string} データ
 */
function pullDataText(bodytext, type) {
  var regExp = {
    reserve: /【ご予約内容】[\s\S]*?■電話番号：\d+/gm,
    cancel: /【キャンセルされたご予約内容】[\s\S]*?■電話番号：\d+/gm
  };
  if (typeof regExp[type] === 'undefined') {
    return null;
  }
  var result = bodytext.match(regExp[type]);
  return (result === null) ? null : result[0];
}

/**
 * 予約メッセージ解析
 * @param {string} target_text 解析対象の文章
 * @return {object} 予約データオブジェクト
 */
function analyzeReserveMessage(target_text) {
  var rsv_data = {};
  target_text.replace(/^■(.+?)：(.+)$/gm, function (match, p1, p2) {
    switch (p1) {
      case '利用日時':
        p2.replace(/(\d{4}\/\d{2}\/\d{2})\(.+\) (\d{2}:\d{2})/, function (match2, pp1, pp2) {
          rsv_data['利用日'] = pp1;
          rsv_data['利用時間'] = pp2;
        });
        break;
      case '名前（姓）':
        rsv_data['名前'] = p2;
        break;
      case '名前（名）':
        rsv_data['名前'] += '　' + p2;
        break;
      case 'フリガナ（セイ）':
        rsv_data['フリガナ'] = p2;
        break;
      case 'フリガナ（メイ）':
        rsv_data['フリガナ'] += '　' + p2;
        break;
      default:
        rsv_data[p1] = p2;
        break;
    }
  });
  return rsv_data;
}
