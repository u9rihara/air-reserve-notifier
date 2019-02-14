function main() {
  try {
    var mails = checkNewMail();

    // 予約メール処理
    if (mails.reserve.length) {
      for (var i = 0; i < mails.reserve.length; i++) {
        var mailData = mails.reserve[i];
        addRow(mailData);
        notifyLine(buildLineText(mailData, 'reserve'));
      }
    }

    // キャンセルメール処理
    if (mails.cancel.length) {
      for (var i = 0; i < mails.cancel.length; i++) {
        var mailData = mails.cancel[i];
        deactivateRow(mailData['予約番号']);
        notifyLine(buildLineText(mailData, 'cancel'));
      }
    }

  } catch (error) {
    console.error(error);
  }
}
