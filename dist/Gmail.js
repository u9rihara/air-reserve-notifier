/**
 * 新着メール確認
 * アーカイブされていないメールを新着として扱う
 * @return {object} 受信メールデータ
 */
function checkNewMail() {
  var query = 'label:inbox from:(reservation@airreserve.net|reservation_cancel@airreserve.net)';
  var threads = GmailApp.search(query, 0, 30);
  var messages = GmailApp.getMessagesForThreads(threads);
  var mails = {
    reserve: [],
    cancel: []
  };
  for (var i = 0; i < messages.length; i++) {
    var from = messages[i][0].getFrom();
    var data = {
      date: formatDate(messages[i][0].getDate()),
      body: messages[i][0].getPlainBody()
    };
    if (from == 'reservation@airreserve.net') {
      mails.reserve.push(data);
    } else {
      mails.cancel.push(data);
    }
  }
  GmailApp.moveThreadsToArchive(threads);
  return mails;
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
  var result = regExp[type].exec(bodytext);
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
