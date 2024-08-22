// #title = "openFile"
// #tooltip = " 選択したテキストをファイル名として開く"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*
openFile Mery用 私家改造版

これはakkun氏によるサクラエディタ用マクロopenFileを個人用に書き換えたものです。
選択したテキストをファイルとしてMery（別タブ）で開きます。
69行目～74行目はおまけとして
指定した拡張子を関連付けられたアプリケーションで開く処理を入れています
（画像ファイルなどを登録すると、開いて確認できます）

相対パス・絶対パス対応。
テキストエディタMeryで一応動きます。動作保証はできません。
以下「＊」がついたコメントは私・hosobosoによる追記
*/

//openFile
//選択したテキストをファイル名として開く

let dir = document.FullName;
let selected = document.selection.Text;
let p = 0;	//親階層数

// ＊ファイル及びフォルダが存在するか確認するための「FileSystemObject」オブジェクト生成
var fso = new ActiveXObject( "Scripting.FileSystemObject" );
// ＊Mery Ver 3.4.1 以上なら、Mery側で「shell.FileExists(strFile)」が使えるので、28行目は必要なし、
// ＊かつ、59行目で「fso.FileExists(textfile)」で指定している部分は
// ＊「shell.FileExists(textfile)」に変更しても動きます。

// ＊おまけ用　69行目以降の指定した拡張子を関連付けられたアプリケーションで開く場合
const wshShell = new ActiveXObject( "WScript.Shell" );

//選択文字列がフルパスかどうかの判定
let textfile;
if (selected.search(/^[a-z]:\\/i)>=0){
	textfile = selected;
} else {
	//選択文字列がフルパスではない場合
	//親階層の検索
	while( selected.search(/^\.\.\\/) != -1 ){
		selected = selected.substring(3);
		p++;
	}
	//現在のファイルパスからファイル名を取り除く
	do {
		if ( (n = dir.lastIndexOf("\\")) != -1){
			dir = dir.substring(0,n);
		}
		p--;
	} while(p>=0);
	var textfile = dir + '\\' + selected;
}

if(selected.length == 0) {
	alert("テキストを選択してください。");
} else if ((fso.FileExists(textfile))) {
// ＊FileExists メソッドで、選択テキストtextfileというファイルが存在しているかどうかの判定
	if (/\.(htm|html|shtml|css|js|xml)$/i.test(selected)) {
	// ＊ファイルとして開く拡張子指定 好みで追加・削除してください
		if (Confirm("実行しますか？")) {
			Editor.OpenFile(textfile, meEncodingNone, meOpenAllowNewWindow);
		}
	// ＊「Confirm("実行しますか？")」で、実行するか確認ダイアログを出すようにしています。
	// ＊必要ないなら63、65行目をコメントアウトしてください。

// ＊ここからおまけ、指定した拡張子を関連付けられたアプリケーションで開きます
	} else if (/\.(jpg|jpeg|png|gif|svg|avif|webp)$/i.test(selected)) {
		if (Confirm("関連付けられたアプリケーションで開きます。\n実行しますか？")) {
			wshShell.Run(textfile);
		}
// ＊おまけここまで、必要ないなら34行目と合わせて削除かコメントアウトしてください

	} else {
	alert("選択した文字列は\nファイルとして開く拡張子に指定されていません。");
	} 
} else {
	alert("選択した文字列は\nファイルとして開くことができません。");
}

/*
＊個人メモ

FileExists メソッド
https://learn.microsoft.com/ja-jp/office/vba/language/reference/user-interface-help/fileexists-method

Mery Ver 3.7.2 以上　Shell オブジェクト
https://www.haijin-boys.com/wiki/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9:3:Shell_%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88

*/