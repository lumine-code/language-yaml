; Existing literal and comment contents are user data, including whitespace.
([(block_scalar) (double_quote_scalar) (single_quote_scalar)] @preserve
  (#is? indent.reindent true)
  (#is-not? indent.matchesCurrentRow startPosition)
  (#set! indent.force true))

(":" @indent
  (#is? test.lastTextOnRow true))

["|" ">"] @indent
