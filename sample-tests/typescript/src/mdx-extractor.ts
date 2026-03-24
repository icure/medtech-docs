export interface ExtractedBlock {
  code: string
  startLine: number
  /** Stable 4-letter test ID from `// @test: XXXX` on the first code line */
  testId?: string
}

export function extractTypeScriptBlocks(mdxContent: string): ExtractedBlock[] {
  const lines = mdxContent.split('\n')
  const blocks: ExtractedBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('```typescript')) {
      const fenceInfo = trimmed.slice(3)

      if (fenceInfo.includes('no-test')) {
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          i++
        }
        i++
        continue
      }

      // Extract test ID from fence info: ```typescript test-XXXX
      const testIdMatch = fenceInfo.match(/\btest-(\w{4})\b/)
      const testId = testIdMatch?.[1]

      const startLine = i + 1
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++

      blocks.push({
        code: codeLines.join('\n'),
        startLine,
        testId,
      })
    } else {
      i++
    }
  }

  return blocks
}

export function isImportLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.startsWith('//')) return false
  return (trimmed.startsWith('import ') || trimmed.startsWith('import\t')) && !trimmed.startsWith('import(')
}

/**
 * Remove import statements from a code block, including multi-line imports.
 * Strips leading/trailing blank lines from the result.
 */
export function stripImportsFromBlock(code: string): string {
  const lines = code.split('\n')
  const bodyLines: string[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    if (isImportLine(lines[i])) {
      // Check if this is a multi-line import (has '{' but no '}')
      if (trimmed.includes('{') && !trimmed.includes('}')) {
        // Skip all lines until we find the closing '}'
        i++
        while (i < lines.length && !lines[i].includes('}')) {
          i++
        }
        i++ // skip the closing '}' line
      } else {
        i++ // single-line import
      }
    } else {
      bodyLines.push(lines[i])
      i++
    }
  }

  while (bodyLines.length > 0 && bodyLines[0].trim() === '') bodyLines.shift()
  while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop()

  // Strip leading `export` keyword from declarations (invalid inside function bodies)
  const strippedLines = bodyLines.map(line => line.replace(/^(\s*)export\s+(async\s+function|function|const|let|class)\s/, '$1$2 '))

  return strippedLines.join('\n')
}
