// #title = "Close Last Tag"
// #tooltip = "終了タグ入力"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

/*
Close Last Tag 3.0 Mery用 私家改造版

これはgis_dur氏によるClose Last Tag 3.0を個人用に書き換えたものです。
テキストエディタMeryで一応動きます。動作保証はできません。
JavaScriptの勉強ついでなのでミスがありそうな気がします。
JavaScriptの勉強ついでなのでコメントをたくさん追加しています。
元ファイルはSJISですがUTF-8で保存しても動きます
以下「＊」がついたコメントは私・hosobosoによる追記
*/

// ＊以下オリジナルのライセンス

/**********************************************************
**  Close Last Tag 3.0                                   **
***********************************************************
**  A "Sakura-Editor Macro" using WSH 5.6                **
**  For sakura.exe ver.1.6.2.0 and over                  **
**                               zlib/libpng ライセンス  **
**                      Copyright (C) 2004-2012 gis_dur  **
***********************************************************
**【動作】                                               **
**  カーソル位置より前にある HTML/XML タグを             **
**  ファイル先頭に向かって検索し、                       **
**  1. 終了タグのない開始タグ                            **
**  2. 閉じていないHTMLコメント        <!--      -->     **
**  3. 閉じていないCDATAブロック       <![CDATA[ ]]>     **
**  4. 閉じていないJSPスクリプトレット <%        %>      **
**  5. 閉じていないJSPコメント         <%--      --%>    **
**  がある場合、対応する終了タグを挿入します。           **
**  コメントタグ内は無視します。                         **
**********************************************************/

// サクラエディタ unicode 版の場合は true にする
// var UNICODE_VER = true;
// xml モード（大文字・小文字を区別する）
let XML_MODE = false;
// 挿入した閉じタグの後ろにカーソルを移動するかどうか
// var MOVE_CURSOR = true;
// 閉じタグを省略可能な要素名
let NO_CLOSE_TAG = "," +
[
	"area", "base", "br", "col", "embed", "frame", "hr", "img",
	"input", "link", "meta", "wbr", "source", "track"
].join(",") + ",";

/*
＊閉じタグを省略可能な要素名を全面的に修正
＊"source", "track"はHTML5で追加
＊"basefont", "spacer", "isindex" ,"nextid"はHTML5で廃止なので上一覧から削除しました
＊"bgsound"はInternet Explorer 独自タグなので削除しました
＊"frame", "keygen", "param"は非推奨なので削除しました
＊参照：Void element （空要素） https://developer.mozilla.org/ja/docs/Glossary/Void_element
*/

/*********************************************************/

// シェル
// if (typeof(Shell) == "undefined") {
//   Shell = new ActiveXObject("WScript.Shell");
// }

/*
＊上のシェルはエラーダイアログ表示用、Window.alert()を使う場合は不要
＊もしシェルでエラーダイアログを出すのなら、
var Shell = new ActiveXObject("WScript.Shell");
＊と、Shellの前にvarを入れないとエラーになります。
*/

// 文字列拡張
// if (typeof(String.prototype.is_wide) == "undefined") {
//   String.prototype.is_wide = function() {
//     if (UNICODE_VER) return false;
//     if (this.length == 0) return false;
//     var c = (this.length == 1) ? this : this.charAt(0);
//     return (!c.match(/[ア-ンァィゥェォッャュョ゛゜ー、。「」・]/) && escape(c).length >= 4);
//   };
// }

// ＊文字列拡張はサクラエディタのANSI版用なのでコメントアウト

