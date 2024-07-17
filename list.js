// #title = "<li>タグ変換"
// #tooltip = "リストタグ変換"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

// 選択テキストをリストタグに変換

// インデントを指定、好みで変更してください
// タブなら
var indent = "\t";
// 半角スペース2個なら
// var indent = "  ";
// インデントなしなら
// var indent = "";

//テキストを選択していない時はリストタグの雛形を入力
if(document.selection.IsEmpty){
	document.write("<ul>\n" + indent + "<li></li>\n</ul>");
}else{	
	var selectText = document.selection.Text;

	// 改行\nで選択テキスト分割
	// Mery のエディタエンジンは内部データの改行コードをすべて LF で扱う仕様とのこと
	var textArray = selectText.split("\n");

	//インデント（indent）や改行位置（\n）は好みで変更してください
	listText = "<ul>\n";
	for (var i = 0; i < textArray.length; i++) {
		listText += indent + "<li>" + textArray[i] + "</li>\n";
	}
	listText += "</ul>";

	document.write(listText);
}