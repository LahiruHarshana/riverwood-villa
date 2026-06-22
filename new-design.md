# Riverwood Villa — Cinematic Redesign Guide

> A complete, step-by-step design & motion blueprint for rebuilding every section **below the Hero** so that scrolling the page feels like watching a slow, elegant film. **No implementation code** — this is the creative + technical direction an AI (or you) follows to build it.

---

## 0. Ground Rules (read first)

1. **The Hero section stays 100% untouched.** Do not edit `.hero`, the loader, `HeroLogo`, `LoaderMark`, `settleHeroReveal`, the nav reveal that the loader drives, or any `data-loader="*"` element. Everything from `<section className="hero">` upward is frozen.
2. **Everything below the Hero is demolished and rebuilt** — About, Sticky Scroll, Projects, Sustainability, Service, Journal/Gallery, Quote, CTA/Contact, Footer. Keep the section `id`s (`#about`, `#project`, `#sustainability`, `#service`, `#journal`, `#contact`) so the existing nav + Lenis anchor scrolling keeps working.
3. **Light theme only.** Every rebuilt section uses `data-theme="light"`. No dark sections (the Hero remains the only `dark` block). This keeps the existing nav theme-switching logic happy.
4. **Strict typography.** Only two families, both already loaded in `app/layout.tsx`:
   - **Bodoni Moda** → `--font-display` (also exposed as `--font-serif`). All display headlines, numerals, editorial accents. Use its **italic** for emotional emphasis.
   - **Manrope** → `--font-body` (also `--font-sans`). All body copy, labels, captions, UI, nav.
   - No third font. No icon-font substitutes for type.
5. **Keep the motion stack.** Continue using **GSAP + ScrollTrigger + Lenis** (already installed). Do not swap libraries. Keep the custom cursor, magnetic buttons, and velocity-skew utilities — they reinforce the cinematic feel.
6. **Respect `prefers-reduced-motion`.** The page already has a reduced-motion branch; every new animation must have a static, fully-legible fallback.

---

## 1. The Core Idea — "Scroll = Playhead"

The brief is *"scrolling feels like watching a video playing."* That is a specific, achievable technique, not a vibe. It rests on five mechanics:

| Mechanic | What it does | Where to use it |
|---|---|---|
| **Scrubbed timelines** (`scrub: true`) | Ties animation progress directly to scroll position, so motion plays forward when scrolling down and *rewinds* when scrolling up — exactly like dragging a video scrubber. | The signature moments: Sticky Scroll, Projects, Gallery, CTA. |
| **Pinning** (`pin: true`) | Freezes a section in the viewport while the scroll distance is "spent" advancing an internal timeline. The page stops translating and a *scene* plays instead. | One pinned "set piece" per major beat (max 3–4 on the page so it never feels stuck). |
| **Continuous through-line** | A persistent visual element (background tone, a thin progress line, a recurring numeral) carries across section boundaries so cuts feel like edits in one film, not separate pages. | Global layer behind all sections. |
| **Sequenced reveals** | Type, images, and lines enter in a deliberate choreographed order with overlap — never all-at-once. | Every section's entrance. |
| **Eased, slow timing** | Long durations (0.9–1.6s) and expressive easings (`expo`, `power4`) read as "cinematic." Snappy UI easing is forbidden here. | All of it. |

**Golden rule:** the reader should never see a hard "page jump." Smooth Lenis scrolling + scrubbed/pinned scenes means the eye is always being *guided*, like a camera move.

---

## 2. Design System

### 2.1 Typography roles (Bodoni Moda + Manrope only)

Build a single, strict type scale. Express every heading through Bodoni, every functional/reading element through Manrope.

