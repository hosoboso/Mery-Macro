// #title = "<img>タグ変換"
// #tooltip = "<img>タグ変換"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

// <img src="" alt="">を入力
// 1行目に画像ファイルのアドレス、2行目にalt属性を記述して選択して実行すると入力します
// 
// 例：
// 
// map.jpg
// 公園の地図
// 
// というテキストを2行選択して実行すると
// <img src="map.jpg" alt="公園の地図">
// と変換します
// 3行以上選択しても3行目以降は無視するので注意
// 1行のみ選択の場合は画像ファイルのアドレスのみ入力

var Selecttext = document.selection.Text;

if(Selecttext.length == 0) {
	document.write("<img src=\"\" alt=\"\">");
	document.selection.CharLeft(false, 9);
} else {

	// 選択テキストを改行で分割
	var textArray = Selecttext.split("\n");

	// 選択テキストが1行のみの場合2行目を空欄にする
	if (textArray.length == 1){
	textArray[1] = "";
	}
	
	var SelectTag = "<img src=\"" + textArray[0] + "\" alt=\"" + textArray[1] + "\">";
	document.write(SelectTag);
	
	// 3行以上選択していた場合は以降にそのまま追加
	if (textArray.length > 1){
		for (var i = 2; i < textArray.length; i++) {
			document.write("\n" + textArray[i]);
		}
	}
}