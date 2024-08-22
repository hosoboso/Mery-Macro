// #title = "数値文字参照置換"
// #tooltip = "16進数数値文字参照置換"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

// 数値文字参照（文字参照）置換
// 選択した文字列なら何の文字でも16進数の数値文字参照に変換
// 文字列がカラの時のalertは別になくても良いのでコメントアウトしてます

let result = "";
const inputStrings = document.selection.Text;

// if (document.selection.IsEmpty) {
// 	alert('文字を入力してください');
// }

// charCodeAt : 0スタートで、*番目の文字のUnicode("12371"や"12398")を返す。
// "&#x" ";"と連結して、数値文字参照を作成
for (let i = 0; i < inputStrings.length; i++) {
	result += "&#x" + inputStrings.charCodeAt(i).toString(16) + ";";
}
document.write(result);