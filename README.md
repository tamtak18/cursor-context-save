# cursor-context-save
## cursor-context-save拡張機能
この拡張機能を「VSIXからのインストール」でインストールしてください．

1. **VS Code を再読み込み**

   * コマンドパレット（`Ctrl+Shift+P`）→「Reload Window」を実行
   * これで拡張機能が有効になります．

2. **テスト用のコードファイルを開く**

   * どんな言語ファイルでも構いません（`.java` や `.js` など）．

3. **右クリック → 「Save Cursor Context」 を実行**

   * エディタ上で，選択範囲がある場合はそのテキストを保存
   * 選択がない場合は，カーソル位置の前後7行を自動で抜き出して保存します．

4. **保存先ファイルを確認**

   * ワークスペース直下に `cursor-context.txt` が生成（または上書き）されます．
   * ファイルを開いて，抜き出されたテキストが正しく入っているか確かめてください．

5. **設定のカスタマイズ（必要に応じて）**

   * `Ctrl + ,` で設定を開き，「Cursor Context Save」を検索
   * 保存先パス（`cursorContextSave.filePath`）や抜き出す行数（`cursorContextSave.contextLines`）を変更できます．
