#title = "<p>タグ＋<br>"
#tooltip = "<p></p>で挟み込み＋内部の改行には<br>を追加"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*******************************************
<p></p>で挟み込み＋内部の改行には<br>を追加

明日の
天気は、
晴れ。

を

<p>明日の<br>
天気は、<br>
晴れ。</p>

に変換

改行なしなら<p></p>挟み込みのみ
*******************************************/

// 選択テキスト
const Selecttext = document.selection.Text;

// テキストが未選択の場合はタグだけ入力 CharLeftでカーソル位置を戻す
if (document.selection.IsEmpty) {
	document.write("<p></p>");
	document.selection.CharLeft(false, 4);
} else {
	// 選択テキストを改行で分割
	const textArray = Selecttext.split("\n");
	let resultText = "<p>";
	for (let i = 0; i < textArray.length; i++) {
		if (i < textArray.length - 1) {
			resultText += textArray[i] + "<br>\n";
		} else {
			resultText += textArray[i] + "</p>";
		}
	}

	document.write(resultText);
}