| Token | Family | Size (clamp) | Weight / style | Tracking | Used for |
|---|---|---|---|---|---|
| **Display XL** | Bodoni Moda | `clamp(3.5rem, 9vw, 11rem)` | 500 | `-0.02em` | Pinned scene words ("Balcony Mornings"), CTA headline |
| **Display L** | Bodoni Moda | `clamp(2.4rem, 5vw, 5rem)` | 500, italic option | `-0.015em` | Section headlines (About, Sustainability, Quote) |
| **Display M** | Bodoni Moda | `clamp(1.6rem, 2.6vw, 2.6rem)` | 500 | `-0.01em` | Project titles, card titles |
| **Numeral** | Bodoni Moda | `clamp(1rem, 1.4vw, 1.4rem)` | 400 | `0` | Index counters `01 / 06`, project numbers |
| **Lead** | Manrope | `clamp(1.05rem, 1.4vw, 1.4rem)` | 400 | `0` | Intro paragraphs, lead copy |
| **Body** | Manrope | `1rem`–`1.125rem` | 400 | `0` | All reading copy |
| **Label** | Manrope | `0.7rem`–`0.8rem` | 600, uppercase | `0.18em`–`0.24em` | Eyebrows (the `(river air)` style tags), captions |
| **Nav/UI** | Manrope | `0.85rem` | 500 | `0.04em` | Buttons, footer nav |

**Editorial rules**
- Pair every Bodoni headline with a small uppercase Manrope **eyebrow label** above it (reuse the existing `.jp` parenthetical voice: `(river air)`, `(hosted calm)` …). This contrast of refined serif + tight technical label is the whole brand signature.
- Allow **one italic Bodoni word** per headline for emphasis (e.g. *river*, *slow*, *light*). Used sparingly it reads luxury; overused it reads wedding invite.
- Headlines are **balanced** (`text-wrap: balance`) and never more than ~3 lines.
- Letter-spacing on Bodoni display is slightly **negative**; on Manrope labels it is **wide**. This polarity is deliberate.

### 2.2 Color — light theme palette

Reuse the existing tokens in `globals.css` (do not invent a new palette; just use them more boldly):

| Token | Value | Role in redesign |
|---|---|---|
| `--paper` | `#f6f5f1` | Default section background |
| `--paper-raised` | `#fbfaf7` | Cards, raised panels, the "lighter" scenes |
| `--paper-sunk` | `#efede7` | Alternating sections, recessed wells, footer |
| `--ink` | `#111110` | Primary type |
| `--muted` | `rgba(17,17,16,.62)` | Secondary copy |
| `--ink-faint` | `#8c8c86` | Numerals, captions, dividers' labels |
| `--line` | `rgba(17,17,16,.12)` | Hairline rules |
| `--sage` / `--sage-deep` | `#849383` / `#5f6b5e` | The single accent — links, active states, the through-line progress bar, hover fills |
| `--sage-tint` | `#e7eae5` | Accent wash backgrounds, hover beds |

**Usage discipline**
- Backgrounds alternate **paper → paper-sunk → paper** between sections to create gentle rhythm (a soft "cut" between scenes). The transition between two adjacent tones should itself be **scrubbed** (see §3.4) so the background appears to *fade* like a film dissolve, not snap.
- **Sage is the only color.** Everything else is paper + ink. One accent, used for motion-meaningful things (the scroll progress line, current index, link underlines), makes the palette feel intentional and expensive.
- Keep the existing **film-grain overlay** (`body::before`). It's a major part of the "shot on film" feeling. Optionally lift its opacity a touch (`0.028 → 0.035`) on the rebuilt sections.

### 2.3 Spacing, grid, and shape

- **Column system:** a 12-column grid with `--gutter` (already `clamp(1rem, 3vw, 3rem)`). Design every section against it; asymmetry (content pulled to 7 of 12 columns, image bleeding the other 5) is what makes editorial layouts feel designed rather than templated.
- **Vertical rhythm:** generous. Section padding block `clamp(6rem, 12vh, 12rem)`. Cinematic = breathing room; never crowd.
- **Radius:** keep it minimal — `--radius-sm` (2px) for cards/images. Sharp corners read architectural and premium; avoid pill/rounded everything.
- **Image treatment:** every image lives inside a clip frame so it can be revealed by an animated mask. Images are **desaturated ~10–15% at rest and bloom to full saturation on reveal** — a subtle "film developing" cue.
- **Hairlines:** thin `--line` rules that **draw themselves** (scaleX 0→1) are a recurring motif separating scenes.

### 2.4 Motion tokens (define once, reuse everywhere)

Standardize timing so the whole page feels like one edit, not many hands.

