// #title = "openFile"
// #tooltip = " 選択したテキストをファイル名として開く"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*
openFile Mery用 私家改造版

これはakkun氏によるopenFileを個人用に書き換えたものです。
選択したテキストをファイルとしてMery（別タブ）で開きます。
相対パス・絶対パス対応。
テキストエディタMeryで一応動きます。動作保証はできません。
以下「＊」がついたコメントは私・hosobosoによる追記
*/

//openFile
//選択したテキストをファイル名として開く

var dir = document.FullName;
var selected = document.selection.Text;
var p = 0;	//親階層数

if(selected.length == 0) {
	alert("テキストを選択してください。");

} else if (/\.(htm|html|shtml|css|js|xml)$/.test(selected)){
// ＊ファイルとして開く拡張子指定
// ＊上で指定した拡張子のテキストを選択して実行するとファイルを開きます
// ＊好みで追加・削除してください

	//選択文字列がフルパスならそのままオープン
	if (selected.search(/^[a-z]:\\/i)>=0){
		Editor.OpenFile(selected, meEncodingNone, meOpenAllowNewWindow);
		// ＊meOpenAllowNewWindowフラグをつけると元のファイルとは別タブ（か別ウィンドウ）で開きます
	}else{
		//親階層の検索
		while( selected.search(/^\.\.\\/) != -1 ){
			selected = selected.substring(3);
			p++;
		}
		//現在のファイルパスからファイル名を取り除く
		do{
			if ( (n = dir.lastIndexOf("\\")) != -1){
				var dir = dir.substring(0,n);
			}
			p--;
		}while(p>=0);
		Editor.OpenFile((dir + '\\' + selected), meEncodingNone, meOpenAllowNewWindow);
	}

} else {
	alert("選択テキストはファイルとして\n開くことができません。");
}