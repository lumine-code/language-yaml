const path = require("node:path");

describe("yaml editing settings", () => {
  let editor;

  beforeEach(async () => {
    jasmine.useRealClock();
    const pack = await lumine.packages.activatePackage(path.resolve(__dirname, ".."));
    await pack.resourceLoadPromise;
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.yaml"));
    editor.update({ autoIndent: false });
    await editor.whenGrammarSettled();
  });

  afterEach(() => editor?.destroy());

  async function setText(text) {
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
  }

  it("pairs supported syntax without inventing unsupported quotes or containers", async () => {
    await lumine.packages.activatePackage("bracket-matcher");
    for (const [typed, expected] of [
      ["[", "[]"],
      ["{", "{}"],
      ['"', '""'],
      ["'", "''"],
      ["(", "("],
      ["`", "`"],
      ["“", "“"],
    ]) {
      await setText("");
      editor.setCursorBufferPosition([editor.getLastBufferRow(), Infinity]);
      await editor.insertText(typed);
      await editor.whenGrammarSettled();
      expect(editor.getText())
        .withContext(typed)
        .toBe("" + expected);
    }
  });
});