| Token | Value | Meaning |
|---|---|---|
| Ease — reveal | `power4.out` | Type & element entrances (decelerate hard) |
| Ease — cinematic | `expo.inOut` | Big masks, pinned scene moves, dissolves |
| Ease — drift | `none` (linear) | Anything `scrub`-bound (parallax, scrubbed timelines) |
| Dur — micro | `0.6s` | Small fades, buttons |
| Dur — standard | `1.0–1.2s` | Most reveals |
| Dur — hero-of-scene | `1.3–1.6s` | Mask wipes, headline reveals |
| Stagger — words | `0.02–0.04s` | Per-word text reveals |
| Stagger — items | `0.06–0.10s` | Grids, lists, numerals |
| Lenis `lerp` | keep `0.08` | The "weight" of the smooth scroll |

---

## 3. Global Motion Architecture

Before any section, set up the connective tissue that makes it a "film."

### 3.1 Keep Lenis as the transport
Smooth inertial scrolling is non-negotiable for the video feel. Keep the current Lenis config (`lerp 0.08`, `smoothWheel`, `wheelMultiplier 0.88`) and its `gsap.ticker` driving + `ScrollTrigger.update` binding. Everything below assumes Lenis is the scroll engine.

### 3.2 One ScrollTrigger philosophy
- **Entrances** (type, lines, images appearing) use `once: true` triggers — they play once and stay. Crisp, not distracting.
- **Scenes & parallax** use `scrub: true` triggers — bound to the playhead, they scrub both directions. This is where the "video" lives.
- Never mix: an element either *arrives* (once) or *is scrubbed* (continuous). Mixing makes motion feel buggy.

### 3.3 The persistent through-line (the "one film" trick)
Add a **fixed, thin vertical progress indicator** (1px sage line on the left or right margin, with a small Bodoni numeral or percentage) that fills based on total page scroll progress. It is the single element proving every section is one continuous reel. It also doubles as a chapter indicator: as each section enters, the numeral ticks `01 → 02 → 03…` with a quick roll animation. Hide on mobile.

### 3.4 Background dissolves between scenes
For each section boundary where the paper tone changes, drive the background color of a **fixed full-screen layer** with a scrubbed trigger spanning the seam (start: previous section bottom near viewport bottom, end: next section top near viewport top). The tone cross-fades over ~60vh of scroll. Result: the page background appears to *dissolve* between shots instead of cutting. This single technique does more for "cinematic" than any individual animation.

### 3.5 Velocity & camera cues (keep + extend)
- Keep **velocity skew** (`data-skew`) on gallery/image blocks — fast scrolling subtly shears the image like motion blur, then settles. Pure cinema.
- Keep **magnetic buttons** (`data-magnetic`) and the **custom cursor** — on links/cards the cursor ring can grow and show a tiny label ("view", "open") to feel like an interactive film UI.

---

## 4. Section-by-Section Redesign

For each section: **the concept**, a rough **layout mock**, **typography**, and the **scroll scene** (Enter → Scrub → Exit beats). Build them in the order listed.

> Notation: `[IMG]` = image/clip frame · `▢` = mask cover · `→` = direction of travel · "scrub" = tied to playhead · "once" = plays once on enter.

---

### Section 1 — About / Intro (`#about`)

