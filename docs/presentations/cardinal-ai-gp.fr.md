---
marp: true
paginate: true
size: 16:9
lang: fr
backgroundColor: '#0D2237'
color: '#D7DEE8'
title: 'IA contrôlée par le patient au cabinet médical'
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

.medium { font-size: 32px; line-height: 1.15; font-weight: 700; color: var(--paper); }
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

<span class="kicker">Cardinal · Données de santé, chiffrées de bout en bout</span>

# Votre IA a-t-elle prêté le serment d'Hippocrate ?

## Une IA clinique à votre service ou vos patients au service de l'IA

<br>

<span class="muted">Antoine Duchâteau · Workshop Biopôle · 2026</span>

---

<!-- _class: lead -->

<span class="kicker">Une scène familière</span>

## Un médecin active un scribe IA<br>au début d'une consultation.

<span class="muted">Il écoute. Il transcrit. Il rédige une note parfaite.<br>Tout le monde est ravi.</span>

---

# Où est passée la consultation ?

<div class="flow">
<div class="node">🩺 Consultation</div>
<span class="arrow bad">───▶</span>
<div class="node bad">🎙️ Audio + transcription brute</div>
<span class="arrow bad">───▶</span>
<div class="node bad">☁️ LLM cloud tiers</div>
</div>

<br>

Les 12 minutes les plus intimes de la vie du patient — **santé mentale, un diagnostic, une peur** — viennent de quitter le cabinet **en clair**, vers un serveur que vous ne contrôlez pas.

---

# On a déraillé trois fois

<div class="cols">
<div class="col card bad">

### Aucun consentement
On n'a jamais demandé au patient si un fournisseur d'IA ou un hyperscaler, pouvait lire sa consultation.

</div>
<div class="col card bad">

### Aucun contrôle
Rétention, journalisation, **entraînement sur vos données** — décidés par les conditions d'utilisation de quelqu'un d'autre.

</div>
<div class="col card bad">

### Aucune couverture
Sous la **nLPD & le secret médical**, c'est le *médecin* qui est responsable — pas le fournisseur.

</div>
</div>

<br>

<span class="muted">« Chiffré en transit » n'est pas la même chose que « le patient décide qui lit quoi ».</span>

---

<!-- _class: lead -->

# Ce qu'on essaie de vous vendre

<div class="cols" style="margin-top:0.5em">
<div class="col"><p class="huge">IA utile</p></div>
<div class="col" style="flex:0 0 auto; align-self:center"><p class="huge muted">vs</p></div>
<div class="col" style="text-align:right"><p class="huge">Données&nbsp;privées</p></div>
</div>

<br>

<span class="muted">Choisissez l'un ou l'autre. — Le mensonge à déconstruire.</span>

---

# Le « contrôle » comme prérequis.

<div class="cols">
<div class="col card good">

### Accès ciblé
L'IA obtient **cette note**, en lecture seule — pas tout le dossier, pas l'identité du patient.

</div>
<div class="col card good">

### Auditable
Chaque accès est une délégation que vous pouvez **voir** — une confiance vérifiable, pas seulement espérée.

</div>
<div class="col card good">

### Révocable
L'accès est un octroi explicite — il peut donc être **retiré**. Un consentement qui peut changer d'avis.

</div>
</div>

---

<p class="big">Une couche de données médicales <strong>chiffrée de bout en bout</strong> où chaque acteur — médecin, patient, appareil, <span style="color:#00B1FF">et service d'IA</span> — est un <strong>propriétaire de données</strong>.</p>


<span class="muted">L'IA n'obtient pas de porte dérobée. Elle obtient une clé de porte d'entrée que le patient peut reprendre.</span>

---

# Du scribe sauvage …

<div class="flow" style="font-size:24px">
<div class="node">🩺 Médecin</div>
<span class="arrow bad">▶</span>
<div class="node bad">🎙️ Transcription en clair</div>
<span class="arrow bad">▶</span>
<div class="node bad">☁️ Cloud du fournisseur</div>
</div>

<br>

- Le patient n'est **pas** dans le schéma
- La clé des données appartient au **fournisseur**
- Révoquer = écrire au support... en espérant

<br>

<span class="danger">Les données ont quitté le cabinet, et le patient n'a jamais détenu la clé.</span>

---

# … au scribe dressé

<div class="flow" style="font-size:23px">
<div class="node">🩺 Médecin</div>
<span class="arrow">▶</span>
<div class="node cardinal">🔐 Note chiffrée</div>
<span class="arrow">▶</span>
<div class="node cardinal">👤 Le patient détient une clé</div>
</div>
<div class="flow" style="font-size:23px; margin-top:14px; margin-left:120px">
<span class="arrow">└▶</span>
<div class="node cardinal">🤖 Scribe IA — délégation ciblée, révocable</div>
</div>

<br>

- Le patient est un **propriétaire de données de plein droit**
- L'IA ne voit la note chiffrée **que** parce qu'on lui a accordé l'accès
- Retirez la délégation → l'IA est de nouveau exclue

