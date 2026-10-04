/* eslint-disable */
const ts = require(process.cwd()+'/node_modules/typescript');
const { parse } = require(process.cwd()+'/node_modules/@vue/compiler-sfc');
const fs = require('fs'); const { execSync } = require('child_process');
const files = execSync("git ls-files '*.ts' '*.js' '*.mjs' '*.cjs' '*.vue'").toString().trim().split('\n')
  .filter(f => !/^(agent-hub|\.claude|node_modules|dist|build)\//.test(f) && !/\.test\./.test(f));
let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let blocks = [];
  if (f.endsWith('.vue')) {
    const { descriptor } = parse(src);
    for (const b of [descriptor.script, descriptor.scriptSetup]) if (b) blocks.push({ code: b.content, off: src.slice(0, b.loc.start.offset).split('\n').length - 1 });
  } else blocks.push({ code: src, off: 0 });
  for (const { code, off } of blocks) {
    const sf = ts.createSourceFile(f, code, ts.ScriptTarget.Latest, true, f.endsWith('.js')||f.endsWith('.mjs')||f.endsWith('.cjs') ? ts.ScriptKind.JS : ts.ScriptKind.TS);
    (function walk(n) {
      if (ts.isFunctionLike(n) && n.parameters && n.parameters.length > 2 && !ts.isFunctionTypeNode(n) && !ts.isCallSignatureDeclaration(n) && !ts.isMethodSignature(n)) {
        total++;
        const line = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1 + off;
        console.log(`${f}:${line} [${ts.SyntaxKind[n.kind]}] ${n.name ? n.name.getText() : '(anon)'}(${n.parameters.map(p=>p.getText()).join(', ')})`);
      }
      ts.forEachChild(n, walk);
    })(sf);
  }
}
console.log('files scanned', files.length, 'hits', total);
