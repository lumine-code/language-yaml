const { Range } = require("lumine");

const URL = "https://example.com/manual.pdf?first=1&second=2";
const LINK_SCOPE = "markup.underline.link.hyperlink";

describe("YAML hyperlink injections", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-hyperlink");
    await lumine.packages.activatePackage("language-yaml");
  });

  afterEach(() => editor?.destroy());

  for (const [name, text] of [
    ["comments", String.raw`# \href{${URL}}{Manual}`],
    ["plain scalars", `manual: ${URL}`],
    ["single-quoted scalars", String.raw`manual: '\href{${URL}}{Manual}'`],
    ["double-quoted scalars", `manual: "${URL}}{Manual"`],
    ["literal block scalars", `manual: |\n  ${String.raw`\href{${URL}}{Manual}`}`],
    ["folded block scalars", `manual: >\n  ${String.raw`\url{${URL}}`}`],
  ]) {
    it(`highlights the exact URL in ${name}`, async () => {
      editor = await lumine.workspace.open();
      editor.setText(text);
      lumine.grammars.assignLanguageMode(editor.getBuffer(), "source.yaml");
      await editor.whenGrammarSettled();
      await editor.languageMode.refresh?.();
      const buffer = editor.getBuffer();
      const index = text.indexOf(URL);
      const range = new Range(
        buffer.positionForCharacterIndex(index),
        buffer.positionForCharacterIndex(index + URL.length),
      );
      expect(editor.bufferRangeForScopeAtPosition(`.${LINK_SCOPE}`, range.start)).toEqual(range);
      if (index + URL.length < text.length)
        expect(editor.scopeDescriptorForBufferPosition(range.end).getScopesArray()).not.toContain(
          LINK_SCOPE,
        );
    });
  }
});
