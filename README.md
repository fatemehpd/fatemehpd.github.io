# Fatemeh Pakdaman — Portfolio

Live site: https://fatemehpd.github.io


Interactive hero built with **React 19 + TypeScript + Vite**. The character
is the visual anchor; the cursor only picks a zone, she never tracks it.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## How it behaves

| Where the cursor goes | What happens |
| --- | --- |
| Left third | She looks left, "Anyone here on the left?", holds ~2.6 s, back to work |
| Right third | She looks right, "Anyone here on the right?", holds ~2.6 s, back to work |
| Centre third | Greeting: looks up at you ("Hey, it's you!") → takes the headset off and rests it on her neck → waves ("Hiiii!") → points down ("Check out the portfolio", links to `#about`) → back to work |

* A reaction plays once per visit to a zone; leave and come back to trigger it again.
* The greeting always finishes. If the visitor drifts to a side during it, that side reacts right after.
* Zone edges have a little hysteresis so hovering on a boundary doesn't flicker.
* Clicking the character, or focusing it with the keyboard and pressing Enter, plays the greeting too.
* **Touch screens** (phones, tablets): no left/right zones. She greets once when the hero is in view, and tapping her replays it. The hint switches to "Tap to call me !".
* `prefers-reduced-motion` shortens crossfades and stops the decorative loops.

## Where things live

```
public/hero/                     7 frames × 2 sizes (720w, 1200w), transparent WebP
src/components/hero/
  frames.ts                      pose list, messages, sequence timings  ← tweak timings here
  heroEngine.ts                  rAF animation engine (crossfades, spring, zones)
  Hero.tsx                       markup + event wiring (renders once)
  Hero.css                       layout, gradient, messages, cursor hint, mobile
  CursorIndicator.tsx            animated cursor hint next to the instruction
src/content/cv.ts                ALL portfolio text from the CV  ← edit content here
src/components/portfolio/        About, Education, Projects, Publications,
                                 Experience, Highlights, Contact + portfolio.css (glass UI)
public/logos/                    TaarLab, University of Tehran, K. N. Toosi logos
src/components/ink/              scroll-scrubbed ink background (ink.ts)
public/ink/                      ink animation frames (720w desktop, 432w phones)
src/components/Nav.tsx           top bar; turns into a floating glass bar on scroll
src/App.tsx                      Nav + Hero + portfolio sections
```

### The ink background

Your Pacific-blue ink clip plays behind the whole page and is driven by
scrolling: scroll down and the ink falls and blooms, scroll up and it rewinds.

* The clip is stored as 147 colour-graded WebP frames in `public/ink/720/`
  (desktop) and `public/ink/432/` (phones), about 3 MB and 1.6 MB.
* Frames load coarse-to-fine, so the whole scroll range works almost at once
  and fills in detail as it loads; neighbouring frames are blended so the
  scrub stays smooth.
* On wide screens the tall clip is shown wider than the window and pans down
  as you scroll, following the ink; its sides fade into the water colour.
* Code: `src/components/ink/ink.ts`. To use a different clip, export its frames
  with the same names and update `INK_FRAMES` and `INK_BG`.

### Typography

Fraunces (display, soft serif), Schibsted Grotesk (text) and IBM Plex Mono
(labels and dates), all self-hosted through Fontsource.

### Performance notes

* React renders the hero once. All per-frame work (layer opacity, the small
  "excited" lift, active message, zone attribute) is written straight to the
  DOM from one `requestAnimationFrame` loop in `HeroEngine`. The loop sleeps
  whenever nothing is moving.
* Crossfades are frame-rate independent (exponential smoothing on real `dt`).
  The incoming pose fades in on top and the old one dissolves underneath once
  it's mostly covered, so there's no see-through dip mid-blend.
* All frames are decoded (`img.decode()`) before the first swap.
* Only `opacity` and `transform` animate.

### Dropping it into another React project

Copy `src/components/hero/` and `public/hero/`, render `<Hero />`, and make sure
`--nav-h` (nav height) plus the colour/font tokens from `src/index.css` exist.
Fonts are self-hosted via `@fontsource/instrument-serif` and
`@fontsource-variable/manrope`.

## About the frames

The 7 poses come from the original animation GIF. They were aligned to each other
(so the laptop and desk don't jump between poses), upscaled 4× with an
anime-specific super-resolution model, and cut out from the white background
with soft edges; the desk dissolves into the backdrop at the sides.
