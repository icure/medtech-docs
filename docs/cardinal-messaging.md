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
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Cardinal SDK
# Messaging & Live Events

Encrypted communication between care actors

---

## Agenda

1. **HealthcareParty Hierarchy** — Organizations, individuals & data ownership
2. **Messaging Concepts** — Topics & messages vs events
3. **Topics** — Conversation containers with participant roles
4. **Messages** — Encrypted communication units
5. **Real-Time Events** — WebSocket subscriptions & live notifications

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 1
# HealthcareParty Hierarchy

Who talks to whom

---

## HealthcareParty — The Care Actor

Any individual or organization involved in patient care

<div class="columns">
<div>

### Individuals
- Doctors, nurses, physiotherapists
- `firstName`, `lastName`
- `gender`, `civility`
- `speciality` / `specialityCodes`
- `languages` (ISO codes)

</div>
<div>

### Organizations
- Hospitals, clinics, labs
- `name`, `companyName`
- `addresses`
- Can group multiple individuals
- Government authorities

</div>
</div>

<div class="highlight-box">

**Non-encryptable** entity — HCP data is considered public directory information, not medical data.

</div>

---

## Parent-Child Hierarchy

HealthcareParties form **tree structures** via `parentId`

```
Hospital "St. Mary's" (id: org-001)
    │
    ├── Department "Cardiology" (id: dept-010, parentId: org-001)
    │       │
    │       ├── Dr. Alice Smith (id: hcp-100, parentId: dept-010)
    │       └── Dr. Bob Jones  (id: hcp-101, parentId: dept-010)
    │
    ├── Department "Radiology" (id: dept-020, parentId: org-001)
    │       │
    │       └── Dr. Carol Lee  (id: hcp-200, parentId: dept-020)
    │
    └── Nurse Team Lead (id: hcp-300, parentId: org-001)
```

Each HCP references its parent — the parent does **not** list its children.

---

## Hierarchical Data Owners

When enabled, the hierarchy unlocks **automatic data access inheritance**

```
                    Hospital (org-001)
                    Can see ALL data below
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
      Cardiology              Radiology
      (dept-010)              (dept-020)
      Sees cardiology data    Sees radiology data
            │                      │
      ┌─────┴─────┐                │
      ▼           ▼                ▼
  Dr. Alice    Dr. Bob         Dr. Carol
  Own data     Own data        Own data
```

- Enabled via `useHierarchicalDataOwners` SDK option
- Children's data flows **down** — children see everything above them
- Siblings remain **isolated** — Cardiology cannot see Radiology data
- Parents keys (weak keys) are shared with children
---

## Becoming a Data Owner

A HealthcareParty can start create data when he has a Public Key set (and a private key stored somewhere on his device)

```
┌──────────────┐         ┌──────────────────────┐
│    User      │         │  HealthcareParty     │
│              │         │                      │
│  login       │────────>│  Dr. Alice Smith     │
│  password    │  linked │  speciality: cardio  │
│  tokens      │   via   │  parentId: dept-010  │
│              │  hcpId  │  RSA keys: XsZw/A5rE │
└──────────────┘         └──────────────────────┘
                                    │
                                    ▼
                            Can encrypt / decrypt
                            Can create delegations            
```

<p class="small">Users can also link to Patient or Device — each being a Data Owner type with different privacy characteristics</p>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 2
# Messages vs Events

Conversations or real-time notifications

---
## Topics/Messages

The building blocks of a Slack/Teams/Discord. A set of entities for building **group conversations** with rich context

| Entity           | Description                                    |
|------------------|------------------------------------------------|
| `Topic`          | Groups participants in a discussion            |
| `Message`        | One message in a conversation (can be a reply) |
| `Document`       | An attachment to a message (can be BIG — GBs)  |

<div class="highlight-box">

Topics and messages offer a **structured, encrypted communication layer** that can be directly linked to medical data, enabling secure collaboration with clinical context.

</div>

<p class="small">🔒 Encrypted by default: textual content, document content, links with patients</p>

---
## Events

The building blocks of a Real-Time notification system. A stream of **entity change notifications** that clients can subscribe to