**Concept:** The opening title card of the film. Maximum restraint: a single editorial headline split across the grid, one calm image breathing in, a thin rule drawing itself. Sets the slow tempo.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ (river air) ── Riverside              [eyebrow]│
│                                                │
│  A private villa                               │
│  wrapped in  river  air.        ← Display L     │
│                          ┌──────────────────┐  │
│   Riverwood keeps the    │                  │  │
│   first impression       │      [IMG]       │  │
│   simple… → About Us      │   (portrait)     │  │
│                          └──────────────────┘  │
│ ───────────────────────────────────────────────│ ← rule draws L→R
└───────────────────────────────────────────────┘
```

**Typography:** Eyebrow = Label. Headline = Display L (italicize *river*). Body = Lead. "About Us" = text-button with animated underline + ArrowUpRight.

**Scroll scene**
- **Enter (once):** eyebrow label rises (`yPercent 115→0`). Headline reveals **word-by-word** through an overflow mask (`power4.out`, stagger `0.03`). Body paragraph reveals word-by-word a beat later. The image clip-frame **wipes open** left→right (`inset 0 100% 0 0` → `0`, `expo.inOut`, 1.4s) while its inner image scales `1.18→1` and **de-blurs / saturates in**.
- **Scrub:** image has gentle parallax (`yPercent` drift) tied to section scroll so it floats as you pass.
- **Exit:** the bottom hairline draws itself L→R as the section leaves, becoming the "cut" into the next scene.

---

### Section 2 — Sticky Scroll Set-Piece (`.scroll_section`)

**Concept:** The signature cinematic moment. **Pin** the viewport and play a self-contained scene: giant Bodoni words assemble while a column of images travels behind them. This is the clearest "scroll is a video playhead" beat — keep it as the centerpiece but rebuild it cleaner.

**Layout mock (pinned stage)**
```
        pinned viewport (1 scene, ~150–200vh scroll)
┌───────────────────────────────────────────────┐
│        B A L C O N Y   M O R N I N G S          │ ← Display XL, words rise in
│        R I V E R   L I G H T                    │
│                                                │
│      [IMG] [IMG] [IMG] [IMG]   ← image track    │
│       travels upward as you scroll (scrub)      │
└───────────────────────────────────────────────┘
```

**Typography:** Display XL Bodoni, split per word. Optional: second line in italic for contrast.

**Scroll scene (all scrub-bound to a pinned timeline)**
- Pin the stage; total scroll length ≈ 1.8–2× viewport height.
- **0–25% progress:** words rise from a mask (`yPercent 112→0`, fade in) staggered, like a title sequence assembling.
- **0–100%:** the image track translates upward (`yPercent` large negative) so photos stream behind/around the type — the "camera tilt."
- **35–100%:** the word block drifts up slightly and fades to ~70% opacity, handing focus to the imagery.
- Each image also self-parallaxes (`scale 1.14→1`, slight `yPercent`) for depth.
- **Reduced motion:** no pin — show the words and a simple stacked image grid statically.

**Why pin here:** pinning *spends* scroll distance on an internal scene. The page literally stops moving while the movie plays, then releases. Use it for **at most one more** section (the CTA) so it stays special.

---

### Section 3 — Projects / Experiences (`#project`)

**Concept:** Three full-bleed editorial "chapters" (Riverside Arrival, Balcony Rituals, Hosted Dining). Each is a cinematic spread: a large image on one side, an oversized index numeral, title, and copy on the other, alternating sides per item.

**Layout mock (one item, alternating)**
```
┌───────────────────────────────────────────────┐
│ ┌────────────────────┐    (project 1)          │
│ │                    │     01 / 03   ← Numeral  │
│ │       [IMG]        │                          │
│ │   (large, clips    │    Riverside Arrival     │ ← Display M
│ │    open on enter)  │    The stay begins with… │ ← Body
│ │                    │    See project →         │
│ └────────────────────┘                          │
└───────────────────────────────────────────────┘
  next item mirrors: text left / image right
```

**Typography:** Eyebrow `(project N)`. Title = Display M, word-mask reveal. Big index numeral = Numeral token but scaled up huge and faint (`--ink-faint`) as a decorative layer behind the title. Copy = Body.

**Scroll scene (per item, `once` entrance + scrub parallax)**
- **Enter:** image clip-wipes open (`expo.inOut`, 1.3s) + inner `scale 1.18→1`. Eyebrow + numerals roll up. Title reveals word-by-word. Copy reveals word-by-word. "See project" fades up last. (This is the existing choreography — keep its quality, restyle the layout.)
- **Scrub:** image parallax `yPercent` drift as the item passes; the giant faint numeral drifts the opposite direction (counter-parallax) for depth.
- **Between items:** alternate the background tone (paper ↔ paper-sunk) with a scrubbed dissolve so each chapter feels like a new shot.

---

### Section 4 — Sustainability / Architecture (`#sustainability`)

