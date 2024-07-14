//HTML頻出の文字参照置換　選択文字列中の&,<,>,",'のみ置換する

// 好みで適宜変更してください。
// #title = "文字参照置換"
// #tooltip = "文字参照置換"
// #icon = "xx.ico"

var str = document.selection.Text;
str = str.replace(/&/g, "&amp;");
str = str.replace(/\</g, "&lt;");
str = str.replace(/\>/g, "&gt;");
str = str.replace(/"/g, "&quot;");
str = str.replace(/'/g, "&apos;");
document.write(str);