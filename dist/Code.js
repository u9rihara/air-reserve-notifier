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

/**
 * 予約メッセージ解析
 * @param {string} target_text 解析対象の文章
 * @return {object} 予約データオブジェクト
 */
function analyzeReserveMessage(target_text) {
  var rsv_data = {
    名前: '',
    フリガナ: '',
    利用日: '',
    利用時間: ''
  };
  target_text.replace(/^■(.+?)：(.+)$/gm, function(match, p1, p2) {
    switch (p1) {
      case '利用日時':
        p2.replace(/(\d{4}\/\d{2}\/\d{2})\(.+\) (\d{2}:\d{2})/, function(match2, pp1, pp2) {
          rsv_data['利用日'] = pp1;
          rsv_data['利用時間'] = pp2;
        });
        break;
      case '名前（姓）':
        rsv_data['名前'] += p2;
        break;
      case '名前（名）':
        rsv_data['名前'] += '　' + p2;
        break;
      case 'フリガナ（セイ）':
        rsv_data['フリガナ'] += p2;
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

/**
 * キャンセルメッセージメッセージ解析
 * @param {string} target_text 解析対象の文章
 * @return {string} 予約番号
 */
function analyzeCancelMessage(target_text) {
  var rsv_id = '';
  target_text.replace(/^■(.+?)：(.+)$/gm, function (match, p1, p2) {
    if (p1 === '予約番号') {
      rsv_id = p2;
    }
  });
  return rsv_id;
}
