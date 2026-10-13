// Builds SDK.md: the whole Cardinal SDK documentation (sdk/) as a single Markdown file, for LLM context.
// Usage: node generate-sdk-md.mjs [sdkDir] [outFile]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Reading order of SDK.md. Paths are relative to the sdk directory.
export const PARTS = [
  {
    title: 'INTRODUCTION',
    files: ['intro.md', 'whats-new.md', 'migration.md', 'mcp-server.md'],
  },
  {
    title: 'QUICKSTART GUIDES',
    files: ['quickstart/kotlin.mdx', 'quickstart/typescript.mdx', 'quickstart/python.mdx', 'quickstart/dart.mdx', 'quickstart/react-native.mdx'],
  },
  {
    title: 'TUTORIALS',
    files: [
      'tutorial/index.mdx',
      'tutorial/basic/index.mdx',
      'tutorial/basic/modules/0_sdk_initialization.mdx',
      'tutorial/basic/modules/1_create_patient.mdx',
      'tutorial/basic/modules/2_create_medical_data.mdx',
      'tutorial/basic/modules/3_searching_data.mdx',
      'tutorial/basic/modules/4_share_data.mdx',
      'tutorial/basic/modules/5_use_codification_system.mdx',
      'tutorial/pubsub/index.mdx',
      'tutorial/pubsub/modules/0_publisher.mdx',
      'tutorial/pubsub/modules/1_subscriber.mdx',
      'tutorial/pubsub/modules/2_run.mdx',
    ],
  },
  {
    title: 'HOW-TO GUIDES',
    files: [
      'how-to/initialize-the-sdk/index.mdx',
      'how-to/initialize-the-sdk/base-sdk.mdx',
      'how-to/initialize-the-sdk/authentication-with-secret-provider.mdx',
      'how-to/initialize-the-sdk/captcha.mdx',
      'how-to/initialize-the-sdk/configure-what-to-encrypt.mdx',
      'how-to/initialize-the-sdk/expo.mdx',
      'how-to/basic-operations.mdx',
      'how-to/querying-data.mdx',
      'how-to/how-to-subscribe-to-events.mdx',
      'how-to/registering-users.mdx',
      'how-to/key-management.mdx',
      'how-to/share-data-with-many-users.mdx',
      'how-to/contact-group-id.mdx',
      'how-to/store-unstructured-data.mdx',
      'how-to/define-user-roles.mdx',
      'how-to/set-up-2fa.mdx',
      'how-to/remember-me.mdx',
      'how-to/calendar-items-occupancy.mdx',
      'how-to/manage-a-multi-group-environment.mdx',
      'how-to/deleting-data-of-users.mdx',
      'how-to/deleting-data-of-inactive-users.mdx',
    ],
  },
  {
    title: 'DATA MODEL REFERENCE',
    files: [
      'explanations/data-model/index.mdx',
      'explanations/data-model/patient.mdx',
      'explanations/data-model/relatedperson.mdx',
      'explanations/data-model/contact.mdx',
      'explanations/data-model/service.mdx',
      'explanations/data-model/content.mdx',
      'explanations/data-model/subcontact.mdx',
      'explanations/data-model/healthelement.mdx',
      'explanations/data-model/document.mdx',
      'explanations/data-model/message.mdx',
      'explanations/data-model/topic.mdx',
      'explanations/data-model/healthcareparty.mdx',
      'explanations/data-model/device.mdx',
      'explanations/data-model/user.mdx',
      'explanations/data-model/code.mdx',
      'explanations/data-model/codestub.mdx',
      'explanations/data-model/identfier.mdx',
      'explanations/data-model/agenda.mdx',
      'explanations/data-model/calendaritem.mdx',
      'explanations/data-model/timetable.mdx',
    ],
  },
  {
    title: 'END-TO-END ENCRYPTION',
    files: [
      'explanations/end-to-end-encryption/index.mdx',
      'explanations/end-to-end-encryption/data-owners-and-access-control.mdx',
      'explanations/end-to-end-encryption/encrypted-links.mdx',
      'explanations/end-to-end-encryption/secure-delegations.mdx',
      'explanations/end-to-end-encryption/crypto-strategies.mdx',
      'explanations/end-to-end-encryption/cryptography-details.mdx',
      'explanations/end-to-end-encryption/key-verification.mdx',
    ],
  },
  {
    title: 'FILTER REFERENCE',
    files: ['explanations/everything-about-filters.mdx'],
  },
  {
    title: 'TROUBLESHOOTING',
    files: ['troubleshooting/encryption.mdx'],
  },
]

