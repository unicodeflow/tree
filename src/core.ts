interface Representation {
  text: string
  children: Representation[]
}

// NOTE: Assume array is non-empty
const lastOf = <T>(array: Array<T>): T => {
  return array.slice(-1)[0]
}

export namespace Parser {
  interface AuxiliaryRepresentation extends Representation {
    depth: number
    children: AuxiliaryRepresentation[]
  }

  const countLeadingSpace = (str: string) => {
    let count = 0
    while (count < str.length && str[count] === ' ') {
      count++
    }
    return count
  }

  const dropDepth = (ar: AuxiliaryRepresentation): Representation => {
    const { text, children } = ar
    return {
      text,
      children: children.map(dropDepth)
    }
  }

  export const parse = (str: string): Representation => {
    const root: AuxiliaryRepresentation = {
      text: '.',
      depth: -1,
      children: []
    }
    const stack: AuxiliaryRepresentation[] = [root]
    str.split('\n').forEach(line => {
      const text = line.trim()
      if (text === '') {
        return
      }
      const node = {
        text,
        children: [],
        depth: countLeadingSpace(line)
      }
      while (node.depth <= lastOf(stack).depth) {
        stack.pop()
      }
      lastOf(stack).children.push(node)
      stack.push(node)
    })
    return dropDepth(root)
  }
}

export namespace Renderer {
  interface AuxiliaryRepresentation extends Representation {
    isLastChildFlags: boolean[]
    children: AuxiliaryRepresentation[]
  }

  const augmentLastChildFlag = (
    r: Representation,
    flags: boolean[]
  ): AuxiliaryRepresentation => {
    const { text, children } = r
    return {
      text,
      children: children.map((child, index) =>
        augmentLastChildFlag(child, [...flags, index === children.length - 1])
      ),
      isLastChildFlags: flags
    }
  }

  const generatePrefix = (
    isLastChildFlags: boolean[],
    indent: number = 2
  ): string => {
    return isLastChildFlags
      .map((flag, index) => {
        if (index === isLastChildFlags.length - 1) {
          const indentationString = '─'.repeat(indent)
          const leadingChar = flag ? '└' : '├'
          return `${leadingChar}${indentationString} `
        } else {
          const indentationString = ' '.repeat(indent)
          const leadingChar = flag ? ' ' : '│'
          return `${leadingChar}${indentationString} `
        }
      })
      .join('')
  }

  export const render = (
    representation: Representation,
    options: { indent?: number }
  ): string => {
    const { indent } = options
    const lines: string[] = []
    const root = augmentLastChildFlag(representation, [])
    const stack: AuxiliaryRepresentation[] = [root]
    while (stack.length) {
      const node = stack.pop()
      if (node == null) {
        continue
      }
      lines.push(`${generatePrefix(node.isLastChildFlags, indent)}${node.text}`)
      node.children.reverse().forEach(child => {
        stack.push(child)
      })
    }
    return lines.join('\n')
  }
}
