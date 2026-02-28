import * as vscode from 'vscode';
import { SpiderBasicCompletionProvider } from './completionProvider';
import { SpiderBasicHoverProvider } from './hoverProvider';
import { SpiderBasicDocumentSymbolProvider } from './symbolProvider';
import { SpiderBasicDefinitionProvider } from './definitionProvider';
import { SpiderBasicFormatter } from './formatter';
import { SpiderBasicLinter } from './linter';
import { CompilerService } from './compilerService';

let outputChannel: vscode.OutputChannel;
let linter: SpiderBasicLinter;
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
  console.log('SpiderBasic extension activated');

  outputChannel = vscode.window.createOutputChannel('SpiderBasic');
  diagnosticCollection = vscode.languages.createDiagnosticCollection('spiderbasic');

  const selector: vscode.DocumentSelector = { language: 'spiderbasic', scheme: 'file' };

  // ── Completion Provider ───────────────────────────────────────────────
  const completionProvider = new SpiderBasicCompletionProvider();
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(selector, completionProvider, '.', '#', '(')
  );

  // ── Hover Provider ────────────────────────────────────────────────────
  const hoverProvider = new SpiderBasicHoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(selector, hoverProvider)
  );

  // ── Document Symbol Provider (Outline) ───────────────────────────────
  const symbolProvider = new SpiderBasicDocumentSymbolProvider();
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(selector, symbolProvider)
  );

  // ── Go-to-Definition Provider ─────────────────────────────────────────
  const definitionProvider = new SpiderBasicDefinitionProvider();
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(selector, definitionProvider)
  );

  // ── Document Formatter ────────────────────────────────────────────────
  const formatter = new SpiderBasicFormatter();
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(selector, formatter)
  );

  // ── Linter / Diagnostics ──────────────────────────────────────────────
  linter = new SpiderBasicLinter(diagnosticCollection);
  if (vscode.workspace.getConfiguration('spiderbasic').get<boolean>('enableLinting', true)) {
    const lintOnChange = (doc: vscode.TextDocument) => {
      if (doc.languageId === 'spiderbasic') { linter.lint(doc); }
    };
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(lintOnChange));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => lintOnChange(e.document)));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(lintOnChange));
    // lint all currently open pb documents
    vscode.workspace.textDocuments.forEach(lintOnChange);
  }

  // ── Compiler Commands ─────────────────────────────────────────────────
  const compilerService = new CompilerService(outputChannel);

  context.subscriptions.push(
    vscode.commands.registerCommand('spiderbasic.compile', async () => {
      const doc = vscode.window.activeTextEditor?.document;
      if (!doc) { vscode.window.showErrorMessage('No active SpiderBasic file.'); return; }
      await compilerService.compile(doc.fileName, false);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('spiderbasic.compileRun', async () => {
      const doc = vscode.window.activeTextEditor?.document;
      if (!doc) { vscode.window.showErrorMessage('No active SpiderBasic file.'); return; }
      await doc.save();
      await compilerService.compile(doc.fileName, true);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('spiderbasic.formatDocument', async () => {
      await vscode.commands.executeCommand('editor.action.formatDocument');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('spiderbasic.showOutput', () => {
      outputChannel.show();
    })
  );

  // ── Format on save ────────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument(event => {
      const cfg = vscode.workspace.getConfiguration('spiderbasic');
      if (cfg.get<boolean>('formatOnSave') && event.document.languageId === 'spiderbasic') {
        event.waitUntil(
          vscode.commands.executeCommand('editor.action.formatDocument') as Thenable<vscode.TextEdit[]>
        );
      }
    })
  );

  context.subscriptions.push(outputChannel, diagnosticCollection);
}

export function deactivate() {
  diagnosticCollection?.dispose();
  outputChannel?.dispose();
}