const HEADER = `# Cardinal SDK — Complete Documentation Reference

> **Purpose**: This document consolidates the entire Cardinal SDK documentation into a single reference
> optimized for LLM context. It is intended to be used by an AI assistant to create and improve an MCP
> server for the Cardinal SDK.
>
> **Cardinal SDK** is a multi-language SDK (Kotlin, TypeScript, Python, Dart) for building healthcare
> applications with end-to-end encryption. It provides CRUD operations, filtering/querying, real-time
> event subscriptions, and cryptographic key management for medical data entities like Patients, Contacts,
> Services, HealthElements, Documents, and more.
>
> This file is generated from \`sdk/\` by \`generate-sdk-md.mjs\` (\`yarn sdk-md\`): edit the pages in \`sdk/\` instead.

---

# TABLE OF CONTENTS

## Part 1: Introduction
- SDK Overview and purpose
- What's new in each SDK release
- Migration between SDK versions (breaking changes)
- MCP server: using the SDK documentation and API from Claude, Codex and other AI agents

## Part 2: Quickstart Guides
- Kotlin setup
- TypeScript setup
- Python setup
- Dart (Flutter) setup
- React Native setup

## Part 3: Tutorials
### 3.1 Introductory Tutorial
- SDK Initialization
- Creating Patients
- Creating and Encrypting Medical Data (Contacts, Services, Documents, HealthElements)
- Searching Data with Filters
- Sharing Encrypted Data (with HCPs and Patients)
- Using Codification Systems (SNOMED, LOINC, ICD-10)

### 3.2 Real-time Communication Tutorial
- Publisher: Creating medical data as a patient user
- Subscriber: Receiving and processing data in real-time via WebSocket events
- Running the example

## Part 4: How-To Guides
### 4.1 SDK Initialization
- Base SDK initialization
- Authentication with Secret Provider
- CAPTCHA integration
- Configuring encrypted fields
- Expo/React Native setup

### 4.2–4.17 Practical Guides
- Basic CRUD operations (create, get, modify, delete, share)
- Querying data with filters (filter options, combining, sorted, cross-entity)
- Subscribing to real-time events (WebSocket subscriptions, buffering, reconnection)
- Registering users (self-registration, invitation-based, patient crypto init)
- Cryptographic key management
- Sharing data with many users (hierarchical HCPs)
- Contact group IDs (splitting examinations across contacts)
- Storing unstructured data (documents, attachments)
- User roles management
- Two-factor authentication
- Persistent sessions (remember-me)
- Calendar items occupancy (appointment availability histograms)
- Multi-group environment
- Deleting user data

## Part 5: Data Model Reference
- Entity overview (base vs encryptable entities)
- Patient, RelatedPerson, Contact, Service, Content, SubContact
- HealthElement, Document, Message, Topic
- HealthcareParty, Device, User
- Code, CodeStub, Identifier
- Agenda, CalendarItem, TimeTable

## Part 6: End-to-End Encryption
- Encryption overview
- Data owners and access control
- Encrypted links (secret IDs)
- Secure delegations
- Crypto strategies
- Cryptography implementation details
- Key verification

## Part 7: Filter Reference
- Complete filter options for all entities

## Part 8: Troubleshooting
- Encryption issues

---
---
`

const FENCE = /^\s*(`{3,}|~{3,})/
const MDX_IMPORT = /^import\s.+\sfrom\s+['"].+['"];?\s*$/
const ADMONITION_OPEN = /^\s*:::(\w+)(?:\s+(.+?))?\s*$/
const ADMONITION_CLOSE = /^\s*:::\s*$/
const TAB_ITEM_OPEN = /^\s*<TabItem\s+value\s*=\s*"([^"]+)"[^>]*>\s*$/
const DROPPED_TAGS = /^\s*(<LanguageTabs>|<\/LanguageTabs>|<\/TabItem>|<div className="proofread">|<\/div>)\s*$/

// Converts one documentation page from MDX to plain Markdown.
export function convert(source) {
  const body = source.replace(/^---\n[\s\S]*?\n---\n/, '')
  const out = []
  let fence = null
  let afterAdmonitionOpen = false
  for (const line of body.split('\n')) {
    const fenceMatch = line.match(FENCE)
    if (fence) {
      out.push(line)
      if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length && line.trim() === fenceMatch[1]) fence = null
      continue
    }
    if (fenceMatch) {
      fence = fenceMatch[1]
      afterAdmonitionOpen = false
      out.push(line)
      continue
    }
    if (afterAdmonitionOpen && line.trim() === '') continue
    afterAdmonitionOpen = false
    if (MDX_IMPORT.test(line) || DROPPED_TAGS.test(line)) continue
    const tab = line.match(TAB_ITEM_OPEN)
    if (tab) {
      out.push(`**${tab[1]}:**`, '', '')
      continue
    }
    if (ADMONITION_CLOSE.test(line)) continue
    const admonition = line.match(ADMONITION_OPEN)
    if (admonition) {
      const [, type, title] = admonition
      if (title) out.push(`> **${type.toUpperCase()}: ${title.replace(/^\[|\]$/g, '')}**`)
      else out.push(`> **${type === 'danger' ? 'DANGER' : type}:**`)
      afterAdmonitionOpen = true
      continue
    }
    out.push(line)
  }
  return out
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trimEnd()
}

export function build(sdkDir) {
  const sections = PARTS.map(
    (part, i) =>
      `\n\n${'='.repeat(80)}\n# PART ${i + 1}: ${part.title}\n${'='.repeat(80)}\n\n` +
      part.files.map((file) => `<!-- Source: sdk/${file} -->\n\n${convert(fs.readFileSync(path.join(sdkDir, file), 'utf8'))}\n\n---\n`).join('\n'),
  )
  return HEADER + sections.join('') + '\n'
}

function listPages(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) return listPages(path.join(dir, entry.name), relative)
    return /\.mdx?$/.test(entry.name) ? [relative] : []
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sdkDir = process.argv[2] ?? 'sdk'
  const outFile = process.argv[3] ?? 'SDK.md'
  const listed = new Set(PARTS.flatMap((part) => part.files))
  const unlisted = listPages(sdkDir).filter((file) => !listed.has(file))
  if (unlisted.length > 0) {
    console.error(`Pages missing from PARTS in generate-sdk-md.mjs:\n${unlisted.map((file) => `  ${file}`).join('\n')}`)
    process.exit(1)
  }
  fs.writeFileSync(outFile, build(sdkDir))
  console.log(`Wrote ${outFile} from ${listed.size} pages of ${sdkDir}`)
}
