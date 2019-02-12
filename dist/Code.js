function main() {
  var mails = checkNewMail();
  var rsv_len = mails.reserve.length;
  var can_len = mails.cancel.length;
  var body, data, lineMsg;

  if (rsv_len) {
    for (var i = 0; i < rsv_len; i++) {
      body = pullDataText(mails.reserve[i].body, 'reserve');
      data = analyzeReserveMessage(body);
      data['予約受付日時'] = mails.reserve[i].date;
      addRow(data);
      lineMsg = buildLineText(data, 'reserve');
      notifyLine(lineMsg);
    }
  }

  if (can_len) {
    for (var i = 0; i < can_len; i++) {
      body = pullDataText(mails.cancel[i].body, 'cancel');
      data = analyzeReserveMessage(body);
      deactivateRow(data['予約番号']);
      lineMsg = buildLineText(data, 'cancel');
      notifyLine(lineMsg);
    }
  }
}