---

# L'IA: un propriétaire de données de plus

<p class="medium">Aucun cas particulier. Aucune nouvelle hypothèse de confiance.</p>

Le scribe IA reçoit l'accès **exactement de la même manière** que vous partageriez une note avec un spécialiste :

<div style="margin-top:0.6em">
<span class="tag">lecture seule</span>
<span class="tag">le contenu de la note — pas l'identité du patient</span>
<span class="tag">aucun identifiant secret superflu</span>
<span class="tag">explicite, donc révocable</span>
</div>

---

# Donner c'est donner, reprendre c'est contrôler

<div class="cols">
<div class="col">

L'accès à la note est une **délégation explicite** dans le graphe de chiffrement de Cardinal.

- Rien n'est partagé par défaut
- Chaque délégataire est nommé
- Supprimez la délégation / faites tourner la clé d'échange → l'accès **disparaît**

</div>
<div class="col" style="text-align:center">

![w:240](assets/decrypt.svg)

<span class="muted">Un consentement qui peut être retiré, c'est tout l'enjeu.</span>

</div>
</div>

---

# Une confiance vérifiable

<div class="cols">
<div class="col card good">

### Auditabilité
Qui a touché cette note ? Ce n'est pas une promesse de fournisseur dans un PDF — c'est une **délégation que vous pouvez énumérer**.

</div>
<div class="col card good">

### Révocation
« Cessez d'utiliser mes données pour l'IA » n'est plus un ticket de support, mais un **changement d'état** dans le dossier.

</div>
</div>

<br>

<p class="medium">La cryptographie au centre de la politique d'accès</p>

---

# C'est aussi ainsi que vous restez conforme

<div class="cols">
<div class="col card">

### nLPD
La minimisation des données et la limitation des finalités sont le **défaut**, pas une case à cocher — vous partagez le minimum, explicitement.

</div>
<div class="col card">

### Secret médical
Le texte en clair ne quitte jamais les personnes légalement autorisées à le détenir (art. 321 CP).

</div>
<div class="col card">

### AI Act européen
Vous pouvez montrer **exactement** quelles données le système d'IA a traitées, et prouver que le patient les a gouvernées.

</div>
</div>

<br>

<span class="muted">La conformité n'est plus ce qui bloque votre IA mais le socle de votre couche de données.</span>

---

# Le scribe n'est que l'ouverture

<div class="cols">
<div class="col">

- 🤖 **Assistant patient** — le patient accorde à *son propre* assistant l'accès à *son propre* dossier
- 🧭 **Aide à la décision** — des données structurées, déchiffrables sur l'appareil, ancrent le modèle
- 📅 **Rappels proactifs** — parcourir les dossiers du cabinet pour repérer qui doit être dépisté

</div>
<div class="col" style="text-align:center">

![w:260](assets/encrypt.svg)

</div>
</div>

<br>

<span class="muted">Mêmes propriétaires de données. Mêmes délégations. Même révocabilité. Un seul modèle, tous les cas d'usage.</span>

---

# Ce que vous n'avez pas à construire

<p class="big">L'IA, c'est les 20 % excitants.<br>La couche de données, c'est les 80 % difficiles.</p>

<div style="margin-top:0.4em">
<span class="tag">chiffrement de bout en bout</span>
<span class="tag">gestion & récupération des clés</span>
<span class="tag">consentement & partage granulaire</span>
<span class="tag">audit & contrôle d'accès</span>
<span class="tag">synchronisation multi-appareils</span>
<span class="tag">2FA, rôles utilisateurs</span>
<span class="tag">modèle médical structuré</span>
</div>

<br>

<span class="muted">Cardinal livre les 80 % — en Kotlin, Python, TypeScript et Dart — pour que vous consacriez votre temps à l'IA.</span>


---

<!-- _class: lead -->
<!-- _paginate: false -->

![w:360](assets/logo_cardinal_white.svg)

# Merci

<span class="muted">https://cardinalsdk.ch · Antoine Duchâteau · contact@icure.com</span>

---

<!-- _backgroundColor: '#0B1F33' -->

<span class="kicker">Annexe · pour les questions</span>

# Sous le capot : zero-trust par conception

- **Le chiffrement E2E ne suffit pas** — Cardinal ajoute des *délégations sécurisées* et un *graphe de délégation* pour un accès prouvable et contraint
- **Partage de données anonyme** — partager avec un propriétaire de données sans révéler *à quel* patient un dossier appartient
- **Récupération & vérification des clés** — les clés peuvent être récupérées et vérifiées mutuellement, sans faire confiance au serveur
- **Propriétaires de données hiérarchiques** — modéliser un cabinet/service pour que le partage passe à l'échelle sans diffusion par médecin
- **Contrôle d'accès strict** — une délégation enfant ne peut jamais dépasser la permission de son parent

<br>

<span class="muted">Voir : Explications → Chiffrement de bout en bout → Délégations sécurisées & stratégies cryptographiques.</span>
