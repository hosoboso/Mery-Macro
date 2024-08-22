// #title = "<p>タグ"
// #tooltip = "<p>タグ"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

//<p>タグ入力

// 入力したいタグ　他タグのマクロはここを変更して作ればOK
const Tag = "p";

// <div class=""></div>のようにグローバル属性も入れたいならここに入力
// const str = "class";
// const attribute = " " + str + "=\"\"";

//グローバル属性なしの場合
const attribute = "";

// テキストが未選択の場合はタグだけ入力 CharLeftでカーソル位置を戻す
if (document.selection.IsEmpty) {
	document.write("<" + Tag + "></" + Tag + ">");
	document.selection.CharLeft(false, (Tag.length + 3) );
// テキストが選択されていれば選択されたテキストをタグで挟む
} else {
	const Selecttext = document.selection.Text;
	const SelectTag = "<" + Tag + attribute + ">" + Selecttext + "</" + Tag + ">";
	document.write(SelectTag);
}