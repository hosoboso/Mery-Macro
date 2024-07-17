// #title = "<p>タグ"
// #tooltip = "<p>タグ"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

//<p>タグ入力

// 入力したいタグ　他タグのマクロはここを変更して作ればOK
var Tag = "p";

// <div class=""></div>のようにグローバル属性も入れたいならここに入力
// var str = "class";
// var attribute = " " + str + "=\"\"";

//グローバル属性なしの場合
var attribute = "";

// テキストが未選択の場合はタグだけ入力 CharLeftでカーソル位置を戻す
if (document.selection.IsEmpty) {
	document.write("<" + Tag + "></" + Tag + ">");
	document.selection.CharLeft(false, (Tag.length + 3) );
// テキストが選択されていれば選択されたテキストをタグで挟む
} else {
	var Selecttext = document.selection.Text;
	var SelectTag = "<" + Tag + attribute + ">" + Selecttext + "</" + Tag + ">";
	document.write(SelectTag);
}