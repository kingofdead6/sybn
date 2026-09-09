# DESIGN.md — Momentum

The design system for أبسط · SIYB. **Every visual change must conform to this file.**

> **Thesis** — SIYB helps people start and grow a business; the site should feel like
> that: confident, forward-moving, built for people taking action. Authority comes from
> clarity and craft, not from decoration — a clean ground, one strong accent, real
> elevation, and a single signature motif that reads as "ascent."

> **Changelog** — this replaces the previous direction, "الأرشيف / The Register"
> (warm paper, oxblood accent, near-square radii, a visible rule grid, rotated
> marginalia tags). See §9 for what was explicitly retired and why.

---

## 1. The one-accent rule

**`--c-accent` (cobalt) is the only accent colour on the site.** It marks the single
dominant action or state on a screen. If two things on one screen are both accent-
coloured, one of them is wrong.

**Carve-out:** the Ascent Edge gradient pair (`--c-accent-edge-from/to`, §5) is not a
second competing accent — it exists only as the signature device's small, fixed-size
tick, never as a button, link, or focus state. If you're tempted to reach for the
gradient anywhere else, use `--c-accent` instead.

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
| `--c-bg` | `#F7F8FA` | Page — clean off-white, cool not warm paper |
| `--c-surface` | `#FFFFFF` | Raised panel / card |
| `--c-sunk` | `#EEF1F5` | Inset well, table header |
| `--c-ink` | `#10151F` | Primary text, headings, near-black |
| `--c-ink-soft` | `#333B49` | Secondary headings |
| `--c-muted` | `#667085` | Meta, captions, disabled label |
| `--c-rule` | `#E1E5EB` | Hairline — a flat separator, not the primary structural device |
| `--c-rule-strong` | `#C7CDD8` | Emphasised divider |
| `--c-accent` | `#2454F0` | **The one accent.** Cobalt — CTA, active state, links |
| `--c-accent-deep` | `#1B3FC4` | Accent hover / pressed |
| `--c-accent-wash` | `#E8EDFF` | Accent-tinted background wash |
| `--c-on-accent` | `#FFFFFF` | Text on accent |
| `--c-success` | `#1B8A5A` | Valid certificate, confirmation |
| `--c-error` | `#C22A2A` | Error, revoked, destructive |
| `--c-warning` | `#92620A` | Caution, "full" state |
| `--c-error-wash` | `#FBEAEA` | Error message background |
| `--c-success-wash` | `#E7F5EE` | Success message background |
| `--c-on-ink` | `#F7F8FA` | Text on the dark bands (CTA, footer) |
| `--c-track-gyb` | `#3E7A46` | Categorical: GYB track |
| `--c-track-syb` | `#B2660A` | Categorical: SYB track |
| `--c-track-iyb` | `#2C6FA6` | Categorical: IYB track |
| `--c-accent-edge-from` | `#2454F0` | Ascent Edge gradient start — signature device only |
| `--c-accent-edge-to` | `#57B8FF` | Ascent Edge gradient end — signature device only |

### Dark

Dark mode is achieved **by redefining these same tokens** — never by per-component
overrides. `--c-bg` becomes `#0B0E14` (near-black, cool not neutral), the accent lifts
to `#5B8DFF` to stay legible, and the track colours lighten. See `tokens.css`.

### Contrast — verify before shipping a new colour

Every foreground/background pairing must meet **WCAG AA** in both modes (4.5:1 body,
3:1 for large text and categorical markers). `--c-warning` and `--c-track-syb` were
darkened during design specifically to pass AA on light backgrounds — **do not revert
these to a punchier, failing amber.** Any new colour pair must be checked before it
ships, the same discipline as before.

---

## 3. Typography

Arabic is the primary language and was chosen **first**; the Latin faces follow it.

