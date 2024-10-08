﻿// #title = "<table>変換"
// #tooltip = "テーブルタグ変換"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

// タブ区切りの選択テキストをテーブルタグに変換
// 1行目はヘッダ固定です

// タグのインデントを指定、好みで変更してください
// タブなら
const indent = "\t";
// 半角スペース2個なら
// const indent = "  ";
// インデントなしなら
// const indent = "";

//テキストを選択していない時はテーブルタグの雛形を入力
if(document.selection.IsEmpty){
	document.write("<table>\n<thead>\n"+ indent + "<tr><th></th><th></th></tr>\n</thead>\n<tbody>\n" + indent + "<tr><td></td><td></td></tr>\n" + indent + "<tr><td></td><td></td></tr>\n</tbody></table>");

//テキストを選択しているならテーブルタグ挿入
} else {
	const selectText = document.selection.Text;
	
	// 改行\nで選択テキスト分割
	// Mery のエディタエンジンは内部データの改行コードをすべて LF で扱う仕様とのこと
	const textArray = selectText.split("\n");
	// タブで分割　タブ区切りではないテキストの場合は「\t」部分を該当文字に変更してください
	const tableArray = [];
	for (let i = 0; i < textArray.length; i++) {
		tableArray[i] = textArray[i].split("\t");
	}

	let tableRow = "";	//1行分のタグ
	let tableText = "";	//テーブルタグ全体

	//インデント（indent）や改行位置（\n）は好みで変更してください
	for (let i = 0; i < tableArray.length; i++) {
		tableRow = indent + "<tr>";
		for (let j = 0; j < tableArray[i].length; j++) {
			if (i == 0) {
				tableRow += "<th>" + tableArray[i][j] + "</th>";
			} else {
				tableRow += "<td>" + tableArray[i][j] + "</td>";
			}
		}
		if (i == 0) {
			tableRow += "</tr>\n</thead>\n<tbody>\n";
		} else {
			tableRow += "</tr>\n";
		}
		tableText += tableRow;
	}
	document.write("<table>\n<thead>\n"+ tableText + "</tbody>\n</table>");
}