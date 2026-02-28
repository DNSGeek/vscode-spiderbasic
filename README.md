# SpiderBasic for Visual Studio Code

Full-featured VS Code extension for [SpiderBasic](https://www.spiderbasic.com/) — the web & mobile dialect of PureBasic that compiles to JavaScript.

## Features

- **Syntax highlighting** for `.sb`, `.sbi`, `.sbf`, `.sbp` — including inline JS lines (`!`) and EnableJS/DisableJS blocks
- **IntelliSense**: 777 built-in functions with signatures & docs, 674 constants, keywords, type suffixes
- **Hover docs**: pulled directly from the SpiderBasic 3.02 reference manual
- **Go to Definition** (F12) across files and workspace
- **Document Outline**: procedures, structures, modules, labels
- **Code formatter** and **linter**
- **Compile & Run** (F5 / Ctrl+F5) with error squiggles
- **Web & mobile snippets**: WebSocket, HTTP, Geolocation, Canvas, inline JS, mobile CompilerIf

## Libraries (43 total)

2DDrawing · Accelerometer · Array · Cipher · Clipboard · Database · Date · Debugger · Desktop · Dialog · File · Font · Gadget · Geolocation · Http · Image · InAppPurchase · Joystick · Json · Keyboard · List · Map · Math · Memory · Menu · Mobile · Mouse · Packer · RegularExpression · Requester · Runtime · Screen · Sort · Sound · Sprite · String · System · ToolBar · TouchScreen · VectorDrawing · WebSocket · Window · XML

## Setup

Set your compiler path in settings:
```json
"spiderbasic.compilerPath": "/Applications/SpiderBasic/sbcompiler"
```

## Building

```bash
npm install && npm run compile
```