| Entity    | Description                                  |
|-----------|----------------------------------------------|
| `Message` | Add a real-time component to messages        |
| `Patient` | Subscribe to administrative data changes     |
| `Contact` | Get notified of new patients transactions    |
| `Service` | Scan streams of realtime medical information |

<div class="highlight-box">

The transport is WebSocket. Subscription are defined through filters abd type of events. Up to 1000 of events per second for an organisation.

</div>

---
<!-- _class: lead -->
<!-- _paginate: false -->

# Part 3
# Topics

Conversation containers

---

## Topic — The Conversation Space

An **encryptable root entity** that groups participants in a discussion

| Field                  | Type   | Description                  |
|------------------------|--------|------------------------------|
| `activeParticipants`   | Map    | User IDs → Roles             |
| `description`          | String | Topic description            |
| `linkedHealthElements` | ID[]   | Related medical conditions   |
| `linkedServices`       | ID[]   | Related medical observations |

<div class="highlight-box">

Topics provide **medical context** — they can link to HealthElements and Services, connecting conversations directly to the patient record.

</div>

<p class="small">🔒 Encrypted by default: description, linkedServices, linkedHealthElements</p>

---

## Topic Participant Roles

Three roles with **escalating privileges**

```
┌─────────────────────────────────────────────────────┐
│  Topic: "Patient Doe — Cardiology Consult"          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  OWNER                                        │  │
│  │  Dr. Alice (created the topic)                │  │
│  │  • Full control over topic                    │  │
│  │  • Can add/remove any participant             │  │
│  │  • Can delete the topic                       │  │
│  ├───────────────────────────────────────────────┤  │
│  │  ADMINISTRATOR                                │  │
│  │  Dr. Bob (invited as admin)                   │  │
│  │  • Can manage participants                    │  │
│  │  • Can modify topic configuration             │  │
│  ├───────────────────────────────────────────────┤  │
│  │  PARTICIPANT                                  │  │
│  │  Nurse Carol (invited to collaborate)         │  │
│  │  • Can read and send messages                 │  │
│  │  • Cannot manage other participants           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Topic + Encryption = Secure Group Chat

Access to a Topic is governed by **Secure Delegations**

```
Topic created by Dr. Alice
    │
    ├── SecureDelegation (Alice → Alice)
    │   Access: READ_WRITE
    │   Entity key encrypted with Alice's exchange key
    │
    ├── SecureDelegation (Alice → Bob)
    │   Access: READ_WRITE
    │   Entity key re-encrypted for Bob
    │
    └── SecureDelegation (Alice → Carol)
        Access: READ
        Entity key re-encrypted for Carol
```

- Each participant gets the **entity AES key** via their own delegation
- Adding a participant = creating a new SecureDelegation
- Removing a participant = revoking their delegation

---

## Linking Topics to Medical Data

Topics can reference **HealthElements** and **Services** for clinical context

```
Patient: Jane Doe
    │
    ├── HealthElement: "Type 2 Diabetes" (he-001)
    │       │
    │       └── Service: "HbA1c = 7.2%" (svc-050)
    │
    └── Topic: "Diabetes Management Discussion"
            │
            ├── linkedHealthElements: [he-001]
            ├── linkedServices: [svc-050]
            │
            ├── Message: "HbA1c trending up, adjust meds?"
            ├── Message: "Agreed, switching to metformin 1000mg"
            └── Message: "Updated prescription, follow-up in 3mo"
```

<p class="small">🔒 linkedHealthElements and linkedServices are encrypted — the server cannot see which medical data the conversation references</p>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 4
# Messages

Encrypted communication units

---

## Message — The Communication Unit

An **encryptable root entity** for sending information between users

| Field           | Type      | Description                              |
|-----------------|-----------|------------------------------------------|
| `fromAddress`   | String    | Sender identifier (user ID, email, etc.) |
| `toAddresses`   | String[]  | Recipient identifiers                    |
| `subject`       | String    | Message subject                          |
| `transportGuid` | String    | ID of the containing Topic               |
| `parentId`      | String    | Parent Message ID (for replies)          |
| `sent`          | Timestamp | When the message was sent                |
| `received`      | Timestamp | When it was received                     |
| `readStatus`    | Map       | User ID → read status info               |

<p class="small">🔒 Encrypted by default: subject</p>

---

## Message ↔ Topic Relationship

Messages reference their Topic — **not the other way around**

```
┌──────────────────────────────┐
│  Topic (id: topic-001)       │
│  "Diabetes Management"       │
│                              │
│  activeParticipants:         │
│    Alice: OWNER              │
│    Bob: ADMINISTRATOR        │
│    Carol: PARTICIPANT        │
│                              │  <── no message list here
└──────────────────────────────┘

