// #title = "openFile"
// #tooltip = " 選択したテキストをファイル名として開く"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*
openFile Mery用 私家改造版

これはakkun氏によるopenFileを個人用に書き換えたものです。
選択したテキストをMery（別タブ）で開きます。
テキストエディタMeryで一応動きます。動作保証はできません。
以下「＊」がついたコメントは私・hosobosoによる追記
*/

//openFile
//選択したテキストをファイル名として開く
 
var dir = document.FullName;
var selected = document.selection.Text;
var p = 0;	//親階層数

//＊ファイルとして開く拡張子指定　以下で指定した拡張子のテキストを選択しても何も起きない
//＊好みで追加・削除してください
if(/\.(htm|html|shtml|css|js|xml)$/.test(selected)){

	//選択文字列がフルパスならそのままオープン
	if (selected.search(/^[a-z]:\\/i)>=0){
		Editor.OpenFile(selected, meEncodingNone, meOpenAllowNewWindow);
		//＊meOpenAllowNewWindowフラグをつけると元のファイルとは別タブ（か別ウィンドウ）で開きます
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

}
