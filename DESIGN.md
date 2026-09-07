# DESIGN.md — الأرشيف / The Register

The design system for أبسط · SIYB. **Every visual change must conform to this file.**

> **Thesis** — A national records office that happens to be beautifully typeset. This
> platform *issues credentials*; it is not a startup selling courses. Authority comes
> from restraint and rigorous structure, not from decoration.

---

## 1. The one-accent rule

**`--c-accent` (oxblood) is the only accent colour on the site.** It marks the single
dominant action or state on a screen. If two things on one screen are both accent-
coloured, one of them is wrong.

The three SIYB brand colours (green / amber / blue) are **categorical, not decorative**.
They exist solely to identify which programme *track* something belongs to, and appear
only as:

- an edge rule on a track band,
- a track numeral or marker,
- a small track pill.

They must **never** be used for buttons, links, focus rings, or general emphasis, and
never as a full-bleed background fill. The SIYB logo keeps its own arcs; that is the
only place the brand colours appear together.

---

## 2. Colour tokens

### Light (default)

| Token | Hex | Role |
|---|---|---|
| `--c-bg` | `#F4F2ED` | Page — warm paper, deliberately not white |
| `--c-surface` | `#FBFAF7` | Raised panel / card |
| `--c-sunk` | `#EAE7DF` | Inset well, table header, code block |
| `--c-ink` | `#1A1815` | Primary text, headings |
| `--c-ink-soft` | `#3A362F` | Secondary headings |
| `--c-muted` | `#6B665C` | Meta, captions, disabled label |
| `--c-rule` | `#D8D3C8` | Hairline rules, borders, the grid |
| `--c-rule-strong` | `#B9B2A4` | Emphasised divider |
| `--c-accent` | `#8A2617` | **The one accent.** CTA, active state, stamp |
| `--c-accent-deep` | `#6E1D12` | Accent hover / pressed |
| `--c-accent-wash` | `#F3E7E4` | Accent-tinted background wash |
| `--c-on-accent` | `#FDFCFA` | Text on accent |
| `--c-success` | `#3F6B4A` | Valid certificate, confirmation |
| `--c-error` | `#9B2C2C` | Error, revoked, destructive |
| `--c-warning` | `#7E621B` | Caution, "full" state |
| `--c-error-wash` | `#F6E9E9` | Error message background |
| `--c-success-wash` | `#E8EFE9` | Success message background |
| `--c-on-ink` | `#F4F2ED` | Text on the dark bands (CTA, footer) |
| `--c-track-gyb` | `#5C7A3D` | Categorical: GYB track |
| `--c-track-syb` | `#A66418` | Categorical: SYB track |
| `--c-track-iyb` | `#2F5D7C` | Categorical: IYB track |

### Dark

Dark mode is achieved **by redefining these same tokens** — never by per-component
overrides. `--c-bg` becomes `#151311` (warm dark, not neutral black), the accent lifts
to `#E8695A` to stay legible, and the track colours lighten. See `tokens.css`.

### Contrast — verified, not assumed

All 27 foreground/background pairs meet **WCAG AA** in both modes (4.5:1 body, 3:1 for
large text and categorical markers). Verified numerically; lowest passing pair is
`muted on sunk` at 4.62:1.

Two colours were **darkened during design** because the original values failed:
`--c-warning` `#8A6D1F → #7E621B` (was 4.38:1) and `--c-track-syb` `#B5701C → #A66418`
(white-on-it was 3.96:1). **Do not revert these to the "prettier" originals.**

Any new colour pair must be checked before it ships.

---

## 3. Typography

Arabic is the primary language and was chosen **first**; the Latin faces follow it.

| Role | Arabic | Latin |
|---|---|---|
| Display | **Almarai** 700 / 800 | **Instrument Serif** 400 |
| Body | **IBM Plex Sans Arabic** 300/400/500/600 | **IBM Plex Sans** 400/500/600 |

> **Instrument Serif ships at weight 400 only.** It is a display face designed for large
> sizes — never request 600/700 from it, and never use it below ~24px.

The `.font-display` class switches face automatically with document direction.

### Scale — 1.250 (Major Third)

| Token | px | Use |
|---|---|---|
| `--text-2xs` | 11 | Marginalia labels, small caps |
| `--text-xs` | 12 | Meta, table meta |
| `--text-sm` | 14 | Secondary body, captions |
| `--text-base` | 16 | Body |
| `--text-md` | 20 | Lead paragraph |
| `--text-lg` | 25 | Card / sub-section heading |
| `--text-xl` | 31 | Section heading |
| `--text-2xl` | 39 | Page heading |
| `--text-3xl` | 49 | Hero (mobile) |
| `--text-4xl` | 61 | Hero (desktop) |

**Numerals are tabular everywhere numbers carry meaning** — stats, seats, prices,
certificate numbers, table columns, pagination. Use `.numerals` (`font-variant-numeric:
tabular-nums`). Arabic UI renders Arabic-Indic digits; English UI renders Latin.

### Small caps convention

Eyebrow/marginalia labels are `--text-2xs`, uppercase, `letter-spacing: 0.14em`,
`--c-muted`. This treatment is reserved for **marginalia only** (§5) — it is not a
general-purpose eyebrow above every heading, which is a pattern this design rejects.

---

## 4. Spacing, radii, borders, shadows

