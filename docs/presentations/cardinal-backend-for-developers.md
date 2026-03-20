---
marp: true
theme: uncover
paginate: true
style: |
  :root {
    --color-bg: #0f172a;
    --color-bg-code: #1e293b;
    --color-fg: #e2e8f0;
    --color-highlight: #38bdf8;
    --color-accent: #a78bfa;
    --color-accent2: #34d399;
    --color-accent3: #fb923c;
    --color-warn: #f472b6;
  }
  section {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
    font-size: 28px;
    padding: 40px 60px;
  }
  h1 {
    color: var(--color-highlight);
    font-weight: 800;
    font-size: 2.2em;
    margin-bottom: 0.3em;
  }
  h2 {
    color: var(--color-accent);
    font-weight: 700;
    font-size: 1.5em;
    border-bottom: 2px solid var(--color-accent);
    padding-bottom: 8px;
    margin-bottom: 0.5em;
  }
  h3 {
    color: var(--color-accent2);
    font-weight: 600;
  }
  strong {
    color: var(--color-highlight);
  }
  em {
    color: var(--color-accent2);
    font-style: normal;
  }
  code {
    background: var(--color-bg-code);
    color: var(--color-accent2);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.85em;
  }
  pre {
    background: var(--color-bg-code) !important;
    border-left: 3px solid var(--color-highlight);
    border-radius: 8px;
    padding: 16px !important;
  }
  pre code {
    background: transparent;
    color: #e2e8f0;
    padding: 0;
  }
  table {
    font-size: 0.8em;
    width: 100%;
  }
  th {
    background: var(--color-bg-code);
    color: var(--color-highlight);
    font-weight: 600;
  }
  td, th {
    border-color: #334155;
    padding: 8px 12px;
  }
  ul, ol {
    margin-top: 0.3em;
  }
  li {
    margin-bottom: 0.2em;
  }
  .columns {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }
  .columns > * {
    flex: 1;
  }
  .highlight-box {
    background: var(--color-bg-code);
    border: 1px solid var(--color-accent);
    border-radius: 12px;
    padding: 16px 24px;
    margin: 12px 0;
  }
  .small {
    font-size: 0.75em;
    color: #94a3b8;
  }
  section.lead h1 {
    font-size: 3em;
    text-align: center;
  }
  section.lead p {
    text-align: center;
    font-size: 1.2em;
    color: #94a3b8;
  }
  .tag {
    display: inline-block;
    background: var(--color-bg-code);
    border: 1px solid var(--color-accent);
    border-radius: 20px;
    padding: 2px 12px;
    font-size: 0.75em;
    margin: 2px;
  }
  .tag-green {
    border-color: var(--color-accent2);
    color: var(--color-accent2);
  }
  .tag-blue {
    border-color: var(--color-highlight);
    color: var(--color-highlight);
  }
  .tag-orange {
    border-color: var(--color-accent3);
    color: var(--color-accent3);
  }
  .tag-pink {
    border-color: var(--color-warn);
    color: var(--color-warn);
  }
  section::after {
    color: #475569;
    font-size: 0.7em;
  }
  .mermaid {
    font-size: 0.8em;
  }
  .big-number {
    font-size: 3em;
    font-weight: 800;
    color: var(--color-highlight);
    line-height: 1;
  }
  .big-number-accent {
    font-size: 3em;
    font-weight: 800;
    color: var(--color-accent2);
    line-height: 1;
  }
  .timeline {
    border-left: 3px solid var(--color-accent);
    padding-left: 20px;
    margin-left: 10px;
  }
  .timeline-item {
    margin-bottom: 12px;
    position: relative;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Cardinal Backend
# Build Health Apps Fast

Why reinvent the backend when you can ship in weeks?

---

## The AI-Assisted Development Revolution

The era of **coding copilots** is here

- **Claude Code** / **Codex** / **GitHub Copilot** let you write application code at unprecedented speed
- A developer can now prototype a full frontend in *days*, not months
- Entire CRUD systems, UI flows, API integrations — generated and refined with AI assistance

<div class="highlight-box">

**The bottleneck has shifted.** Writing code is no longer the hard part. Making it *compliant, secure, and production-ready* is.

</div>

---

## The New Problem: Speed vs. Safety

Building fast is easy. Building **right** is hard.

<div class="columns">
<div>

### What AI helps you do fast
- UI / UX prototyping
- Business logic
- API integrations
- Data transformations
- Frontend scaffolding

</div>
<div>

### What still takes months
- Security architecture
- Penetration testing
- Compliance certification
- Encryption infrastructure
- Data privacy audits

</div>
</div>

<p class="small">A healthcare app with a security breach doesn't just lose users — it faces lawsuits and regulatory action.</p>

---

## The Real Cost of Building From Scratch

```
┌─────────────────────────────────────────────────────────────┐
│  TIMELINE: Healthcare Backend From Scratch                  │
│                                                             │
│  Month 1-2    Authentication, RBAC, user management         │
│  Month 2-4    Data model design, API development            │
│  Month 3-5    Encryption implementation & key management    │
│  Month 4-6    FHIR/HL7 interoperability mapping             │
│  Month 5-7    Security audit & penetration testing          │
│  Month 6-9    GDPR/HIPAA compliance certification           │
│  Month 7-10   Performance testing & hardening               │
│  Month 9-12   Bug fixes, edge cases, key recovery           │
│                                                             │
│  ⏱️  Total: 9–12 months before you can even start on UX     │
└─────────────────────────────────────────────────────────────┘
```

---

## What is Cardinal?

A **production-ready backend** for health data applications

<div class="columns">
<div>

### What you get
- Hosted API at `api.icure.cloud`
- End-to-end encrypted data storage
- Pre-built healthcare data model
- Multi-language SDKs
- Real-time event streaming
- User management & auth

</div>
<div>

### What you skip
- Months of backend development
- Cryptographic engineering
- Compliance certification
- Security infrastructure
- Interoperability mapping
- Penetration testing

</div>
</div>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 1
# Security Without the Headache

Compliant, pen-tested, and E2E encrypted out of the box

---

## E2E Encryption — Built In, Not Bolted On

Cardinal encrypts **before** data leaves the device

```
   Your App (Client)                      Cardinal (Server)
   ┌─────────────────┐                   ┌─────────────────┐
   │                 │                   │                 │
   │  Patient data   │    Already        │  ████████████   │
   │  "John Doe"     │ ──────────────>   │  ████████████   │
   │  BP: 140/90     │   Encrypted       │  ████████████   │
   │                 │                   │                 │
   │  SDK encrypts   │                   │  Server CANNOT  │
   │  automatically  │                   │  read the data  │
   └─────────────────┘                   └─────────────────┘
```

<div class="highlight-box">

**Zero-knowledge architecture**: Neither Cardinal's team, nor your ops team, nor any attacker who compromises the server can read patient data.

</div>

---

## Three-Layer Key Hierarchy

Military-grade encryption without the PhD

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: PERSONAL KEYS (RSA)                           │
│  One per user — stored on device only                   │
│  Used to decrypt exchange keys                          │
├─────────────────────────────────────────────────────────┤
│  Layer 2: EXCHANGE KEYS (AES)                           │
│  One per data-sharing relationship                      │
│  Enables secure collaboration between users             │
├─────────────────────────────────────────────────────────┤
│  Layer 3: ENTITY KEYS (AES)                             │
│  One per medical record                                 │
│  Encrypts the actual patient data                       │
└─────────────────────────────────────────────────────────┘
```

<p class="small">HMAC-SHA256 signatures ensure key authenticity — even a compromised database can't forge access.</p>

---

## Why E2E Encryption Matters

It's not just about checking a box

<div class="columns">
<div>

### Without E2E (traditional)
- Server stores cleartext data
- Database breach = full data leak
- You trust every admin, every DBA
- Compliance = policies & promises
- Encryption "at rest" still decryptable by the system

</div>
<div>

### With Cardinal E2E
- Server stores **encrypted blobs**
- Database breach = useless data
- Zero trust required
- Compliance = **architecture**
- Only authorized users with keys can decrypt

</div>
</div>

<div class="highlight-box">

**GDPR Article 32** & **HIPAA Security Rule** both recommend encryption. Cardinal makes it the *default*, not an afterthought.

</div>

---

## The SDK Makes Crypto Invisible

Developers never touch keys, ciphers, or delegations directly

```typescript
// Create a patient — SDK encrypts automatically
const patient = await sdk.patient.createOrModifyPatient(
  new Patient({ firstName: "Jane", lastName: "Doe" })
)

// Create medical data — encrypted before leaving the device
const contact = new DecryptedContact({ descr: "Annual checkup" })
const created = await sdk.contact.createContact(
  await sdk.contact.withEncryptionMetadata(contact, patient)
)

// Share with another doctor — key exchange happens behind the scenes
await sdk.contact.shareWith(otherDoctorId, created)

// Retrieve — SDK decrypts transparently
const retrieved = await sdk.contact.getContact(created.id)
console.log(retrieved.descr)  // "Annual checkup" ← decrypted
```

---

## Compliance by Architecture

| Requirement | DIY Approach | Cardinal |
|-------------|-------------|----------|
| **GDPR** data protection | Manual implementation + audit | E2E encryption by default |
| **HIPAA** security rule | Policies + encryption layer | Zero-knowledge architecture |
| **Pen testing** | Hire security firm, 4-8 weeks | Already done, continuously tested |
| **Access control** | Build RBAC from scratch | Role & entity-based access built in |
| **Audit trail** | Custom logging pipeline | Automatic `created`/`modified`/`author` |
| **Data deletion** | Hard delete + verification | Soft delete with full audit trail |
| **Key management** | Build or integrate HSM | Automatic key lifecycle + recovery |

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 2
# A Data Model That Speaks Healthcare

Pre-built, battle-tested, and ready to go

---

## Healthcare Data Model — Ready to Use

No schema design needed — Cardinal models the real world

```
┌─────────────────────────────────────────────────────────┐
│  PATIENT                                                │
│  ┌───────────────────────────────────────────────────┐  │
│  │  CONTACT (visit / lab result / phone call)        │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │  │
│  │  │  SERVICE    │ │  SERVICE    │ │  SERVICE    │  │  │
│  │  │  Blood      │ │  Diagnosis  │ │  Prescr.    │  │  │
│  │  │  pressure   │ │             │ │             │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  HEALTH ELEMENT (chronic condition, allergy...)   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  DOCUMENT (PDF, imaging, scans — encrypted)       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Rich Entity Types

Everything you need for a health application

<div class="columns">
<div>

### Clinical
- **Patient** — demographics & medical history
- **Contact** — encounters, consultations, events
- **Service** — atomic medical observations
- **HealthElement** — chronic conditions, allergies
- **Document** — PDFs, imaging, large files

</div>
<div>

### Operational
- **HealthcareParty** — doctors, clinics, organizations
- **User** — authentication & identity
- **Device** — connected medical devices
- **Message / Topic** — encrypted messaging
- **Agenda / CalendarItem** — scheduling

</div>
</div>

<div class="highlight-box">

**Medical codification** built in: SNOMED-CT, LOINC, ICD-10, ATC — all supported through the Code/CodeStub system.

</div>

---

## Content Types — Handle Any Medical Data

The Service entity supports **10+ content types** out of the box

| Type         | Field             | Use Case                             |
|--------------|-------------------|--------------------------------------|
| Number       | `numberValue`     | Lab results, scores                  |
| String       | `stringValue`     | Notes, narratives                    |
| Measure      | `measureValue`    | BP, heart rate (with unit, min, max) |
| Medication   | `medicationValue` | Prescriptions with full detail       |
| Time Series  | `timeSeries`      | ECG, EEG signals                     |
| Document ref | `documentId`      | Linked PDFs, images                  |
| Compound     | `compoundValue`   | Nested service groups                |
| Boolean      | `booleanValue`    | Yes/no assessments                   |
| Date         | `fuzzyDateValue`  | Approximate dates (YYYYMMDD)         |
| Binary       | `binaryValue`     | Small binary payloads                |

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 3
# Interoperability

Speak the language of healthcare systems

---

## FHIR & HL7 Ready

Connect to the existing healthcare ecosystem

<div class="columns">
<div>

### FHIR Identifiers
Every entity supports **FHIR-compliant identifiers**
```
{
  system: "http://hospital.org/mrn",
  value: "MRN-12345",
  type: { type: "MR" },
  assigner: "St. Mary's Hospital"
}
```
Out-of-the-box FHIR mapping

</div>
<div>

### Medical Codification
Built-in support for standard vocabularies

- **SNOMED-CT** — clinical terms
- **LOINC** — lab & clinical observations
- **ICD-10** — diagnostic codes
- **ATC** — drug classification

</div>
</div>

<div class="highlight-box">

**Why it matters**: Health apps don't exist in isolation. Hospitals, insurers, labs, and pharmacies all speak FHIR/HL7. Cardinal speaks it natively.

</div>

---

## Interoperability: DIY vs. Cardinal

```
┌──────────────────────────────────────────────────────────┐
│  Building interoperability from scratch                  │
│                                                          │
│  1. Study FHIR R4 spec (600+ pages)                      │
│  2. Map your data model to FHIR resources                │
│  3. Implement identifier system                          │
│  4. Build code system integration (SNOMED, LOINC, ...)   │
│  5. Handle versioning and migrations                     │
│  6. Test against conformance suites                      │
│  7. Maintain as specs evolve                             │
│                                                          │
│  ⏱️  3-6 months of specialized work                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  With Cardinal                                           │
│                                                          │
│  ✓ FHIR identifiers on every entity                      │
│  ✓ Code/CodeStub system maps to any standard             │
│  ✓ Searchable by system + value                          │
│  ✓ Already designed for healthcare workflows             │
│                                                          │
│  ⏱️  Ready on day one                                    │
└──────────────────────────────────────────────────────────┘
```

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 4
# Developer Experience

Five SDKs. Real-time events. Ship fast.

---

## Multi-Platform SDKs

One backend, every platform

<div class="columns">
<div>

### Available SDKs
- **Kotlin** — Android & JVM
- **TypeScript** — Web & Node.js
- **Python** — Backend & data science
- **Dart** — Flutter mobile
- **Swift** — iOS native

</div>
<div>

### What each SDK gives you
- Transparent E2E encryption
- Type-safe API wrappers
- Automatic key management
- Rich filtering & querying
- WebSocket event streaming

</div>
</div>

<div class="highlight-box">

**Same API, every language.** Learn it once, use it everywhere. The cryptographic complexity is hidden behind clean, idiomatic interfaces.

</div>

---

## Real-Time Event Streaming

React to medical data changes instantly

```typescript
// Subscribe to new contacts for the current user
const events = await sdk.contact.subscribeToEvents(
  ["CREATE"],
  await sdk.contact.filterContactsBy(/* your filter */)
)

for await (const event of events) {
  // ML analysis, notifications, integration workflows...
  console.log("New contact created:", event.contact.id)
}
```

<div class="columns">
<div>

### Use Cases
- Real-time dashboards
- ML-based analysis triggers
- Automated notifications
- Integration pipelines

</div>
<div>

### Built-in Features
- WebSocket-based delivery
- Encryption-aware filtering
- Entity-level subscriptions
- Create / Update / Delete events

</div>
</div>

---

## Secure Data Sharing Made Simple

Complex access control, simple API

```
   Dr. Alice creates a record
        │
        ├── Shares with Dr. Bob (READ_WRITE)
        │     └── Dr. Bob can read AND modify
        │
        ├── Shares with Patient Jane (READ)
        │     └── Jane sees her own data
        │     └── Server CANNOT see Jane's identity (anonymous delegation)
        │
        └── Shares with Lab (READ)
              └── Lab reads results only
```

- **Explicit** data owners: HCPs — ID visible in metadata (public professionals)
- **Anonymous** data owners: Patients — ID hidden, access via hashed keys
- **Hierarchical** access: Doctor > Department > Hospital cascading permissions

---

## User Management — Complete Solution

Authentication, registration, and roles out of the box

<div class="columns">
<div>

### For Patients
- Self-registration with email verification
- CAPTCHA integration
- Remember-me sessions
- 2FA support

</div>
<div>

### For Healthcare Professionals
- Invitation-based onboarding
- Role-based access control
- Organization hierarchies
- Multi-device key sync

</div>
</div>

<div class="highlight-box">

**Key recovery** is built in: password-protected backups, file export/import, notary system for sharing recovery keys with trusted parties.

</div>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 5
# The Argument for Cardinal

AI writes code. Cardinal makes it safe.

---

## The Modern Stack: AI + Cardinal

```
┌──────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Frontend / UX  ←── Built fast with AI copilots    │  │
│  │  Business Logic ←── Claude Code / Copilot / Codex  │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │ Cardinal SDK                 │
│  ┌────────────────────────▼───────────────────────────┐  │
│  │  Cardinal Backend                                  │  │
│  │  ✓ E2E Encryption     ✓ FHIR/HL7 Ready             │  │
│  │  ✓ GDPR/HIPAA         ✓ Pen-Tested                 │  │
│  │  ✓ Data Model         ✓ Real-Time Events           │  │
│  │  ✓ Key Management     ✓ User Auth                  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Time to Market: The Real Comparison

| Phase                       | From Scratch | With Cardinal     |
|-----------------------------|--------------|-------------------|
| Backend infrastructure      | 2-3 months   | **0** (hosted)    |
| Data model design           | 1-2 months   | **0** (pre-built) |
| Encryption & key mgmt       | 2-4 months   | **0** (automatic) |
| User auth & management      | 1-2 months   | **0** (built in)  |
| FHIR/HL7 interop            | 2-4 months   | **0** (native)    |
| Security audit & pen test   | 1-2 months   | **0** (done)      |
| Compliance certification    | 2-3 months   | **0** (covered)   |
| **Your app's unique value** | Month 12+    | **Week 1**        |

<div class="highlight-box">

**Ship in weeks, not years.** Use AI copilots for your frontend and business logic. Let Cardinal handle the hard, regulated backend.

</div>

---

## What You Focus On vs. What Cardinal Handles

<div class="columns">
<div>

### You build (with AI)
- User experience & design
- Business-specific workflows
- Custom analytics & reports
- Patient engagement features
- Integration with your systems
- What makes your app **unique**

</div>
<div>

### Cardinal provides
- Encrypted data storage
- Secure data sharing
- Access control & permissions
- Medical codification
- Real-time event streaming
- Compliance infrastructure

</div>
</div>

<p class="small">Focus on what differentiates your product. Don't rebuild what's already been built, tested, and certified.</p>

---

## Who Uses Cardinal?

Cardinal powers applications across the health spectrum

<div class="columns">
<div>

- **EHR systems** — full electronic health records
- **Telemedicine** — encrypted video + data
- **Patient portals** — self-service health data
- **Clinical research** — anonymized data sharing
- **IoT health** — smartwatch & device integration

</div>
<div>

- **Care coordination** — multi-provider collaboration
- **Mental health** — highly sensitive data protection
- **Pharmacy** — prescription management
- **Insurance** — claims & health data processing
- **Public health** — population health monitoring

</div>
</div>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Recap

---

## Why Cardinal Backend?

1. **AI copilots changed the game** — you can build UIs and business logic faster than ever, but backends still need compliance, security, and pen-testing

2. **E2E encryption by design** — zero-knowledge architecture means even a full server breach exposes nothing. Compliance is built into the architecture, not bolted on with policies

3. **Healthcare data model included** — Patient, Contact, Service, HealthElement, Document and more — all pre-built with 10+ content types

4. **Interoperability out of the box** — FHIR identifiers, SNOMED-CT, LOINC, ICD-10 on every entity. Speak the language of hospitals and labs from day one

5. **Ship in weeks, not months** — Five SDKs, real-time events, user management, key recovery. Focus on what makes your app unique

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Start Building Today

**docs.icure.com** — Documentation
**cardinalsdk.com** — Overview

<span class="tag tag-blue">Kotlin</span> <span class="tag tag-green">TypeScript</span> <span class="tag tag-orange">Python</span> <span class="tag tag-pink">Dart</span> <span class="tag">Swift</span>
