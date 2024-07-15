# Meryマクロ置き場

[テキストエディター「Mery」](https://www.haijin-boys.com/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8)をHTMLエディタとして活用する時用マクロ置き場です。
HTML手打ちの人向け。

Mery Ver 2.6.7 (64 ビット版)

及び、

Mery ベータ版 Ver 3.7.2 (64 ビット版)

で動作確認済みです。

[サクラエディタマクロ](https://www.haijin-boys.com/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8)を手直ししたものを置いてあります。  
マクロの登録方法はヘルプ参照。

> [!TIP]
> Meryでは、マクロの行頭に
> ```HTML
> #title = "マクロ名"
> #tooltip = "マクロ名ツールチップ"
> #icon = "xx.ico"
> ```
> で、表示名やアイコンを変更できます。  
> 必ず行頭に入れる必要があります（行頭にはコメントアウト行なども入れてはだめ）。  
> アイコンは自前で用意するなりしてください。  
> 
> 上を入力しないとマクロのファイル名がそのまま登録されます。

## [p.js](p.js)

```HTML
<p>hogehoge</p>
```
のようにテキストを挟むタグ変換。  
pをdivやH1など他のタグに変更して他のタグのマクロも作成できる。

## [brreplace.js](brreplace.js)

選択テキストの末尾に

```HTML
<br>
```

を追加。

## [list.js](list.js)

選択テキストをリストタグに変換。

```HTML
aaa
bbb
ccc

↓

<ul>
	<li>aaa</li>
	<li>bbb</li>
	<li>ccc</li>
</ul>
```

## [table.js](table.js)

選択テキストをテーブルタグに変換。

```HTML
aaa	111
bbb	222
ccc	333

↓

<table>
<thead>
	<tr><th>aaa</th><th>111</th></tr>
</thead>
<tbody>
	<tr><td>bbb</td><td>222</td></tr>
	<tr><td>ccc</td><td>333</td></tr>
</tbody>
</table>
```

## [href.js](href.js)

選択テキストhogehogeを、
```HTML
<a href="hogehoge" target="_blank">hogehoge</a>
```
に変換。

## [hexadecimal.js](hexadecimal.js)

何の文字でも16進数の数値文字参照に変換。
```HTML
♥ → &#x2665;
♪ → &#x266a;
```
## [htmlentity.js](htmlentity.js)

HTML頻出の文字参照置換。選択文字列中の
```HTML
&, <, >, ", '
```
のみ
```HTML
&amp;, &lt;, &gt;, &quot;, &apos;
```
に置換する。

## [closetagM.js](closetagM.js)

[Close Last Tag（直前の閉じていない HTML/XML タグを閉じる）](https://sakura-editor.sourceforge.net/cgi-bin/cyclamen/cyclamen.cgi?log=macro&tree=c546)

サクラエディタ用のマクロ「Close Last Tag 3.0」を、Maryでも多分動くように個人的に書き換えてみたマクロです。  
一応動きますが、素人が適当にいじったのでおかしい挙動をするかもしれません。

## [Tagautocomp.js](Tagautocomp.js)

[VSライクなhtml終タグ自動補完](https://sakura-editor.github.io/bbslog/sf/macro/341.html)

サクラエディタ用のマクロ「VSライクなhtml終タグ自動補完」を、Maryでも多分動くように個人的に書き換えてみたマクロです。  
一応動きますが、素人が適当にいじったのでおかしい挙動をするかもしれません。

## [公式Wikiのマクロライブラリ](https://www.haijin-boys.com/wiki/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA)

[テキスト整形](https://www.haijin-boys.com/wiki/%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E6%95%B4%E5%BD%A2)

HTMLエディタ向き機能あり
