//選択テキストの末尾に<br>追加
document.selection.Replace("\\n", "<br>\\n", meFindNext | meFindReplaceRegExp | meReplaceSelOnly | meReplaceAll);