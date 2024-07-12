//数値文字参照（文字参照）置換
//何の文字でも16進数の数値文字参照に変換

var result = "";
var inputStrings = document.selection.Text;
if (document.selection.IsEmpty) {
	alert('文字を入力してください');
}
inputStringsLength = inputStrings.length;

// charCodeAt : 0スタートで、*番目の文字のUnicode("12371"や"12398")を返す。
// "&#x" ";"と連結して、数値文字参照を作成
for (var i=0; i<inputStringsLength; i++) {
	result = result + "&#x" + inputStrings.charCodeAt(i).toString(16) + ";";
}
document.write(result);