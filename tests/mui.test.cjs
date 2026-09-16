const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { ThemeProvider, createTheme } = require('@mui/material/styles');

const source = fs.readFileSync(require.resolve('../src/components/GlassPanel.tsx'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
});
const context = { exports: {}, require };
vm.runInNewContext(outputText, context);
const { GlassPanel } = context.exports;
const theme = createTheme({ palette: { primary: { main: '#123456' } } });

function render(sx) {
  return renderToStaticMarkup(
    React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(GlassPanel, { component: 'a', href: '/groups/example', sx }, 'Example'),
    ),
  );
}

test('GlassPanel supports object sx and preserves link props', () => {
  const html = render({ p: 3 });
  assert.match(html, /padding:24px/);
  assert.match(html, /backdrop-filter:blur\(18px\)/);
  assert.match(html, /<a [^>]*href="\/groups\/example"/);
});

test('GlassPanel evaluates theme callback sx', () => {
  assert.match(
    render((theme) => ({ color: theme.palette.primary.main })),
    /color:#123456/,
  );
});

test('GlassPanel supports sx arrays with conditional entries and later overrides', () => {
  const html = render([{ p: 1 }, false, (theme) => ({ p: 3, color: theme.palette.primary.main })]);
  assert.match(html, /padding:8px;.*padding:24px/);
  assert.match(html, /color:#123456/);
});
