import { $ } from './dom.js';
import { Parser, Renderer } from './core.js';
(() => {
    const MIN_INDENTATION = 1;
    const MAX_INDENTATION = 8;
    const DEFAULT_INDENTATION = 2;
    const SYNCHRONIZATION_DELAY = 800;
    const DEFAULT_INPUT_STRING = `hello
foo
  bar`;
    const indentationSizeRangeInput = $('#indentationSizeRangeInput');
    const indentationSizeSpan = $('#indentationSizeSpan');
    const inputStringTextArea = $('#inputStringTextArea');
    const outputStringTextArea = $('#outputStringTextArea');
    indentationSizeSpan.textContent = String(DEFAULT_INDENTATION);
    indentationSizeRangeInput.min = String(MIN_INDENTATION);
    indentationSizeRangeInput.max = String(MAX_INDENTATION);
    indentationSizeRangeInput.value = String(DEFAULT_INDENTATION);
    indentationSizeRangeInput.addEventListener('input', event => {
        const target = event.target;
        indentationSizeSpan.textContent = target.value;
    });
    inputStringTextArea.value = DEFAULT_INPUT_STRING;
    window.setInterval(() => {
        outputStringTextArea.value = Renderer.render(Parser.parse(inputStringTextArea.value), { indent: parseInt(indentationSizeRangeInput.value) });
    }, SYNCHRONIZATION_DELAY);
})();
