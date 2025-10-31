# VSIXの作り方

以下のような構成で、ワークスペース内のファイルを一切追加インストールせずに、オフライン環境でも `.vsix` 化して導入できる最小限の VS Code 拡張機能を作成します。

* **機能**

  * エディタ上で右クリック → “Save Cursor Context” を実行
  * エディタに選択範囲があればそれを、なければカーソル前後7行を抜き出し
  * ワークスペースルート直下の `cursor-context.txt`（設定で変更可）に上書き保存

---

## 1. プロジェクト構成

```
cursor-context-save/
├─ package.json
├─ tsconfig.json
├─ src/
│   └─ extension.ts
└─ README.md
```

---

## 2. package.json

```json
{
  "name": "cursor-context-save",
  "displayName": "Cursor Context Save",
  "description": "Save selected text or cursor ±n lines to a file for RAG preprocessing",
  "version": "1.0.0",
  "publisher": "your-name",
  "engines": {
    "vscode": "^1.60.0"
  },
  "categories": ["Other"],
  "activationEvents": [
    "onCommand:cursorContextSave.save"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "cursorContextSave.save",
        "title": "Save Cursor Context"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "cursorContextSave.save",
          "when": "editorTextFocus"
        }
      ]
    ],
    "configuration": {
      "type": "object",
      "title": "Cursor Context Save",
      "properties": {
        "cursorContextSave.filePath": {
          "type": "string",
          "default": "${workspaceFolder}/cursor-context.txt",
          "description": "保存先ファイルパス（workspaceFolderが展開されます）"
        },
        "cursorContextSave.contextLines": {
          "type": "number",
          "default": 7,
          "minimum": 1,
          "description": "選択範囲がないときに取得する前後行数"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ."
  },
  "devDependencies": {
    "typescript": "^4.4.3",
    "vscode": "^1.1.37",
    "@types/node": "^14.17.6"
  }
}
```

---

## 3. tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "outDir": "out",
    "rootDir": "src",
    "sourceMap": true,
    "strict": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

---

## 4. src/extension.ts

```ts
import * as vscode from 'vscode';
import { dirname } from 'path';

export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('cursorContextSave.save', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('エディターがアクティブではありません。');
      return;
    }

    const doc = editor.document;
    // 1) まずは設定から
    const cfg = vscode.workspace.getConfiguration('cursorContextSave');
    const filePath = cfg.get<string>('filePath')!;
    const n = cfg.get<number>('contextLines')!;

    // 2) 選択範囲 or カーソル前後n行
    let text: string;
    if (!editor.selection.isEmpty) {
      text = doc.getText(editor.selection);
    } else {
      const line = editor.selection.active.line;
      const start = Math.max(line - n, 0);
      const end = Math.min(line + n, doc.lineCount - 1);
      const startPos = new vscode.Position(start, 0);
      const endPos = new vscode.Position(end, doc.lineAt(end).text.length);
      text = doc.getText(new vscode.Range(startPos, endPos));
    }

    // 3) ファイルに保存
    try {
      const uri = vscode.Uri.file(vscode.workspace.asRelativePath(filePath, false));
      const enc = new TextEncoder();
      await vscode.workspace.fs.writeFile(uri, enc.encode(text));
      vscode.window.showInformationMessage(`Cursor context saved to ${filePath}`);
    } catch (err: any) {
      vscode.window.showErrorMessage('ファイル保存に失敗しました: ' + err.message);
    }
  });

  context.subscriptions.push(cmd);
}

export function deactivate() {}
```

---

## 5. ビルド＆パッケージ手順

クローズ環境で一度だけ必要な手順です（インターネット不要な `.vsix` が得られます）：

1. **依存パッケージを入手**
   オフライン用に `node_modules` 一式を他マシンで準備し、プロジェクト直下にコピー
2. **TypeScript をコンパイル**

   ```bash
   npm run compile
   ```
3. **vsce でパッケージ**
   別途入手済みの `vsce` ツールを使い

   ```bash
   vsce package
   ```

   がエラーになる場合は、同僚がビルドした `.vsix` をもらうか、社内リポジトリから入手してください。

→ 出力される `cursor-context-save-1.0.0.vsix` をオフライン環境に持ち込み、
VS Code コマンドパレットから「Extensions: Install from VSIX...」でインストール。

---

## 6. 使い方

1. エディタ上で右クリック → **Save Cursor Context**
2. ワークスペースルートに `cursor-context.txt` が生成・上書き
3. 以降、独自 RAG パイプラインでファイルを読み込めば OK

---

これで **最小限の道具で、選択 or カーソル前後7行をファイルに自動保存** できます。
あとは `.vsix` をバラまくだけ—最も楽＆確実な方法です！
