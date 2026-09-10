const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "yaml-highlights.scm");

describe("YAML Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-yaml");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("flow.yaml");
    editor.setText(text);
    await editor.getBuffer().languageMode.ready;
  }

  function rawCaptures(startRow, endRow) {
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  function expectLocalTile(captures) {
    expect(captures.length).toBeLessThanOrEqual(24);
    expect(
      captures.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);
  }

  it("preserves flow-sequence and flow-mapping delimiter scopes", async () => {
    await setUp("[value]\n{key: value}");

    const scopesAt = (row, text) => {
      const column = editor.lineTextForBufferRow(row).indexOf(text);
      return editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray();
    };
    expect(scopesAt(0, "[")).toContain("punctuation.definition.sequence.begin.bracket.square.yaml");
    expect(scopesAt(0, "]")).toContain("punctuation.definition.sequence.end.bracket.square.yaml");
    expect(scopesAt(1, "{")).toContain(
      "punctuation.definition.dictionary.begin.bracket.curly.yaml",
    );
    expect(scopesAt(1, "}")).toContain("punctuation.definition.dictionary.end.bracket.curly.yaml");
  });

  it("keeps large flow collections leaf-rooted with local tile captures", async () => {
    const sequence = ["["];
    for (let index = 0; index < 6000; index++) {
      sequence.push(`  item_${index}${index < 5999 ? "," : ""}`);
    }
    sequence.push("]");
    await setUp(sequence.join("\r\n"));
    expectLocalTile(rawCaptures(3000, 3006));

    const mapping = ["{"];
    for (let index = 0; index < 6000; index++) {
      mapping.push(`  key_${index}: value_${index}${index < 5999 ? "," : ""}`);
    }
    mapping.push("}");
    editor.setText(mapping.join("\r\n"));
    await editor.getBuffer().languageMode.atTransactionEnd();
    expectLocalTile(rawCaptures(3000, 3006));

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).toContain("(#is? test.childOfType flow_sequence)");
    expect(query).toContain("(#is? test.childOfType flow_mapping)");
    expect(query).not.toMatch(/\(flow_(?:sequence|mapping)\s+"[[{]"/);
  });
});
