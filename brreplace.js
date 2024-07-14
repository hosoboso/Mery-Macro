// #title = "改行→<br>"
// #tooltip = "末尾に<br>追加"
// #icon = "xx.ico"
// 上は好みで適宜変更してください。

// 選択テキストの末尾に<br>追加

document.selection.Replace("\\n", "<br>\\n", meFindNext | meFindReplaceRegExp | meReplaceSelOnly | meReplaceAll);