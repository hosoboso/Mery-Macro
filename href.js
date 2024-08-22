// #title = "<a>タグ"
// #tooltip = "リンクタグ"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

﻿// アドレスを<a href="hogehoge" target="_blank">hogehoge</a>に変換

// target="_blank"を入れる場合
const Targetblank = " target=\"_blank\"";
// target="_blank"がいらない場合
// const Targetblank = "";

// テキストが未選択の場合クリップボードのテキストでリンクを作る
if (document.selection.IsEmpty) {
	const ClipboardText = ClipboardData.GetData();
	const ClipboardHref = "<a href=\"" + ClipboardText + "\"" + Targetblank + "></a>";
	document.write(ClipboardHref);
} else {
// テキストが選択されていれば選択されたテキストでリンクを作る
	const Selecttext = document.selection.Text;
	const SelectHref = "<a href=\"" + Selecttext + "\"" + Targetblank + ">" + Selecttext + "</a>";
	document.write(SelectHref);
}