(function() {
	if (!XML_MODE) {
		NO_CLOSE_TAG = NO_CLOSE_TAG.toUpperCase();
	}
	// タグを表す正規表現
	let TAG_CHARS = "s!\"#$%&\'()=~|^\\`{+*}<>?@[;],/";
	(function(){
		let tmp = "";
		for (let i=0; i<TAG_CHARS.length; i++) {
			tmp += "\\"+TAG_CHARS.charAt(i);
		}
		TAG_CHARS = "[^"+tmp+"]+";
	})();
	let TAGS_EXPRESSION = new RegExp();
	TAGS_EXPRESSION.compile("<!--|-->|<!\\[CDATA\\[|\\]\\]>|<%--|--%>|<%|%>|<"+TAG_CHARS+"([^>]*/>)?|<\\/"+TAG_CHARS+"", "g");
 
	// データ
	let stack = new Array();
	let ins_text = "";
	let err_text = "";
 
	// ステート
	let is_comment = false;
	let is_cdata = false;
	let is_jsp_comment = false;
	let is_jsp = false;
	let is_error = false;

// テキストをすべて取得
//  Editor.CancelMode(0);
//  var cursorX = Number(Editor.ExpandParameter('$x')) - 1;
//  var cursorY = Number(Editor.ExpandParameter('$y')) - 1;
//  Editor.SelectAll(0);
//  var all_text = Editor.GetSelectedString(0);
//  Editor.CancelMode(0);
// 
//  改行を統一
//  ＊Mery のエディタエンジンは内部データの改行コードをすべて LF で扱う仕様なので改行を統一する必要はない
//  all_text = all_text.replace(/\r\n|\r|\n/g, "\n");
//  var all_lines = all_text.split("\n");
//  var num_lines = all_lines.length;
// 
//  カーソル以前のテキストをすべて取得
//  var tmp_text = all_lines[cursorY];
//  if (tmp_text == null) {
//    tmp_text = "";
//  }
//  if (num_lines-(cursorY+1) > 0) {
//    all_lines.splice(cursorY+1, num_lines-(cursorY+1));
//  }
//  for (var i=0; i<cursorX; i++) {
//    if (tmp_text.charAt(i).is_wide()) {
//      cursorX--;
//    }
//  }
//  all_lines[cursorY] = tmp_text.substring(0, cursorX);

	// ＊現在のスクロールバー取得
	let sx = ScrollX, sy = ScrollY;

	// ＊現在のカーソル位置を取得　cursorXはカーソル桁　cursorYはカーソル行
	const cursorX = document.selection.GetActivePointX(mePosLogical);
	const cursorY = document.selection.GetActivePointY(mePosLogical);
	// ＊すべてのテキストを選択し、選択テキストをall_textとする
	document.selection.selectAll();
	const all_text = document.selection.Text;
	// ＊選択解除　meCollapseStartで選択開始位置に向かって選択範囲を解除
	document.selection.Collapse(meCollapseStart);
	
	// ＊全テキストを改行で分割したArrayがall_lines
	const all_lines = all_text.split("\n");
	// ＊全テキストの行数num_lines
	const num_lines = all_lines.length;

	// ＊カーソル行のカーソルより前のテキストtmp_text_start
	let tmp_text_start = document.GetLine(cursorY).substring(0, (cursorX - 1));
	
	// ＊カーソル行のカーソルが行頭だとtmp_text_startがnullなので、カラに直す
	if (tmp_text_start == null) {
		tmp_text_start = "";
	}
	
	// ＊カーソル以前のテキストを行ごとのArrayに
	let cursorBeforeArray = [];
	for (let i=0; i<(cursorY-1); i++) {
		cursorBeforeArray[i] = all_lines[i];
	}
	// ＊Arrayの最後にtmp_text_startを足す　これでカーソルより前のテキスト配列cursorBeforeArray完成
	cursorBeforeArray[cursorY-1] = tmp_text_start;

// タグを取得
// var all_tags = all_lines.join(" ").match(TAGS_EXPRESSION);
// var num_tags = (all_tags == null)? 0: all_tags.length;

	// ＊cursorBeforeArrayの中のタグを取得
	const all_tags = cursorBeforeArray.join(" ").match(TAGS_EXPRESSION);
	const num_tags = (all_tags == null)? 0: all_tags.length;

	// ＊直前の開始タグを検索　now_textがタグ
	for (let i=num_tags-1; i>=0; i--) {
		// タグ文字列取得
		let now_text = all_tags[i];
		if (!XML_MODE) {
			now_text = now_text.toUpperCase();
		}

		// 特殊なステートにある場合
		if (is_comment) {
			if (now_text == "<!--") {
				is_comment = false;
			}
			continue;
		}
		else if (is_cdata) {
			if (now_text == "<![CDATA[") {
				is_cdata = false;
			}
			continue;
		}
		else if (is_jsp_comment) {
			if (now_text == "<%--") {
				is_jsp_comment = false;
			}
			continue;
		}
		else if (is_jsp) {
			if (now_text == "<%") {
				is_jsp = false;
			}
			continue;
		}
 
		// 特殊なステートに遷移する場合
		if (now_text == "-->") {
			is_comment = true;
			continue;
		}
		else if (now_text == "<!--") {
			ins_text = "-->";
			break;
		}
		else if (now_text == "]]>") {
			is_cdata = true;
			continue;
		}
		else if (now_text == "<![CDATA[") {
			ins_text = "]]>";
			break;
		}
		else if (now_text == "--%>") {
			is_jsp_comment = true;
			continue;
		}
		else if (now_text == "<%--") {
			ins_text = "--%>";
			break;
		}
		else if (now_text == "%>") {
			is_jsp = true;
			continue;
		}
		else if (now_text == "<%") {
			ins_text = "%>";
			break;
		}
		// 閉じタグ不要
		else if (now_text.indexOf("/>") != -1) {
			continue;
		}
		// 閉じタグのスタックに追加
		else if (now_text.indexOf("</") == 0) {
			now_text = now_text.substring(2);
			stack.push(now_text);
			continue;
		}

		// 要素名取得
		now_text = now_text.substring(1);

		// 省略可能なタグの場合
		if (NO_CLOSE_TAG.indexOf(","+now_text+",") != -1) {
			if (stack.length == 0) {
				continue;
			}
			else {
				tmp_text = stack.pop();
				if (now_text != tmp_text) {
					stack.push(tmp_text);
				}
				continue;
			}
		}
		// 通常のタグの場合
		else {
			if (stack.length == 0) {
				ins_text = "</" + all_tags[i].substring(1) + ">";
				break;
			}
			else {
				tmp_text = stack.pop();
				if (now_text != tmp_text) {
					is_error = true;
					err_text += "タグの包含関係が不正です。\n";
					err_text += "<"+now_text+"> ... ... </"+tmp_text+">\n";
					stack = new Array();
					break;
				}
			}
		}
	}

	// コメント中
	if (is_comment) {
		is_error = true;
		err_text += "コメントの開閉関係が不正です。\n";
	}
	// CDATA 中
	else if (is_cdata) {
		is_error = true;
		err_text += "CDATA ブロックの開閉関係が不正です。\n";
	}
	// JSP コメント中
	else if (is_jsp_comment) {
		is_error = true;
		err_text += "JSP コメントの開閉関係が不正です。\n";
	}
	// JSP 中
	else if (is_jsp) {
		is_error = true;
		err_text += "JSP スクリプトレットの開閉関係が不正です。\n";
	}
	// スタックに終了タグあり
	else if (stack.length > 0) {
		is_error = true;
		err_text += "開始タグのない終了タグが見つかりました。\n";
		for (let i=0; i<stack.length; i++) {
			err_text += "<"+stack[i]+">\n";
		}
	}

// エラーダイアログ表示
// if (is_error) {
//   Shell.Popup(err_text, 0, "文法エラー", 0);
//   return;
// }
// 
// 終了タグの挿入
// Editor.InsText(ins_text);
// 
// カーソルを動かさない場合は、元の位置に戻す
// if (!MOVE_CURSOR) {
//   for (var i=0; i<ins_text.length; i++) {
//     Editor.Left(0);
//   }

	// ＊カーソル＆スクロール位置を復元
	document.selection.SetActivePoint(mePosLogical, cursorX, cursorY, false);
	ScrollX = sx; ScrollY = sy;

/*
＊元マクロはエラーダイアログ表示以外にシェル使っていないので(サクラエディタはシェルでダイアログ表示）、
＊シェルではなくWindow.alert()を使いましたが、元マクロのようにシェル呼び出しでも動くので好みで。
＊シェル呼び出しは63行目からの追記を参照＆327～331行のコメントアウトを外してください。
*/

	// ＊エラーダイアログ表示
	if (is_error) {
		alert('文法エラー\n' + err_text);
	return;
	}

	// ＊終了タグの挿入
	if (num_tags != 0){
	document.write(ins_text);
	}

})();
