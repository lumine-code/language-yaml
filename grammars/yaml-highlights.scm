
; KEYS
; ====

(block_mapping_pair
  key: (_) @entity.name.tag.yaml
  (#set! capture.final true))

(flow_pair
  key: (_) @entity.name.tag.yaml
  (#set! capture.final true))


; COMMENTS
; ========

(comment) @comment.line.number-sign.yaml

((comment) @punctuation.definition.comment.yaml
  (#set! adjust.endAfterFirstMatchOf "^#"))


; VALUES
; ======

(boolean_scalar) @constant.language.boolean.yaml
(null_scalar) @constant.language.null.yaml

(integer_scalar) @constant.numeric.decimal.integer.yaml
(float_scalar) @constant.numeric.decimal.float.yaml


; STRINGS
; =======

((string_scalar) @string.unquoted.yaml)

(single_quote_scalar) @string.quoted.single.yaml

((single_quote_scalar) @punctuation.definition.string.begin.yaml
  (#set! adjust.endAfterFirstMatchOf "^'"))

((single_quote_scalar) @punctuation.definition.string.end.yaml
  (#set! adjust.startBeforeFirstMatchOf "'$"))

(double_quote_scalar) @string.quoted.double.yaml

((double_quote_scalar) @punctuation.definition.string.begin.yaml
  (#set! adjust.endAfterFirstMatchOf "^\""))

((double_quote_scalar) @punctuation.definition.string.end.yaml
  (#set! adjust.startBeforeFirstMatchOf "\"$"))

(escape_sequence) @constant.character.escape.yaml

(block_scalar) @string.unquoted.block.yaml
(block_scalar
  [">" "|"] @punctuation.definition.string.block.yaml)


; TAGS
; ====

(tag) @support.other.tag.yaml


; ANCHORS and ALIASES
; ===================

(anchor) @entity.name.type.anchor.yaml
(anchor "&" @punctuation.definition.anchor.yaml)

(alias) @variable.other.alias.yaml
(alias "*" @punctuation.definition.alias.yaml)


; PUNCTUATION
; ===========

("[" @punctuation.definition.sequence.begin.bracket.square.yaml
  (#is? test.childOfType flow_sequence)
  (#is? test.first true))
("]" @punctuation.definition.sequence.end.bracket.square.yaml
  (#is? test.childOfType flow_sequence)
  (#is? test.last true))

("{" @punctuation.definition.dictionary.begin.bracket.curly.yaml
  (#is? test.childOfType flow_mapping)
  (#is? test.first true))
("}" @punctuation.definition.dictionary.end.bracket.curly.yaml
  (#is? test.childOfType flow_mapping)
  (#is? test.last true))

(block_mapping_pair
  ":" @punctuation.separator.key-value.yaml)

(block_sequence_item
  "-" @punctuation.definition.entry.yaml)

(document "---" @punctuation.definition.document.begin.yaml)
(document "..." @punctuation.definition.document.end.yaml)
