// Builds the HTML and PDF versions of the book from the Markdown source.
// Usage: NODE_PATH=<dir with marked, katex, playwright> node build.js
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const katex = require('katex');

const here = __dirname;
const src = path.join(here, 'NoCodeAI_ML_Program_Book.md');
const outHtml = path.join(here, 'NoCodeAI_ML_Program_Book.html');
const outPdf = path.join(here, 'NoCodeAI_ML_Program_Book.pdf');

let md = fs.readFileSync(src, 'utf8');

// Front matter
const meta = {};
md = md.replace(/^---\n([\s\S]*?)\n---\n/, (m, block) => {
  for (const line of block.split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '');
  }
  return '';
});

// Protect math, render with KaTeX, then restore after Markdown conversion.
const slots = [];
function stash(html) { slots.push(html); return `@@MATH${slots.length - 1}@@`; }
md = md.replace(/\$\$([\s\S]+?)\$\$/g, (m, tex) =>
  stash(katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false })));
md = md.replace(/\$([^$\n]+?)\$/g, (m, tex) =>
  stash(katex.renderToString(tex, { displayMode: false, throwOnError: false })));

marked.setOptions({ gfm: true, breaks: false });
let body = marked.parse(md);
body = body.replace(/@@MATH(\d+)@@/g, (m, i) => slots[Number(i)]);

// Table of contents from h1 and h2
const toc = [];
body = body.replace(/<h([12])>(.*?)<\/h\1>/g, (m, lvl, text) => {
  const plain = text.replace(/<[^>]+>/g, '');
  const id = plain.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  toc.push({ lvl, id, plain });
  return `<h${lvl} id="${id}">${text}</h${lvl}>`;
});
const tocHtml = '<nav class="toc"><h2>Contents</h2><ul>' +
  toc.map(t => `<li class="lvl${t.lvl}"><a href="#${t.id}">${t.plain}</a></li>`).join('') +
  '</ul></nav>';

// Inline KaTeX CSS with fonts embedded as data URIs so the HTML is self contained.
const katexDir = path.dirname(require.resolve('katex/dist/katex.css'));
let katexCss = fs.readFileSync(path.join(katexDir, 'katex.css'), 'utf8');
katexCss = katexCss.replace(/url\(fonts\/([^)]+?\.woff2)\)\s*format\("woff2"\),?/g, (m, f) => {
  const b64 = fs.readFileSync(path.join(katexDir, 'fonts', f)).toString('base64');
  return `url(data:font/woff2;base64,${b64}) format("woff2"),`;
});
katexCss = katexCss.replace(/url\(fonts\/[^)]+?\.(woff|ttf)\)\s*format\("(woff|truetype)"\),?/g, '');
katexCss = katexCss.replace(/,\s*;/g, ';');

const css = `
  :root { --ink:#1b1b1f; --muted:#5c5f66; --line:#d8d9de; --accent:#8a1c1c; --soft:#f6f4ef; }
  html { font-size: 16px; }
  body { margin:0; padding: 2rem 1.25rem; font-family: Georgia, "Times New Roman", serif; color: var(--ink); background:#fff; line-height:1.55; max-width: 52rem; margin: 0 auto; }
  header.title { border-bottom: 3px solid var(--accent); padding-bottom: 1rem; margin-bottom: 2rem; }
  header.title h1 { font-size: 2.1rem; margin: 0 0 .4rem 0; line-height: 1.15; }
  header.title .sub { font-size: 1.1rem; color: var(--muted); }
  header.title .meta { font-size: .95rem; color: var(--muted); margin-top: .6rem; }
  h1 { font-size: 1.7rem; margin-top: 3rem; border-bottom: 1px solid var(--line); padding-bottom: .3rem; page-break-before: always; }
  h1:first-of-type { page-break-before: auto; }
  h2 { font-size: 1.3rem; margin-top: 2rem; color: var(--accent); }
  h3 { font-size: 1.05rem; margin-top: 1.4rem; }
  p { margin: .7rem 0; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: .92rem; page-break-inside: auto; }
  th, td { border: 1px solid var(--line); padding: .4rem .55rem; vertical-align: top; text-align: left; }
  th { background: var(--soft); }
  tr { page-break-inside: avoid; }
  ul, ol { padding-left: 1.4rem; }
  li { margin: .25rem 0; }
  hr { border: 0; border-top: 1px solid var(--line); margin: 2rem 0; }
  .katex-display { overflow-x: auto; overflow-y: hidden; padding: .2rem 0; }
  nav.toc { background: var(--soft); padding: 1rem 1.25rem; border-radius: 6px; margin-bottom: 2rem; }
  nav.toc h2 { margin-top: 0; }
  nav.toc ul { list-style: none; padding-left: 0; columns: 1; }
  nav.toc li.lvl1 { font-weight: bold; margin-top: .5rem; }
  nav.toc li.lvl2 { padding-left: 1.2rem; font-weight: normal; font-size: .95rem; }
  nav.toc a { color: var(--ink); text-decoration: none; }
  strong { color: #000; }
  .added, .added * { color: #0a7a2f !important; }
  ins.added { text-decoration: none; }
  div.added { border-left: 3px solid #0a7a2f; padding-left: .8rem; margin: .8rem 0; }
  @media print {
    body { padding: 0; max-width: none; font-size: 11pt; }
    nav.toc { page-break-after: always; }
    a { color: inherit; text-decoration: none; }
  }
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title || 'Program Book'}</title>
<style>${katexCss}</style>
<style>${css}</style>
</head><body>
<header class="title">
  <h1>${meta.title || ''}</h1>
  <div class="sub">${meta.subtitle || ''}</div>
  <div class="meta">${meta.author || ''}<br>${meta.date || ''}</div>
</header>
${tocHtml}
${body}
</body></html>`;

fs.writeFileSync(outHtml, html);
console.log('HTML written', outHtml, (html.length / 1024).toFixed(0) + ' KB');

(async () => {
  let pw;
  try { pw = require('playwright'); } catch (e) { console.log('playwright not found, skipping PDF'); return; }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + outHtml, { waitUntil: 'load' });
  await page.pdf({
    path: outPdf, format: 'Letter', printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font-size:8pt;color:#666;text-align:center;font-family:Georgia,serif;">No Code AI and Machine Learning, program book. Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log('PDF written', outPdf);
})();
