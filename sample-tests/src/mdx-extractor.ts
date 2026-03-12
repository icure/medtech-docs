export interface ExtractedBlock {
  code: string
  startLine: number
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

export function stripImportsFromBlock(code: string): string {
  const lines = code.split('\n')
  const bodyLines: string[] = []

  for (const line of lines) {
    if (!isImportLine(line)) {
      bodyLines.push(line)
    }
  }

  while (bodyLines.length > 0 && bodyLines[0].trim() === '') bodyLines.shift()
  while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop()

  return bodyLines.join('\n')
}