┌────────────────────────────┐  ┌────────────────────────────┐
│  Message (id: msg-001)     │  │  Message (id: msg-002)     │
│  transportGuid: topic-001 ─┼──│  transportGuid: topic-001 ─┼──> Topic
│  fromAddress: alice        │  │  fromAddress: bob          │
│  subject: "Adjust meds?"   │  │  subject: "Agreed"         │
│  parentId: null            │  │  parentId: msg-001       <─┼── Reply
└────────────────────────────┘  └────────────────────────────┘
```

<div class="highlight-box">

The backend **does not enforce** the Topic ↔ Message link. It's the application's responsibility to maintain `transportGuid` consistency.

</div>

---

## Threading with parentId

Build **reply chains** by referencing the parent message

```
msg-001: "HbA1c is trending up, should we adjust meds?"
    │
    ├── msg-002: "Agreed, I'd suggest metformin 1000mg"
    │       │
    │       └── msg-003: "Good call, prescription updated"
    │
    └── msg-004: "Also consider dietary counseling referral"
            │
            └── msg-005: "Referred to nutritionist Dr. Park"
```

- `parentId: null` → top-level message
- `parentId: msg-001` → reply to msg-001
- Enables nested conversation threads within a single Topic

---

## Read Status Tracking

Track which participants have **read each message**

```
Message (id: msg-001)
│
└── readStatus:
        "user-alice": { time: 1710000000, read: true  }
        "user-bob":   { time: 1710003600, read: true  }
        "user-carol": NO ENTRY (not read yet)
```

- Maps **User IDs** to read status objects
- Tracks both the **read flag** and the **timestamp**
- Enables read receipts and unread indicators in the UI
- Updated by each client when the user views the message

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Part 5
# Not so Real-Time Events

Live notifications over HTTP

---

## Live event Subscriptions

Subscribe to entity changes with **`subscribeToEvents()`**
We offer no hard Real-Time guarantees, but the SDK handles reconnections and missed events for you.

```typescript
// Subscribe to new messages in mostly real-time
const subscription = await sdk.message.subscribeToEvents(
  [SubscriptionEventType.Create],
  MessageFilters.byTransportGuidForSelf(topicId)
)

// Process events as they arrive
for await (const event of subscription.events) {
  if (event.type === "EntityNotification") {
    const message = event.entity
    console.log(`New message from ${message.fromAddress}`)
    console.log(`Subject: ${message.subject}`)  // auto-decrypted
  }
}
```

- Works on **any entity type**: Message, Contact, HealthElement, Service...
- Events are **encrypted** — SDK decrypts transparently
- Only receives events that you have access to (via delegations)

---

## Subscription Configuration

Fine-tune connection behavior for **reliability**

```typescript
const config = {
  channelBufferCapacity: 100,       // buffer size for events
  onBufferFull: "Close",            // what to do when full
  reconnectionDelay: 2000,          // 2s initial reconnect delay
  retryDelayExponentFactor: 2.0,    // exponential backoff
  connectionMaxRetries: 5           // max reconnect attempts
}
```

```
Connection Timeline:
────●────────────●──────●──────────●──────────────────▶
   Connect    Disconnect  Retry    Reconnect
                          (2s)     (success)
                                       │
                           getMissedEvents()
                           catches up on gaps
