describe("Tree-sitter YAML grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-yaml");
  });

  it("parses documents beyond the range of 16-bit scanner row state", async () => {
    const lines = [];
    for (let row = 0; row < 32769; row++) {
      lines.push(`key${row}: ${row}`);
    }

    const editor = await lumine.workspace.open("large.yaml");
    editor.setText(lines.join("\n"));
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.yaml"));
    await editor.getBuffer().languageMode.ready;

    const rootNode = editor.getBuffer().languageMode.tree.rootNode;
    expect(rootNode.endPosition.row).toBe(32768);
    expect(rootNode.hasError).toBe(false);
  });
});