| Role | Arabic | Latin |
|---|---|---|
| Display | **Cairo** 600/700/800/900 | **Space Grotesk** 500/700 |
| Body | **IBM Plex Sans Arabic** 300/400/500/600 | **Inter** 400/500/600 |

Space Grotesk has a full weight range and no size floor — unlike the old Instrument
Serif, it can be used at any size and weight. Inter is adopted here as the **Latin body
face only** (not display) — a confident grotesk carries the display role instead.

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
`--c-muted`. This is a Latin typographic device — Arabic is uncased and letterspacing
breaks joined letterforms, so `.btn-label`/`.caps-label` apply only under `html[dir='ltr']`.

---

## 4. Spacing, radii, borders, shadows

**Spacing** — 4px base: `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 24 · `6` 32 ·
`7` 48 · `8` 64 · `9` 96 · `10` 128.

Section vertical rhythm must **vary**. Do not give every section `py-24`. Alternate
between `--space-8`, `--space-9` and `--space-10` so the page has cadence.

**Radii — soft-modern, not maximalist.**

| Token | Value | Use |
|---|---|---|
| `--radius-none` | 0 | Full-bleed bands, table cells |
| `--radius-sm` | 8px | Inputs, small controls, table cells |
| `--radius-md` | 12px | **The default workhorse** — cards, panels, buttons |
| `--radius-lg` | 20px | Large surfaces — hero media, modals, mega-menu panels |
| `--radius-pill` | 999px | Pills and avatars |

Real rounding is part of this identity — but stay disciplined: don't reach for a
rounder tier than the scale defines, and don't introduce a fifth tier. `rounded-lg` is
the ceiling.

**Borders** — hairlines (`--border-hairline`, 1px `--c-rule`) still exist, but as flat
**separators** (table rows, list dividers, a header's resting-state bottom edge) — not
as the primary way a card reads as "raised." That job now belongs to shadow.

**Shadows — real elevation, not sparing.** `--shadow-raised` is the default resting
state for **every card** — this is the single biggest shift from the old system, where
a card was defined by its rule and shadows were exceptional. `--shadow-md` is the
hover/interactive-lift state for clickable cards and dropdown panels. `--shadow-overlay`
is reserved for modals, the open mega-menu, and toasts. A hairline (`border-rule/60`) is
still fine as a crisp 1px edge-definer alongside the shadow — it's just no longer the
primary definer.

---

## 5. Structure — the Ascent Edge

The signature device is the **Ascent Edge**: a short vertical gradient tick
(`--c-accent-edge-from` → `--c-accent-edge-to`), paired with a horizontal caps-label,
that grows into place once scrolled into view. It reads as a "growth tick" — an upward
mark, appropriate to an organisation whose whole purpose is helping people grow a
business.

- Component: `<AscentEdge label="…" />` in `components/motion/AscentEdge.jsx`. Used as
  the eyebrow for `Section`'s `label` prop, in the Hero's headline block, and on major
  section openers.
- Positioned with logical `inset-inline-start` — it mirrors correctly in RTL for free,
  no rotation or override needed (unlike the old marginalia's `rotate(180deg)` hack).
- Animates once on scroll (`scaleY(0)` → `scaleY(1)`), riding the same
  reduced-motion/forced-visibility safety net as `Reveal` — under
  `prefers-reduced-motion: reduce` it renders at full size immediately, never hidden.
- **Small and fixed-size, always.** The gradient is a tick, never a background, blob,
  glow, or mesh — see §9.
- Not everything gets one. Reserve it for section openers and genuinely singular
  emphasis (a featured card, the Hero headline) — the old trap of decorating everything
  identically is exactly what this device must avoid.

There is no visible background rule-grid and no rotated marginalia tag in this system —
both are retired outright (§9). Layout asymmetry (an 7/5 or 4/8 column split, for
example) is still a good, deliberate composition tool; it was never tied to the old
aesthetic and needs no replacement.

---

## 6. Motion

- **Interaction** (hover, focus, open/close): **150–250ms**, `--ease-out`
  (`cubic-bezier(0.2, 0, 0, 1)`).
- The hero gets one orchestrated entrance on first load.
- **Scroll reveals** are used throughout. They run **once** per element (never on
  scroll-back), at **450–600ms** on the same easing curve.
  - All of them go through `components/motion/Reveal` (or `AscentEdge`, which follows
    the same rules). Do not hand-roll a scroll animation; extend these instead.
  - Both carry a safety net: if an element reaches the fold without the observer
    firing (anchor jump, restored scroll, fast flick), it shows itself. A decorative
    effect must never be able to hide content permanently.
  - Offsets stay small: **≤28px**, and expressed with `start`/`end` rather than
    left/right so the motion mirrors correctly in RTL. Content settles into
    place; it does not fly in.
  - Never animate scale, rotation, or blur on a section. No parallax on text.
  - Sideways reveals apply only at `lg` and above, where the columns actually
    sit side by side. Below that they become a vertical settle.
  - Pair a column with its facing column using a small `delay` (~0.08s) rather
    than revealing every element on its own timer.
- Every animation must respect `prefers-reduced-motion: reduce`. Under reduce,
  the reveal components render **plain markup with no opacity or transform** —
  content is never left hidden, faded, or offset.

## 7. Focus & states

Focus is **always visible**: `--shadow-focus` is a 2px `--c-accent` ring at 2px offset.
Never remove an outline without replacing it.

Every interactive component must define: `hover`, `focus-visible`, `active`, `disabled`,
and where applicable `loading`, `empty`, and `error`.

---

## 8. Hard rules

0. **The token set is the whole vocabulary.** No transitional aliases, no dead names.
1. **No hex values outside `tokens.css`.** No arbitrary Tailwind colour values.
   `grep -rE "#[0-9a-fA-F]{6}" client/src --exclude=tokens.css` must return nothing.
2. **No raw `white/`, `black/`, `bg-white`, `text-black`** utilities — use tokens.
3. **Logical properties only** — `ms/me/ps/pe/start/end`. Never `ml/mr/left/right`.
   The site is RTL by default; a directional slip is a real bug.
4. **One accent**, with the Ascent Edge carve-out. See §1.
5. **Preserve `#main-content` and `#programs-ladder`** — the skip link and the hero CTA
   target depend on them.