```

---

## Event Lifecycle

Handle **connection states** and **entity notifications**

```
┌─────────────────────────────────────────────────────┐
│  Event Stream                                       │
│                                                     │
│  ┌─────────┐   ┌──────────────────┐                 │
│  │Connected│──>│ getMissedEvents()│── catch up      │
│  └─────────┘   └──────────────────┘                 │
│                                                     │
│  ┌──────────────────┐                               │
│  │EntityNotification│── process new/updated entity  │
│  └──────────────────┘                               │
│                                                     │
│  ┌───────────┐   ┌──────────────────┐               │
│  │Reconnected│──>│ getMissedEvents()│── fill gaps   │
│  └───────────┘   └──────────────────┘               │
│                                                     │
│  ┌─────┐                                            │
│  │Error│── log, decide to continue or close         │
│  └─────┘                                            │
└─────────────────────────────────────────────────────┘
```

---

## Ping / Pong Keep-Alive

WebSocket connections stay healthy with a **heartbeat mechanism**

```
Client                              Server
  │                                    │
  │ <── subscribe (WebSocket open) ──> │
  │                                    │
  │           <── PING ───             │
  │           ─── PONG ──>             │
  │                                    │
  │           <── PING ───             │
  │           ─── PONG ──>             │
  │                                    │
  │           <── PING ───             │
  │           ✗  (no pong)             │
  │                                    │
  │    <── connection closed ──>       │
  │                                    │
  │ ───  reconnect (after delay)  ──>  │
  │                                    │
```

- **Server initiates** pings at regular intervals
- Client must **respond within time window**
- Missing pong triggers **reconnection logic**

---

## Filtering Subscriptions

Receive only the events you care about with **filters**

```typescript
// Messages in a specific topic
MessageFilters.byTransportGuidForSelf(topicId)

// New health elements with a specific tag
HealthElementFilters.byTagForSelf(
  "INTERNAL_INFERENCE_STATUS",
  { tagCode: "TO_BE_STARTED" }
)

// Services matching medical code + processing status
ServiceFilters.byTagAndValueDateForSelf("LOINC", "2339-0")
  .and(ServiceFilters.byTagAndValueDateForSelf(
    "CARDINAL", "TO_BE_ANALYZED"
  ))
```

<div class="highlight-box">

**`forSelf`** — subscriptions are scoped to data **shared with the current user**. You cannot subscribe to data you don't have access to.

</div>

---

## Handling Missed Events

Recover from disconnections **without losing data**

```typescript
for await (const event of subscription.events) {
  switch (event.type) {
    case "Connected":
    case "Reconnected":
      // Fetch events that occurred during disconnection
      const missed = await subscription.getMissedEvents()
      for (const entity of missed) {
        await processEntity(entity)
      }
      break

    case "EntityNotification":
      await processEntity(event.entity)
      break

    case "Error":
      console.error("Subscription error:", event.error)
      break
  }
}
```

---

## Loosely Real-Time (~ 300 ms) Use Cases

<div class="columns">
<div>

### Clinical Communication
- Encrypted chat between HCPs
- Patient-provider messaging
- Topic-based case discussions
- Read receipts & notifications

### Automated Workflows
- AI inference on new lab results
- Alert on critical values
- Tag-based event processing

</div>
<div>

### Monitoring & Integration
- Lab system data ingestion
- Device telemetry processing
- Cross-organization referrals
- Audit trail construction

### Event-Driven Architecture
- Services trigger downstream processing
- HealthElement changes notify care team
- Message delivery confirmation
- Real-time dashboards

</div>
</div>

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Recap

---

## Messaging & Real-Time — Key Takeaways

1. **HealthcareParty hierarchy** models organizations and individuals — with optional hierarchical data access inheritance

2. **Topics** are encrypted conversation containers with **three participant roles** (Owner, Administrator, Participant) and links to medical context

3. **Messages** are encrypted communication units linked to Topics via `transportGuid`, with threading via `parentId` and read tracking

4. **WebSocket subscriptions** deliver live entity events (mostly real-time) with automatic reconnection, missed event recovery, and filter-based targeting

5. **Everything is encrypted** — Topics, Messages, and even the links to medical data are protected by the same three-layer key hierarchy

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Thank You

Cardinal SDK Documentation
**docs.icure.com**