**Spacing** — 4px base: `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 24 · `6` 32 ·
`7` 48 · `8` 64 · `9` 96 · `10` 128.

Section vertical rhythm must **vary**. Do not give every section `py-24`. Alternate
between `--space-8`, `--space-9` and `--space-10` so the page has cadence.

**Radii** — deliberately near-square; this is printed matter, not a mobile app.

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Bands, rules, table cells — the default |
| `--radius-sm` | 2px | Inputs, panels, cards |
| `--radius-md` | 3px | Modal |
| `--radius-pill` | 999px | **Pills and avatars only** |

**`rounded-2xl` and friends are forbidden.** Nothing on this site is softly rounded by
default.

**Borders** — the primary structural device. `--border-hairline` (1px `--c-rule`) is how
things are separated. Prefer a rule over a shadow, always.

**Shadows** — used *sparingly*, and only for genuine elevation (modal, open dropdown).
`--shadow-raised` and `--shadow-overlay` exist; there is deliberately no "soft shadow on
every card". A card is defined by its **rule**, not its shadow.

---

## 5. Structure — the visible rule grid

The organising idea is a **12-column grid whose rules are visible**, not an invisible
centred container.

- Content spans *named column ranges* (2–7, 6–12), producing intentional asymmetry.
  Sections must not all be "centred container, equal padding".
- Section boundaries are **1px rules**, not whitespace alone.
- One dominant element per screen; everything else clearly subordinate.
- Optical alignment beats mathematical alignment where they differ.

### Signature detail — margin marginalia

Every major section carries a rotated, small-caps, letter-spaced label pinned in the
**outer margin**, sitting outside the text column against the grid — like a ledger tab:

```
الملتقيات ٠٤   /   FORUMS 04
```

Rules:
- `writing-mode: vertical-rl`, `--text-2xs`, `letter-spacing: 0.14em`, `--c-muted`.
- Pinned to the **outer** margin — it mirrors automatically in RTL via logical properties.
- `aria-hidden="true"` — it is decorative; the real heading carries the semantics.
- **Hidden below `lg`.** There is no outer margin on a phone; do not squeeze it in.
- Nothing else on the site uses vertical text. That exclusivity is the point.

---

## 6. Motion

- **Interaction** (hover, focus, open/close): **150–250ms**, `--ease-out`
  (`cubic-bezier(0.2, 0, 0, 1)`).
- The hero gets one orchestrated entrance on first load.
- **Scroll reveals** are used on the home page. They run **once** per element
  (never on scroll-back), at **450–600ms** on the same easing curve.
  - All of them go through `components/motion/Reveal`. Do not hand-roll a
    scroll animation; extend that component instead.
  - `Reveal` carries a safety net: if its element reaches the fold without the
    observer firing (anchor jump, restored scroll, fast flick), it shows itself.
    A decorative effect must never be able to hide content permanently.
  - Offsets stay small: **≤28px**, and expressed with `start`/`end` rather than
    left/right so the motion mirrors correctly in RTL. Content settles into
    place; it does not fly in.
  - Never animate scale, rotation, or blur on a section. No parallax on text.
  - Sideways reveals apply only at `lg` and above, where the columns actually
    sit side by side. Below that they become a vertical settle — a horizontal
    offset on a stacked layout overflows the viewport.
  - Pair a column with its facing column using a small `delay` (~0.08s) rather
    than revealing every element on its own timer.
- Every animation must respect `prefers-reduced-motion: reduce`. Under reduce,
  the reveal components render **plain markup with no opacity or transform** —
  content is never left hidden, faded, or offset.

> Scroll reveals were originally rejected here. That was overruled deliberately;
> the constraints above are what keep them from becoming the "everything flies
> in on scroll" pattern §9 still rejects.

## 7. Focus & states

Focus is **always visible**: `--shadow-focus` is a 2px `--c-accent` ring at 2px offset.
Never remove an outline without replacing it.

Every interactive component must define: `hover`, `focus-visible`, `active`, `disabled`,
and where applicable `loading`, `empty`, and `error`.

---

## 8. Hard rules

0. **The token set is now the whole vocabulary.** The transitional aliases used
   during the migration (`--c-paper`, `--c-saffron`, `--c-line`, `bg-accent-green`…)
   have been removed. Use only the names in §2.
1. **No hex values outside `tokens.css`.** No arbitrary Tailwind colour values.
   `grep -rE "#[0-9a-fA-F]{6}" client/src --exclude=tokens.css` must return nothing.
2. **No raw `white/`, `black/`, `bg-white`, `text-black`** utilities — use tokens.
3. **Logical properties only** — `ms/me/ps/pe/start/end`. Never `ml/mr/left/right`.
   The site is RTL by default; a directional slip is a real bug.
4. **One accent.** See §1.
5. **Preserve `#main-content` and `#programs-ladder`** — the skip link and the hero CTA
   target depend on them.
6. **Never alter user-facing copy or i18n keys** while restyling. Content lives in
   `client/src/i18n/locales/**` and in the bilingual `{ar, en}` fields in MongoDB.

## 9. Explicitly rejected

Purple/indigo/violet gradients · navy `#0F172A` · gradient blobs, glow orbs, mesh
backgrounds · glassmorphism / backdrop-blur as a general style · the pill-badge →
centred h1 → centred subtitle → two centred buttons hero · uniform 3-column icon-card
grids · emoji as icons · Inter / Poppins / Montserrat as display · blanket `rounded-xl`
· soft shadows on everything · scroll animation on *every* element, long travel
distances, scale/rotate/blur reveals, parallax text, or effects that replay on every
scroll-back (see §6 for what is allowed) · more than one accent competing for attention.
