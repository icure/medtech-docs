export interface NamedImport {
  kind: 'named'
  names: string[]
  source: string
  isTypeOnly: boolean
}

export interface DefaultImport {
  kind: 'default'
  name: string
  source: string
  isTypeOnly: boolean
}

export interface SideEffectImport {
  kind: 'side-effect'
  source: string
  isTypeOnly: false
}

export type ParsedImport = NamedImport | DefaultImport | SideEffectImport

export interface MergedImports {
  named: Map<string, { names: Set<string>; isTypeOnly: boolean }>
  defaults: Map<string, { name: string; isTypeOnly: boolean }>
  sideEffects: Set<string>
}

export function parseImportLine(line: string): ParsedImport | null {
  const trimmed = line.trim()

  if (!trimmed.startsWith('import ') && !trimmed.startsWith('import\t')) return null
  if (trimmed.startsWith('import(')) return null

  const sideEffectMatch = trimmed.match(/^import\s+['"]([^'"]+)['"]\s*;?\s*$/)
  if (sideEffectMatch) {
    return { kind: 'side-effect', source: sideEffectMatch[1], isTypeOnly: false }
  }

  const isTypeOnly = trimmed.startsWith('import type ')

  const namedMatch = trimmed.match(
    /^import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/
  )
  if (namedMatch) {
    const names = namedMatch[1]
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)
    return { kind: 'named', names, source: namedMatch[2], isTypeOnly }
  }

  const defaultMatch = trimmed.match(
    /^import\s+(?:type\s+)?(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/
  )
  if (defaultMatch) {
    return { kind: 'default', name: defaultMatch[1], source: defaultMatch[2], isTypeOnly }
  }

  return null
}

export function mergeImports(
  importLines: string[],
  onWarning?: (message: string) => void,
): MergedImports {
  const result: MergedImports = {
    named: new Map(),
    defaults: new Map(),
    sideEffects: new Set(),
  }

  const nameToSource = new Map<string, string>()

  for (const line of importLines) {
    const parsed = parseImportLine(line)
    if (!parsed) continue

    switch (parsed.kind) {
      case 'side-effect':
        result.sideEffects.add(parsed.source)
        break

      case 'default':
        if (!result.defaults.has(parsed.source)) {
          result.defaults.set(parsed.source, { name: parsed.name, isTypeOnly: parsed.isTypeOnly })
        }
        break

      case 'named': {
        const key = `${parsed.source}::${parsed.isTypeOnly ? 'type' : 'value'}`
        if (!result.named.has(key)) {
          result.named.set(key, { names: new Set(), isTypeOnly: parsed.isTypeOnly })
        }
        const entry = result.named.get(key)!
        for (const name of parsed.names) {
          const baseName = name.includes(' as ') ? name.split(' as ')[1].trim() : name
          const existingSource = nameToSource.get(baseName)
          if (existingSource && existingSource !== parsed.source) {
            const warn = onWarning ?? ((msg: string) => console.warn(msg))
            warn(`Import name collision: "${baseName}" imported from both "${existingSource}" and "${parsed.source}"`)
          }
          nameToSource.set(baseName, parsed.source)
          entry.names.add(name)
        }
        break
      }
    }
  }

  return result
}

export function renderImports(merged: MergedImports): string {
  const lines: string[] = []

  for (const source of [...merged.sideEffects].sort()) {
    lines.push(`import "${source}"`)
  }

  for (const [source, { name, isTypeOnly }] of [...merged.defaults.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const typePrefix = isTypeOnly ? 'type ' : ''
    lines.push(`import ${typePrefix}${name} from "${source}"`)
  }

  for (const [key, { names, isTypeOnly }] of [...merged.named.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const source = key.split('::')[0]
    const typePrefix = isTypeOnly ? 'type ' : ''
    const sortedNames = [...names].sort((a, b) => {
      const aBase = a.includes(' as ') ? a.split(' as ')[0] : a
      const bBase = b.includes(' as ') ? b.split(' as ')[0] : b
      return aBase.localeCompare(bBase)
    })
    lines.push(`import ${typePrefix}{ ${sortedNames.join(', ')} } from "${source}"`)
  }

  return lines.join('\n')
}
