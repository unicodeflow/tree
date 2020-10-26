// NOTE: Assume array is non-empty
const lastOf = (array) => {
    return array.slice(-1)[0];
};
export var Parser;
(function (Parser) {
    const countLeadingSpace = (str) => {
        let count = 0;
        while (count < str.length && str[count] === ' ') {
            count++;
        }
        return count;
    };
    const dropDepth = (ar) => {
        const { text, children } = ar;
        return {
            text,
            children: children.map(dropDepth)
        };
    };
    Parser.parse = (str) => {
        const root = {
            text: '.',
            depth: -1,
            children: []
        };
        const stack = [root];
        str.split('\n').forEach(line => {
            const text = line.trim();
            if (text === '') {
                return;
            }
            const node = {
                text,
                children: [],
                depth: countLeadingSpace(line)
            };
            while (node.depth <= lastOf(stack).depth) {
                stack.pop();
            }
            lastOf(stack).children.push(node);
            stack.push(node);
        });
        return dropDepth(root);
    };
})(Parser || (Parser = {}));
export var Renderer;
(function (Renderer) {
    const augmentLastChildFlag = (r, flags) => {
        const { text, children } = r;
        return {
            text,
            children: children.map((child, index) => augmentLastChildFlag(child, [...flags, index === children.length - 1])),
            isLastChildFlags: flags
        };
    };
    const generatePrefix = (isLastChildFlags, indent = 2) => {
        return isLastChildFlags
            .map((flag, index) => {
            if (index === isLastChildFlags.length - 1) {
                const indentationString = '─'.repeat(indent);
                const leadingChar = flag ? '└' : '├';
                return `${leadingChar}${indentationString} `;
            }
            else {
                const indentationString = ' '.repeat(indent);
                const leadingChar = flag ? ' ' : '│';
                return `${leadingChar}${indentationString} `;
            }
        })
            .join('');
    };
    Renderer.render = (representation, options) => {
        const { indent } = options;
        const lines = [];
        const root = augmentLastChildFlag(representation, []);
        const stack = [root];
        while (stack.length) {
            const node = stack.pop();
            if (node == null) {
                continue;
            }
            lines.push(`${generatePrefix(node.isLastChildFlags, indent)}${node.text}`);
            node.children.reverse().forEach(child => {
                stack.push(child);
            });
        }
        return lines.join('\n');
    };
})(Renderer || (Renderer = {}));
