// Logger.log();
// console.log();

function checkTest() {
  var mails = checkNewMail();
  var rsv_len = mails.reserve.length;
  var can_len = mails.cancel.length;
  if (rsv_len) {
    for (var i = 0; i < rsv_len; i++) {
      mails.reserve[i].body = pullDataText(mails.reserve[i].body, 'reserve');
    }
  }
  console.log(mails.reserve);
  if (can_len) {
    for (var i = 0; i < can_len; i++) {
      mails.cancel[i].body = pullDataText(mails.cancel[i].body, 'cancel');
    }
  }
  console.log(mails.cancel);
}

function addTest() {
  var text = [
    "【ご予約内容】",
    "■予約番号：11Q3XETM2",
    "■利用日時：2019/02/10(日) 12:00～13:00",
    "■メニュー名：水没修理",
    "■ご利用の端末：iPhone 8",
    "■名前（姓）：田中",
    "■名前（名）：太郎",
    "■フリガナ（セイ）：タナカ",
    "■フリガナ（メイ）：タロウ",
    "■メールアドレス：tanaka@hogehoge.jp",
    "■電話番号：09012345678"
  ].join("\n");
  var data = analyzeReserveMessage(text);
  data['予約受付日時'] = '2019/01/01 00:00:00';
  // addRow(data);
  var message = buildLineText(data, 'reserve');
  // Logger.log(message);
  notifyLine(message);
}

function cancelTest() {
  var text = [
    "【キャンセルされたご予約内容】",
    "■予約番号：11Q3XETM2",
    "■利用日時：2019/02/10(日) 12:00～13:00",
    "■メニュー名：水没修理",
    "■ご利用の端末：iPhone 8",
    "■名前（姓）：田中",
    "■名前（名）：太郎",
    "■フリガナ（セイ）：タナカ",
    "■フリガナ（メイ）：タロウ",
    "■メールアドレス：tanaka@hogehoge.jp",
    "■電話番号：09012345678"
  ].join("\n");
  var data = analyzeReserveMessage(text);
  var rsv_id = data['予約番号'];
  deactivateRow(rsv_id);
  var message = buildLineText(data, 'cancel');
  // Logger.log(message);
  notifyLine(message);
}
