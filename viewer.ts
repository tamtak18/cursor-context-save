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
