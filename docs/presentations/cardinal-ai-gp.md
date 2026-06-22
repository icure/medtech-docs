---
marp: true
paginate: true
size: 16:9
backgroundColor: '#0D2237'
color: '#D7DEE8'
title: 'Patient-Controlled AI for the GP Practice'
author: 'Cardinal'
---

<style>
:root {
  --cardinal: #EF762F;        /* brand orange — CTAs, headings, accents */
  --cardinal-light: #F8965A;
  --blue: #00B1FF;            /* secondary accent — links, highlights */
  --cardinal-pale: #00B1FF;   /* inline code */
  --ink: #0D2237;             /* deep navy page background */
  --ink-soft: #193049;        /* panels / cards / nodes */
  --border: rgba(61, 90, 128, 0.55);  /* navy border */
  --paper: #D7DEE8;           /* light text */
  --muted: #8FA1B8;           /* muted navy-gray */
  --danger: #FF6B6B;
  --ok: #5FD08A;
}

section {
  font-family: -apple-system, 'Segoe UI', Inter, Helvetica, Arial, sans-serif;
  font-size: 26px;
  line-height: 1.45;
  background: radial-gradient(120% 120% at 100% 0%, #214162 0%, var(--ink) 58%);
  padding: 64px 80px;
  letter-spacing: -0.01em;
}

h1 { color: var(--cardinal); font-size: 56px; line-height: 1.05; font-weight: 800; margin-bottom: 0.2em; }
h2 { color: var(--paper); font-size: 40px; font-weight: 700; }
h3 { color: var(--cardinal-light); font-size: 28px; font-weight: 600; }
strong { color: var(--cardinal-light); }
a { color: var(--blue); }
em { color: var(--muted); font-style: normal; }

ul, ol { margin-top: 0.3em; }
li { margin: 0.35em 0; }

code { background: #081626; color: var(--cardinal-pale); border-radius: 6px; padding: 0.05em 0.35em; font-size: 0.9em; }
pre { background: #081626 !important; border: 1px solid var(--border); border-radius: 12px; font-size: 21px; line-height: 1.5; }
pre code { background: transparent; }

section::after {
  color: var(--muted);
  font-size: 14px;
}

/* footer brand mark */
section footer {
  color: var(--muted);
  font-size: 14px;
}

/* ---- utility classes ---- */
.lead { display: flex; flex-direction: column; justify-content: center; }
section.lead h1 { font-size: 68px; }
section.lead h2 { color: var(--muted); font-weight: 500; font-size: 32px; }

.kicker { color: var(--cardinal); font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; font-size: 18px; margin-bottom: 0.4em; }

.big { font-size: 46px; line-height: 1.15; font-weight: 700; color: var(--paper); }
.huge { font-size: 60px; line-height: 1.05; font-weight: 800; }
.muted { color: var(--muted); }
.danger { color: var(--danger); }
.ok { color: var(--ok); }

.cols { display: flex; gap: 36px; align-items: stretch; }
.col { flex: 1; }

.card { background: var(--ink-soft); border: 1px solid var(--border); border-radius: 16px; padding: 22px 26px; }
.card.bad { border-color: #58282a; }
.card.good { border-color: #2a5838; }
.card h3 { margin-top: 0; }

.flow { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; font-size: 22px; }
.node { background: var(--ink-soft); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; text-align: center; }
.node.cardinal { border-color: var(--cardinal); }
.node.bad { border-color: #58282a; }
.arrow { color: var(--cardinal); font-size: 28px; }
.arrow.bad { color: var(--danger); }

.tag { display: inline-block; background: #081626; border: 1px solid var(--cardinal); color: var(--cardinal-light); border-radius: 999px; padding: 4px 14px; font-size: 18px; margin: 3px; }

.spectrum { display: flex; align-items: stretch; gap: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); }
.spectrum > div { flex: 1; padding: 22px; }
.spectrum .l { background: rgba(0, 177, 255, 0.10); }   /* blue tint — local / safe */
.spectrum .r { background: rgba(239, 118, 47, 0.12); }  /* orange tint — cloud */
</style>

<!-- _paginate: false -->
<!-- _class: lead -->

<span class="kicker">Cardinal · Healthcare data, end-to-end encrypted</span>

# Did your AI take the Hippocratic Oath?

## Clinical AI at your service — or your patients in the service of AI

<br>

<span class="muted">Antoine Duchâteau · Workshop Biopôle · 2026</span>

---

<!-- _class: lead -->

<span class="kicker">A familiar scene</span>

## A GP switches on an AI scribe<br>at the start of a consultation.

<span class="muted">It listens. It transcribes. It drafts a perfect note.<br>Everyone's delighted.</span>

---

# Where did the consultation go?

<div class="flow">
<div class="node">🩺 Consultation</div>
<span class="arrow bad">───▶</span>
<div class="node bad">🎙️ Raw audio + transcript</div>
<span class="arrow bad">───▶</span>
<div class="node bad">☁️ Third-party cloud LLM</div>
</div>

<br>

The most intimate 12 minutes of the patient's life — **mental health, a diagnosis, a fear** — just left the practice **in plaintext**, to a server you don't control.

---

# Off the rails — three times

<div class="cols">
<div class="col card bad">

### No consent
The patient was never asked whether an AI vendor or a hyperscaler could read their consultation.

</div>
<div class="col card bad">

### No control
Retention, logging, **training on your data** — decided by someone else's terms of service.

</div>
<div class="col card bad">

### No cover
Under **nLPD & medical secrecy**, the *GP* is liable — not the vendor.

</div>
</div>

<br>

<span class="muted">"It's encrypted in transit" is not the same as "the patient decides who reads what."</span>

---

<!-- _class: lead -->

# What they're trying to sell you

<div class="cols" style="margin-top:0.5em">
<div class="col"><p class="huge">Useful AI</p></div>
<div class="col" style="flex:0 0 auto; align-self:center"><p class="huge muted">vs</p></div>
<div class="col" style="text-align:right"><p class="huge">Private&nbsp;data</p></div>
</div>

<br>

<span class="muted">Pick one or the other. — The lie to dismantle.</span>

---

# "Control" as a prerequisite.

<div class="cols">
<div class="col card good">

### Scoped access
The AI gets **this note**, read-only — not the whole record, not the patient's identity.

</div>
<div class="col card good">

### Auditable
Every access is a delegation you can **see** — trust you can verify, not just hope for.

</div>
<div class="col card good">

### Revocable
Access is an explicit grant — so it can be **withdrawn**. Consent that can change its mind.

</div>
</div>

---

<p class="big">An <strong>end-to-end encrypted</strong> medical data layer where every actor — doctor, patient, device, <span style="color:#00B1FF">and AI service</span> — is a <strong>data owner</strong>.</p>


<span class="muted">The AI doesn't get a backdoor. It gets a front-door key the patient can take back.</span>

---

# It's a spectrum, not a switch

<div class="spectrum">
<div class="l">

### On-device
**Most sensitive inference.**
Decrypt inside the GP's app, run a local model. Plaintext **never leaves** the trust boundary.

</div>
<div class="r">

### Scoped cloud delegation
**When a cloud model is genuinely needed.**
Grant a sovereign AI a minimal, read-only, **revocable** delegation to exactly the data it needs.

</div>
</div>

<br>

<p class="muted">Sensitivity decides where on the spectrum you sit — and Cardinal supports the whole range with one data model.</p>

---

# From a feral scribe …

<div class="flow" style="font-size:24px">
<div class="node">🩺 GP</div>
<span class="arrow bad">▶</span>
<div class="node bad">🎙️ Plaintext transcript</div>
<span class="arrow bad">▶</span>
<div class="node bad">☁️ Vendor cloud</div>
</div>

<br>

- Patient is **not** in the diagram
- The key to the data is **the vendor's**
- Revocation means... emailing support and hoping

<br>

<span class="danger">The data left the building, and the patient never held the key.</span>

---

# … to a tamed one

<div class="flow" style="font-size:23px">
<div class="node">🩺 GP</div>
<span class="arrow">▶</span>
<div class="node cardinal">🔐 Encrypted note</div>
<span class="arrow">▶</span>
<div class="node cardinal">👤 Patient holds a key</div>
</div>
<div class="flow" style="font-size:23px; margin-top:14px; margin-left:120px">
<span class="arrow">└▶</span>
<div class="node cardinal">🤖 AI scribe — scoped, revocable delegation</div>
</div>

<br>

- The patient is a **first-class data owner**
- The AI sees the encrypted note **only** because it was granted access
- Withdraw the delegation → the AI is locked out again

---

# The AI: just one more data owner

<p class="medium">No special case. No new trust assumption.</p>

The AI scribe is granted access the **exact same way** you'd share a note with a specialist:

<div style="margin-top:0.6em">
<span class="tag">read-only</span>
<span class="tag">the note's content — not the patient's identity</span>
<span class="tag">no secret IDs it doesn't need</span>
<span class="tag">explicit, therefore revocable</span>
</div>

---

# Diamonds are forever… not consent

<div class="cols">
<div class="col">

Access to the note is an **explicit delegation** in Cardinal's encryption graph.

- Nothing is shared by default
- Each delegate is named
- Remove the delegation / rotate the exchange key → access is **gone**

</div>
<div class="col" style="text-align:center">

![w:240](assets/decrypt.svg)

<span class="muted">Consent that can be withdrawn is the whole point.</span>

</div>
</div>

---

# Trust you can verify

<div class="cols">
<div class="col card good">

### Auditability
Who touched this note? It's not a vendor promise in a PDF — it's a **delegation you can enumerate**.

</div>
<div class="col card good">

### Revocation
"Stop using my data for AI" stops being a support ticket and becomes a **state change** in the record.

</div>
</div>

<br>

<p class="medium">Cryptography at the center of your access policy.</p>

---

# This is also how you stay compliant

<div class="cols">
<div class="col card">

### nLPD
Data minimisation & purpose limitation are the **default**, not a checklist — you share the minimum, explicitly.

</div>
<div class="col card">

### Medical secrecy
The plaintext never leaves the people who are legally allowed to hold it (art. 321 Swiss Penal Code).

</div>
<div class="col card">

### EU AI Act
You can show **exactly** what data the AI system processed, and prove the patient governed it.

</div>
</div>

<br>

<span class="muted">Compliance is no longer what blocks your AI — it's the foundation of your data layer.</span>

---

# The scribe is just the opening act

<div class="cols">
<div class="col">

- 🤖 **Patient assistant** — the patient grants *their own* assistant access to *their own* record
- 🧭 **Decision support** — structured, decryptable-on-device data grounds the model
- 📅 **Proactive recall** — scan the practice's records to flag who's due for screening

</div>
<div class="col" style="text-align:center">

![w:260](assets/encrypt.svg)

</div>
</div>

<br>

<span class="muted">Same data owners. Same delegations. Same revocability. One model, every use case.</span>

---

# What you don't have to build

<p class="big">AI is the exciting 20%.<br>The data layer is the hard 80%.</p>

<div style="margin-top:0.4em">
<span class="tag">end-to-end encryption</span>
<span class="tag">key management & recovery</span>
<span class="tag">consent & granular sharing</span>
<span class="tag">audit & access control</span>
<span class="tag">multi-device sync</span>
<span class="tag">2FA, user roles</span>
<span class="tag">structured medical model</span>
</div>

<br>

<span class="muted">Cardinal ships the 80% — across Kotlin, Python, TypeScript and Dart — so you can spend your time on the AI.</span>


---

<!-- _class: lead -->
<!-- _paginate: false -->

![w:360](assets/logo_cardinal_white.svg)

# Thank you

<span class="muted">https://cardinalsdk.com · Antoine Duchâteau · contact@icure.com</span>

---

<!-- _backgroundColor: '#0B1F33' -->

<span class="kicker">Appendix · for Q&A</span>

# Under the hood: zero-trust by design

- **E2EE alone isn't enough** — Cardinal adds *secure delegations* and a *delegation graph* so access is provable and constrained
- **Anonymous data sharing** — share with a data owner without leaking *which* patient a record belongs to
- **Key recovery & verification** — keys can be recovered and cross-verified, without trusting the server
- **Hierarchical data owners** — model a practice/department so sharing scales without per-doctor fan-out
- **Strict access control** — child delegations can never exceed a parent's permission

<br>

<span class="muted">See: Explanations → End-to-End Encryption → Secure Delegations & Crypto Strategies.</span>