**Concept:** An asymmetric editorial collage — one tall image, one small image, a large statement headline, a Japanese-character accent (`建築`) used purely as graphic texture. Feels like a magazine spread mid-film.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ ┌──────────┐  建築  (Ken chiku) / Architecture  │
│ │          │                                    │
│ │  [IMG    │   Designs That                     │
│ │  tall]   │   Sustain  Life      ← Display L    │
│ │          │            ┌─────────┐             │
│ └──────────┘            │ [IMG    │  Balconies, │
│                         │ small]  │  palms…     │
│                         └─────────┘  Sustain. → │
│ ───────────────────────────────────────────────│
└───────────────────────────────────────────────┘
```

**Typography:** `建築` large & faint as a watermark (Bodoni won't render kanji — keep it in a system/Manrope fallback at low opacity, treated as texture not type, OR replace with a large faint Bodoni numeral/letterform to honor the two-font rule strictly). Headline = Display L, word-mask reveal, italicize *Life*. Copy = Body.

**Scroll scene**
- **Enter:** both image frames clip-reveal on a slight offset stagger (tall first, small second). Headline word-mask reveals. Kanji/watermark fades in slowly (`0→0.08` opacity over 1.5s) as ambient texture.
- **Scrub:** the two images parallax at **different speeds** (tall slower, small faster) — the depth difference is what makes it feel like a moving camera, not a flat page.
- **Exit:** section divider hairline draws itself.

---

### Section 5 — Service (`#service`)

**Concept:** A kinetic typographic line where an image is *embedded inside the sentence* — "Precision In `[IMG]` Every Stay." The words and the inline image reveal together, like a line of a film's credits animating in.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ (hosted calm)                    Service        │
│                                                │
│   Precision  In  [IMG]  Every  Stay             │
│                   ↑ inline image clips open      │
│                                                │
│   Terrace meals, tea, and local guidance…       │
│   Our service →                                 │
└───────────────────────────────────────────────┘
```

**Typography:** Display L words on one baseline, the inline image sized to cap-height of the line. Eyebrow + "Service" label flanking. Copy = Lead.

**Scroll scene**
- **Enter:** each word rises from a mask with a subtle `rotateX` (8°→0) for a 3D "flip up" feel (keep the existing `service-word` choreography), staggered `0.07`. The inline image clip-wipes open in sequence as if it were the next "word." Copy + link follow.
- **Scrub:** very light parallax on the inline image only.
- This section is intentionally **un-pinned and quick** — a palate cleanser between the two heavier scenes.

---

### Section 6 — Journal / Gallery (`#journal`)

**Concept:** "Scroll through the stay like a film reel." Literally make it a reel: a staggered, offset grid of 6 frames that wipe in, drift with parallax, and **shear with scroll velocity** (motion-blur cue). The most overtly "video" of the static sections.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ (stay notes)                                    │
│ Scroll through the stay like a  film  reel.     │ ← Display L, italic "film"
│                                                │
│  [IMG]      [IMG ↓offset]   [IMG]               │
│  01 Warm    02 Tea          03 Rest             │
│  [IMG]      [IMG ↓offset]   [IMG]               │
│  04 Veranda 05 Sunset       06 Riverwood        │
└───────────────────────────────────────────────┘
```

**Typography:** Eyebrow + Display L heading (italicize *film*). Each frame caption = Numeral + Label (`01  Warm facade after dark`).

**Scroll scene**
- **Enter (once):** every frame clip-wipes open L→R (`power4.inOut`, 1.3s), staggered by DOM order. Columns 2 & 5 start pre-offset downward (`y: 5rem`) so the grid feels hand-composed, not gridded.
- **Scrub:** each frame's inner image scales `1.12→1` across its pass (parallax). Keep `data-skew` velocity shear on every frame.
- **Hover:** caption numeral slides, image lifts slightly, cursor ring grows — interactive reel.

---

### Section 7 — Quote / Testimonial (`.quote-section`)

**Concept:** A held, quiet beat — a large pull-quote in Bodoni that reveals **line-by-line** (not word-by-word) so it reads like end-of-act narration, paired with one calm image.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ (one meeting)                                   │
│                                                │
│   Riverwood has that rare balance               │ ← line 1 rises
│   of privacy, warmth, and                       │ ← line 2 rises
│   tropical  calm.                ┌───────────┐  │
│   The first morning on the       │   [IMG]   │  │
│   balcony was the whole reason…  │           │  │
│                                  └───────────┘  │
└───────────────────────────────────────────────┘
```

