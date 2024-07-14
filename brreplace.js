// 選択テキストの末尾に<br>追加

// 好みで適宜変更してください。
// #title = "改行→<br>"
// #tooltip = "末尾に<br>追加"
// #icon = "xx.ico"

document.selection.Replace("\\n", "<br>\\n", meFindNext | meFindReplaceRegExp | meReplaceSelOnly | meReplaceAll);