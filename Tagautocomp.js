// #title = "タグ自動補完"
// #tooltip = "VSライクなhtml終タグ自動補完"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*
VSライクなhtml終タグ自動補完 Mery用 私家改造版

これはpeak氏による「VSライクなhtml終タグ自動補完」を
個人用に書き換えたものです。
テキストエディタMeryで一応動きます。動作保証はできません。
以下「＊」がついたコメントは私・hosobosoによる追記
*/

////////////////////////////////////////////////////////////////////////////////
// html, xml 入力支援
// <...>の直後に</...>を自動で補完します。
//
// インストール方法
// キー SHIFT + . にこのマクロを割り当ててください。

/*
＊一般的な109キーボードでは「Shift + .」で
＊タグを閉じる「>」が入力されるので
＊同時にこのマクロが動く仕組みです
*/

////////////////////////////////////////////////////////////////////////////////
// エントリーポイント
Entry();


function Entry()
{
	// SHIFT + . で呼び出されるので、とりあえず > を出力する
	// Editor.Char(0x3e); // 0x3e = '>'
	document.write(">");

	// 	var strFileName = Editor.GetFileName();
	// 	if(/\.(htm|html|shtml)$/.test(strFileName)){
	// 		ComplementTag(true);

	var strFileName = document.Name;
	if(/\.(htm|html|shtml|txt)$/.test(strFileName)){
		ComplementTag(true);
	}
	else if(/\.(xml|xhtml)$/.test(strFileName)){
		ComplementTag(false);
	}
}

/*
＊私はテキストファイルでHTMLの下書きをするので、44行目の対応ファイルにtxtを追加してあります。
＊不要なら(htm|html|shtml|txt)を(htm|html|shtml)に戻してください。
*/

function ComplementTag(isHTML)
{
	var strLine = GetCurLineUntilCursor();
	var astrMatched = strLine.match(/<([^<>"']|"[^"]*?"|'[^']*?')+>$/); //'
	if(astrMatched == null) return false;
	var strTag = astrMatched[0];

	// 終タグを必要としないタグなら何もしない
	if(/-->$|\/>$|\?>$/.test(strTag)) return;
	if(strTag.search(/^<\s*(\w+)/) < 0) return;

	// タグ名を抽出
	strTag = RegExp.$1;

	if(isHTML){
		// HTMLの場合は、タグの種類によっては終タグがいらない
		// if("|area|base|basefont|bgsound|br|col|embed|frame|hr|img|input|isindex|keygen|link|meta|nextid|param|spacer|wbr|"
		if("|area|base|br|col|embed|frame|hr|img|input|link|meta|wbr|source|track|"
			.indexOf("|" + strTag + "|") >= 0)
		{
			return;
		}
	}

/*
＊73行目をHTML5対応タグのみに修正しました。
＊参照：Void element （空要素） https://developer.mozilla.org/ja/docs/Glossary/Void_element
*/

	// 終タグを作って挿入
	strTag = "</" + strTag + ">";

// 	Editor.InsText(strTag);
// 	for(var i = 0; i < strTag.length; ++i){
// 		Editor.Left();
// 	}

	document.write(strTag);
	document.selection.CharLeft( false, strTag.length);

	return true;
}


function GetCurLineUntilCursor()
{
// カーソル位置取得
// 	var xCursor = parseInt(Editor.ExpandParameter('$x'));
// 	var yCursor = parseInt(Editor.ExpandParameter('$y'));
	var xCursor = document.selection.GetActivePointX(mePosLogical);
	var yCursor = document.selection.GetActivePointY(mePosLogical);

// カーソル行全体を取得
// 	var str = Editor.GetLineStr(yCursor);
	var str = document.GetLine(yCursor);

// xCursor はマルチバイトコードでの値なのでユニコード用に補正
// --xCursor; // １起算だったものを０起算に直す
// for (var x = 0; x < xCursor; ++x){
//	 if(IsWide(str.charCodeAt(x))) --xCursor;
// }

	return str.substring(0, xCursor);
}

////////////////////////////////////////////////////////////////////////////////
// ２バイト文字判定
// function IsWide(charCode)
// {
//		 return	0x80 <= charCode && (charCode <= 0xff60 || 0xffa0 <= charCode);
// }

// ＊113行～、123行～、ユニコード用補正はMeryだと必要ないのでコメントアウトしています