**Typography:** Quote = Display L Bodoni (lighter weight, slight italic option). Reveal in **sentence/line chunks** with a slow stagger (`0.1`) — this cadence is what makes it feel narrated.

**Scroll scene**
- **Enter:** lines rise from masks one after another (slow, `power4.out`). Image clip-reveals beside them with parallax.
- **Scrub:** image gentle drift. Background here can shift to `--paper-raised` (a brighter "spotlight" tone) via the scrubbed dissolve to signal the emotional high point.

---

### Section 8 — CTA / Contact (`#contact`)

**Concept:** The closing title card. A large invitation headline, a magnetic "Get in touch" button, flanked by two images (one small, one large with a slow scrub-zoom) — the film's final shot that slowly pushes in.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ ┌──────┐   (connect)                            │
│ │[IMG  │                                         │
│ │small]│   Bring the dates.                      │
│ └──────┘   Riverwood will  slow  the rest down.  │ ← Display XL
│            Send your dates, group size…          │
│            ⟦ Get in touch → ⟧  ← magnetic button │
│                          ┌────────────────────┐ │
│                          │      [IMG large]    │ │ ← slow scrub zoom-in
│                          └────────────────────┘ │
└───────────────────────────────────────────────┘
```

**Typography:** Eyebrow `(connect)`. Headline = Display XL, italicize *slow*. Copy = Lead. Button = dark-button (ink fill, paper text) with magnetic + cursor interaction.

**Scroll scene**
- **Enter:** headline word-mask reveal (slow, big stagger). Copy + button follow. Small image clips in.
- **Scrub (the "push-in"):** the large image is `scale 1.18→1.0` bound to scroll across the whole section — a slow, continuous Ken-Burns push that ends the film. This is the last thing the eye does before the footer.
- The magnetic button + growing cursor ring give a final interactive flourish.

---

### Section 9 — Footer

**Concept:** End credits. Quiet, structured, on the darkest paper tone (`--paper-sunk`). A huge "Riverwood Villa" wordmark in Bodoni that mask-reveals, nav + contact columns fading up like a credits roll, a "Back to top" that smooth-scrolls (Lenis) the whole film back to frame one.

**Layout mock**
```
┌───────────────────────────────────────────────┐
│ (1) Home  (2) About  (3) Project … (credits)    │
│                                                │
│   Riverwood Villa                ← huge Bodoni  │
│                                                │
│  Email           Phone          Office   Social │
│  hello@…         +94…           Riverside  ◎ ◎  │
│ ───────────────────────────────────────────────│
│  ©26 Riverwood Villa            Back to top ↑   │
└───────────────────────────────────────────────┘
```

**Scroll scene**
- **Enter:** nav links fade up staggered (credits roll). The big wordmark mask-reveals word-by-word, large stagger, slow. Info columns fade up. Bottom bar fades in last.
- **Back to top:** uses Lenis `scrollTo` — the entire reel rewinds smoothly to the Hero, reinforcing "it was one continuous film."

---

## 5. The Continuity Layer (tie it all into one film)

These cross-section systems are what separate "nice animated sections" from "a video that plays as you scroll." Build them **after** sections work individually.

1. **Scrubbed background dissolves** (§3.4) at every tone change — no hard background cuts anywhere.
2. **The fixed through-line + chapter numeral** (§3.3) — proves continuity, gives the reader a playhead.
3. **Consistent reveal grammar** — every section enters with the *same* vocabulary (mask-rise type, clip-wipe images, drawn hairlines). Repetition = it feels authored by one director.
4. **Counter-parallax pairs** — in any section with two images, move them at different speeds. Depth parallax is the single strongest "this is moving footage" signal.
5. **Velocity shear globally** — keep `data-skew` active so fast scrolls smear slightly and settle, like a film camera whip-pan.
6. **One accent (sage) for all "live" elements** — progress line, current chapter, active link underline. The eye learns "sage = the moving part."
7. **Audio-optional flourish (advanced):** a single soft ambient loop toggled by a small muted-by-default control can complete the "watching a film" illusion. Entirely optional; never autoplay with sound.

---

## 6. Performance & Accessibility (do not skip)

- **Reduced motion:** extend the existing `motion-reduced` branch to cover every new scene — no pinning, no scrub, no skew; show all type and images in their final state, fully legible. The page must be perfect with motion off.
- **Only animate `transform`, `opacity`, and `clip-path`.** Never animate `width/height/top/left` for motion (the current code already follows this — keep it). It's why the scroll stays 60fps.
- **`will-change`** on actively-animating layers only; remove after.
- **Pin sparingly:** at most 2 pinned sections (Sticky Scroll + optionally CTA). Too many pinned scenes make the page feel stuck and disorienting.
- **Images:** keep Next `<Image>` with correct `sizes`, `priority` only on Hero (unchanged). Lazy-load everything below. Serve `webp` where available (several already are).
- **`ScrollTrigger.refresh()`** after the loader completes and on resize (already wired — preserve it).
- **Mobile:** drop the through-line, reduce parallax distances, convert side-by-side editorial layouts to stacked, and shorten/disable pins (pinning on touch is fragile). The *reveal grammar* stays; the *scene complexity* reduces.
- **Test the rewind:** scrub everything by scrolling **up** — it must play backward cleanly. If anything jumps on reverse, it's a `once` trigger that should be `scrub`, or vice-versa.

---

## 7. Build Order (step-by-step)

Do it in this sequence so you always have a working page:

1. **Tokens first.** Lock the type scale (§2.1) and motion tokens (§2.4) as the single source of truth. Confirm Bodoni + Manrope are the only families in use.
2. **Strip the old sections** below the Hero one at a time — never all at once. Keep section `id`s and `data-theme="light"`.
3. **Rebuild static layouts** for all 9 sections with *zero* animation first. Get the editorial composition, grid, type, and spacing beautiful as still frames. (A cinematic page is just good still frames in motion — if the stills aren't gorgeous, animation won't save it.)
4. **Add entrance choreography** (once-triggers): mask-rise type, clip-wipe images, drawn hairlines — section by section, top to bottom.
5. **Add scrub scenes:** parallax pairs, the Sticky Scroll pin, the CTA push-in.
6. **Add the continuity layer** (§5): background dissolves, through-line, velocity shear, counter-parallax.
7. **Wire reduced-motion fallbacks** for every new animation.
8. **Mobile pass:** stack layouts, tame parallax, disable pins.
9. **Polish:** cursor labels, magnetic buttons, hover micro-motion, timing fine-tune.
10. **QA the rewind & the seams** (below).

---

## 8. QA Checklist

- [ ] Hero, loader, and nav reveal are **byte-for-byte unchanged**.
- [ ] Every section is `data-theme="light"`; nav theme-switching still behaves.
- [ ] All anchor links (`#about`, `#project`, …) smooth-scroll to the right place via Lenis.
- [ ] Only Bodoni Moda + Manrope appear anywhere. No third font crept in.
- [ ] Scrolling **down** plays the film; scrolling **up** rewinds it with no jumps.
- [ ] No hard background cuts — every tone change dissolves.
- [ ] 60fps on a mid-range laptop; no layout-thrash (only transform/opacity/clip-path animate).
- [ ] `prefers-reduced-motion: reduce` → everything static, legible, no pins/scrub.
- [ ] Mobile: layouts stack, pins disabled, parallax reduced, nothing overflows.
- [ ] Keyboard focus order is logical; focus-visible rings show; all text has sufficient contrast on paper.
- [ ] The through-line/chapter counter is hidden on mobile and doesn't overlap content on desktop.

---

### One-line brief to hand an AI builder

> "Rebuild every section below the untouched Hero of this Next.js page as a single cinematic, light-theme film: strict Bodoni Moda (display) + Manrope (body), GSAP + ScrollTrigger + Lenis, with mask-rise type, clip-wipe images, counter-parallax pairs, one pinned set-piece (Sticky Scroll) and a scrubbed CTA push-in, all tied together by scrubbed background dissolves and a fixed scroll-progress through-line — so scrolling down plays the movie and scrolling up rewinds it, with a fully static reduced-motion fallback."
