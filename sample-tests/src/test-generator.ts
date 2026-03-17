import { basename, dirname } from 'path'
import type { ExtractedBlock } from './mdx-extractor'
import { stripImportsFromBlock } from './mdx-extractor'

export interface GenerateTestFileOptions {
  sourcePath: string
  blocks: ExtractedBlock[]
  importSuperset: string
  helperModulePath?: string
  /** Map from test name → list of variable names the pre-test provides */
  preTestProvides?: Record<string, string[]>
}

function computeSdkFixtureRelativePath(sourcePath: string): string {
  const withoutSdk = sourcePath.replace(/^sdk\//, '')
  const dir = dirname(withoutSdk)
  const depth = dir === '.' ? 0 : dir.split('/').length
  const ups = '../'.repeat(depth + 1)
  return `${ups}helpers/sdk-fixture`
}

/**
 * Extract top-level function declaration names from a code block.
 * Matches patterns like:
 *   async function foo(...)
 *   function bar(...)
 */
export function extractFunctionNames(code: string): string[] {
  const names: string[] = []
  const re = /^(?:async\s+)?function\s+(\w+)\s*\(/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    names.push(m[1])
  }
  return names
}

/**
 * Extract top-level const/let variable declaration names from a code block.
 * Matches patterns like:
 *   const FOO = ...
 *   let bar = ...
 */
export function extractVariableNames(code: string): string[] {
  const names: string[] = []
  const re = /^(?:const|let)\s+(\w+)\s*=/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    names.push(m[1])
  }
  return names
}

export function generateTestFileContent(options: GenerateTestFileOptions): string {
  const { sourcePath, blocks, importSuperset, helperModulePath, preTestProvides } = options
  const fileBaseName = basename(sourcePath, '.mdx')
  const sdkFixturePath = computeSdkFixtureRelativePath(sourcePath)

  const lines: string[] = []

  lines.push(`// Auto-generated from ${sourcePath} — do not edit`)
  lines.push(importSuperset)
  lines.push(`import { getTestSdk } from "${sdkFixturePath}"`)
  if (helperModulePath !== undefined) {
    lines.push(`import { preTest, postTest } from "${helperModulePath}"`)
  }
  lines.push('')
  lines.push('let sdk: CardinalSdk')
  lines.push('')
  lines.push('beforeAll(async () => {')
  lines.push('  sdk = await getTestSdk()')
  lines.push('})')
  lines.push('')

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const testName = `${fileBaseName} block ${i + 1} (line ${block.startLine})`
    const body = stripImportsFromBlock(block.code)
    const indentedBody = body
      .split('\n')
      .map(line => (line.trim() === '' ? '' : `  ${line}`))
      .join('\n')

    lines.push(`test("${testName}", async () => {`)

    if (helperModulePath !== undefined) {
      const provides = preTestProvides?.[testName] ?? []
      if (provides.length > 0) {
        lines.push(`  const { ${provides.join(', ')} } = await preTest["${testName}"]?.(sdk) ?? {}`)
      } else {
        lines.push(`  await preTest["${testName}"]?.(sdk)`)
      }
    }

    lines.push(indentedBody)

    if (helperModulePath !== undefined) {
      const funcNames = extractFunctionNames(body)
      const varNames = extractVariableNames(body)
      const allNames = [...funcNames, ...varNames]
      const args = ['sdk', ...allNames].join(', ')
      lines.push(`  await postTest["${testName}"]?.(${args})`)
    }

    lines.push('})')
    lines.push('')
  }

  return lines.join('\n')
}