6. **Never alter user-facing copy or i18n keys** while restyling. Content lives in
   `client/src/i18n/locales/**` and in the bilingual `{ar, en}` fields in MongoDB.
7. **Cards are shadow-defined, not rule-defined.** A card without `shadow-raised` (or an
   equivalent elevation) is a bug in this system, not a stylistic variant.

## 9. Explicitly rejected

Purple/indigo/violet gradients as backgrounds · gradient blobs, glow orbs, mesh
backgrounds (the Ascent Edge's small fixed-size tick is not an exception — don't extend
it into one) · glassmorphism / backdrop-blur as a general style · the pill-badge →
centred h1 → centred subtitle → two centred buttons hero · uniform 3-column icon-card
grids · emoji as icons · reaching for a rounder tier than the radius scale defines
(`rounded-lg`/20px is the ceiling) · scroll animation on *every* element, long travel
distances, scale/rotate/blur reveals, parallax text, or effects that replay on every
scroll-back (see §6 for what is allowed) · more than one accent competing for attention.

### Retired from the previous system (not carried forward)

- Near-square radii and "nothing is very rounded" — replaced outright by §4's scale.
- "A card is defined by its rule, not its shadow" — inverted; see §4 and §8.7.
- The visible background rule-grid and the rotated marginalia tag — replaced by the
  Ascent Edge, §5.
- Instrument Serif's "400 only, never below 24px" caveat — Space Grotesk has no such
  restriction.
- Paper grain texture (`.grain`) — dropped as a deliberate simplification; negative
  space and shadow-based depth carry the identity instead. Not reintroduced.
