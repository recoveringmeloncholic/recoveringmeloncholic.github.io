// Backing API for the blog's comment widget (assets/js/comments.js).
// Bind this script to the Google Sheet used as comment storage
// (Extensions > Apps Script from within the sheet), then deploy it
// as a Web App (Execute as: Me, Who has access: Anyone).
//
// Expected sheet header row (row 1): timestamp | post | title | name | comment | ip
//
// The commenter's IP is self-reported by their browser (via a public IP
// lookup service) and stored here for moderation reference only — it is
// intentionally never returned by doGet, so the public read API never
// republishes visitor IPs.

var SHEET_NAME = 'Comments';

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var rows = sheet.getDataRange().getValues();
  rows.shift(); // header

  var postFilter = e.parameter.post;
  var comments = rows
    .filter(function (row) { return row[1]; })
    .filter(function (row) { return !postFilter || row[1] === postFilter; })
    .map(function (row) {
      return {
        timestamp: row[0],
        post: row[1],
        title: row[2],
        name: row[3],
        comment: row[4]
      };
    });

  return respond(comments);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: 'Invalid payload' });
  }

  var post = String(data.post || '').slice(0, 200);
  var title = String(data.title || '').slice(0, 200);
  var name = String(data.name || 'Anonymous').slice(0, 50);
  var comment = String(data.comment || '').slice(0, 1000);
  var ip = String(data.ip || '').slice(0, 45);

  if (!post || !comment) {
    return respond({ ok: false, error: 'Missing post or comment' });
  }

  sheet.appendRow([new Date().toISOString(), post, title, name, comment, ip]);

  return respond({ ok: true });
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
