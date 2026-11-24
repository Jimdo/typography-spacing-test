// System view (v4): the color system from "Colors Systems overview" (Confluence, Motaki) as data, with a specimen,
// a matrix of every background and style, the rules table and a list of contrast failures. Phase 1 is read-only:
// the rules come from the overview; four switches cover the points where it and the earlier prototype disagree.
(function () {
  'use strict';
  // the .dc runtime can run the page's scripts a second time; keep the first copy, which the Type system captured (Oct 31:
  // a second copy left the CMS's theme picker and the Type system on two different themes, each with its own settings)
  if (window.ColorSystem) return;

  // ---- palettes: Lisa's theme plus stress cases (TRF-4091: light, dark, saturated, mid-tone) ----
  const PALETTES = {
    // the nine segment themes made for Dolphin about a year and a half ago (Figma Sites, not Creator themes): colors, fonts and
    // button radius read from each published template page on Oct 22. Roles follow how each design uses its colors:
    // Base = the page background, Alternate = the second section background, Brand = the accent (buttons, links,
    // highlighted headings), Inverted = the opposite strong color (dark on light themes, light on the dark ones:
    // Gaia, Noir, Barber, Grit). Noir's template only has three colors, so its Alternate is a navy-black in Base's hue, #141C23, 1.16:1 from Base like the other themes' Alternates (Oct 24; it repeated Brand, then was production's lighter gray #252628).
    gaia: { group: 'Themes', name: 'Gaia', Shade2: '#EDF2F3', SecondaryColor: '#E5D7CB', MainColor: '#093E44', Shade1: '#11272E', hf: "'Cormorant Upright', Georgia, serif", hw: 400, bf: "'Work Sans', sans-serif", radius: 6, upper: true },
    calm: { group: 'Themes', name: 'Calm', Shade2: '#3B3633', SecondaryColor: '#A06145', MainColor: '#F7F0EB', Shade1: '#EDDBCD', hf: "'Cormorant Infant', Georgia, serif", hw: 500, bf: "Mulish, sans-serif", radius: 0, upper: true },
    nature: { group: 'Themes', name: 'Nature', Shade2: '#26211D', SecondaryColor: '#3E802F', MainColor: '#EBF5E0', Shade1: '#F4EDE5', hf: "Syne, sans-serif", hw: 500, bf: "'Work Sans', sans-serif", radius: 999 },
    noir: { group: 'Themes', name: 'Noir', Shade2: '#EDF2F3', SecondaryColor: '#E1DDD8', MainColor: '#03080E', Shade1: '#141C23', hf: "'Playfair Display', Georgia, serif", hw: 400, bf: "'Work Sans', sans-serif", radius: 0, upper: true },  // square corners (Oct 30, Alberto)
    bliss: { group: 'Themes', name: 'Bliss', Shade2: '#1F182C', SecondaryColor: '#CB395E', MainColor: '#FFF8E8', Shade1: '#F9D4CE', hf: "Caprasimo, Georgia, serif", hw: 400, bf: "'Work Sans', sans-serif", radius: 999 },
    barber: { group: 'Themes', name: 'Barber', Shade2: '#F4ECEC', SecondaryColor: '#D0BEBE', MainColor: '#120E0E', Shade1: '#562B2B', hf: "'Bebas Neue', sans-serif", hw: 400, bf: "Mulish, sans-serif", radius: 8, upper: true },
    career: { group: 'Themes', name: 'Career Coach', Shade2: '#1E252E', SecondaryColor: '#4579B8', MainColor: '#F7F7F7', Shade1: '#CEEAFF', hf: "'DM Serif Display', Georgia, serif", hw: 400, bf: "Karla, sans-serif", radius: 28 },
    coach: { group: 'Themes', name: 'Coach', Shade2: '#1F1C19', SecondaryColor: '#2C4974', MainColor: '#F7F7F7', Shade1: '#F3E8E6', hf: "'Libre Baskerville', Georgia, serif", hw: 500, bf: "Mulish, sans-serif", radius: 30 },
    grit: { group: 'Themes', name: 'Grit', Shade2: '#FBFBFB', SecondaryColor: '#AE0816', MainColor: '#070707', Shade1: '#323232', hf: "'League Gothic', sans-serif", hw: 400, bf: "Barlow, sans-serif", radius: 0, upper: true },  // square corners (Oct 29, Alberto)
    // Rossi (Nov 1): the Traffic team's restaurant template (Figma 4hObqWZzbhSHaeARddBeGY, node 5:1016, Rossi di Cassa in
    // Hamburg): black, a dark brown footer, burnt orange, and a warm beige for the menu block; EB Garamond for everything
    rossi: { group: 'Themes', name: 'Rossi', Shade2: '#E6D5CC', SecondaryColor: '#B75E1F', MainColor: '#000000', Shade1: '#292523', hf: "'EB Garamond', Georgia, serif", hw: 400, bf: "'EB Garamond', Georgia, serif", radius: 6 }
  };;
  // corrected themes (Oct 24, Alberto): chosen per theme, not by a formula. 4.5:1 comes first, then the theme's mood
  // from the template brief; any of the theme's own colors may change to protect it. Gaia, Noir, Barber, and Coach pass
  // as they are. The Guide re-measures every corrected Brand on Base, Alternate, and the cards of both
  const FIXES = {
    calm: { SecondaryColor: '#8F5136', Shade1: '#F6E4D5' },   // Alternate a touch lighter so Brand stays nearer the terracotta
    nature: { SecondaryColor: '#317322' },                    // #3E802F, a little darker
    bliss: { SecondaryColor: '#BE2C54', Shade1: '#DBF4F8' },  // production's sky-blue Alternate (the brief's color pops); Brand stays raspberry
    career: { SecondaryColor: '#2F62A0' },                    // #4579B8, a deeper blue
    grit: { SecondaryColor: '#FF534B', Shade1: '#1A1A1A' },   // a darker gray lets Brand keep full saturation: red, not coral
    rossi: { SecondaryColor: '#D07636' }                      // the template's own lighter orange, from its kickers
  };
  const FIX_WHY = {
    calm: 'Its terracotta is 4.34:1 even on Base, so it got darker. A slightly lighter Alternate keeps that step as small as possible.',
    nature: 'Brand is a small step darker.',
    bliss: 'Production\'s sky-blue Alternate lets the raspberry Brand stay close to itself instead of turning crimson.',
    career: 'Brand is a deeper blue, so it reads at 4.5:1.',
    grit: 'A deep red can\'t reach 4.5:1 on near-black. A darker gray Alternate lets Brand stay at full saturation, so it reads red, not coral.',
    rossi: 'Its burnt orange is 3.35:1 on the brown Alternate. The template already uses a lighter orange for its kickers, so Brand takes that shade.' };
  const CUSTOM_BASE = { group: 'Custom', name: 'Custom', hf: "'Work Sans', sans-serif", hw: 600, bf: "'Work Sans', sans-serif", radius: 8 };
  const CUSTOM_DEFAULT = { MainColor: '#F7F0EB', Shade1: '#EDDBCD', SecondaryColor: '#A06145', Shade2: '#3B3633' };
  const BGS = [['Base', 'MainColor'], ['Alternate', 'Shade1'], ['Brand', 'SecondaryColor'], ['Inverted', 'Shade2'], ['Light', 'White'], ['Dark', 'Black']];
  const STYLES = ['Neutral', 'Tinted', 'Vivid'];

  // ---- color math ----
  const norm = (v) => {
    if (/^oklch\(/.test(String(v))) return String(v).trim();
    let d = String(v == null ? '' : v).trim().replace(/^#/, '').toLowerCase();
    if (d.length === 3) d = d.replace(/./g, (c) => c + c);
    return /^[0-9a-f]{6}$/.test(d) ? '#' + d.toUpperCase() : '#000000';
  };
  // relative luminance (WCAG 2.x): linear R, G, B weighted by how bright each looks. Hex colors are decoded with
  // toLin; oklch() colors (Display P3) are converted to linear light directly, so they're measured as they are
  const lum = (c) => {
    const [r, g, b] = /^oklch\(/.test(String(c)) ? linFromOklch(toOklch(c)) : [1, 3, 5].map((i) => toLin(parseInt(norm(c).slice(i, i + 2), 16) / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  // WCAG contrast ratio, 1 (same color) to 21 (black on white); the order of a and b doesn't matter
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Infant:wght@500;600&family=Mulish:wght@400;500;700&family=Syne:wght@500&family=Work+Sans:wght@400;500;600&family=Cormorant+Upright:wght@400&family=Playfair+Display&family=Caprasimo&family=Bebas+Neue&family=DM+Serif+Display&family=Karla:wght@400;500;700&family=League+Gothic&family=Barlow:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Libre+Baskerville:wght@500&family=EB+Garamond:wght@400;500;700&display=swap';
  // a contrast ratio as text, rounded down so it never claims more than it has: 4.5:1, 3:1, 4.48:1
  // drops trailing zeros from every decimal in a string (0.200 → 0.2, 4.50 → 4.5, 11.00 → 11), for display only
  const tidyNum = (t) => String(t).replace(/(\d)\.(\d*?)0+(?!\d)/g, (m, a, b) => (b ? a + '.' + b : a));
  const fmt = (r) => (Math.floor(r * 100) / 100).toFixed(2).replace(/\.?0+$/, '') + ':1';
  // sRGB channel (0…1) to linear light and back: screens store values with a gamma curve, math needs them linear
  const toLin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const toSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);
  const toOklch = (hex) => {
    const m0 = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.-]+)/.exec(String(hex));
    if (m0) return [+m0[1], +m0[2], +m0[3] * Math.PI / 180]; // already OKLCH (Display P3 colors are kept as oklch() strings)
    const [r, g, b] = [1, 3, 5].map((i) => toLin(parseInt(norm(hex).slice(i, i + 2), 16) / 255));
    // linear sRGB → LMS cone response, cube root; then LMS → OKLab (Ottosson's matrices)
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.hypot(A, B), Math.atan2(B, A)]; // Lab → LCH: chroma is the distance from gray, hue the angle
  };
  // ---- wide gamut (Oct 24): linear sRGB of any OKLCH color, unclamped; and whether it fits sRGB or Display P3
  const linFromOklch = ([L, C, H]) => {
    const A = C * Math.cos(H), B = C * Math.sin(H);
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  };
  const inGamut = (lch, gamut) => { const [r, g, b] = linFromOklch(lch), e = 1e-4;
    // for P3, convert linear sRGB to linear Display P3 first; a color fits when every channel stays in 0…1
    const c = gamut === 'p3' ? [0.8224621 * r + 0.177538 * g, 0.0331941 * r + 0.9668058 * g, 0.0170827 * r + 0.0723974 * g + 0.9105199 * b] : [r, g, b];
    return c.every((v) => v >= -e && v <= 1 + e); };
  // the sRGB fallback of any color (hex as is; an oklch() P3 color clipped), for the native color picker
  const srgbHex = (v) => /^oklch\(/.test(String(v)) ? inGamutMode('srgb', () => fromOklch(toOklch(v))) : norm(v);
  // run fn with the gamut pinned to g (side-by-side examples, the sRGB fallback)
  const inGamutMode = (g, fn) => { const old = GAMUT, oldF = GAMUT_FORCE; GAMUT = GAMUT_FORCE = g; try { return fn(); } finally { GAMUT = old; GAMUT_FORCE = oldF; } };
  // a P3 color is written as oklch(); colors that fit sRGB stay hex, so the sRGB result is the fallback. Chroma is
  // rounded down, never up: a fitted color sits right at the gamut's edge, and rounding up would push it past it
  const oklchCss = ([L, C, H]) => 'oklch(' + L.toFixed(3) + ' ' + (Math.floor(C * 1000) / 1000).toFixed(3) + ' ' + (((H * 180 / Math.PI) + 360) % 360).toFixed(1) + ')';
  // the gamut generated colors may use: the theme's own (Oct 25, was a switch): 'srgb' while every theme color fits
  // sRGB, 'p3' as soon as one is a Display P3 color, so a wide-gamut theme is never capped and an sRGB theme never
  // changes. engine() sets it per theme; GAMUT_FORCE pins it for side-by-side examples
  let GAMUT = 'srgb', GAMUT_FORCE = null;
  const gamutOf = (pal) => ['MainColor', 'Shade1', 'SecondaryColor', 'Shade2'].some((k) => pal[k] && !inGamut(toOklch(pal[k]), 'srgb')) ? 'p3' : 'srgb';
  const fromOklch = ([L, C, H]) => {
    // the inverse of toOklch, written as hex. On a P3 theme, a color outside sRGB is fitted to P3 instead
    if (GAMUT === 'p3' && !inGamut([L, C, H], 'srgb')) return fitGamut(L, C, H);
    // channels outside sRGB are clipped, which can shift the hue: use fitGamut() when the hue must hold
    const clip = (v) => Math.min(1, Math.max(0, v));
    return norm(linFromOklch([L, C, H]).map((v) => Math.round(clip(toSrgb(clip(v))) * 255).toString(16).padStart(2, '0')).join(''));
  };
  // the perceived distance between two colors: straight-line distance in OKLab
  const deltaE = (a, b) => { const [L1, C1, H1] = toOklch(a), [L2, C2, H2] = toOklch(b); return Math.hypot(L1 - L2, C1 * Math.cos(H1) - C2 * Math.cos(H2), C1 * Math.sin(H1) - C2 * Math.sin(H2)); };
  // how far a card sits from its block (L is the block's lightness). The same step reads weaker on dark colors, so the
  // distance grows toward black, with an extra push under L 0.3: 0.032 near white, about 0.13 near black
  const cardDE = (L) => 0.032 + 0.035 * (1 - L) ** 2 + 0.06 * Math.max(0, (0.3 - L) / 0.3) ** 2;
  // OKLab understates differences near black (screens add glare and crush dark tones), so the card must also reach this
  // contrast ratio, which grows toward black: 1.06 near white, about 1.36 near black. The bigger of the two steps wins
  const cardCR = (L) => 1.06 + 0.3 * (1 - L) ** 3;
  // the most chroma a lightness and hue can hold in the current gamut, found by halving the range 24 times (no OKLCH
  // color has more than 0.4)
  const maxChroma = (L, H, hi = 0.4) => {
    let lo = 0; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (inGamut([L, m, H], GAMUT)) lo = m; else hi = m; } return lo; };
  // the card surface: the block's own color (same hue), one step darker, or lighter on dark blocks (L < 0.45).
  // `accent`: the block's accent, which must keep `min` contrast on the card; it must already read on the block (null:
  // nothing to protect). `steps`: how many card steps out (dividers use LINE_STEPS)
  const derivedCard = (bg, accent, min = 4.5, steps = 1) => {
    const [L, C, H] = toOklch(bg), dir = L >= 0.45 ? -1 : 1;
    // chroma: a darker card scales it with how much more the gamut holds there (up to ×1.25), so it stays as vivid as
    // the block; a lighter card keeps the block's chroma (more turned near-black cards brown). Blocks with a hue keep
    // at least 0.02·(1 − L)², so a dark navy card doesn't go gray
    const room = maxChroma(L, H);
    const chromaAt = (L2) => { const c = dir > 0 ? C : C * Math.min(1.25, room > 1e-4 ? maxChroma(L2, H) / room : 1); return C >= 0.005 ? Math.max(c, 0.02 * (1 - L) ** 2) : c; };
    // the card `step` thousandths of lightness away from the block, with its chroma times `boost`
    const cardAt = (step, boost = 1) => { const L2 = L + dir * step / 1000; return fitGamut(L2, chromaAt(L2) * boost, H); };
    const farEnough = (x) => deltaE(x, bg) >= steps * cardDE(L) && contrast(x, bg) >= cardCR(L) ** steps;
    const keepsAccent = (x) => !accent || contrast(accent, x) >= min;
    // 1. step lightness until the card is far enough from the block, both perceptually (ΔE) and in contrast (at most 0.4)
    let step = 0, card = bg;
    for (; step < 400; step++) { card = cardAt(step); if (farEnough(card)) break; }
    // 2. if that pushed the accent under its minimum: step back until it reads, then win distance back with chroma (×1.6 at most)
    if (!keepsAccent(card)) {
      while (step > 0 && !keepsAccent(card)) card = cardAt(--step);
      for (let k = 1; k <= 12; k++) { const y = cardAt(step, 1 + k * 0.05); if (!keepsAccent(y)) break; card = y; if (deltaE(y, bg) >= cardDE(L)) break; }
    }
    return norm(card);
  };

  // every blend is a straight line in OKLab (see mixLab)
  const mix = (a, b, t) => mixLab(a, b, t);
  // L, C, H of a color, for the generated colors list
  const okText = (hex) => { const [L, C, H] = toOklch(hex); return 'L ' + tidyNum(L.toFixed(2)) + ' · C ' + tidyNum(C.toFixed(3)) + ' · H ' + Math.round(((H * 180 / Math.PI) + 360) % 360) + '°'; };
  // ---- status colors from the theme: each keeps an anchor hue so it still reads as red, green or amber
  const STATUS_HUE = { error: 27, success: 150, warning: 75, info: 250 };
  // radians to degrees (0…360), and the signed gap from hue a to hue b the short way round (−180…180)
  const deg = (r) => ((r * 180 / Math.PI) + 360) % 360, hueGap = (a, b) => ((b - a) % 360 + 540) % 360 - 180;
  const statusHC = (name, brandHex) => {
    // [hue in degrees, chroma]. Success, warning, and info: nudged 20% toward Brand's hue (at most 12°) so they belong to the
    // theme, chroma following Brand's within 0.09…0.17. Error: a fixed hue and 0.15…0.20 chroma, because a muted or
    // nudged red reads as rust or brown
    const [, Cb, Hb] = toOklch(brandHex), a = STATUS_HUE[name], c = 0.5 * Cb + 0.06;
    if (name === 'error') return [a, Math.max(0.15, Math.min(0.2, c))];
    return [a + Math.max(-12, Math.min(12, hueGap(a, deg(Hb)) * 0.2)), Math.max(0.09, Math.min(0.17, c))]; };
  // a color that keeps its lightness and hue and gives up only as much chroma as it must to fit the current gamut
  // (clipping channels instead would change the hue). Colors that fit sRGB come back as hex, P3 ones as oklch()
  const fitGamut = (L, C, H) => {
    const c = inGamut([L, Math.max(0, C), H], GAMUT) ? Math.max(0, C) : maxChroma(L, H, C);
    if (GAMUT !== 'p3' || inGamut([L, c, H], 'srgb')) return fromOklch([L, c, H]);
    // P3: check the value as written (3 decimals), since rounding can nudge an edge color out: then give up a little more
    let x = oklchCss([L, c, H]), k = 0;
    while (!inGamut(toOklch(x), 'p3') && k < 50) x = oklchCss([L, Math.max(0, c - 0.001 * ++k), H]);
    return inGamut(toOklch(x), 'srgb') ? fromOklch(toOklch(x)) : x; };
  // the status color for a surface: its hue and chroma, at the first lightness that reaches 4.5:1 (null if none does)
  const statusOf = (name, surface, brandHex) => {
    const [h, C] = statusHC(name, brandHex), H = h * Math.PI / 180;
    // the preferred side first (away from the surface), then the other; a result that had to lose most of its chroma
    // to fit no longer reads as red, green, amber, or blue, so it doesn't count
    // lightness in hundredths: up from 0.60 to 0.98, or down from 0.60 to 0.05
    const lighterFirst = toOklch(surface)[0] < 0.5;
    for (const up of [lighterFirst, !lighterFirst]) for (let i = 60; up ? i <= 98 : i >= 5; i += up ? 1 : -1) { const x = fitGamut(i / 100, C, H); if (contrast(x, surface) >= 4.5) return toOklch(x)[1] >= 0.06 ? x : null; }
    return null;
  };
  // hover and pressed move a color this far in OKLCH lightness, away from its surface; dividers sit LINE_STEPS
  // card steps from their block and, in Vivid, take LINE_TINT of Brand's hue and chroma
  const HOVER = 0.09, PRESSED = 0.16, LINE_TINT = 0.25, LINE_STEPS = 1.5;
  // the contrast every part that can carry the accent must reach (WCAG AA for text)
  const MIN = 4.5;
  const tintLine = (line, brand) => {
    // Vivid's dividers: a quarter of the way toward Brand for hue and chroma, but the line's own lightness, so
    // they stay as subtle as in Neutral and Tinted
    const [L] = toOklch(line), [, C, H] = toOklch(mixLab(line, brand, LINE_TINT));
    return norm(fitGamut(L, C, H)); };
  // a divider on a surface: the surface's own color LINE_STEPS card steps out, tinted toward the fill in Vivid where
  // the block uses Brand itself (the specimen and the Theme tab's card share it)
  const dividerOn = (bg, fill, tint) => { const base = derivedCard(bg, null, 0, LINE_STEPS); return tint ? tintLine(base, fill) : base; };
  // one rule for every hover and pressed state (buttons, links, field borders): move away from the surface, darker on
  // light and lighter on dark, so contrast only goes up
  const stateShift = (col, surface, step) => {
    return shiftL(col, toOklch(col)[0] < toOklch(surface)[0] ? -step : step); };
  // the secondary button's hover and pressed background: the surface tinted toward the button's color, at most tmax,
  // and less if the label would drop under 4.5:1
  const stateSurface = (surface, col, tmax) => {
    for (let i = Math.round(tmax * 100); i >= 1; i--) { const x = mix(surface, col, i / 100); if (contrast(col, x) >= 4.5) return x; } return surface; };
  // blend two colors in a straight line in OKLab: no swing round the hue circle, so a raspberry over a cream lands
  // between the two (a dusty pink) instead of passing through peach
  const mixLab = (a, b, t) => { const [L1, C1, H1] = toOklch(a), [L2, C2, H2] = toOklch(b);
    const A = C1 * Math.cos(H1) + (C2 * Math.cos(H2) - C1 * Math.cos(H1)) * t, B = C1 * Math.sin(H1) + (C2 * Math.sin(H2) - C1 * Math.sin(H1)) * t;
    // a straight line between two colors in the gamut can still leave it (OKLab isn't shaped like the gamut): fit, don't clip
    return fitGamut(L1 + (L2 - L1) * t, Math.hypot(A, B), Math.atan2(B, A)); };
  // move lightness only. In sRGB, a step that leaves the gamut is clipped per channel, which keeps a vivid color vivid
  // but can land a little short of the step and nudge the hue (fitGamut would keep both but wash it out); a P3 theme fits
  const shiftL = (c, d) => { const [L, C, H] = toOklch(c), L2 = Math.min(1, Math.max(0, L + d)); return GAMUT === 'p3' ? fitGamut(L2, C, H) : fromOklch([L2, C, H]); };
  const closestPassing = (fg, surface, min) => {
    // the softest version of fg that still passes: blended toward the surface as far as the minimum allows (60% at most,
    // in 2% steps)
    for (let i = 30; i >= 0; i--) { const c = mix(fg, surface, i / 50); if (contrast(c, surface) >= min) return c; } return norm(fg); };
  // a color the specimen works out, with why, what it's checked against, and whether it passes (min 0: no minimum)
  const res = (hex, why, against, min) => { const ratio = contrast(hex, against); return { hex, why, ratio, min, against, pass: min ? ratio >= min - 1e-9 : true }; };

  // ---- targets: the "Style and targets" and "Contrast checks" tables of the overview, merged ----
  // src: per style (Neutral, Tinted, Vivid), where the part's color comes from: ink, brand (the accent), emph (the card
  // surface) or fillInk (the button label). null: no color of its own (its states, or a group of parts, are in
  // RULE_PARTS). min: the overview's minimum; the system checks every part that can carry the accent at MIN (4.5:1)
  const TARGETS = [
    // ordered by importance and by how often the part shows up on a site (Oct 22): text, buttons, links, forms, status,
    // small elements, then the card
    { id: 'body', label: 'Body text', group: 'Text', src: ['ink', 'ink', 'ink'], min: 4.5, status: 'DECIDED' },
    { id: 'heading', label: 'Section heading', group: 'Text', src: ['ink', 'ink', 'brand'], min: 4.5, status: 'DECIDED', note: 'AA allows 3:1 if large (24px, or 18.7px bold), but the editor decides the size, so 4.5:1 for now' },
    { id: 'marker', label: 'List marker', group: 'Text', src: ['ink', 'brand', 'brand'], min: 3, status: 'DECIDED', note: 'Bullets 3:1 (graphics), numbers 4.5:1 (text). The list text stays Ink.' },
    { id: 'btnFill', label: 'Primary button fill', group: 'Buttons', src: ['ink', 'brand', 'brand'], min: 3, status: 'ENG', note: 'Make sure it works the same way as the existing system' },
    { id: 'btnLabel', label: 'Primary button label', group: 'Buttons', src: ['fillInk', 'fillInk', 'fillInk'], min: 4.5, against: 'fill', status: 'WIP', note: 'Checked against the fill, in every state' },
    { id: 'btnStates', label: 'Primary button states', group: 'Buttons', src: null, status: 'DECIDED', note: 'Focus 3:1; disabled exempt' },
    { id: 'btn2', label: 'Secondary button border and label', group: 'Buttons', src: ['ink', 'brand', 'brand'], min: 4.5, status: 'DECIDED', note: 'Border 3:1, label 4.5:1' },
    { id: 'btn2States', label: 'Secondary button states', group: 'Buttons', src: null, status: 'DECIDED' },
    { id: 'link', label: 'Link', group: 'Links', src: ['ink', 'brand', 'brand'], min: 4.5, status: 'DECIDED', note: 'In Neutral a link is the color of body text, so it needs an underline' },
    { id: 'linkStates', label: 'Link states', group: 'Links', src: null, status: 'DECIDED', note: 'Focus 3:1 on the block background' },
    { id: 'fieldText', label: 'Field label, helper text, required marker', group: 'Forms', src: null, status: 'DECIDED', note: '4.5:1 on the block' },
    { id: 'field', label: 'Field surface, value, placeholder, border', group: 'Forms', src: null, status: 'DECIDED', note: 'Value and placeholder 4.5:1 on the field; border 3:1 on the block' },
    { id: 'fieldStates', label: 'Field states', group: 'Forms', src: null, status: 'DECIDED', note: '3:1 on the block; disabled exempt' },
    { id: 'statusColors', label: 'Status colors', group: 'Status', src: null, status: 'DECIDED', note: 'Text 4.5:1, border or icon 3:1; never color alone' },
    { id: 'kicker', label: 'Kicker', group: 'Small elements', src: ['ink', 'brand', 'ink'], min: 4.5, status: 'DECIDED' },
    { id: 'icon', label: 'Icon', group: 'Small elements', src: ['ink', 'brand', 'brand'], min: 3, status: 'DECIDED', note: 'None if decorative' },
    { id: 'indicator', label: 'Switch and pagination dot', group: 'Small elements', src: ['ink', 'brand', 'brand'], min: 3, status: 'DECIDED' },
    { id: 'divider', label: 'Divider (separators, kicker lines, progress track)', group: 'Small elements', src: null, status: 'DECIDED', note: 'Decorative: no contrast minimum' },
    { id: 'cardSurface', label: 'Card surface', group: 'Card', src: ['emph', 'emph', 'emph'], min: 3, status: 'DECIDED', note: 'The block\'s own color, a step darker or lighter, so the card reads as one object' },
    { id: 'cardHeading', label: 'Card heading', group: 'Card', src: ['ink', 'ink', 'brand'], min: 4.5, level: 'card', status: 'DECIDED' },
    { id: 'cardRest', label: 'Everything else on the card', group: 'Card', src: null, status: 'DECIDED', note: 'Same as block level, worked out on the card surface. Aim for variety.' }
  ];
  // on the card, these targets are worked out a second time against the card surface
  const CARD_REPEAT = ['body', 'marker', 'icon', 'kicker', 'link', 'btnFill', 'btnLabel', 'btn2'];

  // ---- settings (saved per browser) ----
  const KEY = 'color-system-v4b';
  const DEFAULTS = { palette: 'gaia', bg: 'Base', style: 'Tinted', inkv: 'soft', tab: 'specimen', show: 'off', colors: 'fixed', label: 'bg', scope: 'theme', codeLang: 'js' };
  let S = Object.assign({}, DEFAULTS);
  try { S = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* storage blocked: defaults */ }
  // switches that were decided and removed (card, blend, fallback, rule, status, lines, gamut) may still be saved: drop them
  ['card', 'blend', 'fallback', 'rule', 'status', 'lines', 'gamut'].forEach((k) => delete S[k]);
  // the Contrast background is called Inverted since Oct 25 (Contrast also named the contrast ratio)
  if (S.bg === 'Contrast') S.bg = 'Inverted';
  if (S.show !== 'derived') S.show = 'off'; if (S.tab === 'spec') S.tab = 'guide';
  // Oct 24: engine names corrected to production (Base = MainColor, Alternate = Shade1, Contrast = Shade2); custom
  // colors saved before used Base = Shade1, Alternate = Shade2, Contrast = MainColor, so move them once
  if (S.custom && !S.engineNames) { const c = S.custom; S.custom = { MainColor: c.Shade1, Shade1: c.Shade2, SecondaryColor: c.SecondaryColor, Shade2: c.MainColor }; }
  S.engineNames = 1;
  // a hex or an oklch() Display P3 color (the Custom fields take both)
  S.custom = Object.fromEntries(Object.keys(CUSTOM_DEFAULT).map((k) => [k, S.custom && /^(#[0-9a-f]{6}|oklch\([\d. -]+\))$/i.test(S.custom[k]) ? S.custom[k] : CUSTOM_DEFAULT[k]]));
  if (!PALETTES[S.palette] && S.palette !== 'custom') S.palette = 'gaia';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* nothing to do */ } };

  // ---- engine: one theme's colors. opt.inkv: 'soft' (art-directed inks) or 'pure' (black and white); opt.label: 'bg'
  // (the button label is the surface color) or 'ink'
  const engine = (pal, opt) => {
    const p = Object.assign({ White: '#FFFFFF', Black: '#000000' }, pal);
    const gm = gamutOf(p), useG = () => { GAMUT = GAMUT_FORCE || gm; }; useG();
    // the inks: a near-black and a near-white in the page's hue, so text belongs to the theme. The hue is Base's, or
    // Inverted's or Brand's when Base is near gray (C < 0.01). With 'pure', plain black and white
    const art = opt.inkv !== 'pure';
    const hueOf = (hex) => toOklch(hex)[2];
    const inkHue = hueOf([p.MainColor, p.Shade2, p.SecondaryColor].find((h) => toOklch(h)[1] >= 0.01) || p.SecondaryColor);
    // dark ink at L 0.25, or 0.05 below a darker Base (Noir, Barber, Grit); light ink at L 0.975
    const baseL = toOklch(p.MainColor)[0];
    const inkDark = art ? fitGamut(Math.max(0.06, Math.min(0.25, baseL - 0.05)), 0.025, inkHue) : '#000000';
    const inkLight = art ? fitGamut(0.975, 0.01, inkHue) : '#FFFFFF';
    // the Light background is the light ink; the Dark background is deeper than the dark ink (L 0.14, or 0.05 below a
    // darker Base), because L 0.25 reads well as text but too soft as a background
    const darkBg = art ? fitGamut(Math.max(0.04, Math.min(0.14, baseL - 0.05)), 0.025, inkHue) : '#000000';
    if (art) { p.White = inkLight; p.Black = darkBg; }
    // Ink: whichever ink contrasts more with the surface; on a mid-tone where neither reaches 4.5:1, pure black or white
    const pick = (d, l, s) => (contrast(d, s) >= contrast(l, s) ? d : l);
    const ink = (s) => { const a = pick(inkDark, inkLight, s); return contrast(a, s) >= 4.5 ? a : pick('#000000', '#FFFFFF', s); };
    // one minimum for every part that can carry the accent (decided Oct 24); borders and focus rings use 3:1 elsewhere
    const minFor = () => MIN;
    // the accent: SecondaryColor if it reads on the surface, else Shade1 (Alternate, which stands in on the Brand
    // background), else Ink
    const brand = (s, min) => {
      const sec = norm(p.SecondaryColor), s2 = norm(p.Shade1), cs = contrast(sec, s), c2 = contrast(s2, s);
      if (cs >= min) return { hex: sec, why: 'Brand: SecondaryColor (' + fmt(cs) + ')', brand: true };
      if (c2 >= min) return { hex: s2, why: 'Brand: Shade1, because SecondaryColor is ' + fmt(cs), brand: true };
      return { hex: ink(s), why: 'Ink, because SecondaryColor is ' + fmt(cs) + ' and Shade1 ' + fmt(c2), brand: false };
    };
    // the card surface, built so the block's accent keeps its minimum on it
    const emphasis = (bg) => {
      const acc = brand(bg, MIN), hex = derivedCard(bg, acc.brand ? acc.hex : null, MIN);
      return { hex, why: 'Derived: the block\'s own color, ' + (toOklch(bg)[0] >= 0.45 ? 'darker' : 'lighter') };
    };
    // one target on one surface, in one style
    const resolve = (t, styleIdx, surface, ctx) => {
      const src = t.src[styleIdx], min = minFor(t);
      let r;
      if (src === 'ink') r = { hex: ink(surface), why: 'Ink' };
      // on a card, accent targets take the block's accent as it is, so card and block match; if even the card can't keep
      // it at the minimum (only some custom palettes), Ink, the same rule as on the block
      else if (src === 'brand') r = !ctx.accent ? brand(surface, min)
        : contrast(ctx.accent.hex, surface) >= min - 1e-9 ? { hex: ctx.accent.hex, why: ctx.accent.brand ? 'Brand: the block\'s accent' : 'Ink, like the block', brand: ctx.accent.brand }
        : { hex: ink(surface), why: 'Ink, because the block\'s accent is ' + fmt(contrast(ctx.accent.hex, surface)) + ' on the card', brand: false };
      else if (src === 'emph') r = emphasis(surface);
      // the button label: the surface color (it always passes, since the fill was picked at 4.5:1 on that surface), or Ink
      else if (src === 'fillInk') r = opt.label === 'bg' ? { hex: surface, why: 'The background color on the fill (same pair as the fill on the background)' } : { hex: ink(ctx.fill), why: 'Ink on the button fill' };
      const against = src === 'fillInk' ? ctx.fill : surface;
      const ratio = contrast(r.hex, against);
      return Object.assign(r, { src, min, ratio, against, pass: ratio >= min - 1e-9 });
    };
    // everything for one block: block-level targets, then the card and its targets
    const block = (bgName, styleIdx) => {
      const bg = /^#/.test(bgName) ? norm(bgName) : norm(p[BGS.find((b) => b[0] === bgName)[1]]);
      const out = { bg, block: {}, card: {} };
      const fill = resolve(T('btnFill'), styleIdx, bg, {});
      TARGETS.forEach((t) => { if (t.src && t.level !== 'card' && t.id !== 'cardSurface') out.block[t.id] = resolve(t, styleIdx, bg, { fill: fill.hex }); });
      const cs = resolve(T('cardSurface'), styleIdx, bg, {});
      out.cardSurface = cs;
      const accent = brand(bg, MIN);
      const cardFill = resolve(T('btnFill'), styleIdx, cs.hex, { accent });
      out.card.cardHeading = resolve(T('cardHeading'), styleIdx, cs.hex, { accent });
      CARD_REPEAT.forEach((id) => { out.card[id] = resolve(T(id), styleIdx, cs.hex, { fill: cardFill.hex, accent }); });
      return out;
    };
    // every call works in this theme's gamut, whichever engine ran last
    return { p, gamut: gm, block: (...a) => (useG(), block(...a)), minFor, ink: (...a) => (useG(), ink(...a)), fns: { inkDark, inkLight, darkBg, pick, ink, brand, emphasis } };
  };

  // a font pair picked in the CMS's Fonts view (Nov 1) borrows another theme's fonts for the current theme only; raw skips it,
  // for the Themes list, which shows every theme as it comes
  const pairOf = (k) => { const q = PALETTES[k]; return q ? { hf: q.hf, hw: q.hw, bf: q.bf } : null; };
  // (Nov 4, performance) the color engine is pure for its settings: the CMS's renderVals asked it the same 14 questions on every
  // render, about 1ms each, before a view could push. Cache the answers per settings snapshot and hand out copies.
  let memoKey = '', memo = new Map();
  const memoized = (name, fn) => function (...a) { const k0 = JSON.stringify(S); if (k0 !== memoKey) { memoKey = k0; memo = new Map(); }
    const k = name + JSON.stringify(a); let v = memo.get(k); if (v === undefined) { v = fn.apply(this, a); memo.set(k, v); }
    return v && typeof v === 'object' ? Object.assign({}, v) : v; };
  const themed = (k, raw) => k === 'custom' ? Object.assign({}, CUSTOM_BASE, S.custom) : Object.assign({}, PALETTES[k], S.colors !== 'original' ? FIXES[k] : null, !raw && k === S.palette && S.fontPair && S.fontPair !== k ? pairOf(S.fontPair) : null);
  const palette = () => themed(PALETTES[S.palette] || S.palette === 'custom' ? S.palette : 'calm');
  const allPalettes = () => Object.keys(PALETTES).concat(S.palette === 'custom' ? ['custom'] : []).map((k) => [k, themed(k)]);
  const T = (id) => TARGETS.find((t) => t.id === id);
  // a background's name with the engine color it maps to, like Base (MainColor) (Motaki's walkthrough, Oct 23)
  const bgAlias = (n) => { const k = (BGS.find((x) => x[0] === n) || [])[1]; return k ? n + ' (' + k + ')' : n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // "On this page" as a dropdown under the lead, for windows too narrow for the side column; items are [id, title (HTML), depth]
  const tocSelect = (items) => '<label class="cs-gtocsel"><span class="cs-gtocselbox"><select aria-label="On this page"><option value="" disabled selected>On this page</option>'
    + items.map(([id, t, d]) => '<option value="' + id + '">' + '\u00a0'.repeat(d * 4) + esc(String(t).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')) + '</option>').join('')
    + '</select></span></label>';

  // ---- small pieces of markup ----
  const badge = (r, small) => {
    if (!r) return '';
    const cls = r.pass ? 'ok' : 'bad';
    return '<span class="cs-badge ' + cls + (small ? ' sm' : '') + '" title="' + esc((r.pass ? 'Passes ' : 'Fails ') + fmt(r.min) + ' minimum') + '">' + fmt(r.ratio) + (small ? '' : (r.pass ? ' ✓' : ' ✗')) + '</span>';
  };
  // the Min cell: amber when the contrast passes but sits within 5% of it (4.5:1 → under 4.73, 3:1 → under 3.15), one
  // small change away from failing; red when it fails
  const minCell = (r, extra) => {
    const close = r.pass && r.min > 0 && r.ratio < r.min * 1.05;
    return '<td><span class="cs-badge sm ' + (!r.pass ? 'bad' : close ? 'close' : 'ok') + '" title="' + (!r.pass ? 'Under the minimum' : close ? 'Within 5% of the minimum' : 'Passes comfortably') + '">' + fmt(r.min) + '</span>' + (extra || '') + '</td>';
  };
  // one Contrast cell instead of Contrast + Min: the ratio, a word for how it stands against its minimum, and a small
  // scale from 1:1 to 10:1 with a tick at the minimum (4.5:1 text, 3:1 controls) and the fill up to the ratio.
  // Close: passes but within 5% of the minimum. Exceeds: reaches the next WCAG step (7:1 for text, 4.5:1 for 3:1 parts).
  const crLevel = (r) => !r.min ? 'none' : !r.pass ? 'bad' : r.ratio < r.min * 1.05 ? 'close' : r.ratio >= (r.min >= 4.5 ? 7 : r.min >= 3 ? 4.5 : r.min * 1.5) ? 'great' : 'ok';
  const CR_WORD = { none: 'No minimum', bad: 'Fails', close: 'Just passes', ok: 'Passes', great: 'Exceeds' };
  const crCell = (r) => {
    if (!r) return '';
    const lv = crLevel(r), pos = (x) => Math.max(0, Math.min(100, (x - 1) / 9 * 100)).toFixed(1);
    const n = tidyNum((Math.floor(r.ratio * 100) / 100).toFixed(2));
    const tipTxt = n + ':1. ' + (r.min ? CR_WORD[lv] + ' the ' + fmt(r.min) + ' minimum' + (lv === 'close' ? ', by less than 5%' : lv === 'great' ? ', up to the next WCAG step' : '') : 'Decorative, so no minimum') + '.';
    return '<span class="cs-cr ' + lv + '" title="' + esc(tipTxt) + '"><span class="cs-crn">' + n + '<i>:1</i></span><span class="cs-crbar"><i style="width:' + pos(r.ratio) + '%"></i>' + (r.min ? '<u style="left:' + pos(r.min) + '%"></u>' : '') + '</span><span class="cs-crw">' + CR_WORD[lv] + (r.min && r.min !== 4.5 ? '<span class="cs-crmin"> · needs ' + fmt(r.min) + '</span>' : '') + '</span></span>';
  };
  const CR_LEGEND = '<p class="cs-crlegend"><span class="cs-crbar"><i style="width:45%"></i><u style="left:38.9%"></u></span> The mark on each bar is the minimum: <code class="cs-lchip">4.5:1</code> for text, <code class="cs-lchip">3:1</code> for borders and controls.</p>';
  const TOK_LEGEND = '<p class="cs-toklegend"><span><i class="picked"></i>Reused: an existing color, chosen by a rule</span><span><i class="generated"></i>Generated: a new color, calculated</span></p>';
  // both legends as one quiet block, right above the table they explain
  // "#hex on #hex": both values as code chips, like every value in the interface
  const onPair = (r) => '<code class="cs-lchip">' + r.hex + '</code> on <code class="cs-lchip">' + r.against + '</code>';
  const LEGENDS = '<div class="cs-legends">' + TOK_LEGEND + CR_LEGEND + '</div>';
  const sample = (r) => '<span class="cs-aa" style="background:' + r.against + ';color:' + r.hex + '" title="' + norm(r.hex) + ' on ' + norm(r.against) + '">Aa</span>';
  const STATUS_LABEL = { DECIDED: 'Decided', WIP: 'In review', ENG: 'Engineering check' };
  // decided is the norm, so it reads quietly; anything still open stands out as a pill
  const statusPill = (s) => statusPillLoud(s);
  const statusPillLoud = (s) => '<span class="cs-status ' + s.toLowerCase() + '">' + (STATUS_LABEL[s] || s) + '</span>';
  const icon = (c) => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="' + c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>';
  const tip = (label, r) => esc(label + ': ' + r.hex + ' · ' + r.why + ' · ' + fmt(r.ratio) + ' (min ' + fmt(r.min) + ')');

  // a block preview: the targets painted on their surfaces, with a card inside


  // a small version of the specimen's first block for the Matrix (Oct 22): the same heading, lead with link, list, two
  // buttons and card, in the theme's fonts, case and button shape, so each cell reads like a real section
  const miniPage = (b, pal) => {
    const k = b.block, c = b.card, rad = pal.radius == null ? 0 : Math.min(pal.radius, 999), r = rad ? Math.min(rad, 999) : 0;
    const link = (col, txt) => '<span class="cs-mlink" style="color:' + col + '">' + txt + '</span>';
    const btn = (fill, label, txt, full) => '<span class="cs-mbtn' + (full ? ' full' : '') + '" style="background:' + fill.hex + ';color:' + label.hex + ';border-color:' + fill.hex + ';border-radius:' + r + 'px" title="' + tip('Primary button', fill) + '">' + txt + '</span>';
    const ghost = (col, txt) => '<span class="cs-mbtn" style="color:' + col.hex + ';border-color:' + col.hex + ';border-radius:' + r + 'px" title="' + tip('Secondary button', col) + '">' + txt + '</span>';
    return '<div class="cs-mini" style="background:' + b.bg + ';--hf:' + esc(pal.hf || "'Cormorant Infant', serif") + ';--hw:' + (pal.hw || 600) + ';--ht:' + (pal.upper ? 'uppercase' : 'none') + ';--bf:' + esc(pal.bf || 'Mulish, sans-serif') + '">'
      + '<div class="cs-mhero"><div class="cs-mh1" style="color:' + k.heading.hex + '" title="' + tip('Section heading', k.heading) + '">Feel well again</div>'
      + '<div class="cs-mlead" style="color:' + k.body.hex + '" title="' + tip('Body text', k.body) + '">Care at your own pace. ' + link(k.link.hex, 'How it works') + '</div>'
      + '<ul class="cs-mlist" style="list-style-type:' + (rad === 0 ? 'square' : 'disc') + '">' + ['Unhurried sessions', 'Flexible plans'].map((x) => '<li style="color:' + k.marker.hex + '"><span style="color:' + k.body.hex + '">' + x + '</span></li>').join('') + '</ul>'
      + '<div class="cs-mbtns">' + btn(k.btnFill, k.btnLabel, 'Book') + ghost(k.btn2, 'Prices') + '</div></div>'
      + '<div class="cs-mcard" style="background:' + b.cardSurface.hex + '" title="' + tip('Card surface', b.cardSurface) + '"><div class="cs-mh3" style="color:' + c.cardHeading.hex + '">Yoga</div>'
      + '<div class="cs-mlead" style="color:' + c.body.hex + '">Gentle care. ' + link(c.link.hex, 'More') + '</div>'
      + btn(c.btnFill, c.btnLabel, 'Book', true) + '</div></div>';
  };

  // a full specimen: one block of a real-looking site with every target, designed or not
  const specimenFull = (b, si, E, pal) => {
    const k = b.block, c = b.card, bg = b.bg, ink = E.ink(bg), neutral = si === 0, rad = pal.radius == null ? 0 : pal.radius;
    // D() marks a generated color: `from` names its source (shown with Highlight: Generated) and it joins the sidebar's
    // Generated colors list
    GEN = [];
    const D = (r, from, label, src, chg) => { const d = Object.assign({}, r, { from }); if (label && !GEN.some((g) => g.label === label)) GEN.push({ label, hex: r.hex, from, src, chg, how: r.why }); return d; };
    const nameOf = (r) => (r.brand ? 'Brand' : 'Ink');
    // Ink is generated too when the neutrals are art-directed: the theme's hue (Base's, or Inverted's or Brand's on a
    // gray Base) at a fixed lightness and low chroma. Pure black or white (Black and white, or the mid-tone fallback) is picked
    if (S.inkv !== 'pure' && !['#000000', '#FFFFFF'].includes(norm(ink))) {
      const [hk, hn] = [['MainColor', 'Base'], ['Shade2', 'Inverted'], ['SecondaryColor', 'Brand']].find(([key]) => toOklch(pal[key])[1] >= 0.01) || ['SecondaryColor', 'Brand'];
      const [iL, iC] = toOklch(ink);
      D(res(ink, 'the ' + (iL < 0.5 ? 'dark' : 'light') + ' ink: ' + hn + '\'s hue at OKLCH L ' + tidyNum(iL.toFixed(3)) + ', C ' + tidyNum(iC.toFixed(3)) + ', whichever ink reads better on the background', bg, 4.5), hn, 'Ink', pal[hk], hn + '\'s hue, L ' + tidyNum(iL.toFixed(2)) + ' · C ' + tidyNum(iC.toFixed(3)));
    }
    const soft = D(res(closestPassing(ink, bg, 4.5), 'Ink blended toward the background, stopping while it still reads at 4.5:1', bg, 4.5), 'Ink', 'Soft text (placeholder)', ink, 'Blended toward the background, still 4.5:1');
    // Vivid tints dividers toward Brand, but only where the block uses SecondaryColor itself
    const bTint = si === 2 && norm(k.btnFill.hex) === norm(pal.SecondaryColor);
    // borders (field borders, empty checkboxes) mark a control: Ink faded only as far as 3:1 allows
    const line = D(res(closestPassing(ink, bg, 3), 'Ink blended toward the background, stopping while it still reads at 3:1', bg, 3), 'Ink', 'Border', ink, 'Blended toward the background, still 3:1');
    // dividers (separators, kicker lines, progress track) only organize the layout, so no minimum: they follow
    // the card rule, LINE_STEPS card steps out
    const lineHex = dividerOn(bg, k.btnFill.hex, bTint);
    const divider = D(res(lineHex, 'the block\'s own color, one and a half card steps ' + (toOklch(bg)[0] >= 0.45 ? 'darker' : 'lighter') + (bTint ? ', then ' + Math.round(LINE_TINT * 100) + '% toward Brand in hue and chroma, lightness kept' : '') + ' (decorative, no contrast minimum)', bg, 0), bTint ? 'Background + Brand' : 'Background', 'Divider', bg, 'One and a half card steps' + (bTint ? ', ' + Math.round(LINE_TINT * 100) + '% toward Brand' : '') + ', no minimum');
    // hover and pressed move the fill away from the background (stateShift); the label stays the same
    const bgLabel = S.label === 'bg';
    const labelOn = (f, lab) => bgLabel ? lab : E.ink(f);
    const fill = k.btnFill.hex, light = toOklch(fill)[0] < toOklch(bg)[0], fillFrom = nameOf(k.btnFill);
    const stepTxt = (st) => (light ? 'Darker' : 'Lighter') + ', L ' + (light ? '−' : '+') + st.toFixed(2);
    const hover = D(res(stateShift(fill, bg, HOVER), 'the accent, lightness ' + (light ? '−' : '+') + HOVER + ', away from the background', bg, 3), fillFrom, 'Primary button, hovered', fill, stepTxt(HOVER));
    const pressed = D(res(stateShift(fill, bg, PRESSED), 'the accent, lightness ' + (light ? '−' : '+') + PRESSED + ', away from the background', bg, 3), fillFrom, 'Primary button, pressed', fill, stepTxt(PRESSED));
    const ring = res(ink, 'Ink, 2px ring, 2px away', bg, 3);
    const dis = D(res(mix(fill, bg, 0.6), 'the fill blended 60% toward the background (disabled needs no contrast)', bg, 0), fillFrom, 'Primary button, disabled', fill, '60% toward the background');
    // status messages sit on the card surface; a status that can't reach 4.5:1 there uses Ink (the icon carries the
    // meaning). Field errors sit on the block, so they also get the color worked out on the background (onBg)
    const msgBg = b.cardSurface.hex;
    const status = Object.fromEntries(Object.keys(STATUS_HUE).map((n) => {
      const r = D(res(statusOf(n, msgBg, pal.SecondaryColor) || E.ink(msgBg), (n === 'error' ? 'error: a fixed red, chroma 0.15…0.20' : n + ' hue nudged toward Brand, chroma from the theme') + ', lightness for 4.5:1', msgBg, 4.5), 'Brand', n[0].toUpperCase() + n.slice(1) + ' color', pal.SecondaryColor, 'Hue toward Brand, chroma from the theme');
      return [n, Object.assign(r, { surface: msgBg, onBg: statusOf(n, bg, pal.SecondaryColor) || E.ink(bg) })];
    }));
    const stIcon = { error: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>', success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>', warning: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4M12 17h.01"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>' };
    const errC = status.error.onBg || status.error.hex;
    const t = (label, r) => tip(label, r);
    const w = (inner, r, label) => '<span class="cs-t done' + (r.from ? ' drv" data-from="' + r.from : '') + '" title="' + t(label, r) + '">' + inner + '</span>';
    const btn = (f, lab, txt, extra) => '<span class="cs-btn" style="background:' + f + ';color:' + lab + ';border-radius:' + rad + 'px;' + (extra || '') + '">' + txt + '</span>';
    const ghost = (col, txt, extra) => '<span class="cs-btn ghost" style="border-color:' + col + ';color:' + col + ';border-radius:' + rad + 'px;' + (extra || '') + '">' + txt + '</span>';
    const lightOf = (hex) => toOklch(hex)[0] > 0.5;
    const liveVars = (f, lab, surface) => { const h = stateShift(f, surface, HOVER), pr = stateShift(f, surface, PRESSED);
      return '--b:' + f + ';--fg:' + lab + ';--bh:' + h + ';--fgh:' + labelOn(h, lab) + ';--bp:' + pr + ';--fgp:' + labelOn(pr, lab) + ';--ring:' + E.ink(surface) + ';--bgc:' + surface; };
    const liveBtn = (f, lab, txt, surface) => '<button type="button" class="cs-btn live" style="' + liveVars(f, lab, surface) + ';border-radius:' + rad + 'px">' + txt + '</button>';
    const liveGhost = (col, txt, surface) => '<button type="button" class="cs-btn ghost live2" style="--c:' + col + ';--bh:' + stateSurface(surface, col, 0.12) + ';--bp:' + stateSurface(surface, col, 0.22) + ';--ring:' + E.ink(surface) + ';--bgc:' + surface + ';border-radius:' + rad + 'px">' + txt + '</button>';
    const liveLink = (col, txt, surface) => '<a href="#" onclick="return false" class="cs-live-link" style="--l:' + col + ';--lh:' + stateShift(col, surface, HOVER) + ';--lp:' + stateShift(col, surface, PRESSED) + ';--ring:' + E.ink(surface) + ';border-radius:' + (rad ? 3 : 0) + 'px">' + txt + '</a>';
    const cap = (txt) => '<span class="cs-cap" style="color:' + soft.hex + '">' + txt + '</span>';
    const linkCss = (col, thick) => 'color:' + col + ';text-decoration:underline ' + (thick ? '2px' : '1px') + ';text-underline-offset:3px';
    const cardFrom = ' drv" data-from="' + S.bg;
    { const [bl, bc] = toOklch(bg), [cl, cc] = toOklch(b.cardSurface.hex), dl = cl - bl, k = bc ? cc / bc : 0;
      GEN.unshift({ label: 'Card surface', hex: b.cardSurface.hex, from: S.bg, src: bg, chg: (dl > 0 ? 'Lighter, L +' : 'Darker, L −') + Math.abs(dl).toFixed(3) + '; ΔE ' + cardDE(bl).toFixed(3), how: 'the block\'s own color, hue kept and as vivid, ' + (dl > 0 ? 'lighter' : 'darker') + ' until it sits ΔE ' + cardDE(bl).toFixed(3) + ' away (0.032 + 0.035·(1 − L)², plus a punch under L 0.3)' }); }
    const card = (title, txt) => '<div class="cs-card big' + cardFrom + '" style="background:' + b.cardSurface.hex + ';border-radius:' + Math.min(rad, 12) + 'px" title="' + t('Card surface', b.cardSurface) + '">'
      + w('<span class="cs-h3" style="color:' + c.cardHeading.hex + '">' + title + '</span>', c.cardHeading, 'Card heading')
      + w('<span class="cs-p" style="color:' + c.body.hex + '">' + txt + ' ' + liveLink(c.link.hex, 'Read more', b.cardSurface.hex) + '</span>', c.body, 'Body text (card)')
      + '<div class="cs-cardbtn">' + w(liveBtn(c.btnFill.hex, c.btnLabel.hex, 'Book this session', b.cardSurface.hex), c.btnFill, 'Primary button (card)') + '</div></div>';
    const fLabel = res(k.body.hex, 'Ink, like body text', bg, 4.5), fValue = res(k.body.hex, 'Ink, like body text', bg, 4.5);
    const checked = res(k.btnFill.hex, 'the primary button fill', bg, 3);
    // resting fields stay neutral; on hover the border takes accent-hover, the same color as a hovered button or link
    // (the accent is Brand in Tinted and Vivid, Ink in Neutral)
    const fAcc = !neutral && k.btnFill.brand ? k.btnFill.hex : ink;
    const fHover = D(res(stateShift(fAcc, bg, HOVER), 'accent-hover: the accent, lightness ' + (toOklch(fAcc)[0] < toOklch(bg)[0] ? '−' : '+') + HOVER + ', away from the background', bg, 3), !neutral && k.btnFill.brand ? nameOf(k.btnFill) : 'Ink', 'Border, hovered', fAcc, (toOklch(fAcc)[0] < toOklch(bg)[0] ? 'Darker, L −' : 'Lighter, L +') + HOVER.toFixed(2));
    // disabled fields: the border and placeholder blended 60% toward the background, like every disabled part (the
    // `disabled` token; exempt from contrast), instead of fading the whole field
    const fDis = D(res(mix(line.hex, bg, 0.6), 'the field border blended 60% toward the background (disabled needs no contrast)', bg, 0), 'Ink', 'Field, disabled', line.hex, '60% toward the background');
    const field = (label, value, opts) => {
      // resting 1px; hover, focus, and error 2px, the extra pixel drawn as an inset shadow so the field doesn't move.
      // Focus uses the accent (Ink in Neutral) plus the outer ring, so it stays distinct from hover for keyboard users
      const o = opts || {}, accent = !neutral && k.btnFill.brand ? k.btnFill.hex : ink;
      const border = o.disabled ? fDis.hex : o.error ? errC : o.focus ? accent : o.hover ? fHover.hex : line.hex, thick = o.error || o.focus || o.hover;
      const shadow = [thick ? 'inset 0 0 0 1px ' + border : '', o.focus ? '0 0 0 2px ' + bg + ',0 0 0 4px ' + ring.hex : ''].filter(Boolean).join(',');
      return '<div class="cs-field' + (o.disabled ? ' dis' : '') + '">'
        + (label == null ? '' : w('<span class="cs-flabel" style="color:' + k.body.hex + '">' + label + (o.req ? ' <span style="color:' + (o.error ? errC : soft.hex) + '">*</span>' : '') + '</span>', fLabel, 'Label'))
        + w(label == null
          ? '<span class="cs-input" style="border-color:' + border + ';border-radius:' + Math.min(rad, 8) + 'px;color:' + (o.disabled ? mix(soft.hex, bg, 0.6) : value ? k.body.hex : soft.hex) + (shadow ? ';box-shadow:' + shadow : '') + '">' + (value || o.placeholder) + '</span>'
          // the form's own fields are real inputs: hover and focus animate 1px → 2px (see .cs-input.live)
          : '<input class="cs-input live" value="' + esc(value) + '" placeholder="' + esc(o.placeholder || '') + '" aria-label="' + esc(label) + '" style="--fb:' + (o.error ? errC : line.hex) + ';--fh:' + (o.error ? errC : fHover.hex) + ';--fa:' + (o.error ? errC : accent) + ';--fw:' + (o.error ? '1px' : '0px') + ';--ring:' + ring.hex + ';--bgc:' + bg + ';--ph:' + soft.hex + ';color:' + k.body.hex + ';border-radius:' + Math.min(rad, 8) + 'px">',
          value ? fValue : soft, value ? 'Value text' : 'Placeholder')
        + (o.help ? w('<span class="cs-help" style="color:' + (o.error ? errC : k.body.hex) + '">' + (o.error ? '<svg class="cs-sticon" viewBox="0 0 24 24" aria-hidden="true">' + stIcon.error + '</svg>' : '') + o.help + '</span>', o.error ? status.error : k.body, o.error ? 'Error text' : 'Helper text') : '')
        + '</div>';
    };
    // ---- shop and booking (Oct 24, from Motaki's screenshots): the single components arranged in four small, related
    // compositions (navigation; date and time with its summary; your details; the order), so they read as parts of one
    // site. Every control is live and uses the same states as fields and buttons: resting `line`, hover `accent-hover`
    // with the 2nd pixel inside, focus ring, disabled faded 60%. Days, slots and arrows are secondary buttons; selected keeps the pressed background
    // and a 2px border (not the primary fill, which competed with the real buttons). The banner is a light accent tint.
    // On the card everything is worked out against the card surface
    const MORE = () => {
      const cs = b.cardSurface.hex, inkC = E.ink(cs), softC = closestPassing(inkC, cs, 4.5), lineC = closestPassing(inkC, cs, 3);
      const divC = bTint ? tintLine(derivedCard(cs, null, 0, LINE_STEPS), c.btnFill.hex) : derivedCard(cs, null, 0, LINE_STEPS);
      const r2 = Math.min(rad, 8), hf = 'font-family:var(--hf);font-weight:var(--hw,600);text-transform:var(--ht,none)';
      const acc = !neutral && k.btnFill.brand ? k.btnFill.hex : ink, accC = c.btnFill.brand ? c.btnFill.hex : inkC;
      // the CSS variables every control reads; set once per surface, inherited by everything inside
      // --c, --wh, --wp: the secondary button (border and label, surface-hover, surface-pressed), used by days, time slots
      // and the month arrows; --sf…--slp: the primary button (fill, label, accent-hover, accent-pressed), for checkboxes
      const vars = (on, f, lab, ln, inkS, softS, accS, sec) => { const sh = stateShift(f, on, HOVER), sp = stateShift(f, on, PRESSED);
        return '--c:' + sec + ';--wh:' + stateSurface(on, sec, 0.12) + ';--wp:' + stateSurface(on, sec, 0.22) + ';--cd:' + mix(sec, on, 0.6) + ';--br:' + rad + 'px;--slh:' + labelOn(sh, lab) + ';--slp:' + labelOn(sp, lab) + ';--fb:' + ln + ';--fh:' + stateShift(accS, on, HOVER) + ';--fa:' + accS + ';--fw:0px;--ring:' + E.ink(on) + ';--bgc:' + on + ';--ph:' + softS + ';--tx:' + inkS
        + ';--sf:' + f + ';--sl:' + lab + ';--sh:' + sh + ';--sp:' + sp + ';--dl:' + mix(ln, on, 0.6) + ';--di:' + mix(inkS, on, 0.6) + ';--r:' + r2 + 'px'
        + ';--mk:url(\'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + lab + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>') + '\')'; };
      const vB = vars(bg, k.btnFill.hex, k.btnLabel.hex, line.hex, k.body.hex, soft.hex, acc, k.btn2.hex), vC = vars(cs, c.btnFill.hex, c.btnLabel.hex, lineC, inkC, softC, accC, c.btn2.hex);
      const chev = (d, sz) => '<svg viewBox="0 0 24 24" width="' + (sz || 16) + '" height="' + (sz || 16) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
      const L = 'm15 18-6-6 6-6', R = 'm9 18 6-6-6-6', DN = 'm6 9 6 6 6-6';
      const row = (l, r) => '<div class="cs-mrow2"><span>' + l + '</span><span>' + r + '</span></div>';
      const lv = (l, v) => '<div class="cs-lv"><span style="color:' + softC + '">' + l + '</span><span>' + v + '</span></div>';
      const label = (txt) => '<span class="cs-mcap" style="color:' + soft.hex + '">' + txt + '</span>';
      const h2 = (txt, col) => '<span class="cs-mh2" style="' + hf + ';color:' + (col || k.heading.hex) + '">' + txt + '</span>';
      // navigation
      const sep = '<span style="color:' + soft.hex + '" aria-hidden="true">/</span>';
      const nav = '<div class="cs-mnav"><span class="cs-back" style="--lh:' + stateShift(k.link.hex, bg, HOVER) + ';color:' + k.link.hex + '">' + chev(L) + liveLink(k.link.hex, 'Back', bg) + '</span>'
        + '<nav class="cs-crumbs" aria-label="Breadcrumb">' + liveLink(k.link.hex, 'Store', bg) + sep + liveLink(k.link.hex, 'Sessions', bg) + sep + '<span aria-current="page" style="color:' + k.body.hex + '">Booking</span></nav></div>';
      // date and time: icon buttons, days and time slots are one choice control (pick = selected, others resting)
      const pick = (txt, on, cls) => '<button type="button" class="cs-pick' + (cls ? ' ' + cls : '') + (on ? ' on' : '') + '" aria-pressed="' + !!on + '" onclick="ColorSystem.pick(this)">' + txt + '</button>';
      const days = [0, 0, 0, 0, 1, 2, 3].concat(Array.from({ length: 28 }, (_, i) => i + 4));
      const open = { 23: 1, 26: 1, 27: 1, 28: 1, 29: 1, 30: 1 };
      const cal = '<div class="cs-calmain"><div class="cs-calhead"><button type="button" class="cs-pick cs-ibtn" disabled aria-label="Previous month">' + chev(L) + '</button><b style="color:' + k.body.hex + '">October 2026</b><button type="button" class="cs-pick cs-ibtn" aria-label="Next month">' + chev(R) + '</button></div>'
        + '<div class="cs-calgrid">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d2) => '<span class="cs-wd" style="color:' + soft.hex + '">' + d2 + '</span>').join('')
        + days.map((d) => !d ? '<span></span>' : open[d] ? pick(d, d === 23, 'cs-day') : '<span class="cs-day off" style="color:' + mix(k.body.hex, bg, 0.6) + '">' + d + '</span>').join('') + '</div></div>';
      const slots = '<div class="cs-calside"><b style="color:' + k.body.hex + '">Friday, October 23</b>' + pick('9:00 to 10:00 am', true, 'cs-slot') + pick('10:30 to 11:30 am', false, 'cs-slot') + pick('2:00 to 3:00 pm', false, 'cs-slot')
        + '<span class="cs-msmall" style="color:' + k.body.hex + '">Times shown in Europe/Berlin</span></div>';
      const summary = '<div class="cs-mcard" style="background:' + cs + ';border-radius:' + Math.min(rad, 12) + 'px;color:' + inkC + '">'
        + '<span class="cs-meyebrow" style="color:' + c.kicker.hex + '">Summary</span><span class="cs-mh" style="' + hf + ';color:' + c.cardHeading.hex + '">First consultation</span>'
        + lv('Date', 'October 23, 2026') + lv('Time', '9:00 to 10:00 am') + lv('Location', 'In the practice')
        + '<hr style="border-color:' + divC + '">' + row('<b>Total</b>', '<b>€75.00</b>') + '</div>';
      const g1 = '<div class="cs-mpair"><div class="cs-mcol">' + h2('Pick a date and time') + '<div class="cs-cal">' + cal + slots + '</div>' + liveBtn(k.btnFill.hex, k.btnLabel.hex, 'Continue booking', bg) + '</div>' + summary + '</div>';
      // your details: select, text area, checkbox with description, small print
      const select = '<span class="cs-mselwrap"><select class="cs-input live cs-sel" required aria-label="Country"><option value="">Country</option><option>Germany</option><option>Austria</option><option>Switzerland</option></select><span class="cs-mselchev" style="color:' + k.body.hex + '">' + chev(DN, 18) + '</span></span>';
      const area = '<textarea class="cs-input live cs-ta" rows="3" placeholder="Anything I should know before we meet? (optional)" aria-label="Note"></textarea>';
      const cbx = '<label class="cs-cdesc"><input type="checkbox" class="cs-cbx"><span><span style="color:' + k.body.hex + '">Send me the newsletter</span><span class="cs-msmall" style="color:' + k.body.hex + '">News about sessions and events, about once a month. Unsubscribe anytime.</span></span></label>';
      const fine = '<p class="cs-msmall" style="color:' + k.body.hex + '">By booking, you agree to the ' + liveLink(k.link.hex, 'terms and conditions', bg) + '. The ' + liveLink(k.link.hex, 'privacy policy', bg) + ' applies.</p>';
      const g2 = (top, mid) => '<div class="cs-mcol">' + h2('Your details') + top + '<div class="cs-dgrid">' + select + '<input class="cs-input live" placeholder="City" aria-label="City"></div>' + mid + area + cbx + fine + liveBtn(k.btnFill.hex, k.btnLabel.hex, 'Book with obligation to pay', bg) + '</div>';
      // the order, on a card: banner, quantity, summary list
      const qty = '<span class="cs-qty" role="group" aria-label="Quantity"><button type="button" class="cs-qbtn" disabled aria-label="Fewer" onclick="ColorSystem.qty(this,-1)">−</button><b>1</b><button type="button" class="cs-qbtn" aria-label="More" onclick="ColorSystem.qty(this,1)">+</button></span>';
      const order = '<div class="cs-mcard" style="' + vC + ';background:' + cs + ';border-radius:' + Math.min(rad, 12) + 'px;color:' + inkC + '">'
        + '<span class="cs-banner" style="background:' + bg + ';color:' + k.btn2.hex + '">Reserved for <b>4:55</b></span>'
        + '<div class="cs-mrow2" style="align-items:center"><span class="cs-lv"><span>Gift voucher</span><span style="color:' + softC + '">€25.00 each</span></span>' + qty + '</div>'
        + '<div class="cs-mgap">' + row('<span style="color:' + softC + '">Subtotal</span>', '€25.00') + row('<span style="color:' + softC + '">Shipping</span>', '€0.00') + '</div><hr style="border-color:' + divC + '">' + row('<b>Total</b>', '<b>€25.00</b>')
        + liveBtn(c.btnFill.hex, c.btnLabel.hex, 'Pay now', cs) + '</div>';
      const g3 = '<div class="cs-mcol">' + h2('Your order') + order + '</div>';
      return { vB, nav, g1, g2, g3, divC, cs, inkC, softC, hf };
    };
    const sec = (title, inner) => '<div class="cs-sec2"><div class="cs-sectitle" style="color:' + soft.hex + ';border-color:' + divider.hex + '">' + title + '</div>' + inner + '</div>';
    const feature = (txt) => '<li>' + w(icon(k.icon.hex), k.icon, 'Icon') + '<span style="color:' + k.body.hex + '">' + txt + '</span></li>';
    // states as one compact grid: a row per control, a column per state
    const stateCols = ['Resting', 'Hovered', 'Pressed', 'Focused', 'Disabled', 'Visited'];
    const ringCss = 'box-shadow:0 0 0 2px ' + bg + ',0 0 0 4px ' + ring.hex;
    const h2 = stateSurface(bg, k.btn2.hex, 0.12), p2 = stateSurface(bg, k.btn2.hex, 0.22), d2 = mix(k.btn2.hex, bg, 0.6);
    const linkHover = stateShift(k.link.hex, bg, HOVER), linkPressed = stateShift(k.link.hex, bg, PRESSED), linkDark = toOklch(k.link.hex)[0] < toOklch(bg)[0];
    // the generated colors, each with the pair and minimum it has to meet, for the Failures sweep
    const acc = !neutral && k.btnFill.brand ? k.btnFill.hex : ink;
    LAST_CHECKS = [
      ['Soft text (placeholder)', soft.hex, bg, 4.5], ['Border', line.hex, bg, 3], ['Border, hovered', fHover.hex, bg, 3],
      ['Border, focused', acc, bg, 3], ['Focus ring', ring.hex, bg, 3], ['Field error text', errC, bg, 4.5],
      ['Primary button label, hovered', labelOn(hover.hex, k.btnLabel.hex), hover.hex, 4.5], ['Primary button label, pressed', labelOn(pressed.hex, k.btnLabel.hex), pressed.hex, 4.5],
      ['Secondary button, hovered', k.btn2.hex, h2, 4.5], ['Secondary button, pressed', k.btn2.hex, p2, 4.5], ['Link, hovered', linkHover, bg, 4.5], ['Link, pressed', linkPressed, bg, 4.5]
    ].concat(Object.entries(status).map(([n, r]) => [n[0].toUpperCase() + n.slice(1) + ' message', r.hex, r.surface || bg, 4.5]))
      .map(([label, hex, against, min]) => { const ratio = contrast(hex, against); return { label, base: GEN_BASE[label], r: { hex, against, ratio, min, pass: ratio >= min - 1e-9 } }; });
    const states = [
      ['Primary button', [
        [btn(fill, k.btnLabel.hex, 'Book'), k.btnFill], [btn(hover.hex, labelOn(hover.hex, k.btnLabel.hex), 'Book'), hover], [btn(pressed.hex, labelOn(pressed.hex, k.btnLabel.hex), 'Book'), pressed],
        [btn(fill, k.btnLabel.hex, 'Book', ringCss), ring], [btn(dis.hex, mix(k.btnLabel.hex, bg, 0.6), 'Book'), dis], null]],
      ['Secondary button', [
        [ghost(k.btn2.hex, 'Details'), k.btn2], [ghost(k.btn2.hex, 'Details', 'background:' + h2), D(res(h2, 'the background with 12% of the border color blended in', bg, 0), nameOf(k.btn2), 'Secondary button, hovered', k.btn2.hex, '12% over the background')],
        [ghost(k.btn2.hex, 'Details', 'background:' + p2), D(res(p2, 'the background with 22% of the border color blended in', bg, 0), nameOf(k.btn2), 'Secondary button, pressed', k.btn2.hex, '22% over the background')],
        [ghost(k.btn2.hex, 'Details', ringCss), ring], [ghost(d2, 'Details'), D(res(d2, 'the border blended 60% toward the background (disabled needs no contrast)', bg, 0), nameOf(k.btn2), 'Secondary button, disabled', k.btn2.hex, '60% toward the background')], null]],
      ['Link', [
        ['<span class="cs-lead" style="' + linkCss(k.link.hex) + '">A link</span>', k.link],
        ['<span class="cs-lead" style="' + linkCss(linkHover, true) + '">A link</span>', D(res(linkHover, 'accent-hover, underline 2px', bg, 4.5), nameOf(k.link), 'Link, hovered', k.link.hex, (linkDark ? 'Darker, L −' : 'Lighter, L +') + HOVER.toFixed(2))],
        ['<span class="cs-lead" style="' + linkCss(linkPressed, true) + '">A link</span>', D(res(linkPressed, 'accent-pressed, underline 2px', bg, 4.5), nameOf(k.link), 'Link, pressed', k.link.hex, (linkDark ? 'Darker, L −' : 'Lighter, L +') + PRESSED.toFixed(2))],
        ['<span class="cs-lead" style="' + linkCss(k.link.hex) + ';outline:2px solid ' + ring.hex + ';outline-offset:3px;border-radius:' + (rad ? 3 : 0) + 'px">A link</span>', ring], null,
        ['<span class="cs-lead" style="' + linkCss(k.link.hex) + '">A link</span>', res(k.link.hex, 'visited: same as the link', bg, 4.5)]]]
    ];
    const grid = '<div class="cs-grid"><div></div>' + stateCols.map((c2) => cap(c2)).join('')
      + states.map(([name, cells]) => cap(name) + cells.map((cell, n) => '<div>' + (cell ? w(cell[0], cell[1], name + ', ' + stateCols[n].toLowerCase()) : '<span class="cs-na" title="' + name + ' has no ' + stateCols[n].toLowerCase() + ' state">None</span>') + '</div>').join('')).join('') + '</div>';
    return '<div class="cs-site' + (S.show === 'derived' ? ' derived' : '') + '" style="border-radius:' + Math.min(pal.radius || 0, 12) + 'px;background:' + bg + ';--bgc:' + bg + ';--hf:' + esc(pal.hf || "'Cormorant Infant', serif") + ';--hw:' + (pal.hw || 600) + ';--ht:' + (pal.upper ? 'uppercase' : 'none') + ';--bf:' + esc(pal.bf || 'Mulish, sans-serif') + '">'
      // the specimen as one website page (Oct 24): header, hero with card, services, booking, details and order, footer,
      // every component in context on the sidebar's background and style. The states grid and field-state row are still
      // computed above (they fill GEN and the checks) but no longer drawn: Components shows every state
      + (() => {
        const M = MORE(), msg = (n) => { const r = status[n]; return w('<span class="cs-msg th" style="border-color:' + r.hex + ';color:' + r.hex + (r.surface ? ';background:' + r.surface + ';border-radius:' + Math.min(rad, 8) + 'px' : '') + '">' + '<svg class="cs-sticon" viewBox="0 0 24 24" aria-hidden="true">' + stIcon[n] + '</svg>' + '<span>' + { error: 'Something didn\'t send. Try again.', success: 'Booking confirmed.', warning: 'Only 2 slots left this week.', info: 'You can reschedule up to 24 hours before.' }[n] + '</span></span>', r, n[0].toUpperCase() + n.slice(1) + ' message'); };
        const hfS = 'font-family:var(--hf);font-weight:var(--hw,600);text-transform:var(--ht,none)';
        const chevI = (d) => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
        // header links are regular links in Ink, without the resting underline: hover and pressed grow it to 2px like links
        // (same transition), the current page keeps 2px, focus is the link outline
        const navLink = (txt, cur) => liveLink(k.body.hex, txt, bg).replace('class="cs-live-link"', 'class="cs-live-link nav' + (cur ? ' cur' : '') + '"');
        const header = '<header class="cs-phead" style="border-color:' + divider.hex + '"><span class="cs-plogo" style="' + hfS + ';color:' + k.heading.hex + '">Lisa Vogt</span><nav class="cs-pnav">' + navLink('Home', true) + navLink('Sessions') + navLink('About') + navLink('Contact') + '</nav>' + liveGhost(k.btn2.hex, 'Book', bg) + '</header>';
        const cardS = 'background:' + M.cs + ';border-radius:' + Math.min(rad, 12) + 'px;color:' + M.inkC;
        const head = (title, lead, extra) => '<div class="cs-phd"><div class="cs-phdt"><span class="cs-mh2" style="' + hfS + ';color:' + k.heading.hex + '">' + title + '</span>' + (lead ? '<span class="cs-plead" style="color:' + k.body.hex + '">' + lead + '</span>' : '') + '</div>' + (extra || '') + '</div>';
        const ch = (txt) => '<span class="cs-mh" style="' + hfS + ';color:' + c.cardHeading.hex + '">' + txt + '</span>';
        // services: three cards with a link each; one has a badge
        const svc = (title, txt, isNew) => '<div class="cs-pcard" style="' + cardS + '"><div class="cs-pcardb">' + (isNew ? '<span class="cs-pkick" style="color:' + c.kicker.hex + '">New</span>' : '')
          + ch(title) + '<span>' + txt + '</span><span class="cs-pcta">' + liveGhost(c.btn2.hex, 'Request a session', M.cs) + '</span></div></div>';
        const services = '<section class="cs-psec">' + head('Support that fits your needs', 'Three ways of working. Which one we use is something we decide together.')
          + '<div class="cs-pcards">' + svc('Classical naturopathy', 'Phytotherapy and gentle regulation therapies, chosen for your constitution.') + svc('Nutritional counselling', 'We start with what you eat in a normal week and change it in small steps you can keep.') + svc('Ongoing support', 'Sessions at the interval that suits you, to see what has shifted.') + '</div></section>';
        // reviews: a carousel of cards, arrows (icon buttons) and dots, all live
        const star = '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + c.link.hex + '" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
        const rev = (q, who) => '<figure class="cs-pcard cs-prevc" style="' + cardS + '"><div class="cs-pcardb"><span class="cs-pstars" aria-label="5 of 5 stars">' + star.repeat(5) + '</span><blockquote>' + q + '</blockquote><figcaption style="color:' + M.softC + '">' + who + '</figcaption></div></figure>';
        const arrows = '<div class="cs-parrows"><button type="button" class="cs-pick cs-ibtn" disabled aria-label="Previous reviews" onclick="ColorSystem.slide(this,-1)">' + chevI('m15 18-6-6 6-6') + '</button><button type="button" class="cs-pick cs-ibtn" aria-label="Next reviews" onclick="ColorSystem.slide(this,1)">' + chevI('m9 18 6-6-6-6') + '</button></div>';
        const dots = '<div class="cs-pdots" style="--don:' + k.indicator.hex + ';--doff:' + line.hex + ';--dh:' + fHover.hex + '">' + [0, 1].map((n) => '<button type="button" class="cs-pdot' + (n ? '' : ' on') + '" aria-label="Page ' + (n + 1) + '" onclick="ColorSystem.slide(this,0,' + n + ')"></button>').join('') + '</div>';
        const reviews = '<section class="cs-psec cs-prev cs-more" style="' + M.vB + '">' + head('What my patients say', 'What changed for them, in their own words.', arrows)
          + '<div class="cs-ptrack">' + [['I arrived with a long list of complaints and left feeling properly heard for the first time in years.', 'Katrin M. · Cologne'], ['My digestion had been unsettled for two winters. Three months in, I notice the difference every morning.', 'Thomas B. · Cologne'], ['It’s quiet there and nothing is hurried. I always leave calmer than I arrived.', 'Annelie R. · Cologne'], ['I wrote one message and had an appointment the same week.', 'Deniz K. · Cologne'], ['She told me plainly which symptoms belonged with my doctor, and worked with me on the rest.', 'Friederike S. · Cologne'], ['She explained what each remedy was for and left the decision to me.', 'Marek W. · Cologne']].map(([q, who]) => rev('“' + q + '”', who)).join('') + '</div>' + dots + '</section>';
        // sessions and prices
        const price = (mins, title, txt, eur) => '<div class="cs-pcard" style="' + cardS + '"><div class="cs-pcardb"><span class="cs-pkick" style="color:' + c.kicker.hex + '">' + mins + '</span>' + ch(title) + '<span>' + txt + '</span>'
          + '<span class="cs-pprice" style="' + hfS + ';color:' + c.cardHeading.hex + '">' + eur + '</span><span class="cs-pcta">' + liveBtn(c.btnFill.hex, c.btnLabel.hex, 'Book this session', M.cs) + '</span></div></div>';
        const prices = '<section class="cs-psec">' + head('Sessions and prices') + '<div class="cs-pcards">' + price('90 minutes', 'First appointment', 'The whole history, unhurried, and a plan in writing.', '120 €') + price('60 minutes', 'Follow-up session', 'What has changed, and adjusting your remedies and routines.', '90 €') + price('3.5 hours', 'Three-session path', 'A first appointment and two follow-ups over about three months.', '255 €') + '</div>'
          + '<div class="cs-psteps"><span class="cs-mh" style="' + hfS + ';color:' + k.heading.hex + '">How booking works</span><ol class="cs-list" style="color:' + k.marker.hex + '">' + ['Pick a time that suits you', 'Tell me a little about what brings you', 'Pay after your visit, in the practice'].map((x) => '<li><span style="color:' + k.body.hex + '">' + x + '</span></li>').join('') + '</ol></div>'
          + '<p class="cs-msmall" style="color:' + k.body.hex + '">Prices are per session and include your written plan. Questions? Use ' + liveLink(k.link.hex, 'the contact form', bg) + '.</p></section>';
        // questions: a live accordion
        const faqQ = (q, a, open) => '<details class="cs-faq"' + (open ? ' open' : '') + ' style="border-color:' + divider.hex + '"><summary style="color:' + k.heading.hex + ';--lh:' + stateShift(k.heading.hex, bg, HOVER) + ';--lp:' + stateShift(k.heading.hex, bg, PRESSED) + ';--hb:' + b.cardSurface.hex + ';--r2:' + Math.min(rad, 8) + 'px;--ring:' + ring.hex + '"><span style="' + hfS + '">' + q + '</span>' + chevI('m6 9 6 6 6-6') + '</summary><p style="color:' + k.body.hex + '">' + a + '</p></details>';
        const faq = '<section class="cs-psec cs-pfaq">' + head('Questions about your visit') + '<div class="cs-faqs" style="border-color:' + divider.hex + '">' + faqQ('Do I need a referral?', 'No. You can book directly, and I’ll tell you plainly if something belongs with your doctor.', true) + faqQ('Is it covered by health insurance?', 'Naturopathy is a private service in Germany. Some private and supplementary plans cover part of it.') + faqQ('What should I bring?', 'Recent test results, if you have them, and a list of what you take.') + '</div></section>';
        const booking = '<section class="cs-psec cs-more" style="' + M.vB + '">' + M.nav + M.g1 + '<div class="cs-pwarn">' + msg('warning') + '</div></section>';
        const top = msg('error') + '<div class="cs-pprog">' + '<div class="cs-progress">' + w('<span class="cs-track" style="background:' + divider.hex + '"><span style="background:' + k.btnFill.hex + '"></span></span>', checked, 'Progress fill') + cap('Step 2 of 3') + '</div>' + '</div>' + field('Name', 'Lisa Vogt', { req: true })
        + field('Email', '', { req: true, placeholder: 'name@example.com', help: 'We only use it to confirm your booking.' })
        + field('Date of birth', '12.13.1990', { req: true, error: true, help: 'Enter a date like 12.03.1990.' });
        const lbl = (input, txt) => '<label class="cs-plbl" style="color:' + k.body.hex + '">' + input + '<span>' + txt + '</span></label>';
        const mid = '<div class="cs-pchecks">' + lbl('<input type="checkbox" class="cs-cbx" checked>', 'Send me reminders') + lbl('<input type="checkbox" class="cs-cbx">', 'I\'m a new patient') + '</div>'
          + '<fieldset class="cs-pfs"><legend style="color:' + k.body.hex + '">How would you like to meet?</legend>' + lbl('<input type="radio" name="cs-meet" class="cs-rdo" checked>', 'In person') + lbl('<input type="radio" name="cs-meet" class="cs-rdo">', 'Online') + '</fieldset>';
        const details = '<section class="cs-psec cs-more" style="' + M.vB + '"><div class="cs-mpair">' + M.g2(top, mid) + M.g3 + '</div></section>';
        const done = '<section class="cs-psec"><div class="cs-pdone">' + msg('success') + msg('info') + '</div></section>';
        const footer = '<footer class="cs-pfoot" style="border-color:' + divider.hex + ';color:' + k.body.hex + '"><span class="cs-plogo" style="' + hfS + ';color:' + k.heading.hex + '">Lisa Vogt</span><span class="cs-msmall">Naturopathy in Cologne · ' + liveLink(k.link.hex, 'Imprint', bg) + ' · ' + liveLink(k.link.hex, 'Privacy', bg) + '</span></footer>';
        return header + '<section class="cs-psec cs-phero">' + '<div class="cs-split"><div class="cs-hero">'
        + '<span class="cs-peyebrow" style="color:' + k.kicker.hex + '">Naturopathy and nutrition in Cologne</span>' + w('<span class="cs-h1" style="color:' + k.heading.hex + '">Health starts with a conversation</span>', k.heading, 'Section heading')
        + w('<span class="cs-lead" style="color:' + k.body.hex + '">If your results came back fine but you don\'t feel fine, that\'s a good place for us to start. ' + liveLink(k.link.hex, 'How a first visit works', bg) + '</span>', k.body, 'Body text and link')
        // a real HTML list: the marker takes the li's color, the text keeps body color; square markers on square themes
        + '<ul class="cs-list" style="list-style-type:' + (rad === 0 ? 'square' : 'disc') + '">' + ['Steadier sleep', 'Quieter digestion', 'Energy that lasts past the afternoon'].map((x) => '<li style="color:' + k.marker.hex + '" title="' + t('List marker', k.marker) + '"><span style="color:' + k.body.hex + '">' + x + '</span></li>').join('') + '</ul>'
        + '<div class="cs-btns">' + w(liveBtn(k.btnFill.hex, k.btnLabel.hex, 'Tell me your story', bg), k.btnFill, 'Primary button') + w(liveGhost(k.btn2.hex, 'See prices', bg), k.btn2, 'Secondary button') + '</div></div>'
        + card('Then we take our time', 'Ninety minutes, a plan in writing, and someone who still remembers your whole story next time.') + '</div>' + '</section>' + services + reviews + prices + booking + details + done + faq + footer;
      })()
      + '</div>';
  };

  // ---- tabs ----
  const specimen = (E) => {
    const si = STYLES.indexOf(S.style), b = E.block(S.bg, si);
    const full = specimenFull(b, si, E, palette()); // first: it fills LAST_CHECKS for this background and style
    return pageHead('Lisa\'s site in ' + esc(palette().name), esc(S.bg) + ' background, ' + S.style + '. Hover or focus any part to see its color, what it sits on, and its contrast.') + '<div class="cs-spec"><div class="cs-spec-left">' + full + '<p class="muted">Every part with its color and contrast on this background is in <a href="#" class="cs-golink" data-goto="components|">Components</a>, and why each color is chosen is in the <a href="#" class="cs-golink" data-goto="guide|">Guide</a>. Set Highlight to “Generated” to see which colors are calculated from another one.</p></div>'
      + '</div>';
  };

  // what each theme is for, from the Q2 2025 segment research (as summarized in Alberto's styling strategy, July 2026)
  // and the template brief (Victor Sola's Q1 2026 product brief): the segment, the aesthetic direction, and the mood
  const SEGMENT_NEEDS = {
    'Health and wellness': 'Text-led sites with elegant serifs, calm spacing, large practitioner photos, and trust badges.',
    'Beauty and salons': 'Highly visual sites: a full-height hero, logos, an Instagram feed, offers, and booking.',
    Coaching: 'Strong personal branding, with stats, process steps, and quotes.',
    'Restaurants and food': 'Appetite first: big food photos, the menu with prices, opening hours, and a way to book a table.' };
  // feel: the mood, said once; colors: the palette in the brief's words (no word repeats between the two); cta: the
  // theme card's two button labels, short and selling, for its segment and mood (18 characters at most)
  const THEME_INFO = {
    calm: { segment: 'Health and wellness', direction: 'Warm and earthy', feel: 'Soft and low in contrast, so long pages of text feel quiet and easy to read.', colors: 'Ivory, honey, and taupe, all low in saturation.', cta: ['Book a session', 'See treatments'] },
    nature: { segment: 'Health and wellness', direction: 'Fresh and natural', feel: 'Bright greens bring the outdoors into a practice\'s pages.', colors: 'Bright greens with a warmer accent.', cta: ['Book a visit', 'Our treatments'] },
    gaia: { segment: 'Health and wellness', direction: 'Rich and immersive', feel: 'Deep, dark sections pull visitors into the experience.', colors: 'Deep teal and muted blush.', cta: ['Start your journey', 'Discover rituals'] },
    noir: { segment: 'Beauty and salons', direction: 'Dark luxe', feel: 'Minimal, so photos of the work carry the page.', colors: 'Charcoal, deep navy, and black, with an off-white accent.', cta: ['Book now', 'See the work'] },
    bliss: { segment: 'Beauty and salons', direction: 'Young and vibrant', feel: 'Playful pops of color make offers and booking feel fun.', colors: 'Creamy backgrounds with pops of pink, coral, and sky blue.', cta: ['Get the offer', 'Book now'] },
    barber: { segment: 'Beauty and salons', direction: 'Vintage craft', feel: 'It feels like a traditional shop, made by hand.', colors: 'Browns, wood tones, and bronze.', cta: ['Book a cut', 'See prices'] },
    career: { segment: 'Coaching', direction: 'Corporate and cool', feel: 'Authoritative, so expertise, stats, and process steps read as credible.', colors: 'Deep blues on white.', cta: ['Book a call', 'See results'] },
    coach: { segment: 'Coaching', direction: 'Warm and personal', feel: 'Visitors feel they\'re meeting the coach, not a company.', colors: 'Soft, calm tones with a deep blue accent.', cta: ['Book a free call', 'My story'] },
    grit: { segment: 'Coaching', direction: 'High contrast and bold', feel: 'Intense, so a personal brand stands out.', colors: 'Black and dark grays with a strong red accent.', cta: ['Start today', 'See results'] },
    rossi: { segment: 'Restaurants and food', direction: 'Classic and unhurried', feel: 'A long dinner at a family trattoria: nothing rushed, nothing loud.', colors: 'Black with a burnt orange accent and a warm beige.', cta: ['Book a table', 'See the menu'] } };
  // the kind of each theme font, for the typography line
  const FONT_KIND = { 'Cormorant Infant': 'an elegant serif', 'Cormorant Upright': 'an elegant upright serif', 'Playfair Display': 'a high-contrast serif', 'DM Serif Display': 'a display serif',
    Caprasimo: 'a soft, rounded display serif', Syne: 'a wide, geometric sans', 'Bebas Neue': 'a condensed sans', 'League Gothic': 'a tall, condensed sans', Karla: 'a friendly sans', 'Libre Baskerville': 'a classic book serif',
    Mulish: 'a clean sans', 'Work Sans': 'a neutral sans', Barlow: 'a slightly condensed sans' };
  // Font line height (Oct 29): a font-level correction, so it follows the heading font wherever it's used, in a theme
  // or picked by hand. Each heading font stores [sentence case, uppercase], added to every heading's line height at
  // both ends; only the one for the headings' case applies. Both come from one formula, worked out once per font:
  //   value = (letter height - reference) x 0.5, rounded to 0.01
  // sentence case: the x-height against 0.5 em; uppercase: the cap height against 0.7 em (both a typical font, the
  // kind the templates use these line heights with). Letter heights in em, from the font file's OS/2 table, in the
  // comment on each line. A font missing here gets 0. caps: the font has capitals only (always uppercase headings)
  const FONT_LH = {
    'Cormorant Infant': { lh: [-0.06, -0.04] },   // x 0.386, cap 0.625
    'Cormorant Upright': { lh: [-0.06, -0.04] },  // x 0.386, cap 0.625
    'Syne': { lh: [0, -0.03] },                   // x 0.5, cap 0.65
    'Playfair Display': { lh: [0.01, 0] },        // x 0.514, cap 0.708
    'Caprasimo': { lh: [0, 0] },                  // x 0.5, cap 0.7
    'Bebas Neue': { lh: [0, 0], caps: true },     // capitals only, cap 0.7
    'DM Serif Display': { lh: [-0.01, -0.02] },   // x 0.481, cap 0.66
    'Karla': { lh: [-0.01, -0.03] },              // x 0.486, cap 0.649
    'League Gothic': { lh: [0.02, 0.02] },        // x 0.547, cap 0.735
    'Libre Baskerville': { lh: [0.02, 0.04] },    // x 0.53, cap 0.77 (Coach's headings, Medium, since Oct 29)
    'EB Garamond': { lh: [-0.05, -0.02] }         // x 0.4, cap 0.65 (Rossi, Nov 1)
  };
  // matched fallback fonts (Oct 29): while a web font loads, the page shows a local font (Arial for sans fonts, Georgia
  // for serif ones) resized to take the same room, so lines don't rewrap and nothing jumps when the web font arrives.
  // Worked out once per font:
  //   size-adjust = width of a sample sentence in the font / its width in the fallback, measured in Chrome four ways:
  //   regular and bold (Arial Bold and Georgia Bold widen more than most fonts' bold), in sentence case and in capitals
  //   (capitals have other proportions; the heading font takes the capitals pair when headings are uppercase)
  //   ascent, descent, line gap overrides = the font's own metric / size-adjust (typesystem.js divides)
  // [fallback, size-adjust %, bold, capitals, capitals bold, ascent, descent, line gap (% of the em, from the font file: OS/2 typo
  // metrics if USE_TYPO_METRICS is set, else hhea)]. One row per family
  // line height from font metrics (Oct 29, after typography.damato.design/line-height): [glyph, leading, capitals glyph
  // (kept for reference: as a glyph it set uppercase far too tight)],
  // in em, from the font file (OS/2 typo metrics if USE_TYPO_METRICS is set, else hhea):
  //   glyph = (cap height - descender) / units per em    the band where neighbouring lines could touch
  //   leading = (ascender - cap height + line gap) / em   the white space the font puts between lines
  //   capitals glyph = cap height / units per em         uppercase has no descenders
  const FONT_METRICS = {
    'Cormorant Infant': [0.912, 0.299, 0.625], 'Cormorant Upright': [0.912, 0.299, 0.625], 'Syne': [0.925, 0.275, 0.65],
    'Playfair Display': [0.959, 0.374, 0.708], 'Caprasimo': [0.929, 0.218, 0.7], 'Bebas Neue': [1, 0.2, 0.7],
    'DM Serif Display': [0.995, 0.376, 0.66], 'Karla': [0.88, 0.289, 0.628], 'League Gothic': [0.968, 0.233, 0.735],
    'Mulish': [0.955, 0.3, 0.705], 'Work Sans': [0.903, 0.27, 0.66], 'Barlow': [0.9, 0.3, 0.7],
    'Libre Baskerville': [1.04, 0.2, 0.77], 'EB Garamond': [0.948, 0.357, 0.65],
    // (Nov 11) the customer sites' fonts, measured in Chrome with canvas (cap height, ascent, descent; the line gap
    // taken as 0): the same method reads Work Sans, Mulish, Karla, and Barlow within 0.005 of their rows above
    'Cinzel': [1.07, 0.28, 0.7], 'Montserrat': [0.95, 0.27, 0.7], 'Raleway': [0.94, 0.23, 0.71], 'DynaPuff': [0.981, 0.219, 0.741], 'Mali': [0.972, 0.328, 0.722]
  };
  // body text spacing correction (Oct 30), in em: some text fonts are drawn loose. Measured as the space beside n and o
  // in x-heights (Helvetica 0.25 and 0.13): Work Sans 0.36 and 0.23, Karla 0.39 and 0.21, Barlow 0.30 and 0.25, Mulish
  // 0.29 and 0.19. Kept small (never below -0.02em): text fonts are meant to be looser than Helvetica, and tight text is
  // harder to read. A body font with no row gets 0
  // (Nov 11) the customer sites' body fonts: Montserrat 0.37 and 0.18, Raleway 0.28 and 0.15, Mali 0.24 and 0.14
  const FONT_TRACK = { 'Work Sans': -0.015, 'Karla': -0.01, 'Barlow': -0.005, 'Mulish': 0, 'Montserrat': -0.005, 'Raleway': 0, 'Mali': 0 };
  const FONT_FALLBACK = {
    'Cormorant Infant': ['Georgia', 90.1, 77.36, 94.11, 84.38, 92.4, 28.7, 0],
    'Cormorant Upright': ['Georgia', 85.2, 72.87, 91.23, 81.38, 92.4, 28.7, 0],
    'Syne': ['Arial', 105.05, 97.39, 99.59, 98.37, 92.5, 27.5, 0],
    'Playfair Display': ['Georgia', 102.09, 86.78, 94.33, 84.15, 108.2, 25.1, 0],
    'Caprasimo': ['Georgia', 115.83, 99.05, 108.41, 96.71, 91.8, 22.9, 0],
    'Bebas Neue': ['Arial', 75.14, 69.64, 57.47, 56.77, 90.0, 30.0, 0],
    'DM Serif Display': ['Georgia', 101.36, 86.23, 88.67, 79.1, 103.6, 33.5, 0],
    'Karla': ['Arial', 100.7, 98.37, 87.77, 91.8, 91.7, 25.2, 0],
    'League Gothic': ['Arial', 58.21, 54.16, 52.85, 52.2, 96.7, 23.2, 0],
    'Mulish': ['Arial', 103.72, 99.89, 98.8, 99.85, 100.5, 25.0, 0],
    'Work Sans': ['Arial', 111.31, 103.23, 99.27, 98.42, 93.0, 24.3, 0],
    'Barlow': ['Arial', 95.69, 91.23, 87.93, 87.07, 100.0, 20.0, 0],
    'Libre Baskerville': ['Georgia', 116.96, 100.42, 116.69, 104.09, 97.0, 27.0, 0],
    // (Nov 1) measured against local Georgia with a pangram, then scaled by 0.979 to this table's sample (the method read
    // Libre Baskerville and Cormorant Infant about 2% wide)
    'EB Garamond': ['Georgia', 84.9, 80.3, 93.1, 86.6, 100.7, 29.8, 0],
    // (Nov 11) the customer sites' fonts: a pangram's width against canvas Arial or Georgia, scaled per column to this table's
    // sample by the ratio the same method reads on the rows above (Arial 1.07, 0.99, 1.077, 1.062; Georgia 1, 0.975, 1, 0.98)
    'Cinzel': ['Georgia', 123.1, 105.2, 99.3, 92.2, 98.0, 37.0, 0],
    'Montserrat': ['Arial', 112.1, 109.6, 104.4, 106.1, 97.0, 25.0, 0],
    'Raleway': ['Arial', 103.6, 99.1, 97.5, 96.3, 94.0, 23.0, 0],
    'DynaPuff': ['Arial', 111.5, 105.2, 91.6, 92.3, 96.0, 24.0, 0],
    'Mali': ['Arial', 110.3, 105.6, 99.0, 104.1, 105.0, 25.0, 0]
  };
  const fontName = (f) => String(f || '').split(',')[0].replace(/['"]/g, '').trim();
  // the three shapes a theme can have: square corners, rounded corners, or fully rounded (pill) buttons; a radius from
  // 20px makes a button fully round at its height. Cards follow the buttons, but stop at 12px
  const shapeOf = (rad) => (!rad ? 'square' : rad >= 20 ? 'round' : 'rounded');
  const SHAPE_TEXT = { square: 'Square corners', rounded: 'Rounded corners', round: 'Fully rounded' };
  // what each background is for, in the Theme tab's rows
  const BG_ROLE = { Base: 'The page', Alternate: 'Second sections', Brand: 'The accent as a background', Inverted: 'The opposite of Base', Light: 'The light ink as a background', Dark: 'Deeper than the dark ink' };
  // what each style does, in the Theme tab's column headers
  const STYLE_ROLE = { Neutral: 'Inks only', Tinted: 'Accent on buttons, links, and small parts', Vivid: 'Accent on headings too' };
  // the card at the top of the Theme tab: what the theme should convey, for whom, how its type, shape, and colors do
  // it, and what the system had to do for it
  const themeCard = (E) => {
    const k = PALETTES[S.palette] ? S.palette : null, pal = palette(), info = k && THEME_INFO[k];
    const hf = fontName(pal.hf), bf = fontName(pal.bf), rad = pal.radius == null ? 0 : pal.radius, btn = shapeOf(rad), card = shapeOf(Math.min(rad, 12));
    const b = E.block(S.bg, STYLES.indexOf(S.style)), kk = b.block, cardDark = toOklch(b.bg)[0] < 0.5;
    const ring = cardDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.12)', ink = kk.body.hex;
    const hFont = 'font-family:' + esc(pal.hf) + ';font-weight:' + (pal.hw || 600) + ';text-transform:' + (pal.upper ? 'uppercase' : 'none');
    // one big card on the sidebar's background and style. Left, the theme itself, large. Right, smaller, what the
    // colors, the typography, and the shapes are, set in the theme's own fonts
    // a hidden easter egg: the dots also set the background (here and in the sidebar), with no selected state
    const dots = BGS.slice(0, 4).map(([bg, key]) => { const now = norm(pal[key]), was = k && PALETTES[k][key] && norm(PALETTES[k][key]);
      return '<button type="button" data-set="bg" data-val="' + bg + '" aria-label="' + esc(bg + ' background') + '" title="' + esc(bg + ': ' + BG_ROLE[bg].toLowerCase() + ', ' + now + (was && was !== now ? ' (corrected from ' + was + ')' : '')) + '" style="background:' + now + ';box-shadow:inset 0 0 0 1px ' + ring + ',0 0 0 2px ' + b.bg + '"></button>'; }).join('');
    // the card's buttons are bigger than the site's, so a fully rounded theme gets a true pill here, not its 20–24px
    const bRad = btn === 'round' ? 999 : rad, btnFont = 'font-family:' + esc(pal.bf) + ';border-radius:' + bRad + 'px';
    const noAccent = brandUnavailable(E);
    const styles = '<div class="cs-tstyle" role="group" aria-label="Color style">' + STYLES.map((st) => { const off = st !== 'Neutral' && noAccent;
      return '<button type="button" data-set="style" data-val="' + st + '" aria-pressed="' + (S.style === st) + '"' + (off ? ' aria-disabled="true"' : '') + '>' + st + '</button>'; }).join('') + '</div>';
    // the link sits on its own line, with a drawn arrow that nudges on hover
    const more = '<a href="#" class="cs-golink cs-tmore" data-goto="guide|g-themes">About the corrections<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
    const fix = k && FIXES[k] ? esc(FIX_WHY[k] || '') + more : k ? 'Brand reads at 4.5:1 on Base and Alternate as it is, so nothing was corrected.' : 'A custom theme gets no corrections, so this tab shows what any palette does.';
    // each font name opens its Google Fonts page (every theme font is a Google font)
    const fontLine = (name, extra) => '<a class="cs-golink" href="https://fonts.google.com/specimen/' + encodeURIComponent(name).replace(/%20/g, '+') + '" target="_blank" rel="noopener">' + esc(name) + '</a>' + (FONT_KIND[name] ? ', ' + FONT_KIND[name] : '') + (extra || '');
    // a short list: what each part uses
    const descList = (t, items) => '<h3 style="' + hFont + ';color:' + kk.heading.hex + '">' + t + '</h3><ul>' + items.map(([lab, txt]) => '<li><b>' + lab + ':</b> ' + txt + '</li>').join('') + '</ul>';
    const desc = (t, d) => '<h3 style="' + hFont + ';color:' + kk.heading.hex + '">' + t + '</h3><p>' + codeify(d) + '</p>';
    // the example, top to bottom: the direction as the kicker, the name in the heading font, what the mood does in the
    // body font, and both buttons
    const visual = '<div class="cs-tvis">' + (info ? '<p class="cs-tkick" style="font-family:' + esc(pal.bf) + ';color:' + (kk.kicker || kk.body).hex + '">' + esc(info.direction) + '</p>' : '')
      + '<b class="cs-thead" style="' + hFont + ';color:' + kk.heading.hex + '">' + esc(pal.name) + '</b>'
      + '<p class="cs-tbody" style="font-family:' + esc(pal.bf) + '">' + (info ? esc(info.feel) : 'Body text in the theme\'s body font.') + '</p>'
      // live buttons with the system's states: the primary fill moves to accent-hover and accent-pressed, the secondary gets
      // surface-hover and surface-pressed, and both show the Ink focus ring
      + '<span class="cs-tbtns" style="--tb-bg:' + b.bg + ';--tb-ring:' + ink + '"><button type="button" class="cs-tb1" style="' + btnFont + ';--f:' + kk.btnFill.hex + ';--fh:' + stateShift(kk.btnFill.hex, b.bg, HOVER) + ';--fp:' + stateShift(kk.btnFill.hex, b.bg, PRESSED) + ';--l:' + kk.btnLabel.hex + '">' + esc(info ? info.cta[0] : 'Book a session') + '</button>'
      + '<button type="button" class="cs-tb2" style="' + btnFont + ';--c:' + kk.btn2.hex + ';--wh:' + stateSurface(b.bg, kk.btn2.hex, 0.12) + ';--wp:' + stateSurface(b.bg, kk.btn2.hex, 0.22) + '">' + esc(info ? info.cta[1] : 'See prices') + '</button></span></div>';
    // the right column: the style switch on top, then what the theme is made of; the four colors sit under Colors
    const about = '<div class="cs-tdesc" style="font-family:' + esc(pal.bf) + '">' + styles + '<div class="cs-tdescin">' + desc('Colors', (info ? esc(info.colors) + ' ' : '') + fix) + '<span class="cs-tdots">' + dots + '</span>' + descList('Typography', [['Headings', fontLine(hf, pal.upper ? ', in capitals' : '')], ['Body text', fontLine(bf)]])
      + descList('Shapes', [['Buttons', SHAPE_TEXT[btn].toLowerCase()], ['Cards', SHAPE_TEXT[card].toLowerCase()]]) + '</div></div>';
    // the same page head as every tab: the name, and who it's made for as the lead
    return '<section class="cs-theme">' + pageHead(esc(pal.name), info ? 'For the ' + esc(info.segment.toLowerCase()) + ' segment: ' + esc(SEGMENT_NEEDS[info.segment].charAt(0).toLowerCase() + SEGMENT_NEEDS[info.segment].slice(1)) : 'Your own four colors, with no corrections.')
      + '<div class="cs-tbig" style="background:' + b.bg + ';color:' + ink + ';--tlink:' + kk.link.hex + ';--tlinkh:' + stateShift(kk.link.hex, b.bg, HOVER) + ';--tline:' + dividerOn(b.bg, kk.btnFill.hex, S.style === 'Vivid' && norm(kk.btnFill.hex) === norm(pal.SecondaryColor)) + ';--tink:' + ink + ';--tbg:' + b.bg + ';--tfill:' + kk.btnFill.hex + ';--tlabel:' + kk.btnLabel.hex + ';--tbtn2:' + kk.btn2.hex + ';--trad:' + bRad + 'px;border-radius:' + Math.min(rad, 12) + 'px">' + visual + about + '</div></section>';
  };
  const matrix = (E) => {
    // the four sidebar backgrounds (Light and Dark dropped, Oct 22); each row gets a full-width label with its swatch and
    // hex instead of a side column, so the three styles get the width; the cell that's open in Specimen is outlined
    const head = STYLES.map((s) => '<div class="cs-colhead"><b>' + s + '</b><span>' + STYLE_ROLE[s] + '</span></div>').join('');
    // each row: swatch, name, and hex; what the background is for and its engine name are in the palette list above
    const rows = BGS.map(([bg, key]) => '<div class="cs-mrow" id="mrow-' + bg + '" title="' + esc(BG_ROLE[bg] + ' (' + key + ')') + '"><i style="background:' + norm(E.p[key]) + '"></i>' + bg + '<code class="cs-lchip">' + norm(E.p[key]) + '</code></div>' + STYLES.map((s, si) => {
      const b = E.block(bg, si), all = Object.values(b.block).concat(Object.values(b.card));
      const fails = all.filter((r) => !r.pass).length, brandUsed = all.filter((r) => r.brand).length;
      const wants = all.filter((r) => r.src === 'brand').length;
      const note = si === 0 ? '' : (brandUsed === 0 ? '<span class="cs-warn">No accent: looks like Neutral</span>' : '<span class="muted">Accent on ' + brandUsed + ' of ' + wants + ' parts</span>');
      return '<button type="button" class="cs-cell' + (S.bg === bg && S.style === s ? ' cur' : '') + '" data-go="' + bg + '|' + s + '">' + miniPage(b, palette()) + '<div class="cs-cellfoot">' + (fails ? '<span class="cs-badge bad sm">' + fails + ' fail</span>' : '<span class="cs-badge ok sm">All pass</span>') + note + '</div></button>';
    }).join('')).join('');
    return themeCard(E) + secHead('Every background, in every style', 'Select a cell to open it in Specimen. The outlined cell is the one open now.') + '<div class="cs-matrix">' + head + rows + '</div>';
  };

  // ---- the color inventory (Oct 23, after Motaki's walkthrough): one row per color token, with a general name, what
  // it's made from, a live swatch per background, the formula behind it and every part that uses it; everything else
  // links here (sidebar, Rules, the specimen's targets, Failures, Formulas) and back
  const TOKENS = [
    ['ink', 'Ink', 'generated', 'The theme\'s hue at a low chroma: a near-black (L 0.25) or a near-white (L 0.975), whichever reads better on the surface. Pure black or white with Black and white neutrals', 'Ink', (d, E) => E.ink(d.bg)],
    ['accent', 'Accent', 'picked', 'Brand (SecondaryColor), else Alternate (Shade1), else Ink: the first that reads at 4.5:1 on the surface', 'Brand', (d) => d.b.block.link.hex],
    ['button-label', 'Button label', 'picked', 'The surface it sits on, the block or the card: the fill was chosen at 4.5:1 on it, so the pair reads both ways', 'Button label', (d) => d.b.block.btnLabel.hex],
    ['card-surface', 'Card surface', 'generated', 'The block\'s own color, a step darker (lighter on dark blocks); it keeps the block\'s accent readable', 'Card surface', (d) => d.b.cardSurface.hex],
    ['ink-soft', 'Soft text', 'generated', 'Ink faded toward the surface as far as 4.5:1 allows', 'Soft text', (d) => d.gen('Soft text (placeholder)')],
    ['border', 'Border', 'generated', 'Ink faded toward the surface as far as 3:1 allows', 'Borders', (d) => d.gen('Border')],
    ['divider', 'Divider', 'generated', 'One and a half card steps from the surface; in Vivid toward the accent', 'Dividers', (d) => d.gen('Divider')],
    ['border-focus', 'Border, focused', 'picked', 'The accent, Ink in Neutral', 'Field states', (d) => (d.chk('Border, focused') || {}).hex],
    ['focus-ring', 'Focus ring', 'picked', 'Ink, with a gap in the surface color', 'Focus ring', (d) => (d.chk('Focus ring') || {}).hex],
    ['accent-hover', 'Accent, hovered', 'generated', 'The accent moved 0.09 in lightness, away from the surface', 'Hover and pressed', (d) => d.gen('Primary button, hovered')],
    ['accent-pressed', 'Accent, pressed', 'generated', 'The accent moved 0.16 in lightness, away from the surface', 'Hover and pressed', (d) => d.gen('Primary button, pressed')],
    ['surface-hover', 'Surface, hovered', 'generated', 'Up to 12% of the border color over the surface, keeping 4.5:1', 'Secondary button hover and pressed', (d) => (d.chk('Secondary button, hovered') || {}).against],
    ['surface-pressed', 'Surface, pressed', 'generated', 'Up to 22% of the border color over the surface, keeping 4.5:1', 'Secondary button hover and pressed', (d) => (d.chk('Secondary button, pressed') || {}).against],
    ['disabled', 'Disabled', 'generated', 'The part\'s color blended 60% toward the surface', 'Disabled', (d) => d.gen('Primary button, disabled')],
    ['error', 'Error', 'generated', 'Fixed red, 4.5:1 on the message surface', 'Status colors', (d) => (d.chk('Error message') || {}).hex],
    ['success', 'Success', 'generated', 'Green anchor nudged toward Brand, 4.5:1 on the message surface', 'Status colors', (d) => (d.chk('Success message') || {}).hex],
    ['warning', 'Warning', 'generated', 'Amber anchor nudged toward Brand, 4.5:1 on the message surface', 'Status colors', (d) => (d.chk('Warning message') || {}).hex],
    ['info', 'Info', 'generated', 'Blue anchor nudged toward Brand, 4.5:1 on the message surface', 'Status colors', (d) => (d.chk('Info message') || {}).hex],
  ].map(([id, name, kind, how, formula, get]) => ({ id, name, kind, how, formula, get }));
  // Ink is calculated from the theme's hue with art-directed neutrals, but with Black and white it's pure black or white,
  // an existing color: so its kind follows the Neutrals switch
  Object.defineProperties(TOKENS.find((t) => t.id === 'ink'), { kind: { get: () => (S.inkv === 'pure' ? 'picked' : 'generated') },
    how: { get: () => (S.inkv === 'pure' ? 'Black or white, whichever reads better on the surface' : 'The theme\'s hue at a low chroma: a near-black (L 0.25) or a near-white (L 0.975), whichever reads better on the surface') } });
  // which tokens each target uses (Rules, the specimen's targets, Failures link through this)
  const TGT_TOKENS = { body: ['ink'], heading: ['ink', 'accent'], marker: ['ink', 'accent'], btnFill: ['ink', 'accent'], btnLabel: ['button-label'],
    btnStates: ['accent-hover', 'accent-pressed', 'disabled', 'focus-ring'], btn2: ['ink', 'accent'], btn2States: ['surface-hover', 'surface-pressed', 'disabled', 'focus-ring'],
    link: ['ink', 'accent'], linkStates: ['accent-hover', 'accent-pressed', 'focus-ring', 'disabled'], fieldText: ['ink', 'ink-soft', 'error'], field: ['ink', 'ink-soft', 'border'],
    fieldStates: ['border', 'accent-hover', 'border-focus', 'disabled'], statusColors: ['error', 'success', 'warning', 'info', 'card-surface'],
    kicker: ['ink', 'accent'], icon: ['ink', 'accent', 'accent-hover', 'accent-pressed'], indicator: ['ink', 'accent'], divider: ['divider'], cardSurface: ['card-surface'], cardHeading: ['ink', 'accent'], cardRest: ['card-surface'] };
  // which components each target shows up in (Targets links through this)
  const TGT_COMP = { body: ['Section'], heading: ['Section'], marker: ['List'], btnFill: ['Primary button'], btnLabel: ['Primary button'], btnStates: ['Primary button'],
    btn2: ['Secondary button'], btn2States: ['Secondary button'], link: ['Link'], linkStates: ['Link'], fieldText: ['Text field'], field: ['Text field'],
    fieldStates: ['Text field', 'Checkbox and radio'], statusColors: ['Status messages'], kicker: ['Kicker'], icon: ['Icon'], indicator: ['Switch', 'Pagination dots'],
    divider: ['Section', 'Progress'], cardSurface: ['Card'], cardHeading: ['Card'], cardRest: ['Card'] };
  // the sidebar's generated colors and the sweep's checks, by token
  const LABEL_TOKEN = { 'Ink': 'ink', 'Card surface': 'card-surface', 'Soft text (placeholder)': 'ink-soft', 'Border': 'border', 'Divider': 'divider',
    'Primary button, hovered': 'accent-hover', 'Primary button, pressed': 'accent-pressed', 'Primary button, disabled': 'disabled', 'Secondary button, disabled': 'disabled', 'Field, disabled': 'disabled', 'Border, hovered': 'accent-hover', 'Border, focused': 'border-focus',
    'Secondary button, hovered': 'surface-hover', 'Secondary button, pressed': 'surface-pressed', 'Link, hovered': 'accent-hover', 'Link, pressed': 'accent-pressed', 'Focus ring': 'focus-ring', 'Field error text': 'error',
    'Error color': 'error', 'Success color': 'success', 'Warning color': 'warning', 'Info color': 'info', 'Error message': 'error', 'Success message': 'success', 'Warning message': 'warning', 'Info message': 'info',
    'Primary button label, hovered': 'button-label', 'Primary button label, pressed': 'button-label' };
  const tokOf = (label, id, r) => { if (LABEL_TOKEN[label] && !(TGT_TOKENS[id] || []).length) return LABEL_TOKEN[label]; if (LABEL_TOKEN[label]) return LABEL_TOKEN[label]; const ts = TGT_TOKENS[id] || []; if (ts.includes('accent')) return r && r.brand ? 'accent' : 'ink'; return ts[0]; };
  const NCOMP = 25;
  // the sidebar's generated colors, one entry per color: parts that share a token and its value (accent-hover on the
  // button, the field border and the link) show once, under the token's name, with the parts in the tooltip
  // where two entries share a token but not a value, a name that tells them apart
  const GEN_NAME = { 'Field, disabled': 'Field, disabled' };
  const GENLIST = () => { const m = new Map(); GEN.forEach((g) => { const tok = LABEL_TOKEN[g.label], key = tok ? tok + '|' + norm(g.hex) : g.label;
    if (m.has(key)) m.get(key).uses.push(g.label); else m.set(key, Object.assign({}, g, { uses: [g.label] })); });
    return [...m.values()].map((g) => Object.assign(g, { name: GEN_NAME[g.label] || (TOK(LABEL_TOKEN[g.label]) ? TOK(LABEL_TOKEN[g.label]).name : g.label) })); };
  // the sidebar's generated colors link their name to the component that uses them (their token chip goes to Colors)
  const GEN_COMP = (label) => /^Field, disabled/.test(label) ? 'Text field' : /^Card/.test(label) ? 'Card' : /^Primary button/.test(label) ? 'Primary button' : /^Secondary button/.test(label) ? 'Secondary button' : /^Link/.test(label) ? 'Link'
    : /^(Soft text|Field)/.test(label) ? 'Text field' : /^Divider/.test(label) ? 'Section' : /^(Error|Success|Warning|Info)/.test(label) ? 'Status messages' : /^Ink$/.test(label) ? 'Section' : '';
  const SURFACE_TOKENS = ['card-surface', 'surface-hover', 'surface-pressed', 'disabled'];
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const TOK = (id) => TOKENS.find((t) => t.id === id);
  const tokLink = (id) => { const t = TOK(id); return t ? '<a href="#" class="cs-tok ' + t.kind + '" data-goto="colors|tok-' + id + '">' + esc(t.id) + '</a>' : ''; };
  const fxLink = (title, label) => '<a href="#" class="cs-golink" data-goto="formulas|fx-' + slug(title) + '">' + esc(label || title) + ' →</a>';
  const ruleLink = (id) => '<a href="#" class="cs-golink" data-goto="rules|rule-' + id + '">' + esc(T(id).label) + '</a>';
  // one snapshot per background of the selected theme and style: the specimen is built off screen to read its colors
  const bgData = (E, si, pal) => {
    const keepGen = GEN;
    const out = BGS.map(([bgName]) => { const bb = E.block(bgName, si); specimenFull(bb, si, E, pal);
      const G = GEN.slice(), C = LAST_CHECKS.slice();
      return { bgName, bg: bb.bg, b: bb, gen: (l) => (G.find((x) => x.label === l) || {}).hex, chk: (l) => (C.find((x) => x.label === l) || {}).r }; });
    GEN = keepGen;
    return out;
  };
  // why each color exists, in plain words (Motaki's walkthrough, Oct 23: how, where and which formula, plus the reason)
  const TOKEN_WHY = {
    'ink': 'Text has to read on any background, so it\'s whichever of the two inks contrasts more.',
    'accent': 'Carries the brand, but only where it reads. Where it doesn\'t, the part stays in Ink.',
    'button-label': 'The label has to read on the fill. The surface color makes the button look cut out of the page.',
    'border-focus': 'Shows which field is active, in the same color as buttons and links.',
    'focus-ring': 'Keyboard users need to see where they are on every background, so it\'s always Ink.',
    'card-surface': 'Sets a card apart from its block without competing with the text on it.',
    'ink-soft': 'Secondary text, like placeholders and kickers, steps back but stays readable.',
    'border': 'Field borders show where you can type, so they need 3:1 to be seen.',
    'divider': 'Separators only organize the layout, so they stay quiet and need no contrast minimum.',
    'accent-hover': 'Hover should feel like a response. One shared step makes buttons, links, and fields react the same way.',
    'accent-pressed': 'A stronger step than hover confirms the press, the same on every interactive part.',
    'surface-hover': 'An outline button has no fill to change, so hover adds a light background in its own color.',
    'surface-pressed': 'A stronger background than hover confirms the press, and the label stays readable.',
    'disabled': 'Disabled parts should look unavailable, so they fade toward the background. They\'re exempt from contrast.',
    'error': 'Errors need a color people recognize as red, so it keeps a fixed, vivid red hue and is always shown with an icon.',
    'success': 'Success needs a color people recognize as green, tuned to the theme and always shown with an icon.',
    'warning': 'Warnings need a color people recognize as amber, tuned to the theme and always shown with an icon.',
    'info': 'Information needs a calm color people recognize as blue, tuned to the theme and always shown with an icon.'
  };
  // values, ratios, units and code names in running text get the monospace chip (outside tags, links and code), in
  // every tab, so a value always looks like a value
  const CODE_RE = /((?<![\w&])#[0-9A-Fa-f]{6}\b|\d+(?:\.\d+)?:1|(?<![\w.])\d+(?:\.\d+)?(?:px|ms|%)|(?<![\w.])\d*\.\d+\b|ΔE|\b(?:MainColor|Shade1|SecondaryColor|Shade2)\b|color-mix\(\)|oklch\(\))/g;
  const codeify = (html) => String(html).split(/(<pre\b[^>]*>.*?<\/pre>|<code\b[^>]*>.*?<\/code>|<span class="cs-gnum">.*?<\/span>|<a\b[^>]*>.*?<\/a>|<[^>]+>)/s).map((part, i) => i % 2 ? part : part.replace(CODE_RE, (m) => '<code class="cs-lchip">' + (m[0] === '#' ? m : tidyNum(m)) + '</code>')).join('');
  // a link to a Guide section, and which section explains each token, component and target group (in the Guide's order,
  // which every other tab follows)
  const guideLink = (id, label) => '<a href="#" class="cs-golink" data-goto="guide|g-' + id + '">' + (label || 'Guide →') + '</a>';
  // a heading that is itself the link to its Guide section, with an arrow (Targets groups, Components)
  const headLink = (id, text) => '<a href="#" class="cs-headlink" data-goto="guide|g-' + id + '" title="Read about it in the Guide">' + text + '<span class="cs-arrow" aria-hidden="true">→</span></a>';
  const TOKEN_GUIDE = { accent: 'styles', ink: 'ink', 'ink-soft': 'text', border: 'lines', divider: 'lines', 'button-label': 'labels', 'surface-hover': 'buttons', 'surface-pressed': 'buttons',
    'border-focus': 'fields', 'accent-hover': 'hover', 'accent-pressed': 'hover', 'focus-ring': 'focus', disabled: 'disabled', error: 'status', success: 'status', warning: 'status', info: 'status', 'card-surface': 'cards' };
  const COMP_GUIDE = { Section: 'overview', Card: 'cards', 'Summary list': 'cards', Link: 'links', List: 'text', Kicker: 'text', Icon: 'ink', 'Primary button': 'buttons', 'Secondary button': 'buttons',
    'Icon button': 'buttons', Choice: 'buttons', 'Text field': 'fields', Quantity: 'fields', 'Select and text area': 'fields', 'Checkbox and radio': 'fields', 'Checkbox with description': 'fields',
    Switch: 'styles', 'Date picker': 'buttons', 'Navigation link': 'links', 'Breadcrumb and back link': 'links', 'Pagination dots': 'styles', Accordion: 'lines', 'Status messages': 'status', Banner: 'status', Progress: 'lines' };
  const GROUP_GUIDE = { Text: 'text', Buttons: 'buttons', Links: 'links', Forms: 'fields', Status: 'status', 'Small elements': 'lines', Card: 'cards' };
  // a row of links at the top of a long page, one per group, with how many items it holds
  const sectionIndex = (items) => '<nav class="cs-secindex" aria-label="Jump to a group">' + items.map(([id, label, n, dot]) => '<a href="#" data-gscroll="' + id + '">' + (dot ? '<i class="' + dot + '"></i>' : '') + esc(label) + (n != null ? '<span>' + n + '</span>' : '') + '</a>').join('') + '</nav>';
  // the first few links, then the rest behind "+N more"
  const fewThenMore = (links, few = 4) => links.length <= few + 1 ? links.join(', ') : links.slice(0, few).join(', ') + ' <details class="cs-more"><summary>+' + (links.length - few) + ' more</summary>' + links.slice(few).join(', ') + '</details>';
  // every tab opens the same way: a title that says what the page holds, and one line on how to read it
  // the Confluence page that holds the same content, for tabs that have one (Oct 26)
  const CONF = { overview: 'https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6628999178/Colors+Systems+overview', guide: 'https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6648168465/Color+system+Guide', formulas: 'https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6648430599/Color+system+Formulas', tests: 'https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6648889360/Color+system+Tests' };
  const confLink = (url) => url ? '<a class="cs-conflink" href="' + url + '" target="_blank" rel="noopener">View in Confluence</a>' : '';
  const pageHead = (title, intro, kicker, conf) => '<header class="cs-pagehead">' + (kicker ? '<p class="cs-kick">' + kicker + '</p>' : '') + '<h1>' + title + '</h1>' + (intro ? '<p class="cs-lead">' + intro + '</p>' : '') + confLink(conf) + '</header>';
  // a section inside a tab: the same heading and intro everywhere
  const secHead = (title, intro, id) => '<header class="cs-shead"' + (id ? ' id="' + id + '"' : '') + '><h2>' + title + '</h2>' + (intro ? '<p>' + intro + '</p>' : '') + '</header>';
  const colorsTab = (E) => {
    const si = STYLES.indexOf(S.style), pal = palette(), DATA = bgData(E, si, pal);
    const uses = (id) => TARGETS.filter((t) => (TGT_TOKENS[t.id] || []).includes(id));
    const comps = buildComponents(E, DATA.find((x) => x.bgName === S.bg));
    const inComps = (id) => fewThenMore(comps.filter(([, , parts]) => parts.some(([, tok]) => tok === id)).map(([name]) => '<a href="#" class="cs-golink" data-goto="components|comp-' + slug(name) + '">' + esc(name) + '</a>'));
    const head = '<tr><th>Color</th>' + DATA.map((d) => '<th class="cs-invbg">' + d.bgName + '<span class="cs-bgalias">' + esc((BGS.find((x) => x[0] === d.bgName) || [])[1] || '') + '</span></th>').join('') + '<th>Made from</th><th>Used in</th></tr>';
    let grp = '';
    const order = Object.keys(TOKEN_GUIDE), byGuide = (a, b) => order.indexOf(a.id) - order.indexOf(b.id);
    const rows = TOKENS.filter((t) => t.kind === 'picked').sort(byGuide).concat(TOKENS.filter((t) => t.kind !== 'picked').sort(byGuide)).map((t) => { const g = t.kind === 'picked' ? 'Reused' : 'Generated'; const h = g !== grp ? '<tr class="grp" id="tokgrp-' + (t.kind === 'picked' ? 'picked' : 'generated') + '"><td colspan="' + (DATA.length + 3) + '">' + g + '<span class="cs-grpdesc">' + (t.kind === 'picked' ? 'An existing color, chosen by a rule: a theme color, Ink, or the surface. In code, a reference to another color.' : 'A new color, calculated from the theme\'s colors by a formula.') + '</span></td></tr>' : ''; grp = g;
      return h + '<tr id="tok-' + t.id + '"><td class="cs-why"><span class="cs-tok ' + t.kind + ' big">' + t.id + '</span><p>' + codeify(esc(TOKEN_WHY[t.id] || '')) + '</p></td>'
        + DATA.map((d) => { const hex = t.get(d, E); return '<td class="cs-invbg">' + (hex ? '<span class="cs-invaa">' + sample(SURFACE_TOKENS.includes(t.id) ? { hex: E.ink(hex), against: hex } : { hex, against: t.id === 'button-label' ? d.b.block.btnFill.hex : d.bg }) + '</span>' : '<span class="muted">None</span>') + '</td>'; }).join('')
        + '<td>' + codeify(esc(t.how)) + '<div>' + fxLink(t.formula, 'Formula') + (TOKEN_GUIDE[t.id] ? ' · ' + guideLink(TOKEN_GUIDE[t.id]) : '') + '</div></td><td class="cs-invuse">' + inComps(t.id) + (uses(t.id).length ? '<a href="#" class="cs-golink cs-tgtlink" data-goto="rules|rule-' + uses(t.id)[0].id + '">In ' + uses(t.id).length + ' target' + (uses(t.id).length > 1 ? 's' : '') + ' →</a>' : '') + '</td></tr>'; }).join('');
    const nPicked = TOKENS.filter((t) => t.kind === 'picked').length;
    return pageHead('Every color, and where it\'s used', 'On each background of ' + esc(pal.name) + ' in ' + S.style + ': why each color exists, and how it\'s made.', '', CONF.overview + '#Color-tokens')
      + sectionIndex([['tokgrp-picked', 'Reused', nPicked, 'picked'], ['tokgrp-generated', 'Generated', TOKENS.length - nPicked, 'generated']])
      + '<table class="cs-table cs-inv"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';
  };
  // ---- the component inventory (Oct 23): each component drawn live on the selected background and style, with every
  // part and state, the token it uses (linked to Colors) and the color it resolves to here
  const buildComponents = (E, d) => {
    const si = STYLES.indexOf(S.style), pal = palette(), b = d.b, k = b.block, c = b.card, bg = b.bg;
    const rad = pal.radius == null ? 0 : pal.radius, ink = E.ink(bg), font = 'font-family:' + esc(pal.bf || 'Mulish, sans-serif');
    const acc = (r) => (r && r.brand ? 'accent' : 'ink'), H = (h) => norm(h || '#000000');
    const g = (l) => d.gen(l), ck = (l) => d.chk(l) || {};
    const btn = (fill, label, txt, extra) => '<span style="display:inline-block;padding:8px 14px;border-radius:' + rad + 'px;background:' + fill + ';color:' + label + ';font-weight:600;font-size:13px;' + (extra || '') + '">' + txt + '</span>';
    const ghost = (col, txt, extra) => '<span style="display:inline-block;padding:7px 13px;border-radius:' + rad + 'px;border:1px solid ' + col + ';color:' + col + ';font-weight:600;font-size:13px;' + (extra || '') + '">' + txt + '</span>';
    const ring = 'box-shadow:0 0 0 2px ' + bg + ',0 0 0 4px ' + H(ck('Focus ring').hex);
    const field = (border, txt, col, extra) => '<span style="display:block;width:150px;padding:7px 9px;border:1px solid ' + border + ';border-radius:' + Math.min(rad, 8) + 'px;color:' + col + ';font-size:12px;' + (extra || '') + '">' + txt + '</span>';
    const msg = ck('Error message').against, cs = b.cardSurface.hex;
    const kick = H(g('Soft text (placeholder)')), div = H(g('Divider')), line = H(g('Border')), ringC = H(ck('Focus ring').hex);
    const hov = H(g('Primary button, hovered')), prs = H(g('Primary button, pressed')), dis = H(g('Primary button, disabled')), disL = mix(k.btnLabel.hex, bg, 0.6);
    const w1 = H(ck('Secondary button, hovered').against), w2 = H(ck('Secondary button, pressed').against), dis2 = H(g('Secondary button, disabled'));
    const fH = H(ck('Border, hovered').hex), fF = H(ck('Border, focused').hex), err = H(ck('Field error text').hex), lp = H(ck('Link, pressed').hex), lh = H(ck('Link, hovered').hex), fDisC = H(g('Field, disabled')), lDis = mix(k.link.hex, bg, 0.6);
    const orn = k.indicator.hex, ornInk = E.ink(orn);
    const CH = { L: 'm15 18-6-6 6-6', R: 'm9 18 6-6-6-6' }, chevS = (d) => '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
    const box = (border, col, inner, extra, size) => '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;box-sizing:border-box;border:1.5px solid ' + border + ';border-radius:' + rad + 'px;color:' + col + ';' + (size || '') + ';' + (extra || '') + '">' + inner + '</span>';
    const P2 = 'width:auto;padding:0 10px';
    const softCs = closestPassing(E.ink(b.cardSurface.hex), b.cardSurface.hex, 4.5), divCs = derivedCard(b.cardSurface.hex, null, 0, LINE_STEPS);
    // previews (Oct 24 visual pass): real sizes as on the specimen, the theme's fonts and corners, one cell per state with
    // its name underneath. State names everywhere: Resting, Hovered, Pressed, Focused, Disabled, Visited, Selected
    const fs = 'font-family:var(--bf)', hfS = 'font-family:var(--hf);font-weight:var(--hw,600);text-transform:var(--ht,none)';
    const cell = (html, cap) => '<div class="cs-cst"><span class="cs-cstcap">' + cap + '</span><div class="cs-cstv">' + html + '</div></div>';
    const cells = (list) => '<div class="cs-csts">' + list.map(([h, cap]) => cell(h, cap)).join('') + '</div>';
    const B = (fill, label, txt, extra) => '<span class="cs-cb" style="background:' + fill + ';border-color:' + fill + ';color:' + label + ';border-radius:' + rad + 'px;' + (extra || '') + '">' + txt + '</span>';
    const G = (col, txt, extra) => '<span class="cs-cb" style="background:transparent;border-color:' + col + ';color:' + col + ';border-radius:' + rad + 'px;' + (extra || '') + '">' + txt + '</span>';
    const F = (border, txt, col, extra) => '<span class="cs-cf" style="border-color:' + border + ';border-radius:' + Math.min(rad, 8) + 'px;color:' + col + ';' + (extra || '') + '">' + txt + '</span>';
    const inset = (c) => 'box-shadow:inset 0 0 0 1px ' + c, ringF = ',0 0 0 2px ' + bg + ',0 0 0 4px ';
    const LK = (col, txt, w, extra) => '<span style="font-size:16px;color:' + col + ';text-decoration:underline ' + w + 'px;text-underline-offset:3px;' + (extra || '') + '">' + txt + '</span>';
    const svgI = (d, col, sz, sw) => '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" fill="none" stroke="' + col + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
    const tick = svgI('<path d="M5 12.5l4.5 4.5L19 7.5"/>', k.btnLabel.hex, 14, 3);
    const cbx = (border, fill, extra, mark) => '<span style="flex:none;width:20px;height:20px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;border-radius:' + Math.min(rad, 4) + 'px;border:1.5px solid ' + border + ';background:' + (fill || 'transparent') + ';' + (extra || '') + '">' + (fill ? (mark ? svgI('<path d="M5 12.5l4.5 4.5L19 7.5"/>', mark, 14, 3) : tick) : '') + '</span>';
    const rdo = (border, dot, extra) => '<span style="flex:none;width:20px;height:20px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid ' + border + ';' + (extra || '') + '">' + (dot ? '<span style="width:10px;height:10px;border-radius:50%;background:' + dot + '"></span>' : '') + '</span>';
    const withLabel = (ctl, txt) => '<span style="display:inline-flex;gap:10px;align-items:center;font-size:15px;color:' + k.body.hex + '">' + ctl + txt + '</span>';
    const ib = (border, col, fill, extra, dir) => '<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;box-sizing:border-box;border:1.5px solid ' + border + ';border-radius:' + rad + 'px;color:' + col + ';background:' + (fill || 'transparent') + ';' + (extra || '') + '">' + svgI('<path d="' + (dir || CH.R) + '"/>', 'currentColor', 18) + '</span>';
    const fadedInk = mix(k.body.hex, bg, 0.6), SL = 'padding:10px 18px;font-size:14px';
    const ST = { error: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>', success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>', warning: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4M12 17h.01"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>' };
    // parts: [part, token, color shown, sample text color, sample surface, contrast minimum]. A text or line part is its own
    // color on the surface it sits on; a surface part shows what sits on it. Minimum 0: decorative or disabled, no check.
    const t = (part, tok, hex, on, min) => [part, tok, H(hex), H(hex), H(on), min];
    const sf = (part, tok, hex, fg, min) => [part, tok, H(hex), H(fg), H(hex), min];
    const C = [
      ['Section', '<div style="color:' + k.body.hex + ';max-width:440px;' + fs + '"><div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:' + k.kicker.hex + ';margin-bottom:12px">' + esc((THEME_INFO[S.palette] || {}).direction || 'Kicker') + '</div><div style="' + hfS + ';font-size:36px;line-height:1.08;color:' + k.heading.hex + '">Section heading</div><div style="font-size:16px;line-height:1.55;margin-top:12px">Body text on the block, long enough to wrap onto a second line.</div></div>',
        [sf('Background', null, bg, k.body.hex, 0).concat(S.bg + ' (' + BGS.find((x) => x[0] === S.bg)[1] + ')', 'none'), t('Heading', acc(k.heading), k.heading.hex, bg, 4.5), t('Body text', 'ink', k.body.hex, bg, 4.5), t('Kicker', acc(k.kicker), k.kicker.hex, bg, 4.5)],
        'The background is the one picked for the block. Everything else on it is worked out against it.'],
      ['Card', '<div style="background:' + cs + ';border-radius:' + Math.min(rad, 12) + 'px;padding:24px;width:300px;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;' + fs + '"><div style="' + hfS + ';font-size:24px;line-height:1.1;color:' + c.cardHeading.hex + '">Card heading</div><div style="font-size:15px;line-height:1.5;color:' + c.body.hex + '">Text on the card with a <span style="color:' + c.link.hex + ';text-decoration:underline;text-underline-offset:3px">link</span>.</div><div style="margin-top:8px">' + B(c.btnFill.hex, c.btnLabel.hex, 'Book a session', 'width:100%;box-sizing:border-box') + '</div></div>',
        [['Surface', 'card-surface', H(cs), H(c.body.hex), H(cs), 0, null, [H(cs), bg]], t('Heading', acc(c.cardHeading), c.cardHeading.hex, cs, 4.5), t('Text', 'ink', c.body.hex, cs, 4.5), t('Link', acc(c.link), c.link.hex, cs, 4.5), t('Button fill', acc(c.btnFill), c.btnFill.hex, cs, 3), t('Button label', 'button-label', c.btnLabel.hex, c.btnFill.hex, 4.5)],
        'Every block part is worked out again on the card surface. Parts in the accent keep the block\'s accent, so card and block match.'],
      ['Primary button', cells([[B(k.btnFill.hex, k.btnLabel.hex, 'Book'), 'Resting'], [B(hov, k.btnLabel.hex, 'Book'), 'Hovered'], [B(prs, k.btnLabel.hex, 'Book'), 'Pressed'], [B(k.btnFill.hex, k.btnLabel.hex, 'Book', ring), 'Focused'], [B(dis, disL, 'Book'), 'Disabled']]),
        [t('Fill', acc(k.btnFill), k.btnFill.hex, bg, 3), t('Label', 'button-label', k.btnLabel.hex, k.btnFill.hex, 4.5), sf('Fill, hovered', 'accent-hover', hov, k.btnLabel.hex, 4.5), sf('Fill, pressed', 'accent-pressed', prs, k.btnLabel.hex, 4.5), t('Focus ring', 'focus-ring', ringC, bg, 3), sf('Disabled', 'disabled', dis, disL, 0)],
        'The label keeps its color in every state. Focus: a 2px ring with a 2px gap in the background color. Disabled has no contrast minimum.'],
      ['Secondary button', cells([[G(k.btn2.hex, 'See prices'), 'Resting'], [G(k.btn2.hex, 'See prices', 'background:' + w1), 'Hovered'], [G(k.btn2.hex, 'See prices', 'background:' + w2), 'Pressed'], [G(k.btn2.hex, 'See prices', ring), 'Focused'], [G(dis2, 'See prices'), 'Disabled']]),
        [t('Border and label', acc(k.btn2), k.btn2.hex, bg, 4.5), sf('Background, hovered', 'surface-hover', w1, k.btn2.hex, 4.5), sf('Background, pressed', 'surface-pressed', w2, k.btn2.hex, 4.5), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Disabled', 'disabled', dis2, bg, 0)],
        'A 1px border in the label color. Hover and pressed add a light background behind the label; the border and label stay the same. For something that stays selected, use Choice.'],
      ['Link', cells([[LK(k.link.hex, 'Read more', 1), 'Resting'], [LK(lh, 'Read more', 2), 'Hovered'], [LK(lp, 'Read more', 2), 'Pressed'], [LK(k.link.hex, 'Read more', 1, 'outline:2px solid ' + ringC + ';outline-offset:3px;border-radius:' + (rad ? 3 : 0) + 'px'), 'Focused'], [LK(k.link.hex, 'Read more', 1), 'Visited'], [LK(lDis, 'Read more', 1, 'cursor:not-allowed'), 'Disabled']]),
        [t('Text and underline', acc(k.link), k.link.hex, bg, 4.5), t('Text, hovered', 'accent-hover', lh, bg, 4.5), t('Text, pressed', 'accent-pressed', lp, bg, 4.5), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Text, disabled', 'disabled', lDis, bg, 0)],
        'Underlined in every state, so a link never relies on color: 1px resting and visited, 2px on hover and pressed. Hover and pressed use the same colors as buttons and fields; visited keeps the resting color. Focus: a 2px outline 3px away from the text, square on square themes. Disabled works like the buttons: the color blends 60% toward the background and the 1px underline stays.'],
      ['List', cells([['<ul style="margin:0;padding-left:20px;font-size:16px;line-height:1.7;' + fs + ';list-style-type:' + (rad === 0 ? 'square' : 'disc') + '">' + ['Unhurried first sessions', 'Plans that fit your week', 'Follow-ups by phone'].map((x) => '<li style="color:' + k.marker.hex + '"><span style="color:' + k.body.hex + '">' + x + '</span></li>').join('') + '</ul>', 'Bulleted'],
          ['<ol style="margin:0;padding-left:24px;font-size:16px;line-height:1.7;' + fs + '">' + ['Pick a time', 'Tell me your story', 'Get your plan in writing'].map((x) => '<li style="color:' + k.marker.hex + ';font-weight:700"><span style="color:' + k.body.hex + ';font-weight:400">' + x + '</span></li>').join('') + '</ol>', 'Numbered']]),
        [t('Bullets', acc(k.marker), k.marker.hex, bg, 3), t('Numbers', acc(k.marker), k.marker.hex, bg, 4.5), t('Text', 'ink', k.body.hex, bg, 4.5)],
        'Bullets and numbers take the accent (Ink in Neutral); the text stays Ink. Square bullets on square themes, round otherwise. Numbers count as text, so they need 4.5:1.'],
      ['Text field', (() => { const dimP = mix(kick, bg, 0.6);
          const fld = (border, val, valC, help, o) => { o = o || {}; const lab = k.body.hex;  // disabled fades only the control: label and helper stay readable
            return '<div style="display:flex;flex-direction:column;gap:6px;width:220px;' + fs + '"><span style="font-size:15px;font-weight:400;color:' + lab + '">Email <span style="color:' + (o.err ? err : kick) + '">*</span></span>' + F(border, val, valC, o.x) + '<span style="font-size:13px;line-height:1.4;color:' + (o.err ? err : lab) + ';display:flex;gap:5px;align-items:flex-start">' + (o.err ? '<span style="display:flex;align-items:center;height:1.4em;flex:none">' + svgI(ST.error, err, 14) + '</span>' : '') + help + '</span></div>'; };
          const H1 = 'We only use it to confirm your booking.', E1 = 'Enter an email like name@example.com.';
          return cells([[fld(line, 'name@example.com', kick, H1), 'Resting'], [fld(line, 'lisa@vogt.de', k.body.hex, H1), 'Filled'], [fld(fH, 'name@example.com', kick, H1, { x: inset(fH) }), 'Hovered'],
            [fld(fF, 'lisa@vo', k.body.hex, H1, { x: inset(fF) + ringF + ringC }), 'Focused'], [fld(err, 'lisa@', k.body.hex, E1, { err: true, x: inset(err) }), 'Error'],
            [fld(err, 'lisa@', k.body.hex, E1, { err: true, x: inset(err) + ringF + ringC }), 'Error, focused'], [fld(fDisC, 'Not needed', dimP, H1, { dis: true }), 'Disabled']]); })(),
        [t('Label, value, helper', 'ink', k.body.hex, bg, 4.5), t('Placeholder, required marker', 'ink-soft', kick, bg, 4.5), t('Border', 'border', line, bg, 3), t('Border, hovered', 'accent-hover', fH, bg, 3), t('Border, focused', 'border-focus', fF, bg, 3), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Error border and text', 'error', err, bg, 4.5), t('Border, disabled', 'disabled', fDisC, bg, 0)],
        'The field surface is the block. Border 1px resting and filled; 2px on hover, focus, and error, the extra pixel drawn inside so nothing moves. Focus adds the ring, also on an error. Disabled blends the border and the value 60% toward the background; the label and helper text stay in Ink, so people can still read what the field is. Errors keep the error border and show the message with an icon instead of the helper text. Fields have no pressed state: selecting one focuses it. Select and text area follow the same states.'],
      ['Checkbox and radio', (() => { const wl = (c, txt) => '<span style="display:inline-flex;gap:10px;align-items:center;font-size:15px;color:' + k.body.hex + '">' + c + txt + '</span>', ringBox = 'box-shadow:0 0 0 2px ' + bg + ',0 0 0 4px ' + ringC;
          const states = (ctl, txt) => cells([[wl(ctl(line), txt), 'Resting'], [wl(ctl(fH, null, inset(fH)), txt), 'Hovered'], [wl(ctl(prs, null, inset(prs)), txt), 'Pressed'], [wl(ctl(line, null, ringBox), txt), 'Focused'], [wl(ctl(k.btnFill.hex, k.btnFill.hex), txt), 'Selected'], [wl(ctl(hov, hov), txt), 'Selected, hovered'], [wl(ctl(fDisC), txt, true), 'Disabled'], [wl(ctl(dis, dis, '', disL), txt, true), 'Disabled, selected']]);
          return '<div style="display:flex;flex-direction:column;gap:28px">' + states((b2, f, x, mk) => cbx(b2, f, x, mk), 'Reminders') + states((b2, f, x) => rdo(b2, f, x), 'Online') + '</div>'; })(),
        [t('Border', 'border', line, bg, 3), t('Border, hovered', 'accent-hover', fH, bg, 3), t('Border, pressed', 'accent-pressed', prs, bg, 3), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Selected', acc(k.btnFill), k.btnFill.hex, bg, 3), t('Check mark', 'button-label', k.btnLabel.hex, k.btnFill.hex, 3), t('Selected, hovered', 'accent-hover', hov, bg, 3), t('Disabled', 'disabled', fDisC, bg, 0), sf('Disabled, selected', 'disabled', dis, disL, 0), t('Label', 'ink', k.body.hex, bg, 4.5)],
        'Like the text field: hover and pressed draw a 2px border in the shared accent-hover and accent-pressed colors (the 2nd pixel inside), focus adds the ring. Selected uses the primary button fill, with the check mark or dot in its label color; hovered while selected, the fill takes accent-hover. Disabled fades the border, fill, and label 60% toward the background.'],
      ['Progress', '<div style="width:300px;' + fs + '"><div style="height:6px;border-radius:3px;background:' + div + '"><div style="width:66%;height:100%;border-radius:3px;background:' + k.btnFill.hex + '"></div></div><div style="font-size:13px;margin-top:10px;color:' + kick + '">Step 2 of 3</div></div>',
        [t('Fill', acc(k.btnFill), k.btnFill.hex, bg, 3), t('Track', 'divider', div, bg, 0)],
        'The fill carries the meaning, so the track is decorative.'],
      ['Status messages', '<div style="display:flex;flex-direction:column;gap:8px;width:320px;' + fs + '">' + [['Error', 'error', 'Something didn\'t send. Try again.'], ['Success', 'success', 'Booking confirmed.'], ['Warning', 'warning', 'Only 2 slots left this week.'], ['Info', 'info', 'You can reschedule up to 24 hours before.']].map(([n, key, txt]) => { const col = H(ck(n + ' message').hex); return '<span style="display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:' + Math.min(rad, 8) + 'px;background:' + H(ck(n + ' message').against) + ';color:' + col + ';font-size:14px;font-weight:600;line-height:20px">' + svgI(ST[key], col, 18) + '<span>' + txt + '</span></span>'; }).join('') + '</div>',
        [['Surface', 'card-surface', H(msg), H(E.ink(H(msg))), H(msg), 0, null, [H(msg), bg]], t('Error', 'error', ck('Error message').hex, msg, 4.5), t('Success', 'success', ck('Success message').hex, msg, 4.5), t('Warning', 'warning', ck('Warning message').hex, msg, 4.5), t('Info', 'info', ck('Info message').hex, msg, 4.5)],
        'Always with an icon (circle-cross, circle-check, triangle, circle-i), so meaning never relies on color. Always on the card surface, like the cards; Ink where a status color can\'t reach 4.5:1 there.'],
      ['Kicker', cells([['<span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:' + k.kicker.hex + '">Naturopathy in Cologne</span>', 'On the block'], ['<span style="display:inline-block;background:' + cs + ';border-radius:' + Math.min(rad, 8) + 'px;padding:10px 12px"><span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:' + c.kicker.hex + '">Summary</span></span>', 'On a card']]),
        [t('Text', acc(k.kicker), k.kicker.hex, bg, 4.5), t('Text on a card', acc(c.kicker), c.kicker.hex, cs, 4.5)],
        'A short uppercase label above a heading or on a card, like a section topic, a duration or “New”. Brand in Tinted only; Ink in Neutral and Vivid, where the heading already carries Brand.'],
      ['Icon', (() => { const heart = (c) => svgI('<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/>', c, 32), iH = stateShift(k.icon.hex, bg, HOVER), iP = stateShift(k.icon.hex, bg, PRESSED);
          return cells([[heart(k.icon.hex), 'Resting'], [heart(iH), 'Hovered'], [heart(iP), 'Pressed']]); })(),
        [t('Icon', acc(k.icon), k.icon.hex, bg, 3), t('Icon, hovered', 'accent-hover', stateShift(k.icon.hex, bg, HOVER), bg, 3), t('Icon, pressed', 'accent-pressed', stateShift(k.icon.hex, bg, PRESSED), bg, 3)],
        'Icons that carry meaning need 3:1. Decorative icons have no minimum. A clickable icon changes color on hover and pressed like a link, moving away from the background, so its contrast only goes up.'],
      // ---- added Oct 24: switch, navigation link, accordion and pagination dots, with every state
      ['Switch', (() => { const ornH = stateShift(orn, bg, HOVER), fade = (c) => mix(c, bg, 0.6);
          const sw = (on, track, knob, extra) => '<span style="display:block;width:44px;height:24px;box-sizing:border-box;border-radius:' + (rad ? 999 : 2) + 'px;position:relative;' + (on ? 'background:' + track : 'border:1.5px solid ' + track) + ';' + (extra || '') + '"><span style="position:absolute;' + (on ? 'right:3px;top:3px' : 'left:2.5px;top:2.5px') + ';width:' + (on ? 18 : 16) + 'px;height:' + (on ? 18 : 16) + 'px;border-radius:' + (rad ? 999 : 1) + 'px;background:' + knob + '"></span></span>';
          const ringBox = 'box-shadow:0 0 0 2px ' + bg + ',0 0 0 4px ' + ringC;
          return cells([[sw(false, line, line), 'Off'], [sw(false, fH, fH, inset(fH)), 'Off, hovered'], [sw(true, orn, ornInk), 'On'], [sw(true, ornH, ornInk), 'On, hovered'], [sw(false, line, line, ringBox), 'Focused'], [sw(false, fade(line), fade(line)), 'Disabled'], [sw(true, fade(orn), fade(ornInk)), 'Disabled, on']]); })(),
        [t('Track and knob, off', 'border', line, bg, 3), t('Off, hovered', 'accent-hover', fH, bg, 3), t('Track, on', acc(k.indicator), orn, bg, 3), sf('Knob, on', 'ink', orn, ornInk, 3), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Disabled', 'disabled', mix(line, bg, 0.6), bg, 0)],
        'Off is an outlined track with the knob in the border color; on fills the track with the accent and the knob is Ink worked out on it. Hover moves the off border to accent-hover and the on track away from the background. Focus adds the ring; disabled fades everything 60% toward the background. The label next to it is Ink.'],
      ['Navigation link', (() => { const navH = stateShift(k.body.hex, bg, HOVER), navP = stateShift(k.body.hex, bg, PRESSED);
          return cells([['<span style="font-size:16px;color:' + k.body.hex + '">Sessions</span>', 'Resting'], [LK(navH, 'Sessions', 2), 'Hovered'], [LK(navP, 'Sessions', 2), 'Pressed'], ['<span style="font-size:16px;color:' + k.body.hex + ';outline:2px solid ' + ringC + ';outline-offset:3px;border-radius:' + (rad ? 3 : 0) + 'px">Sessions</span>', 'Focused'], [LK(k.body.hex, 'Sessions', 2), 'Current']]); })(),
        [t('Text and underline', 'ink', k.body.hex, bg, 4.5), ['Text, hovered', null, H(stateShift(k.body.hex, bg, HOVER)), H(stateShift(k.body.hex, bg, HOVER)), H(bg), 4.5, 'Ink moved like accent-hover'], ['Text, pressed', null, H(stateShift(k.body.hex, bg, PRESSED)), H(stateShift(k.body.hex, bg, PRESSED)), H(bg), 4.5, 'Ink moved like accent-pressed'], t('Focus ring', 'focus-ring', ringC, bg, 3)],
        'A link in Ink, so the menu stays calm in every style, with no underline at rest: hover and pressed show a 2px underline with the same transition and color shifts as links, focus is the link outline, and only the current page keeps the 2px underline.'],
      ['Accordion', (() => { const qH = stateShift(k.heading.hex, bg, HOVER), qP = stateShift(k.heading.hex, bg, PRESSED), onCard = 'background:' + cs, chev = (up) => svgI('<path d="' + (up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6') + '"/>', 'currentColor', 18);
          const item = (q, c, open, extra, ul) => '<div style="width:300px;border-top:1px solid ' + div + ';border-bottom:1px solid ' + div + ';' + fs + '"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 10px;font-size:18px;line-height:1.25;color:' + c + ';' + (extra || '') + '"><span style="' + hfS + (ul ? ';text-decoration:underline 2px;text-underline-offset:4px' : '') + '">' + q + '</span>' + chev(open) + '</div>' + (open ? '<p style="margin:0;padding:0 10px 12px;font-size:14px;line-height:1.5;color:' + k.body.hex + '">No. You can book directly.</p>' : '') + '</div>';
          return cells([[item('Do I need a referral?', k.heading.hex, false), 'Closed'], [item('Do I need a referral?', qH, false, onCard), 'Hovered'], [item('Do I need a referral?', qP, false, onCard), 'Pressed'], [item('Do I need a referral?', k.heading.hex, false, 'box-shadow:0 0 0 2px ' + ringC + ';border-radius:2px'), 'Focused'], [item('Do I need a referral?', k.heading.hex, true), 'Open']]); })(),
        [t('Question and chevron', acc(k.heading), k.heading.hex, bg, 4.5), ['Question, hovered', null, H(stateShift(k.heading.hex, bg, HOVER)), H(stateShift(k.heading.hex, bg, HOVER)), H(bg), 4.5, 'The heading color moved like accent-hover'], ['Question, pressed', null, H(stateShift(k.heading.hex, bg, PRESSED)), H(stateShift(k.heading.hex, bg, PRESSED)), H(bg), 4.5, 'The heading color moved like accent-pressed'], ['Background, hovered and pressed', 'card-surface', H(cs), H(stateShift(k.heading.hex, bg, HOVER)), H(cs), 4.5, null, [H(stateShift(k.heading.hex, bg, HOVER)), H(cs)]], t('Answer', 'ink', k.body.hex, bg, 4.5), t('Dividers', 'divider', div, bg, 0), t('Focus ring', 'focus-ring', ringC, bg, 3)],
        'Questions are headings: the theme\'s heading font and case, and the heading color, so they take the accent in Vivid and stay Ink in Neutral and Tinted. Answers are Ink, separated by dividers. Hover and pressed put the question on the card surface and move its color away from the background (accent-hover, accent-pressed), so contrast goes up, as on links and buttons; no underline. The chevron turns when open. Focus: a 2px ring around the question.'],
      ['Pagination dots', (() => { const dot = (c, extra) => '<span style="display:block;width:10px;height:10px;border-radius:50%;background:' + c + ';' + (extra || '') + '"></span>', row3 = (a, b2, c3) => '<span style="display:flex;gap:8px">' + a + b2 + c3 + '</span>';
          return cells([[row3(dot(orn), dot(line), dot(line)), 'Resting'], [row3(dot(orn), dot(fH), dot(line)), 'Hovered'], [row3(dot(orn), dot(line, 'box-shadow:0 0 0 2px ' + bg + ',0 0 0 4px ' + ringC), dot(line)), 'Focused']]); })(),
        [t('Dot, current', acc(k.indicator), orn, bg, 3), t('Dot, other', 'border', line, bg, 3), t('Dot, hovered', 'accent-hover', fH, bg, 3), t('Focus ring', 'focus-ring', ringC, bg, 3)],
        'Dots carry meaning (which page is shown), so every dot needs 3:1: the current one in the accent, the others in the border color. The carousel arrows are icon buttons.'],
      // shop and booking (Oct 24): every control follows the text field's states; selected is the primary button pair
      ['Breadcrumb and back link', cells([['<span style="display:inline-flex;align-items:center;gap:4px;font-size:15px;color:' + k.link.hex + '">' + svgI('<path d="' + CH.L + '"/>', 'currentColor', 16) + '<span style="text-decoration:underline;text-underline-offset:3px">Back</span></span>', 'Back link'], ['<span style="font-size:15px;display:inline-flex;gap:8px"><span style="color:' + k.link.hex + ';text-decoration:underline;text-underline-offset:3px">Store</span><span style="color:' + kick + '">/</span><span style="color:' + k.link.hex + ';text-decoration:underline;text-underline-offset:3px">Sessions</span><span style="color:' + kick + '">/</span><span style="color:' + k.body.hex + '">Booking</span></span>', 'Breadcrumb']]),
        [t('Links and back icon', acc(k.link), k.link.hex, bg, 4.5), t('Separators', 'ink-soft', kick, bg, 0), t('Current page', 'ink', k.body.hex, bg, 4.5)],
        'Links follow the link states; the back icon takes the link color in every state. Separators are decorative. The current page is plain text, not a link.'],
      ['Icon button', cells([[ib(k.btn2.hex, k.btn2.hex), 'Resting'], [ib(k.btn2.hex, k.btn2.hex, w1), 'Hovered'], [ib(k.btn2.hex, k.btn2.hex, w2), 'Pressed'], [ib(k.btn2.hex, k.btn2.hex, null, ring), 'Focused'], [ib(dis2, dis2, null, '', CH.L), 'Disabled']]),
        [t('Border and icon', acc(k.btn2), k.btn2.hex, bg, 3), sf('Background, hovered', 'surface-hover', w1, k.btn2.hex, 3), sf('Background, pressed', 'surface-pressed', w2, k.btn2.hex, 3), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Disabled', 'disabled', dis2, bg, 0)],
        'A secondary button with an icon: resting, hover, focus, disabled. Same border, corners, and states as the secondary button.'],
      ['Select and text area', (() => { const dimT = mix(k.body.hex, bg, 0.6), dimP = mix(kick, bg, 0.6), r8 = Math.min(rad, 8) + 'px';
          // one field per state: label, control, helper or error line, like the text field
          const wrap = (label, ctl, help, o) => '<div style="display:flex;flex-direction:column;gap:6px;width:220px;' + fs + '"><span style="font-size:15px;font-weight:400;color:' + k.body.hex + '">' + label + '</span>' + ctl + '<span style="font-size:13px;line-height:1.4;color:' + (o.err ? err : k.body.hex) + ';display:flex;gap:5px;align-items:flex-start">' + (o.err ? '<span style="display:flex;align-items:center;height:1.4em;flex:none">' + svgI(ST.error, err, 14) + '</span>' : '') + help + '</span></div>';
          const sel = (border, val, valC, o) => wrap('Country', '<span class="cs-cf" style="border-color:' + border + ';border-radius:' + r8 + ';display:flex;justify-content:space-between;align-items:center;color:' + valC + ';' + (o.x || '') + '">' + val + svgI('<path d="m6 9 6 6 6-6"/>', o.dis ? dimT : k.body.hex, 18) + '</span>', o.err ? 'Choose a country.' : 'Where you live.', o);
          const area = (border, val, valC, o) => wrap('Note', '<span class="cs-cf" style="border-color:' + border + ';border-radius:' + r8 + ';color:' + valC + ';height:84px;white-space:normal;position:relative;' + (o.x || '') + '">' + val + '<span style="position:absolute;right:3px;bottom:3px;display:flex">' + svgI('<path d="M20 12 12 20M20 17l-3 3"/>', o.dis ? dimP : kick, 12) + '</span></span>', o.err ? 'Keep it under 500 characters.' : 'Optional.', o);
          const row = (f, ph, val) => cells([[f(line, ph, kick, {}), 'Resting'], [f(line, val, k.body.hex, {}), 'Filled'], [f(fH, ph, kick, { x: inset(fH) }), 'Hovered'], [f(fF, val, k.body.hex, { x: inset(fF) + ringF + ringC }), 'Focused'], [f(err, val, k.body.hex, { err: true, x: inset(err) }), 'Error'], [f(fDisC, ph, dimP, { dis: true }), 'Disabled']]);
          return '<div style="display:flex;flex-direction:column;gap:28px">' + row(sel, 'Choose a country', 'Germany') + row(area, 'Anything I should know?', 'Mornings work best for me.') + '</div>'; })(),
        [t('Border', 'border', line, bg, 3), t('Label, value, helper', 'ink', k.body.hex, bg, 4.5), t('Placeholder, resize handle', 'ink-soft', kick, bg, 4.5), t('Select chevron', 'ink', k.body.hex, bg, 3), t('Border, hovered', 'accent-hover', fH, bg, 3), t('Border, focused', 'border-focus', fF, bg, 3), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Error border and text', 'error', err, bg, 4.5), t('Border, disabled', 'disabled', fDisC, bg, 0)],
        'The same states as the text field: Resting, Filled, Hovered, Focused, Error, and Disabled, with the same borders, ring, and error line. Disabled fades only the control, so the label and helper text stay in Ink. The select\'s chevron is Ink and fades when disabled; its open list is the browser\'s own. The text area resizes vertically, with the handle in soft text.'],
      ['Checkbox with description', cells([false, true].map((on) => ['<span style="display:flex;gap:10px;align-items:flex-start;width:260px;' + fs + ';color:' + k.body.hex + '"><span style="margin-top:1px;display:flex">' + (on ? cbx(k.btnFill.hex, k.btnFill.hex) : cbx(line)) + '</span><span style="display:flex;flex-direction:column;gap:2px"><span style="font-size:15px">Send me the newsletter</span><span style="font-size:13px;line-height:1.5">About once a month. Unsubscribe anytime.</span></span></span>', on ? 'Selected' : 'Resting'])),
        [t('Box', 'border', line, bg, 3), t('Label and description', 'ink', k.body.hex, bg, 4.5), t('Box, selected', acc(k.btnFill), k.btnFill.hex, bg, 3), t('Check mark', 'button-label', k.btnLabel.hex, k.btnFill.hex, 3)],
        'The label has the same weight as other checkbox labels; the description is smaller, in Ink. The whole row is clickable. States follow the checkbox.'],
      ['Choice', cells([[G(k.btn2.hex, '9:00 am', SL), 'Resting'], [G(k.btn2.hex, '9:00 am', SL + ';background:' + w1), 'Hovered'], [G(k.btn2.hex, '9:00 am', SL + ';background:' + w2), 'Pressed'], [G(k.btn2.hex, '9:00 am', SL + ';' + ring), 'Focused'], [G(k.btn2.hex, '9:00 am', SL + ';background:' + w2 + ';box-shadow:inset 0 0 0 .5px ' + k.btn2.hex), 'Selected'], [G(dis2, '9:00 am', SL), 'Disabled']]),
        [t('Border and label', acc(k.btn2), k.btn2.hex, bg, 4.5), sf('Background, hovered', 'surface-hover', w1, k.btn2.hex, 4.5), sf('Background, pressed and selected', 'surface-pressed', w2, k.btn2.hex, 4.5), t('Focus ring', 'focus-ring', ringC, bg, 3), t('Disabled', 'disabled', dis2, bg, 0)],
        'Time slots, days, and payment methods: the secondary button\'s colors, corners, and states. Selected keeps the pressed background and a 2px border, so it reads as chosen without competing with the primary button.'],
      ['Date picker', '<div style="width:320px;' + fs + '"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' + ib(dis2, dis2, null, '', CH.L) + '<b style="font-size:15px;color:' + k.body.hex + '">October 2026</b>' + ib(k.btn2.hex, k.btn2.hex) + '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;font-size:14px">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((x) => '<span style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:' + kick + '">' + x + '</span>').join('') + [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((x) => { const base = 'height:36px;display:flex;align-items:center;justify-content:center;border-radius:' + rad + 'px;box-sizing:border-box;'; return x === 23 ? '<span style="' + base + 'border:2px solid ' + k.btn2.hex + ';background:' + w2 + ';color:' + k.btn2.hex + ';font-weight:700">' + x + '</span>' : (x > 25 && x < 31) || x === 24 ? '<span style="' + base + 'border:1.5px solid ' + k.btn2.hex + ';color:' + k.btn2.hex + ';font-weight:700">' + x + '</span>' : '<span style="' + base + 'color:' + fadedInk + '">' + x + '</span>'; }).join('') + '</div></div>',
        [t('Weekdays', 'ink-soft', kick, bg, 4.5), t('Available days', acc(k.btn2), k.btn2.hex, bg, 4.5), sf('Selected day', 'surface-pressed', w2, k.btn2.hex, 4.5), t('Unavailable days', 'disabled', mix(k.body.hex, bg, 0.6), bg, 0)],
        'Open days and the picked day are Choices; past and full days are plain faded text. The month arrows are icon buttons, so the whole picker uses the button styles.'],
      ['Quantity', cells([false, true].map((hv) => ['<span style="display:inline-flex;align-items:center;gap:4px;border:1px solid ' + line + ';border-radius:' + Math.min(rad, 8) + 'px;padding:3px;font-size:15px;color:' + k.body.hex + ';' + fs + '"><span style="width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;color:' + fadedInk + '">−</span><b style="min-width:22px;text-align:center">1</b><span style="width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;color:' + (hv ? fH : k.body.hex) + '">+</span></span>', hv ? 'Hovered' : 'Resting'])),
        [t('Border', 'border', line, bg, 3), t('Value, − and +', 'ink', k.body.hex, bg, 4.5), t('− and +, hovered', 'accent-hover', fH, bg, 4.5), t('−, disabled at 1', 'disabled', mix(k.body.hex, bg, 0.6), bg, 0)],
        'One bordered group. − and + change color on hover and get the focus ring; − is disabled at 1.'],
      ['Banner', '<span style="display:block;width:320px;box-sizing:border-box;padding:12px 16px;border-radius:' + Math.min(rad, 8) + 'px;background:' + w1 + ';color:' + k.btn2.hex + ';font-size:15px;' + fs + '">Reserved for <b>4:55</b></span>',
        [sf('Background', 'surface-hover', w1, k.btn2.hex, 4.5), t('Text', acc(k.btn2), k.btn2.hex, w1, 4.5)],
        'A light tint of the accent with accent text, like a hovered secondary button: it informs without competing with the buttons. Not a status message: no icon, no status color.'],
      ['Summary list', '<div style="background:' + cs + ';border-radius:' + Math.min(rad, 12) + 'px;padding:20px 24px;width:320px;box-sizing:border-box;font-size:14px;line-height:1.5;color:' + E.ink(cs) + ';display:flex;flex-direction:column;gap:6px;' + fs + '"><div style="display:flex;justify-content:space-between"><span style="color:' + softCs + '">Subtotal</span><span>€25.00</span></div><div style="display:flex;justify-content:space-between"><span style="color:' + softCs + '">Shipping</span><span>€0.00</span></div><div style="border-top:1px solid ' + divCs + ';margin:6px 0"></div><div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700"><span>Total</span><span>€25.00</span></div></div>',
        [['Surface', 'card-surface', H(cs), H(E.ink(cs)), H(cs), 0, null, [H(cs), bg]], t('Labels', 'ink-soft', softCs, cs, 4.5), t('Values and total', 'ink', E.ink(cs), cs, 4.5), t('Divider', 'divider', divCs, cs, 0)],
        'On the card surface, worked out against it. Labels in soft text, values in Ink, a divider before the total.']
    ];
    return C;
  };
  const componentsTab = (E) => {
    const si = STYLES.indexOf(S.style), pal = palette(), d = bgData(E, si, pal).find((x) => x.bgName === S.bg), bg = d.bg, rad = pal.radius == null ? 0 : pal.radius, font = 'font-family:' + esc(pal.bf || 'Mulish, sans-serif'), H = (h) => norm(h || '#000000');
    // grouped like a design system (Oct 24): containers, text, actions, navigation, form controls, feedback
    const GROUPS = [['Compositions', ['Section', 'Card', 'Summary list']], ['Text', ['Link', 'List', 'Kicker', 'Icon']],
      ['Actions', ['Primary button', 'Secondary button', 'Icon button', 'Choice']], ['Form controls', ['Text field', 'Quantity', 'Select and text area', 'Checkbox and radio', 'Checkbox with description', 'Switch', 'Date picker']],
      ['Navigation', ['Navigation link', 'Breadcrumb and back link', 'Pagination dots', 'Accordion']], ['Feedback', ['Status messages', 'Banner', 'Progress']]];
    const ALL = buildComponents(E, d), byName = Object.fromEntries(ALL.map((x) => [x[0], x])), listed = new Set(GROUPS.flatMap((g) => g[1]));
    const rest = ALL.filter((x) => !listed.has(x[0])), C = GROUPS.flatMap(([g, names]) => names.filter((n) => byName[n]).map((n, i) => Object.assign(byName[n].slice(), { group: i ? null : g }))).concat(rest);
    return pageHead('Every component, in every state', 'Each part, the token it uses, and the color that token resolves to on ' + esc(pal.name) + ', ' + S.bg + ', ' + S.style + ', and its contrast against what it sits on. Select a token to see it in Colors.') + sectionIndex(GROUPS.map(([g, names]) => ['cgrp-' + slug(g), g, names.filter((n) => byName[n]).length])) + LEGENDS
      + C.map((cmp) => { const [name, preview, parts, spec] = cmp; return (cmp.group ? '<h3 class="cs-compgrp" id="cgrp-' + slug(cmp.group) + '">' + esc(cmp.group) + '</h3>' : '') + '<article class="cs-comp" id="comp-' + slug(name) + '"><h4>' + (COMP_GUIDE[name] ? headLink(COMP_GUIDE[name], esc(name)) : esc(name)) + '</h4>' + (spec ? '<p class="cs-compspec">' + codeify(esc(spec)) + '</p>' : '') + '<div class="cs-compbody"><div class="cs-comppv" style="background:' + bg + ';' + font + ';--bf:' + esc(pal.bf || 'Mulish, sans-serif') + ';--hf:' + esc(pal.hf || 'serif') + ';--hw:' + (pal.hw || 600) + ';--ht:' + (pal.upper ? 'uppercase' : 'none') + ';--cap:' + H(closestPassing(E.ink(bg), bg, 4.5)) + '">' + preview + '</div>'
        + '<div><table class="cs-table cs-comptab"><thead><tr><th>Part</th><th>Token</th><th>Color</th><th>Contrast</th></tr></thead><tbody>' + parts.map(([part, tok, hex, fg, on, min, note, pair]) => { const ratio = pair && pair !== 'none' ? contrast(pair[0], pair[1]) : contrast(fg, on);
        return '<tr><td>' + esc(part) + '</td><td>' + (tok ? tokLink(tok) : '<span class="muted">' + esc(note || '') + '</span>') + '</td><td class="cs-compcol">' + sample({ hex: fg, against: on }) + '<code class="cs-lchip">' + hex + '</code></td><td>' + (pair === 'none' ? '<span class="muted">The block itself</span>' : crCell({ ratio, min, pass: !min || ratio >= min - 1e-9 }) + (pair ? '<span class="cs-crmin cs-crblock">Against the block</span>' : '')) + '</td></tr>'; }).join('') + '</tbody></table></div></div></article>'; }).join('');
  };
  const SRC_TOKEN = { ink: 'ink', brand: 'accent', emph: 'card-surface', fillInk: 'button-label' };
  // one row per part and per state. [label, token ('src': the target's own per-style source; null: no color of its own),
  // needs (a ratio, 0 for none; left out: the target's minimum), note]
  const RULE_PARTS = {
    btn2: [['Secondary button border', 'src', 3], ['Secondary button label', 'src', 4.5]],
    btnStates: [['Primary button, hovered', 'accent-hover', 4.5, 'The label on this fill'], ['Primary button, pressed', 'accent-pressed', 4.5, 'The label on this fill'], ['Primary button, disabled', 'disabled', 0, 'Disabled parts are exempt'], ['Primary button, focused', 'focus-ring', 3, 'On the background']],
    btn2States: [['Secondary button, hovered', 'surface-hover', 4.5, 'The label on this surface'], ['Secondary button, pressed', 'surface-pressed', 4.5, 'The label on this surface'], ['Secondary button, disabled', 'disabled', 0, 'Disabled parts are exempt'], ['Secondary button, focused', 'focus-ring', 3, 'On the background']],
    linkStates: [['Link, hovered', 'accent-hover', 4.5, '2px underline'], ['Link, pressed', 'accent-pressed', 4.5, '2px underline'], ['Link, focused', 'focus-ring', 3, 'On the block background'], ['Link, visited', 'link', 4.5, 'Same as resting'], ['Link, disabled', 'disabled', 0, 'Like disabled buttons; the underline stays']],
    fieldText: [['Field label', 'ink', 4.5], ['Helper text', 'ink', 4.5], ['Required marker', 'ink-soft', 4.5], ['Error text', 'error', 4.5, 'With an icon before the text']],
    field: [['Field surface', null, 0, 'The block background'], ['Field value', 'ink', 4.5, 'On the field'], ['Placeholder', 'ink-soft', 4.5, 'On the field'], ['Field border', 'border', 3, 'On the block']],
    fieldStates: [['Field, resting', 'border', 3], ['Field, hovered', 'accent-hover', 3], ['Field, focused', 'border-focus', 3, 'Plus the focus ring'], ['Field, error', 'error', 3], ['Field, disabled', 'disabled', 0, 'Border and value only; label and helper stay in Ink']],
    statusColors: [['Error', 'error', 4.5, 'Text 4.5:1, icon 3:1; never color alone'], ['Success', 'success', 4.5, 'Text 4.5:1, icon 3:1; never color alone'], ['Warning', 'warning', 4.5, 'Text 4.5:1, icon 3:1; never color alone'], ['Info', 'info', 4.5, 'Text 4.5:1, icon 3:1; never color alone'], ['Message surface', 'card-surface', 0]],
    kicker: [['Kicker', 'src']],
    icon: [['Icon', 'src'], ['Icon, hovered', 'accent-hover', 3, 'Clickable icons; like links'], ['Icon, pressed', 'accent-pressed', 3, 'Clickable icons; like links']],
    indicator: [['Switch, on', 'src', 3], ['Pagination dot, current', 'src', 3]],
    divider: [['Divider', 'divider', 0, 'Separators, kicker lines, progress track. No minimum']],
    cardSurface: [['Card surface', 'card-surface', 0, 'Decorative: no minimum, or 3:1 if the whole card is clickable. The block\'s own color, a step darker or lighter']],
    cardRest: [['Everything else on the card', 'same', 0, 'The block\'s targets, worked out again on the card surface']] };
  // ---- the Guide tab (Oct 24): written explanations of what the tables can't explain (when Tinted and Vivid are
  // available, how cards are made), plus the handoff items that live nowhere else in the page. It replaced a Spec tab
  // that mostly repeated Targets, Colors and Formulas. Examples are computed live from the engine
  // how the corrected theme colors were found (Oct 22, re-solved Oct 24 for the final card rule). Run once by hand; the
  // results are the hex values in FIXES. Shown in the Guide, not in Formulas, which only has runtime colors
  // a heading's copy-link button (Guide and Formulas): copies …#system/<tab>/<id>
  const LINK_ICON = window.DocKit.icons.link;
  const copyLink = (path, t) => '<button type="button" class="cs-glink" data-copylink="' + path + '" aria-label="Copy link to ' + esc(t) + '" title="Copy link">' + LINK_ICON + '</button>';
  const guideTab = (E) => {
    const P2 = (k) => Object.assign({}, PALETTES[k], FIXES[k] || {}), opt = Object.assign({}, S, { card: 'derived', rule: 'aa45', fallback: 'shade2' });
    const chip = (h) => '<span class="cs-gchip"><i style="background:' + h + '"></i><code>' + tidyNum(norm(h)) + '</code></span>';
    // where Tinted and Vivid can be used: backgrounds of the nine themes where some target gets the accent
    // backgrounds with an accent, out of 54: Brand only, or Brand then Alternate (the fallback switch is gone, so it's measured here)
    // the three styles side by side, each a small copy of the Theme tab's example (kicker, name, mood, both buttons) on the
    // sidebar's theme and background, without the description column (Oct 28)
    const styleCards = () => { const k = PALETTES[S.palette] ? S.palette : null, pal = palette(), info = k && THEME_INFO[k], rad = pal.radius == null ? 0 : pal.radius;
      const hFont = 'font-family:' + esc(pal.hf) + ';font-weight:' + (pal.hw || 600) + ';text-transform:' + (pal.upper ? 'uppercase' : 'none');
      const btnFont = 'font-family:' + esc(pal.bf) + ';border-radius:' + (shapeOf(rad) === 'round' ? 999 : rad) + 'px';
      return '<div class="cs-gstyles">' + STYLES.map((st, i) => { const b = E.block(S.bg, i), kk = b.block;
        return '<figure><figcaption>' + st + '</figcaption><div class="cs-gstyle" style="background:' + b.bg + ';color:' + kk.body.hex + ';border-radius:' + Math.min(rad, 12) + 'px">'
          + (info ? '<span class="cs-gskick" style="font-family:' + esc(pal.bf) + ';color:' + (kk.kicker || kk.body).hex + '">' + esc(info.direction) + '</span>' : '')
          + '<b class="cs-gshead" style="' + hFont + ';color:' + kk.heading.hex + '">' + esc(pal.name) + '</b>'
          + '<span class="cs-gsbody" style="font-family:' + esc(pal.bf) + '">' + (info ? esc(info.feel) : 'Body text in the theme\'s body font.') + '</span>'
          + '<span class="cs-gsbtns"><span style="' + btnFont + ';background:' + kk.btnFill.hex + ';border-color:' + kk.btnFill.hex + ';color:' + kk.btnLabel.hex + '">' + esc(info ? info.cta[0] : 'Book a session') + '</span>'
          + '<span style="' + btnFont + ';border-color:' + kk.btn2.hex + ';color:' + kk.btn2.hex + '">' + esc(info ? info.cta[1] : 'See prices') + '</span></span></div>'
          + '</figure>'; }).join('') + '</div><p class="cs-gmuted">' + esc(pal.name) + ' on ' + esc(S.bg) + ', the sidebar\'s theme and background.</p>'; };
    const availCount = (fixed, withAlt) => { let n = 0, tot = 0; Object.keys(PALETTES).forEach((k) => { const p = fixed ? P2(k) : PALETTES[k], e = engine(p, opt); BGS.forEach(([bg]) => { const h = e.block(bg, 2).bg; tot++; if (contrast(p.SecondaryColor, h) >= MIN || (withAlt && contrast(p.Shade1, h) >= MIN)) n++; }); }); return [n, tot]; };
    // which theme color each background takes as its accent, on the nine corrected themes (Oct 27)
    const sideMap = () => { const rows = Object.keys(PALETTES).map((k) => { const p = P2(k), e = engine(p, opt);
        return '<tr><td>' + esc(p.name) + '</td>' + BGS.map(([bg]) => { const b = e.block(bg, 2), f = b.block.btnFill, who = !f.brand ? 'Ink' : norm(f.hex) === norm(p.SecondaryColor) ? 'Brand' : 'Alternate';
          return '<td' + (who === 'Alternate' ? ' class="alt"' : '') + ' title="' + esc(p.name + ' ' + bg + ': ' + who + ' ' + f.hex) + '"><span class="cs-gside" style="background:' + b.bg + ';color:' + f.hex + ';font-family:' + esc(p.hf || 'inherit') + '">Aa</span><span class="cs-gsidelab">' + who + '</span></td>'; }).join('') + '</tr>'; }).join('');
      return '<table class="cs-gtab cs-gsides"><thead><tr><th>Theme</th>' + BGS.map(([bg]) => '<th>' + bg + '</th>').join('') + '</tr></thead><tbody>' + rows + '</tbody></table>'; };
    // how close Alternate sits to Base on the nine corrected themes, as [lowest, highest] contrast
    const altRange = () => { const r = Object.keys(PALETTES).map((k) => contrast(P2(k).MainColor, P2(k).Shade1)); return [Math.min(...r), Math.max(...r)]; };
    const pct = ([n, tot]) => n + ' of ' + tot + ', ' + Math.round(n / tot * 100) + '%';
    // the same theme with its Brand pushed to the edge of Display P3 (same hue, still 4.5:1 on Base and Alternate):
    // what a wide-gamut theme gets, next to the sRGB original
    const p3Theme = (k) => { const pl = P2(k), [L0, , H] = toOklch(pl.SecondaryColor); let L = L0, x;
      do { const C = inGamutMode('p3', () => maxChroma(L, H)) * 0.97; x = oklchCss([L, C, H]); L += toOklch(pl.MainColor)[0] > 0.5 ? -0.005 : 0.005; }
      while ((contrast(x, pl.MainColor) < 4.5 || contrast(x, pl.Shade1) < 4.5) && L > 0.05 && L < 0.95);
      return Object.assign({}, pl, { SecondaryColor: x }); };
    const p3Theme2 = (k) => { const rows = [P2(k), p3Theme(k)].map((pl) => { const e = engine(pl, opt), b = e.block('Base', 2).block, fill = b.btnFill.hex, hov = stateShift(fill, pl.MainColor, HOVER), card = e.block('Brand', 2).cardSurface.hex;
        return { pl, fill, hov, card, g: e.gamut }; });
      const col = (r) => '<div class="cs-p3col"><b>' + (r.g === 'p3' ? 'Brand in Display P3' : 'Brand in sRGB') + '</b>' + [['Brand', r.fill], ['Hovered', r.hov], ['Card on Brand', r.card]].map(([n, c]) => '<span class="cs-p3line"><i style="background:' + c + '"></i><span>' + n + '<code>' + tidyNum(norm(c)) + '</code></span></span>').join('') + '</div>';
      return '<figure class="cs-gtile cs-p3"><figcaption><b>' + esc(rows[0].pl.name) + '</b></figcaption><div class="cs-p3row">' + rows.map(col).join('') + '</div></figure>'; };
    const labelTile = (k, bg) => { const e = engine(P2(k), opt), b = e.block(bg, 2), k2 = b.block, own = norm(k2.btnLabel.hex) === norm(b.bg), rad = P2(k).radius == null ? 0 : P2(k).radius;
      return '<figure class="cs-gtile"><div class="cs-gtblk cs-gacc" style="background:' + b.bg + '"><span style="background:' + k2.btnFill.hex + ';color:' + k2.btnLabel.hex + ';border-radius:' + Math.min(rad, 999) + 'px">Book a session</span></div><figcaption><b>' + esc(P2(k).name) + ' ' + bg + '</b><span>' + (own ? 'Label is the surface ' : 'Soft label ') + chip(k2.btnLabel.hex) + '</span></figcaption></figure>'; };
    // Light and Dark for one theme, with the dark text ink beside them
    const ldTile = (k) => { const e = engine(P2(k), opt), L = e.p.White, D = e.p.Black, inkD = e.fns.inkDark;
      const sw = (bg, fg, lab) => '<span class="cs-p3sw"><i style="background:' + bg + ';box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"><b style="color:' + fg + '">Aa</b></i><span>' + lab + ' ' + chip(bg) + '</span></span>';
      return '<figure class="cs-gtile cs-p3"><figcaption><b>' + esc(P2(k).name) + '</b></figcaption><div class="cs-p3row">' + sw(L, e.ink(L), 'Light') + sw(D, e.ink(D), 'Dark') + '</div><figcaption><span>Dark text ink ' + chip(inkD) + '</span></figcaption></figure>'; };
    const pair = (k, bg) => { const e = engine(P2(k), opt), b = e.block(bg, 2); return '<figure class="cs-gtile"><div class="cs-gtblk" style="background:' + b.bg + '"><div style="background:' + b.cardSurface.hex + '"></div></div><figcaption><b>' + esc(P2(k).name) + ' ' + bg + '</b><span>Block ' + chip(b.bg) + '</span><span>Card ' + chip(b.cardSurface.hex) + '</span></figcaption></figure>'; };
    const link = (href, txt) => '<a href="' + href + '" target="_blank" rel="noopener" class="cs-golink">' + esc(txt) + '</a>';
    const go = (to, txt) => '<a href="#" class="cs-golink" data-goto="' + to + '">' + txt + '</a>';
    // specs and references the Guide links to (Oct 24)
    const REF = {
      oklab: ['https://bottosson.github.io/posts/oklab/', 'OKLab, by Björn Ottosson'],
      css4: ['https://www.w3.org/TR/css-color-4/#ok-lab', 'CSS Color 4: OKLab and OKLCH'],
      oklch: ['https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch', 'oklch() on MDN'],
      mix: ['https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix', 'color-mix() on MDN'],
      rel: ['https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors', 'Relative colors on MDN'],
      contrast: ['https://www.w3.org/TR/WCAG22/#contrast-minimum', 'WCAG 2.2: Contrast (minimum)'],
      nontext: ['https://www.w3.org/TR/WCAG22/#non-text-contrast', 'WCAG 2.2: Non-text contrast'],
      lum: ['https://www.w3.org/TR/WCAG22/#dfn-relative-luminance', 'WCAG 2.2: Relative luminance'],
      usecolor: ['https://www.w3.org/TR/WCAG22/#use-of-color', 'WCAG 2.2: Use of color'],
      focus: ['https://www.w3.org/TR/WCAG22/#focus-visible', 'WCAG 2.2: Focus visible'],
      p3: ['https://www.w3.org/TR/css-color-4/#predefined-display-p3', 'CSS Color 4: Display P3'],
      gamut: ['https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut', 'color-gamut on MDN'],
      motion: ['https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion', 'prefers-reduced-motion on MDN']
    };
    const ref = (k, txt) => link(REF[k][0], txt || REF[k][1]);
    const TERMS = [['Display P3', 'p3'], ['OKLCH', 'oklch'], ['OKLab', 'oklab']];
    const linkTerms = (html) => { const done = new Set(html.match(/<a\b[^>]*>[^<]*<\/a>/g) ? [] : []);
      return html.split(/(<pre\b[^>]*>.*?<\/pre>|<a\b[^>]*>.*?<\/a>|<[^>]+>)/s).map((part, i) => i % 2 ? part : TERMS.reduce((t, [term, k]) => {
        if (done.has(term) || html.includes('href="' + REF[k][0] + '"')) return t;
        const at = t.indexOf(term); if (at < 0) return t; done.add(term);
        return t.slice(0, at) + ref(k, term) + t.slice(at + term.length); }, part)).join(''); };
    // the opening, under the lead, without a heading of its own (it was the "How it works" section until Oct 25)
    const INTRO = '<div id="g-overview" class="cs-gintro">' + codeify(linkTerms('<p>Jimdo\'s customers are small business owners and freelancers, most with no design training. Color has to make their site look professional without asking them to be designers. So the system must be powerful enough for every theme\'s character, yet simple enough that nobody makes a page worse by accident.</p><p>The old system had neither. Text was the same near-black or white on every theme, Brand quietly dropped to it, and hover, fields, and borders had no rules. Now people pick a theme. Each block gets a background and a color style, and the system decides the rest. ' + link('https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6631981057/Visual+quality+Strategy', 'Visual quality: Strategy') + ' tells the full story.</p><p>Every color comes from two inputs: the theme\'s <b>four colors</b> and the block\'s <b>color style</b> (Neutral, Tinted, or Vivid). Each block works out its colors in this order:</p>'
      + '<ol><li><b>Background:</b> the color the block sits on.</li><li><b>' + go('colors|tok-ink', 'Ink') + ':</b> the text color that reads best on it, made from the theme\'s hue.</li><li><b>' + go('colors|tok-accent', 'Accent') + ':</b> Brand if it reads, else Alternate, else none.</li><li><b>Each part:</b> takes Ink or the accent, depending on the style.</li><li><b>Everything else:</b> the ' + go('colors|tok-card-surface', 'card surface') + ', ' + go('colors|tok-ink-soft', 'soft text') + ', borders, dividers, state colors, and status colors, all made from the ones above.</li><li><b>Cards:</b> the same steps again, on the card surface.</li></ol>'
      + '<p>Every part ends up as one of three colors, or a color made from them:</p>'
      + '<table class="cs-gtab"><thead><tr><th>Color</th><th>What it is</th><th>Read more</th></tr></thead><tbody>'
      + '<tr><td><b>Ink</b></td><td>A near-black or a near-white in the page\'s hue, whichever contrasts more with the surface. Every other part falls back to it.</td><td>' + go('guide|g-ink', 'Ink') + ' · ' + go('formulas|fx-ink', 'Formula') + '</td></tr>'
      + '<tr><td><b>Accent</b></td><td>Brand if it reads at 4.5:1 on the surface, else Alternate, else Ink. On the nine themes, light backgrounds take Brand and strong ones take Alternate (on dark themes, the other way around). One accent per block, and its cards use the same one.</td><td>' + go('guide|g-alternate', 'Why Alternate') + ' · ' + go('formulas|fx-brand', 'Formula') + '</td></tr>'
      + '<tr><td><b>Card surface</b></td><td>The block\'s own color, a step darker (lighter on dark blocks), keeping the block\'s accent readable.</td><td>' + go('guide|g-cards', 'Cards') + ' · ' + go('formulas|fx-card-surface', 'Formula') + '</td></tr></tbody></table>'
      + '<p>' + go('colors|', 'Colors') + ' lists every resulting color, ' + go('formulas|', 'Formulas') + ' shows how each one is made, and ' + go('rules|', 'Targets') + ' shows which part uses which.</p>')) + '</div>';
    const SECS = [
      ['palette', 'The palette and backgrounds', '<p>Every website has one palette of six colors. People can edit four of them, the theme colors. The system makes Light and Dark from the inks (' + go('guide|g-lightdark', 'how') + '). Every color can be a block background, and each also has a job in the system.</p>'
        + '<table class="cs-gtab"><thead><tr><th>Color</th><th>Engine name</th><th>Editable</th><th>Used for</th></tr></thead><tbody>'
        + [['Base', 'MainColor', 'Yes', 'The page background.'], ['Alternate', 'Shade1', 'Yes', 'Second sections, close to Base. The accent on strong backgrounds, where Brand doesn\'t read.'], ['Brand', 'SecondaryColor', 'Yes', 'The accent on backgrounds like the page: buttons, links, and highlights.'], ['Inverted', 'Shade2', 'Yes', 'The opposite of Base, dark on light themes and light on dark ones.'], ['Light', 'White', 'No, the light ink', 'Blocks that sit apart from the theme\'s colors.'], ['Dark', 'Black', 'No, a near-black in the ink\'s hue', 'Blocks that sit apart from the theme\'s colors.']].map(([n, e, ed, u]) => '<tr><td><b>' + go('matrix|mrow-' + n, n) + '</b></td><td>' + e + '</td><td>' + ed + '</td><td>' + u + '</td></tr>').join('') + '</tbody></table>'
        + '<p>Each name opens that background in the Theme tab. The CMS view still calls Inverted Contrast. Brand and Alternate share the accent: each is the accent where the other can\'t be read (' + go('guide|g-alternate', 'why') + ').</p>'
        + '<p><b>Theme colors need a one-off update.</b> In five of the nine themes, Brand didn\'t reach 4.5:1 on its own backgrounds. Calm, Nature, Bliss, Career Coach, and Grit get new values (' + go('guide|g-themes', 'how') + ').</p>', [
        ['colorstyles', 'What the color styles do', '<p>Recoloring parts of a page one by one almost always makes it worse. So people never pick colors per part. Each block picks a color style, and the system decides where the accent goes. The same palette can then look calm, balanced, or bold.</p>'
          + '<table class="cs-gtab"><thead><tr><th>Style</th><th>What it does</th><th>Why</th></tr></thead><tbody>'
          + '<tr><td><b>Neutral</b></td><td>No accent. Text and buttons stay in Ink, dark or light, whichever reads best.</td><td>The calm, classic look. Existing sites start here: it looks almost like today, with correct contrast.</td></tr>'
          + '<tr><td><b>Tinted</b></td><td>The ' + go('colors|tok-accent', 'accent') + ' on ' + go('components|comp-primary-button', 'buttons') + ', ' + go('components|comp-link', 'links') + ', ' + go('components|comp-list', 'list markers') + ', ' + go('components|comp-kicker', 'kickers') + ', ' + go('components|comp-icon', 'icons') + ', and ' + go('components|comp-switch', 'switches') + '. Headings stay in Ink.</td><td>Personality without giving up legibility. The proposed default for new sites.</td></tr>'
          + '<tr><td><b>Vivid</b></td><td>Tinted, plus the accent on headings. Kickers go back to Ink, so they don\'t compete with the headings.</td><td>The boldest, most branded look. Always a deliberate choice, never a default.</td></tr></tbody></table>' + styleCards()
          + '<p>In ' + link('https://jimplan.atlassian.net/wiki/spaces/XD/pages/6573293569/September+25th+2026+-+Feedback+Friday+42', 'Feedback Friday #42') + ', all three participants read the names as a scale of how much color. ' + go('rules|rule-link', 'Targets lists every part, per style') + ', and ' + link('https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6631981057/Visual+quality+Strategy', 'Visual quality: Strategy') + ' has the full reasoning.</p>']]],
      ['contrast', 'Contrast', '<p>Text needs 4.5:1 against what it sits on, the ' + ref('contrast', 'WCAG AA minimum') + '. Borders, controls, icons, and focus rings need 3:1, the minimum for ' + ref('nontext', 'non-text contrast') + '. Decorative and disabled parts have no minimum. Contrast is the WCAG 2.x ratio of ' + ref('lum', 'relative luminance') + ' (' + go('formulas|fx-contrast', 'how') + '), and ' + go('failures|', 'Failures checks every part on every theme') + '.</p><p>Contrast does more than keep text readable. It also decides where the accent can go, and so when Tinted and Vivid are available. The sections below follow that thread, from one minimum to the theme colors that meet it.</p>', [
        ['minimum', 'Why one minimum for everything', '<p>The Colors Systems overview set a minimum per target: 4.5:1 for text, but 3:1 for large headings, list markers, and button fills. The system uses <b>4.5:1 for every part that can carry the accent</b> instead. Borders and focus rings never decide the accent, so they keep 3:1. There are three reasons:</p>'
          + '<ol><li><b>One decision per block.</b> With a minimum per target, a Brand at 3.8:1 would color the buttons and markers but not the headings and links. On the themes\' original colors, 12 of 54 backgrounds would mix Brand and Ink that way. With one minimum, none do.</li>'
          + '<li><b>Predictable for customers.</b> Tinted and Vivid put the accent on every part they promise, or they aren\'t offered. No part silently drops its color.</li>'
          + '<li><b>Less work, fewer mistakes.</b> One minimum is one check per background, not one per part and again on every card. It also holds at any text size: a heading allowed 3:1 as large text fails as soon as someone makes it smaller.</li></ol>'
          + '<p>The cost was darker Brand colors on five themes, covered in ' + go('guide|g-themes', 'How five themes were corrected to meet the minimum') + '. On the corrected themes, minimums per target wouldn\'t change a single color. ' + go('formulas|fx-contrast', 'The Contrast formula') + ' measures it, and ' + go('failures|', 'Failures') + ' checks every part against it.</p>'],
        ['styles', 'When Tinted and Vivid are available', '<p>A ' + go('guide|g-colorstyles', 'color style') + ' never picks a color and never changes the background. It only decides where the accent goes, so it needs an accent to work with. With one minimum, that\'s one question per block.</p>'
          + '<p>The block\'s background decides its accent (' + go('formulas|fx-brand', 'how') + '):</p><ol><li>If <b>Brand</b> reads at 4.5:1 on it, Brand is the accent.</li><li>If not, and <b>Alternate</b> does, Alternate is the accent.</li><li>If neither does, there\'s no accent: <b>Tinted and Vivid are disabled</b>, and the block stays Neutral.</li></ol>'
          + '<p>Every part of the block, and every card inside it, uses that one accent. Step 2 is what keeps Tinted and Vivid available on the nine themes, as the next section shows.</p>'
          + '<p class="cs-gnote"><b>In the CMS today</b> (the CMS view), the check is still Brand only, at 3:1, so conflicts can be tested on Lisa\'s own colors. Two ways to show one are being tested. <b>Conflict A</b> dims Tinted and Vivid and adds a compact note. <b>Conflict B</b> shows only Neutral, with no note. Moving a block to a background without an accent resets it to Neutral. Phase 2 moves the CMS to the rule above.</p>'],
        ['alternate', 'How Alternate keeps Tinted and Vivid available on every background', '<p>Brand can\'t be the accent everywhere. It never reads on the Brand background, and it\'s often too close to Inverted and to Light or Dark. Alternate covers those backgrounds (' + go('formulas|fx-brand', 'how') + ').</p>'
          + '<p>On a light theme, the light backgrounds (Base, Alternate, and Light) take Brand, and the strong ones (Brand, Inverted, and Dark) take Alternate. Dark themes work the same way, flipped. All nine themes follow this pattern, so Ink is never needed. Alternate is shaded:</p>'
          + sideMap()
          + '<p>It\'s a familiar art-direction move. On a strong background, the colors swap places: the section takes the strong color, and the accent takes the page\'s own color. A pale button on a deep band still reads as the same brand. For customers, it stays simple: they pick a background, and the style previews show its accent before they choose a style.</p>'
          + '<p>Ink could stand in on strong backgrounds. Then Tinted and Vivid would look like Neutral there. Disabling them instead would cost half of all backgrounds, every Brand section included:</p>'
          + '<table class="cs-gtab"><thead><tr><th></th><th>Brand only</th><th>Brand, then Alternate</th></tr></thead><tbody>'
          + '<tr><td>Original theme colors</td><td>' + pct(availCount(false, false)) + '</td><td>' + pct(availCount(false, true)) + '</td></tr>'
          + '<tr><td>Corrected theme colors</td><td>' + pct(availCount(true, false)) + '</td><td><b>' + pct(availCount(true, true)) + '</b></td></tr></tbody></table>'
          + '<p>Everything made from the accent follows it. On strong backgrounds, ' + go('colors|tok-accent-hover', 'hover and pressed colors') + ', links, field focus, and checked controls all come from Alternate, and Vivid\'s dividers stay neutral. In a custom palette, Brand may read on every background, and then it\'s the accent everywhere.</p>'
          + '<p>For this to work, Alternate has to be a close relative of Base. It\'s just as light (on dark themes, just as dark), only a slightly different color. On the nine themes, the two sit ' + fmt(altRange()[0]) + ' to ' + fmt(altRange()[1]) + ' apart, from nearly the same to clearly different. Alternate still has to differ from Base at least as much as a ' + go('guide|g-cards', 'card') + ' does, so its sections stand out. And Brand has to be readable on it, at the same 4.5:1 as text. Contrast works both ways, so Alternate then reads on Brand too. The ' + go('guide|g-themes', 'corrected theme colors') + ' make sure of all three. How generation handles new themes and custom palettes is still open.</p>'],
        ['themes', 'How five themes were corrected to meet the minimum', '<p>Everything above needs Brand to read at 4.5:1 on the theme\'s own backgrounds. On five of the nine themes, it didn\'t. They were corrected <b>once, as a design change</b>: the themes get new hex values. Nothing is calculated on the site, so this isn\'t in Formulas.</p>'
          + '<p>Each correction was chosen per theme. Contrast comes first: every Brand reads at 4.5:1 or more on Base, Alternate, and the cards of both. Within that, the theme\'s mood from the template brief decides, and any of its own colors may change to protect it. Gaia, Noir, Barber, and Coach pass as they are.</p>'
          + '<table class="cs-gtab"><thead><tr><th>Theme</th><th>Why</th><th>Lowest contrast</th></tr></thead><tbody>' + Object.keys(FIXES).map((k) => { const p = Object.assign({}, PALETTES[k], FIXES[k]), b = p.SecondaryColor, low = Math.min(...[p.MainColor, p.Shade1, derivedCard(p.MainColor, null), derivedCard(p.Shade1, null)].map((x) => contrast(b, x)));
            return '<tr><td>' + esc(p.name) + '</td><td>' + esc(FIX_WHY[k] || '') + '</td><td>' + fmt(low) + '</td></tr>'; }).join('') + '</tbody></table>'
          + '<table class="cs-gtab"><thead><tr><th>Theme</th><th>Color</th><th>Original</th><th>Corrected</th></tr></thead><tbody>' + Object.entries(FIXES).map(([k, fx]) => Object.entries(fx).map(([role, hex], n) => '<tr><td>' + (n ? '' : esc(PALETTES[k].name)) + '</td><td>' + esc((BGS.find((x) => x[1] === role) || [role])[0]) + ' <span class="cs-gmuted">(' + role + ')</span></td><td>' + chip(PALETTES[k][role]) + '</td><td>' + chip(hex) + '</td></tr>').join('')).join('') + '</tbody></table>'
          + '<p>The <b>Theme colors</b> switch in the sidebar shows every tab with the original colors. The templates need to ship the corrected values. ' + go('matrix|', 'The Theme tab') + ' shows each corrected theme on every background, and ' + go('failures|', 'Failures') + ' checks them all.</p>']]],
      ['ink', 'Ink', '<p>' + go('colors|tok-ink', 'Ink') + ' is the text color every part falls back to: a near-black or a near-white, whichever contrasts more with the surface.</p><p>The inks aren\'t pure black and white. They take the page\'s hue at a low chroma (Base\'s, or Inverted\'s or Brand\'s when Base is gray), so text belongs to the theme. The dark ink sits at OKLCH lightness 0.25, or a little darker than Base on dark themes; the light ink at 0.975. Where neither reaches 4.5:1, pure black or white is used (' + go('formulas|fx-ink', 'how') + '). The same inks make the ' + go('guide|g-lightdark', 'Light and Dark backgrounds') + ', and the <b>Neutrals</b> switch in the sidebar sets both.</p>', [
        ['lightdark', 'Light and Dark backgrounds', '<p>Light and Dark are the two backgrounds the system makes, for blocks that should sit apart from the theme\'s own colors. They come from the same inks as the text, with one difference:</p>'
          + '<ul><li><b>Light is the light ink itself:</b> an off-white in the page\'s hue, at OKLCH lightness 0.975 and chroma 0.01. Text and background share one color.</li>'
          + '<li><b>Dark is deeper than the dark ink.</b> It has the same hue and chroma 0.025, but lightness 0.14 instead of 0.25 (or 0.05 below Base on dark themes). At 0.25 the dark ink reads well as text but looks washed out as a background.</li></ul>'
          + '<p>Text on both is Ink, so it always reads at 4.5:1 or more. With <b>Black and white</b> ink, Light and Dark are pure white (#FFFFFF) and pure black (#000000), like the text.</p>'
          + '<p>On a theme whose Base is already near white, Light sits close to Base: on Calm, #F7F0EB and #FCF5F0. A block that should stand apart from Base uses Alternate. Whether Light should be pure white there is still open (see Status and open questions). The CMS view uses pure white for now, from the v3.0 rules.</p>'
          + '<div class="cs-ggrid">' + ['calm', 'noir', 'nature'].map(ldTile).join('') + '</div>'
          + '<p>' + go('formulas|fx-light-and-dark-backgrounds', 'The formula') + ' shows the values for the selected theme, and ' + go('matrix|mrow-Light', 'the Theme tab') + ' shows both backgrounds in every style.</p>'],
        ['text', 'Text', '<p>Body text, labels, helper text, and field values are Ink. ' + go('colors|tok-ink-soft', 'Soft text') + ' (placeholders, required markers, kickers) is Ink faded toward the surface as far as 4.5:1 allows: quieter, still readable (' + go('formulas|fx-soft-text', 'how') + ').</p>'],
        ['links', 'Links', '<p>' + go('components|comp-link', 'Links') + ' take the accent, or Ink in Neutral. They\'re underlined in every state, so they never ' + ref('usecolor', 'rely on color alone') + ': 1px at rest and visited, 2px on hover and pressed. Hover and pressed use the ' + go('guide|g-hover', 'shared state colors') + ' (' + go('formulas|fx-link-states', 'how') + ').</p>'],
        ['lines', 'Borders and dividers', '<p>Lines come in two kinds, because they do different jobs:</p><ul><li>' + go('colors|tok-border', 'Borders') + ' mark a control: ' + go('components|comp-text-field', 'field borders') + ', ' + go('components|comp-checkbox-and-radio', 'empty checkboxes and radios') + '. They\'re Ink faded as far as 3:1 allows, in every style (' + go('formulas|fx-borders', 'how') + ').</li><li>' + go('colors|tok-divider', 'Dividers') + ' only organize the layout: ' + go('components|comp-section', 'separators, the line under a kicker') + ', ' + go('components|comp-progress', 'the progress track') + '. They follow the card rule one and a half steps out, so they show even on a card, with no minimum. In Vivid they take a quarter of Brand\'s hue and chroma but keep their lightness. That keeps them as subtle as in the other styles (' + go('formulas|fx-dividers', 'how') + ').</li></ul>']]],
      ['buttons', 'Buttons', '<p>' + go('components|comp-primary-button', 'Primary buttons') + ' are filled with the accent, or Ink in Neutral. Their ' + go('colors|tok-button-label', 'label') + ' is the color of the surface around them, so they look cut out of the page (see ' + go('guide|g-labels', 'Button labels') + ').</p>'
        + '<p>' + go('components|comp-secondary-button', 'Secondary buttons') + ' are outlined in the accent. On hover and press they get a light background in their own color: up to 12% on ' + go('colors|tok-surface-hover', 'hover') + ' and 22% when ' + go('colors|tok-surface-pressed', 'pressed') + '. It stops where the label would drop under 4.5:1. Focus and disabled work like on every other part (' + go('guide|g-states', 'States') + ').</p>', [
        ['labels', 'Button labels', '<p>A primary button\'s label is the color of the surface around it, the block or the card, on every surface: light, dark or mid-tone. It needs no contrast check of its own. The fill was picked because it reads on that surface, and the label is the same pair reversed.</p>'
          + '<p>Hover and pressed keep the label and move the fill away from it, so contrast only goes up.</p>'
          + '<div class="cs-ggrid">' + [['calm', 'Base'], ['gaia', 'Base'], ['barber', 'Brand']].map(([k, bg]) => labelTile(k, bg)).join('') + '</div>'
          + '<p>The <b>Button label</b> switch, under In review in the sidebar, compares this with Ink labels (' + go('formulas|fx-button-label', 'how') + ').</p>']]],
      ['fields', 'Fields', '<p>' + go('components|comp-text-field', 'Fields') + ' rest with a 1px border. Hover, focus, and error go to 2px. Hover uses the shared hover color; focus, the ' + go('colors|tok-border-focus', 'accent') + ' plus the ' + go('guide|g-focus', 'focus ring') + '; error, the ' + go('colors|tok-error', 'error color') + ' with an icon before the message. The second pixel is an inset shadow, so nothing moves. Changes animate in 120ms, or not at all with ' + ref('motion', 'reduced motion') + ' (' + go('formulas|fx-field-states', 'how') + '). ' + go('components|comp-checkbox-and-radio', 'Checkboxes and radios') + ' follow the same states.</p>'],
      ['states', 'States', '<p>Hover, pressed, focus, and disabled look the same on every interactive part: buttons, links, fields, checkboxes, and radios. ' + go('formulas|fxs-states', 'Formulas') + ' has their rules, and ' + go('components|', 'Components') + ' shows every part in every state.</p>', [
        ['hover', 'Hover and pressed', '<p>One step for everything: the accent moves 0.09 (' + go('colors|tok-accent-hover', 'hover') + ') or 0.16 (' + go('colors|tok-accent-pressed', 'pressed') + ') in lightness, away from the surface, so contrast only goes up. Buttons, links, and field borders share these two colors (' + go('formulas|fx-hover-and-pressed', 'how') + ').</p>'],
        ['focus', 'Focus', '<p>Every interactive part shows the same ' + go('colors|tok-focus-ring', 'focus ring') + ' in Ink, so it\'s ' + ref('focus', 'always visible') + '. It reads at 3:1 or more on any background, accent, or card.</p><ul><li><b>Buttons and fields:</b> a 2px ring with a 2px gap in the background color, so it stays visible next to a filled button.</li><li><b>Links:</b> an outline 3px away from the text, so it doesn\'t sit on the letters. Square corners on square themes, 3px rounded otherwise.</li></ul><p>Buttons and links show it only for keyboard focus. Fields show it whenever they\'re active, since that\'s where you type (' + go('formulas|fx-focus-ring', 'how') + ').</p>'],
        ['disabled', 'Disabled', '<p>' + go('colors|tok-disabled', 'Disabled') + ' parts blend every color 60% toward the background: fill, label, border, and text. They look unavailable, and they\'re exempt from contrast (' + go('formulas|fx-disabled', 'how') + '). A disabled field fades only the control. Its label and helper text stay in Ink, so people can still read what it is and why it\'s off. Disabled links fade like buttons.</p>']]],
      ['status', 'Status colors', '<p>' + go('colors|tok-error', 'Error') + ', ' + go('colors|tok-success', 'success') + ', ' + go('colors|tok-warning', 'warning') + ', and ' + go('colors|tok-info', 'info') + ' keep recognizable hues (red, green, amber, and blue). Success, warning, and info are nudged a little toward Brand so they belong to the theme, and their chroma follows Brand\'s. Error keeps a fixed red with more chroma, because a muted or nudged red reads as rust or brown. Their lightness is the first to reach 4.5:1 on the ' + go('colors|tok-card-surface', 'card surface') + ' (' + go('formulas|fx-status-colors', 'how') + ').</p><p>' + go('components|comp-status-messages', 'Messages') + ' always sit on the card surface, like the cards. Where a status color can\'t reach 4.5:1 there, the message uses Ink. Every message has an icon, so meaning never relies on color alone.</p>'],
      ['cards', 'Cards', '<p>A ' + go('components|comp-card', 'card') + ' is a block inside a block: a service, a price, a testimonial. It reads as one object without a border because its ' + go('colors|tok-card-surface', 'surface') + ' is a slightly different color. That difference is decorative, with no minimum, or 3:1 if the whole card is clickable. Everything on the card is checked again against its surface.</p><p>Five steps, the same for every theme (' + go('formulas|fx-card-surface', 'how') + '):</p>'
        + '<ol><li><b>Start from the block\'s own color.</b> The hue never changes: a cream block gets a cream card. Blending toward Ink was tried and made cards grayish.</li>'
        + '<li><b>Pick the direction.</b> Darker, unless the block is too dark for that to show (OKLCH lightness under 0.45); then lighter. Cards never flip direction between themes.</li>'
        + '<li><b>Go far enough to be seen.</b> The card moves until both its color distance (ΔE in OKLab) and its contrast ratio are big enough. Both targets grow toward dark: 0.032 and 1.06 near white, about 0.13 and 1.36 near black. Small steps in dark colors are harder to see.</li>'
        + '<li><b>Keep the color alive.</b> A darker card keeps the block\'s vividness, up to 1.25 times its chroma, so a saturated orange stays orange instead of turning tan. A lighter card keeps the block\'s chroma, so near-black cards don\'t turn brown. Dark blocks with a hue get a small minimum, so a navy card doesn\'t turn gray. Grays stay gray.</li>'
        + '<li><b>Protect the accent.</b> If the accent would drop under 4.5:1 on the card, the card moves less and adds up to 60% more chroma instead. The corrected themes never need it; it\'s a safety net for custom palettes.</li></ol>'
        + '<div class="cs-ggrid">' + [['calm', 'Base'], ['nature', 'Alternate'], ['career', 'Alternate'], ['calm', 'Brand'], ['bliss', 'Brand'], ['gaia', 'Base'], ['barber', 'Alternate'], ['noir', 'Base'], ['grit', 'Alternate']].map(([k, bg]) => pair(k, bg)).join('') + '</div>'
        + '<p>' + go('colors|tok-card-surface', 'Every card on every background') + ' is in Colors.</p>'],
      ['p3', 'Wide-gamut screens (Display P3)', '<p>Most phones and laptops show more saturated colors than sRGB, the web\'s original color space. The system never caps a theme at sRGB. <b>The gamut follows the theme:</b> if every theme color fits sRGB, every generated color does too. As soon as one theme color is a ' + ref('p3', 'Display P3') + ' color, every color is worked out in P3.</p>'
        + '<p>P3 colors are written as oklch(). Colors that also fit sRGB stay hex. Contrast is measured on the real color either way, so every minimum holds in P3 too.</p>'
        + '<p><b>Today\'s themes are all sRGB, so nothing changes for them.</b> A P3 Brand carries its extra color into everything made from it: the accent, hover and pressed, cards, and lines. Below, two themes with their Brand pushed to the edge of P3, same hue, still 4.5:1. Your screen ' + (typeof matchMedia === 'function' && matchMedia('(color-gamut: p3)').matches ? 'shows P3, so the difference is real' : 'doesn\'t show P3, so both columns look the same') + '.</p>'
        + '<div class="cs-ggrid cs-p3grid">' + ['bliss', 'nature'].map(p3Theme2).join('') + '</div>'
        + '<p>In Formulas, ' + go('formulas|fx-fit-to-srgb-keeping-the-hue', 'Fit to sRGB, keeping the hue') + ' does the fitting, and ' + go('formulas|fx-oklch-conversion', 'OKLCH conversion') + ' the math behind it.</p>'
        + '<p>To try it, pick <b>Custom</b> in the Theme list and type an oklch() value, like <code class="cs-lchip">oklch(0.55 0.25 10)</code>, into a color\'s field.</p>'
        + '<p>On the page, a P3 color needs its sRGB fallback next to it, using the ' + ref('gamut', 'color-gamut') + ' media query:</p>'
        + CODE_BLOCK(':root { --accent: #BE2C54; }\n@media (color-gamut: p3) {\n  :root { --accent: oklch(0.52 0.23 10); }\n}', 'css')],
      // descriptive only (Oct 25, Alberto): how to build it is engineering's call (Motaki is gathering everything in one
      // JavaScript file as the single source of truth), so this section says what is here, not how to structure the code
      ['build', 'Code and checks', '<p>This guide describes what each color is and why. How to build it, and how to organize the code, is up to engineering.</p>'
        + '<p>' + go('formulas|', 'Formulas has every rule') + ' as plain JavaScript functions, the same code this page runs. <b>Copy all as a JavaScript module</b> gives every function in one file. Where a rule can also be written in modern CSS, with ' + ref('mix', 'color-mix()') + ' or ' + ref('rel', 'relative colors') + ', Formulas shows that version too, for reference.</p>'
        + '<p>To check a change, ' + go('failures|', 'Failures runs every target') + ' and generated color on every background and style, on one theme or all of them.</p>'],
      ['status-open', 'Status and open questions', '<p class="cs-gmeta">Version 4.2, published Oct 26 · Ready for dev; the items under Waiting on review and Open can still change · ' + link('https://jimplan.atlassian.net/browse/TRF-4091', 'TRF-4091') + ' · ' + link('https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6628999178', 'Colors Systems overview') + ' · Specs: ' + link('https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6631161867', 'Modes') + ', ' + link('https://jimplan.atlassian.net/wiki/spaces/WBG/pages/6631391234', 'Controls') + '</p>'
        + '<ul><li><b>Waiting on review:</b> the proposals under <b>In review</b> in the sidebar: art-directed neutrals (Motaki is recording a video) and the button label.</li><li><b>Next:</b> two usability tests compare Conflict A and B; a source for the other 32 stock palettes; the CMS running on these rules (phase 2). The code for that is already here and unused on purpose: <b>ColorSystem.cmsColors(background, style)</b> returns every color a block and its cards need, <b>cmsBackgrounds()</b> the six backgrounds, <b>cmsHasAccent()</b> whether Tinted and Vivid are available, and <b>CMS_CUSTOM</b> a palette for testing conflicts.</li><li><b>Open:</b> Light on near-white themes. Keep the light ink, which sits close to Base on themes like Calm, or use pure white so Light always differs from Base.</li><li><b>Compare:</b> <b>Before · After</b> in the bar switches the theme colors, ink, and button label back to the earlier versions.</li><li><b>CMS scope:</b> Color style is set per block only; the site-wide control is parked (TRF-4090).</li><li><b>Validation:</b> v1 was tested in ' + link('https://jimplan.atlassian.net/wiki/spaces/XD/pages/6573293569/September+25th+2026+-+Feedback+Friday+42', 'Feedback Friday #42') + '; later versions aren\'t tested yet. Legal review not needed.</li></ul>'],
      ['changes', 'Changelog', '<div class="cs-glog"><p class="cs-glogv"><b><span class="cs-gnum">4.2</span></b> <span>Additions, Oct 27 to 28, published</span></p><p class="cs-glogsub">Color rules</p><ul><li>An Info status message next to Error, Success, and Warning: blue, hue 250°, nudged toward Brand like success and warning, with a circle-i icon. Every check passes, 5,670 in all.</li><li>Disabled fields fade only the control. Labels and helper text stay in Ink.</li><li>Links have a Disabled state like buttons, and clickable icons have Hovered and Pressed like links.</li></ul><p class="cs-glogsub">System view</p><ul><li>Color tokens are Reused (an existing color, chosen by a rule) or Generated (a new color, calculated). Ink is Generated with art-directed neutrals and Reused with Black and white, and the Generated colors list shows it.</li><li>The Guide opens with why the system exists, explains what each color style does with an example of all three, and tells Contrast as one story.</li><li>How Alternate keeps Tinted and Vivid available on every background has a map of which color is the accent where.</li><li>Values are rounded and set as code everywhere, in one size and color.</li></ul><p class="cs-glogsub">Quality</p><ul><li>The Confluence pages were updated from the prototype, with images of the Guide\'s examples.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">4.2</span></b> <span>Oct 23 to 26, ready for dev, published</span></p><p class="cs-glogsub">Color rules</p><ul><li>One 4.5:1 minimum for every part that can carry the accent, and Alternate as the accent when Brand doesn\'t read. Tinted and Vivid are now available on every background of the nine themes, up from 31%.</li><li>Display P3: the gamut follows the theme, so a P3 theme is never capped and sRGB themes don\'t change.</li><li>The dark text ink is back at L 0.25, and the Dark background got its own, deeper value.</li><li>Cards are the block\'s own color again: hue kept, as vivid as the block, darker (lighter on dark blocks), with more distance near black. They never take away the block\'s accent.</li><li>Card parts that use the accent fall back to Ink when a card can\'t keep it at 4.5:1. Only custom palettes ever need it.</li><li>Dividers follow the card, one and a half card steps out, tinted a quarter toward Brand in Vivid.</li><li>Hover and pressed follow one rule for buttons, links, and field borders: 0.09 and 0.16 OKLCH lightness away from the surface.</li><li>Button labels are the surface color on every surface.</li><li>Status messages always sit on the card surface.</li><li>A clearer error red: a fixed hue with stronger chroma, so it reads as red on every theme.</li></ul><p class="cs-glogsub">Themes</p><ul><li>Engine names match production: Base is MainColor, Alternate Shade1, Brand SecondaryColor, and Inverted Shade2.</li><li>The Contrast background is called Inverted, the opposite of Base, since Contrast also named the contrast ratio.</li><li>Corrections are chosen per theme to keep its mood: darker Brand colors in Calm, Nature, and Career Coach, a raspberry Brand on a sky-blue Alternate in Bliss, and a full red on a near-black Alternate in Grit.</li><li>Noir gets a navy-black Alternate in its own hue.</li></ul><p class="cs-glogsub">System view</p><ul><li>New tabs: Guide, Colors (18 color tokens, each with why it exists) and Components (25 components with every state). Rules became Targets.</li><li>Targets and Components link each group and component name to the Guide, show where styles differ, and have a jump index. Colors shows where each color is used more compactly.</li><li>The Ink switch is called Neutrals, since it also sets the Light and Dark backgrounds.</li><li>The Matrix is now the Theme tab, and opens with a card for the selected theme: its segment, mood, typography, shape, and colors, with a live sample. It lists the theme type (light or dark) before the colors and the typography.</li><li>The Light and Dark backgrounds sit next to Ink in the Guide and Formulas, which explain how they relate to the inks.</li><li>The Specimen is Lisa\'s site as a full page: services, a reviews carousel, prices, booking, a details form and an FAQ, all live.</li><li>Formulas reads like the Guide: every rule in JavaScript, with a CSS version where one exists, comments in the code, and all of it as one JavaScript module.</li><li>Links between every tab, deep links to every heading, and one contrast cell everywhere: the ratio, a bar, and a verdict.</li><li>The sidebar\'s In review section keeps only what\'s still open: ink and button label.</li><li>Narrow windows: the tab bar and wide tables scroll with an edge fade, On this page becomes a dropdown, and the Theme tab\'s cells stack their card.</li><li>One design system for every tab, including the Guide and Formulas. Text follows one scale with a ratio of 1.125, from 13.5px for code and badges to a 17px body and 30.5px titles. Every tab opens with the same title and intro, on the same white page. The three text grays all read at 4.5:1, and every tab uses the same breakpoints: 640, 1024, and 1280px.</li><li>The Specimen shows a tooltip on every part: its color, what it sits on, and its contrast.</li><li>On phones, the sidebar sits above the content and nothing scrolls sideways.</li></ul><p class="cs-glogsub">CMS view</p><ul><li>Back on the v3.0 color rules, so both conflicts show on Lisa\'s own colors.</li><li>Two conflict variants for the usability tests: Conflict A (dimmed, with a compact callout) and Conflict B (hidden).</li><li>A tighter color group in Block Design, about 25% smaller.</li><li>Navigation Design, with the transparent navigation switch; the header takes the first block\'s colors.</li><li>The phone view: tap a block, the eye, its tools, the Block Design modal and the color sheet. It switches to Mobile on its own under 1024px and fills the screen under 440px.</li><li>The version menu marks <span class="cs-gnum">4.2</span> as Dev ready.</li></ul><p class="cs-glogsub">Quality</p><ul><li>A test suite of 84 tests: the color engine, every formula\'s promises on random colors, Jimdo\'s writing rules, the System view, the CMS, accessibility, keyboard, wording, and the earlier versions. It found and fixed four bugs on the way.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">4.1</span></b> <span>Oct 23</span></p><p class="cs-glogsub">Color rules</p><ul><li>Ink takes Base\'s hue instead of Brand\'s, so text no longer looks tinted by the accent.</li><li>OKLab blending for generated colors, so a raspberry blend stays pink instead of turning peach.</li><li>Light and Dark backgrounds are back, as the two text inks.</li><li>Cards blended toward Ink, with a contrast floor near black (replaced in <span class="cs-gnum">4.2</span>).</li><li>Dividers as two card steps out, so they stay visible near black.</li><li>Stronger hover and pressed states for buttons and links.</li></ul><p class="cs-glogsub">System view</p><ul><li>Before · After in the bar compares the earlier model with the proposal.</li><li>A Custom theme with four color pickers, to see how any palette behaves. Tinted and Vivid are disabled where no Brand reads, like in the CMS.</li></ul><p class="cs-glogsub">Quality</p><ul><li>All 5,346 checks pass with After.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">4.0</span></b> <span>Oct 22</span></p><p class="cs-glogsub">Color rules</p><ul><li>Switches for the open points: ink, Brand fallback, card surface, contrast minimum, button label, and status colors.</li><li>Art-directed ink as the default, always at 4.5:1.</li></ul><p class="cs-glogsub">Themes</p><ul><li>The nine Dolphin themes, each with a version corrected for 4.5:1.</li></ul><p class="cs-glogsub">System view</p><ul><li>The System view, built on the Colors Systems overview: a specimen, a matrix of every background and style, the rules table with statuses, and contrast failures.</li><li>A Formulas tab with every rule and a live example.</li><li>A Generated colors list with each color\'s source and change.</li></ul><p class="cs-glogsub">CMS view</p><ul><li>A CMS · System switch in the bar.</li><li>A compact dark prototype bar in every version.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">3.0</span></b> <span>Oct 21</span></p><ul><li>Background and Color style became two separate controls, after Motaki\'s feedback that the preview tiles mixed two jobs.</li><li>Background is a row of plain square swatches.</li><li>Color style is three preview cards with Aa and a solid and an outline button. Tinted and Vivid are grayed out when Brand fails.</li><li>Moving a block to a clashing background resets it to Neutral.</li><li>On the Brand background, the callout says the background already uses your brand color.</li><li>The state bar starts with Neutral.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">2.1</span></b> <span>Oct 20</span></p><ul><li>Background tiles preview each background in the chosen style, with an amber dot where the style falls back.</li><li>A copy pass against Jimdo\'s writing rules: Background and Color style labels, shorter descriptions, and a shorter callout.</li><li>Selecting the current state again starts it over.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">2.0</span></b> <span>Oct 20</span></p><ul><li>Color style at block level only. The site-wide control is parked.</li><li>A new editor shell from the Reviews prototype: a prototype bar with a version menu, a screen size switch, and color states with links.</li><li>The Reviews block can be added from Add Blocks.</li></ul><p class="cs-glogv"><b><span class="cs-gnum">1.0</span></b> <span>Sep 29</span></p><ul><li>Color style site-wide and per block, with Brand at 3:1 and callouts that say how many blocks kept Neutral.</li><li>OKLCH card colors, and Block Design zooming out around its block.</li><li>Tested in Feedback Friday #42.</li></ul></div>'],
      ['refs', 'References', '<ul class="cs-grefs">' + Object.values(REF).map(([href, txt]) => '<li>' + link(href, txt) + '</li>').join('') + '</ul>']
    ];
    const head = (id, t, tag) => '<' + tag + '>' + esc(t) + copyLink('guide/' + id, t) + '</' + tag + '>';
    return '<div class="cs-gwrap"><article class="cs-guide cs-doc"><header><h1>How the color system works</h1><p class="cs-glead">Why every color is chosen the way it is. The examples are computed live.</p>' + tocSelect(SECS.flatMap(([id, t, , subs]) => [['g-' + id, esc(t), 0]].concat((subs || []).map(([sid, st]) => ['g-' + sid, esc(st), 1])))) + confLink(CONF.guide) + '' + INTRO + '</header>'
      + SECS.map(([id, t, body, subs]) => '<section id="g-' + id + '">' + head(id, t, 'h2') + (id === 'status-open' || id === 'refs' ? body : codeify(linkTerms(body)))
        + (subs || []).map(([sid, st, sb]) => '<section id="g-' + sid + '" class="cs-gsub">' + head(sid, st, 'h3') + codeify(linkTerms(sb)) + '</section>').join('') + '</section>').join('') + '</article>'
      + '<nav class="cs-gtoc" aria-label="On this page"><b>On this page</b>' + SECS.map(([id, t, , subs], n) => '<a href="#" data-gscroll="g-' + id + '"' + (n ? '' : ' aria-current="true"') + '>' + esc(t) + '</a>' + (subs ? '<div class="cs-gtocsub">' + subs.map(([sid, st]) => '<a href="#" data-gscroll="g-' + sid + '">' + esc(st) + '</a>').join('') + '</div>' : '')).join('') + '</nav></div>';
  };
  // Tests: the automated suite for engineers, run live from the published tests folder (Oct 26). The test counts are read
  // from tests.js, so they can't drift; older is one test written once per version (v1 to v3)
  // this prototype's suites (Oct 30: typography-spacing/tests/; the color prototype's own suite stays in its project)
  const SUITES = [
    ['math', 'Type and space math', 'Every Font size and Scale grows step by step, paragraphs are 16 px or more on Mobile, every size keeps the zoom cap, every token is valid CSS and hits its two ends, and Spacing and Scale move only the roles they should.'],
    ['snapshot', 'Snapshot', 'Every theme’s sizes, roles, line heights, and tracking against snapshot.json.'],
    ['examples', 'Example sites', 'All nine themes at Desktop and Mobile: no overflow, block padding from its roles, same background one gap, corners from the theme, and heading colors.'],
    ['specimen', 'Specimen', 'The table of contents, Shuffle colors and Reset, a shuffle per theme, and quiet text in the soft color.'],
    ['views', 'Type and Color views', 'Every tab opens from its link with no errors or broken text, every link lands, and nothing scrolls sideways at 1440, 1024, and 390 px.'],
    ['cms', 'CMS', 'The Font size and Scale hints, same background on Lisa’s site, and the toast when two blocks join.'],
    ['content', 'Writing rules', 'No em dashes, Mobile and Desktop for the two ends, select not click, US spelling, and wording that matches copy.md.']];
  // the color system's own suites, apart from the general ones (CMS, accessibility, wording, earlier versions)
  const COLOR_SUITES = ['math', 'snapshot', 'examples', 'specimen'];
  let TEST_COUNTS = null, TEST_NAMES = null;
  // a test name that starts with a function (norm(), fitGamut and maxChroma: …) keeps it as code; others get a capital
  const CODE_START = /^(norm\(\)|fmt|contrast and lum|fitGamut and maxChroma|mixLab|derivedCard|hueGap|engine)(?=[\s:])/;
  const testTitle = (t) => { const m = CODE_START.exec(t); return m ? m[1].split(' and ').map((w) => '<code class="cs-lchip">' + esc(w) + '</code>').join(' and ') + codeify(esc(t.slice(m[1].length))) : codeify(esc(/[A-Z]|^v\d/.test(t.split(' ')[0]) ? t : t.charAt(0).toUpperCase() + t.slice(1))); };
  // every color system test, by suite, as written in tests.js
  // the color system tests, sorted by topic within each suite (basics first, then rules, sweeps, and stability); a test
  // not listed here keeps its place at the end. Each suite is a block with a two-column checklist (Oct 26)
  const TEST_ORDER = {
    engine: ['loads', 'contrast matches', 'oklch round trip', 'norm()', 'hover and pressed always', 'the corrected brand', 'full sweep', 'every in review', 'before still', '200 random', 'every theme is srgb', 'a p3 theme passes', 'srgb themes never', 'snapshot', 'results are deterministic', 'the exported'],
    formulas: ['contrast and lum', 'huegap', 'fmt', 'fitgamut', 'mixlab', 'display p3', 'a p3 theme worked', 'engine:', 'state colors', 'derivedcard', 'status colors', 'the exported', 'the written rules', 'the guide quotes', 'the full sweep'],
    cms: ['loads with', 'the version list', 'neutral, tinted', 'mixed cycles', 'painted colors', 'conflict a and b', 'block design', 'navigation design', 'edit design', 'add blocks', 'selecting the current', 'narrow windows', 'phone: tap', 'phone: conflict', 'phone: navigation'],
    a11y: ['every control in the cms has', 'every control in the cms phone', 'every control in the system', 'site images'],
    system: ['opens from', 'every tab renders', 'tab counts', 'every tab has its own link', 'deep links', 'every in-page link', 'cross-tab', 'every tab links to the guide', 'external links', 'no sideways', 'contents:', 'every theme, background', 'before and after', 'the custom theme', 'a custom color', 'theme tab: every theme', 'theme tab: every background', 'formulas: every formula', 'formulas: javascript', 'values in running text', 'specimen controls', 'the generated highlight', 'switching back'] };
  const sortTests = (k, list) => { const o = TEST_ORDER[k] || [], at = (t) => { const i = o.findIndex((x) => t.toLowerCase().startsWith(x)); return i < 0 ? o.length : i; };
    return list.map((t, n) => [t, n]).sort((a, b) => at(a[0]) - at(b[0]) || a[1] - b[1]).map(([t]) => t); };
  const TICK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"/></svg>';
  const testList = (color) => (TEST_NAMES ? SUITES.filter(([k]) => COLOR_SUITES.includes(k) === color).map(([k, n, d]) => { const all = sortTests(k, TEST_NAMES[k]), half = Math.ceil(all.length / 2);
    return '<section class="cs-tsuite"><header><h3>' + n + ' <code class="cs-lchip">' + k + '</code> <span class="cs-tcount">' + TEST_NAMES[k].length + '</span></h3><p>' + codeify(esc(d)) + '</p></header>'
      + '<div class="cs-tcols">' + [all.slice(0, half), all.slice(half)].filter((c) => c.length).map((c) => '<ul>' + c.map((t) => '<li>' + TICK + '<span>' + testTitle(t) + '</span></li>').join('') + '</ul>').join('') + '</div></section>'; }).join('') : null);
  const colorTests = () => (TEST_COUNTS ? COLOR_SUITES.reduce((n, k) => n + TEST_COUNTS[k], 0) : '');
  const groupTests = (color) => (TEST_COUNTS ? SUITES.filter(([k]) => COLOR_SUITES.includes(k) === color).reduce((n, [k]) => n + TEST_COUNTS[k], 0) : '');
  // read once (the tab re-renders), then filled into whatever shows a count
  const loadTestCounts = () => fetch('../tests/tests.js').then((r) => (r.ok ? r.text() : '')).then((src) => {
    if (!src) return;
    TEST_COUNTS = Object.fromEntries(SUITES.map(([k]) => [k, k === 'older' ? 3 : (src.match(new RegExp("test\\('" + k + "'", 'g')) || []).length]));
    TEST_NAMES = Object.fromEntries(SUITES.map(([k]) => [k, k === 'older' ? ['v3 opens and runs every state without errors', 'v2 opens without errors', 'v1 opens without errors'] : [...src.matchAll(new RegExp("test\\('" + k + "',\\s*'((?:[^'\\\\]|\\\\.)*)'", 'g'))].map((m) => m[1].replace(/\\(.)/g, '$1'))]));
    document.querySelectorAll('.cs-tlist:not([data-own])').forEach((n) => { n.innerHTML = testList(!!n.dataset.color); });
    document.querySelectorAll('.cs-tsn[data-suite]').forEach((n) => { n.textContent = TEST_COUNTS[n.dataset.suite]; });
    document.querySelectorAll('[data-testcount]').forEach((n) => { n.textContent = n.dataset.testcount === 'color' ? colorTests() : groupTests(false); n.hidden = false; });
  }).catch(() => {});
  setTimeout(loadTestCounts, 0);
  const testsTab = () => {
    const table = (color) => '<div class="cs-tscroll"><table class="cs-table cs-suites"><thead><tr><th>Suite</th><th>What it checks</th><th>Tests</th></tr></thead><tbody>'
      + SUITES.filter(([k]) => COLOR_SUITES.includes(k) === color).map(([k, n, d]) => '<tr><td><b>' + n + '</b><br><code class="cs-lchip">' + k + '</code></td><td>' + codeify(esc(d)) + '</td><td class="cs-tsn" data-suite="' + k + '">' + (TEST_COUNTS ? TEST_COUNTS[k] : '') + '</td></tr>').join('') + '</tbody></table></div>';
    const count = (kind) => ' <span class="cs-tcount" data-testcount="' + kind + '"' + (TEST_COUNTS ? '' : ' hidden') + '>' + (kind === 'color' ? colorTests() : groupTests(false)) + '</span>';
    return pageHead('Every rule, tested', 'An automated suite checks the type and space system, the example sites, and both views. It drives the real pages, so it checks what people see, and it runs in a browser or a terminal.', '', CONF.tests)
      + '<p class="cs-tactions"><a class="cs-tbtn" href="../tests/" target="_blank" rel="noopener">Run the tests in your browser</a></p>'
      + secHead('Type and space' + count('color'), 'The math, the snapshot, the example sites, and the Specimen. These are the tests to run after changing a type or spacing rule.') + '<div class="cs-tlist" data-color="1">' + (testList(true) || table(true)) + '</div>'
      + secHead('General' + count('general'), 'Both views, the CMS, and the writing rules.') + '<div class="cs-tlist">' + (testList(false) || table(false)) + '</div>'
      + secHead('Run it in a terminal', 'From the repository root, with Node 22 or later and Google Chrome. It starts its own server and exits with 0 when everything passes.')
      + '<pre class="cs-tcmd"><code>node typography-spacing/tests/run.mjs\nnode typography-spacing/tests/run.mjs math,examples\nnode typography-spacing/tests/run.mjs snapshot --update</code></pre>'
      + '<p class="cs-tnote">The first runs everything, the second only the suites you name, and the third writes a new snapshot after an intended change.</p>';
  };
  const rules = (E) => {
    // the spec only: the same for every theme. What a target looks like on a background lives in Components, linked
    // from each row (TGT_COMP)
    const need = (t, n) => { const v = n === undefined ? (t.src ? E.minFor(t) : 0) : n; return v ? '<code class="cs-lchip">' + fmt(v) + '</code>' : n !== undefined ? '<span class="muted">None</span>' : ''; };
    const compLinks = (t) => (TGT_COMP[t.id] || []).map((c) => '<a href="#" class="cs-golink" data-goto="components|comp-' + slug(c) + '">' + esc(c) + '</a>').join('<br>');
    let g = '';
    const rows = TARGETS.map((t) => {
      const grp = t.group !== g ? '<tr class="grp" id="tgrp-' + slug(t.group) + '"><td colspan="8">' + (GROUP_GUIDE[t.group] ? headLink(GROUP_GUIDE[t.group], t.group) : t.group) + '</td></tr>' : ''; g = t.group;
      // each style cell names the token it uses (linked to Colors); how a token is made lives in Colors and Formulas
      // when every style uses the same color, it shows once across the three columns, so the differences stand out
      const styleCells = (toks) => toks.every((x) => x === toks[0]) ? '<td colspan="3" class="cs-allstyles">' + tokLink(toks[0]) + '<span>in every style</span></td>' : toks.map((x) => '<td>' + tokLink(x) + '</td>').join('');
      const srcCells = () => styleCells(t.src.map((s) => SRC_TOKEN[s]));
      const tokCells = (tk) => tk === 'link' ? styleCells(['ink', 'brand', 'brand'].map((s) => SRC_TOKEN[s])) : tk === 'same' ? '<td colspan="3" class="muted">Same as the block\'s targets</td>' : tk ? styleCells([tk, tk, tk]) : '<td colspan="3" class="muted">No color of its own</td>';
      const parts = RULE_PARTS[t.id] || [[t.label, t.src ? 'src' : undefined, undefined, t.note]];
      return grp + parts.map(([label, tk, n, note], i) => '<tr' + (i ? '' : ' id="rule-' + t.id + '"') + '><td>' + esc(label) + '</td>' + (tk === 'src' ? srcCells() : tk === undefined ? '<td colspan="3" class="muted">Not designed yet</td>' : tokCells(tk)) + '<td>' + need(t, n) + (t.minNote && !i ? '<br><span class="tiny muted">' + esc(t.minNote) + '</span>' : '') + '</td><td class="cs-tcomp">' + compLinks(t) + '</td>' + '<td>' + statusPill(t.status) + '</td><td class="muted">' + codeify(esc(note || '')) + '</td></tr>').join('');
    }).join('');
    const groups = [...new Set(TARGETS.map((t) => t.group))].map((g) => ['tgrp-' + slug(g), g, TARGETS.filter((t) => t.group === g).reduce((n, t) => n + (RULE_PARTS[t.id] || [0]).length, 0)]);
    return pageHead('Every part, and the color it gets', 'The color each part uses in each style, and the contrast it needs. It\'s the same for every theme. Select a color to see how it\'s made, or a component to see its real colors on the background picked in the sidebar.', '', CONF.overview + '#Targets') + sectionIndex(groups)
      // how to read the table, in the same legend box as Components and Failures: one short line each (Oct 26)
      + '<div class="cs-legends cs-tgtabout">' + TOK_LEGEND
      + '<p class="cs-leg"><span>' + statusPill('DECIDED') + ' Agreed and built</span><span>' + statusPill('WIP') + ' Still compared in the sidebar</span><span>' + statusPill('ENG') + ' Engineering confirms it fits</span></p></div>'
      + '<table class="cs-table rules cs-targets"><thead><tr><th>Target</th><th>Neutral</th><th>Tinted</th><th>Vivid</th><th>Needs</th><th>Component</th><th>Status</th><th>Notes</th></tr></thead><tbody>' + rows + '</tbody></table>';
  };

  // the card surface isn't checked: it's decorative (about 1.06:1 by design); a card that's clickable as a whole would
  // need a 3:1 edge, which belongs to a card border rule, not the surface color (Oct 22)
  let DROPS = [], nChecks = 0, LOWEST = {}, LAST_CHECKS = [], BYTHEME = [];
  // "Body text (card)", but "List markers (bullets, card)" instead of two sets of brackets
  const cardLabel = (l) => (/^Card /.test(l) ? l : /\)$/.test(l) ? l.replace(/\)$/, ', card)') : l + ' (card)');
  // which target each generated color belongs to, so it sits in that target's group
  const GEN_BASE = { 'Soft text (placeholder)': 'field', 'Divider': 'divider', 'Border': 'field', 'Border, hovered': 'fieldStates', 'Border, focused': 'fieldStates', 'Field error text': 'fieldText', 'Focus ring': 'btnStates', 'Primary button label, hovered': 'btnStates', 'Primary button label, pressed': 'btnStates', 'Secondary button, hovered': 'btn2States', 'Secondary button, pressed': 'btn2States', 'Link, hovered': 'linkStates', 'Link, pressed': 'linkStates', 'Error message': 'statusColors', 'Success message': 'statusColors', 'Warning message': 'statusColors' };
  const failures = () => {
    const list = [], keepGen = GEN; nChecks = 0; LOWEST = {}; BYTHEME = []; DROPS = [];
    // the selected theme by default, like the rest of the System view; "All themes" sweeps every theme
    allPalettes().filter(([k]) => S.scope === 'all' || k === (PALETTES[S.palette] || S.palette === 'custom' ? S.palette : 'calm')).forEach(([k, pal]) => {
      const E = engine(pal, S), th = { name: pal.name, checks: 0, fails: 0, low: null }; BYTHEME.push(th);
      BGS.forEach(([bg]) => STYLES.forEach((s, si) => {
        const b = E.block(bg, si);
        const note = (label, r, base) => { const m = r.ratio / (r.min || 1), cur = LOWEST[label]; th.checks++; if (!r.pass) th.fails++; if (!th.low || m < th.low.m) th.low = { m, r, label, where: bg + ' · ' + s }; if (!cur || m < cur.m) LOWEST[label] = { m, r, base, where: (S.scope === 'all' ? pal.name + ' · ' : '') + bg + ' · ' + s }; };
        Object.entries(b.block).forEach(([id, r]) => { nChecks++; note(T(id).label, r, id); if (!r.pass) list.push([pal.name, bg, s, T(id).label, r]); });
        Object.entries(b.card).forEach(([id, r]) => { nChecks++; note(cardLabel(T(id).label), r, id); if (!r.pass) list.push([pal.name, bg, s, cardLabel(T(id).label), r]); });
        const blockHasBrand = Object.values(b.block).some((r) => r.brand);
        if (blockHasBrand) [['block', b.block], ['card', b.card]].forEach(([lvl, set]) => Object.entries(set).forEach(([id, r]) => { const t = T(id); if (t && t.src && t.src[si] === 'brand' && !r.brand) DROPS.push([pal.name, bg, s, lvl === 'card' ? cardLabel(t.label) : t.label, r]); }));
        specimenFull(b, si, E, pal);
        LAST_CHECKS.forEach(({ label, r, base }) => { nChecks++; note(label, r, base); if (!r.pass) list.push([pal.name, bg, s, label, r]); });
      }));
    });
    GEN = keepGen;
    return list;
  };
  // the formulas, one per row, written for engineers (Oct 22): a signature, where it's used, the contrast it must meet,
  // what it depends on, the rule, a live example and the exact code the System view runs (from the functions
  // themselves via toString, so it can't drift; copyable)
  // every pure function above as one ES module, in dependency order, for engineers to drop in and test
  const MODULE_SRC = () => ['// Color system formulas, from the System view (color-style v4). Pure functions; colors are hex strings,',
    '// OKLCH is [L 0–1, C, H in radians], contrast is the WCAG 2.x ratio. Theme-level pieces (ink, brand, labels)',
    '// need the palette and settings and live in engine(); see the Formulas tab.',
    ...[['norm', norm], ['lum', lum], ['contrast', contrast], ['toLin', toLin], ['toSrgb', toSrgb], ['toOklch', toOklch], ['fromOklch', fromOklch],
      ['linFromOklch', linFromOklch], ['inGamut', inGamut], ['gamutOf', gamutOf], ['oklchCss', oklchCss], ['mixLab', mixLab], ['shiftL', shiftL], ['fitGamut', fitGamut], ['closestPassing', closestPassing], ['deltaE', deltaE], ['cardDE', cardDE], ['cardCR', cardCR], ['maxChroma', maxChroma], ['derivedCard', derivedCard], ['tintLine', tintLine],
      ['stateShift', stateShift], ['stateSurface', stateSurface], ['deg', deg], ['hueGap', hueGap], ['statusHC', statusHC], ['statusOf', statusOf]]
      .map(([nm, fn]) => 'export const ' + nm + ' = ' + fn.toString() + ';'),
    'export const mix = mixLab;',
    'export const LINE_TINT = ' + LINE_TINT + ';',
    'export const LINE_STEPS = ' + LINE_STEPS + ';',
    'export const HOVER = ' + HOVER + ', PRESSED = ' + PRESSED + ';',
    "export let GAMUT = 'srgb'; // the theme's gamut: set it with GAMUT = gamutOf(theme); 'p3' keeps Display P3 colors, sRGB ones stay hex",
    'export const STATUS_HUE = ' + JSON.stringify(STATUS_HUE) + ';'].join('\n');
  // the Formulas tab's highlighted code block, also used by the Guide (set when Formulas renders, which is every render)
  let CODE_BLOCK = (c) => '<pre class="cs-fxcode">' + esc(c) + '</pre>';
  const formulas = (E) => {
    const si = STYLES.indexOf(S.style), b = E.block(S.bg, si), bg = b.bg, pal = palette(), F = E.fns;
    const g = (label) => GEN.find((x) => x.label === label);
    const sw = (hex, name) => '<span class="cs-fxsw"><i style="background:' + hex + '"></i>' + (name ? '<b>' + esc(bgAlias(name)) + '</b> ' : '') + '<code>' + tidyNum(norm(hex).toUpperCase()) + '</code></span>';
    const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const ex = (pairs, out) => '<div class="cs-fxex">' + pairs.map(([h, n]) => sw(h, n)).join('') + arrow + sw(out) + '</div>';
    const exG = (label, srcName) => { const x = g(label); return x ? ex([[x.src, srcName || x.from], [bg, S.bg]], x.hex) : ''; };
    const src = (name, fn) => 'const ' + name + ' = ' + fn.toString() + ';';
    // the formulas are the same for every theme; only the inputs change. Each row shows them on the selected theme's
    // four backgrounds in the selected style: the specimen is built off screen per background to read its colors
    const DATA = bgData(E, si, pal);
    const rt = (a, c) => fmt(contrast(a, c));
    const PER = {
      'Contrast': (d) => ({ ins: [[E.ink(d.bg), 'Ink'], [d.bg, d.bgName]], val: rt(E.ink(d.bg), d.bg) }),
      'OKLCH conversion': (d) => ({ ins: [[d.bg, d.bgName]], val: okText(d.bg) }),
      'Blend': (d) => ({ ins: [[E.ink(d.bg), 'Ink'], [d.bg, d.bgName]], outs: [[d.gen('Divider'), 't 0.85']], val: 'mix(Ink, bg, 0.85)' }),
      'Shift': (d) => ({ ins: [[d.b.block.btnFill.hex, 'Fill']], outs: [[d.gen('Primary button, hovered'), 'hover']], val: (() => { const dl = toOklch(d.gen('Primary button, hovered'))[0] - toOklch(d.b.block.btnFill.hex)[0]; return 'L ' + (dl > 0 ? '+' : '−') + Math.abs(dl).toFixed(2); })() }),
      'Fit to sRGB, keeping the hue': (d) => ({ ins: [], outs: [[d.gen('Error color'), 'error']], val: okText(d.gen('Error color')) }),
      'Ink': (d) => ({ ins: [[d.bg, d.bgName]], outs: [[E.ink(d.bg), 'Ink']], val: rt(E.ink(d.bg), d.bg) }),
      'Brand': (d) => ({ ins: [[pal.SecondaryColor, 'Brand'], [d.bg, d.bgName]], outs: [[d.b.block.link.hex, d.b.block.link.brand ? (norm(d.b.block.link.hex) === norm(pal.SecondaryColor) ? 'Brand' : 'Shade1') : 'Ink']], val: rt(d.b.block.link.hex, d.bg) }),
      'Card surface': (d) => ({ ins: [[d.bg, d.bgName]], outs: [[d.b.cardSurface.hex, 'card']], val: (() => { const dl = toOklch(d.b.cardSurface.hex)[0] - toOklch(d.bg)[0]; return 'L ' + (dl > 0 ? '+' : '−') + Math.abs(dl).toFixed(3) + ' · ' + rt(d.b.cardSurface.hex, d.bg); })() }),
      'Soft text': (d) => ({ ins: [[E.ink(d.bg), 'Ink'], [d.bg, d.bgName]], outs: [[d.gen('Soft text (placeholder)'), 'soft']], val: rt(d.gen('Soft text (placeholder)'), d.bg) }),
      'Borders': (d) => ({ ins: [[E.ink(d.bg), 'Ink'], [d.bg, d.bgName]], outs: [[d.gen('Border'), 'border']], val: rt(d.gen('Border'), d.bg) }),
      'Dividers': (d) => ({ ins: [[E.ink(d.bg), 'Ink'], [d.bg, d.bgName]], outs: [[d.gen('Divider'), 'divider']], val: rt(d.gen('Divider'), d.bg) }),
      'Field states': (d) => ({ ins: [[d.bg, d.bgName]], outs: [[d.gen('Border'), 'resting'], [d.chk('Border, hovered').hex, 'hover'], [d.chk('Border, focused').hex, 'focus']], val: rt(d.chk('Border, hovered').hex, d.bg) + ' hover' }),
      'Button label': (d) => ({ ins: [[d.b.block.btnFill.hex, 'Fill']], outs: [[d.b.block.btnLabel.hex, 'label']], val: rt(d.b.block.btnLabel.hex, d.b.block.btnFill.hex) }),
      'Hover and pressed': (d) => ({ ins: [[d.b.block.btnFill.hex, 'Fill']], outs: [[d.gen('Primary button, hovered'), 'hover'], [d.gen('Primary button, pressed'), 'pressed']], val: rt(d.chk('Primary button label, pressed').hex, d.gen('Primary button, pressed')) + ' label' }),
      'Disabled': (d) => ({ ins: [[d.b.block.btnFill.hex, 'Fill'], [d.bg, d.bgName]], outs: [[d.gen('Primary button, disabled'), 'disabled']], val: 'no minimum' }),
      'Secondary button hover and pressed': (d) => ({ ins: [[d.bg, d.bgName], [d.b.block.btn2.hex, 'Border']], outs: [[d.chk('Secondary button, hovered').against, 'hover'], [d.chk('Secondary button, pressed').against, 'pressed']], val: rt(d.b.block.btn2.hex, d.chk('Secondary button, pressed').against) + ' label' }),
      'Link states': (d) => ({ ins: [[d.b.block.link.hex, 'Link']], outs: [[d.chk('Link, hovered').hex, 'hover'], [d.chk('Link, pressed').hex, 'pressed']], val: rt(d.chk('Link, pressed').hex, d.bg) + ' pressed' }),
      'Focus ring': (d) => ({ ins: [[d.bg, d.bgName]], outs: [[E.ink(d.bg), 'ring']], val: rt(E.ink(d.bg), d.bg) }),
      'Status colors': (d) => { const m = d.chk('Error message'); return { ins: [[m.against, 'card']], outs: [['Error', 'Success', 'Warning', 'Info'].map((x) => d.chk(x + ' message').hex)].flat().map((h, i) => [h, ['error', 'success', 'warning', 'info'][i]]), val: ['Error', 'Success', 'Warning', 'Info'].map((x) => rt(d.chk(x + ' message').hex, d.chk(x + ' message').against)).join(' · ') }; }
    };
    // three backgrounds cover the range: light, saturated, dark (Oct 24: all six were too many)
    const EX_BGS = ['Base', 'Brand', 'Inverted'];
    const perTable = (f) => '<table class="cs-fxtab"><tbody>' + DATA.filter((d) => EX_BGS.includes(d.bgName)).map((d) => { const x = f(d); return '<tr><td>' + x.ins.map(([h, nm]) => sw(h, nm)).join('') + (x.outs ? arrow + x.outs.map(([h, nm]) => sw(h, nm)).join('') : '') + '</td><td class="cs-fxval">' + codeify(esc(x.val || '')) + '</td></tr>'; }).join('') + '</tbody></table>';
    // each line is its own block: long lines wrap with a hanging indent, so nothing scrolls sideways
    // a small JavaScript highlighter, Dracula colors: comments, strings, numbers, keywords, globals, function calls
    const JS_TOKEN = /(\/\/.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|\b(\d+(?:\.\d+)?(?:e-?\d+)?)\b|\b(const|let|var|return|if|else|for|of|in|new|while|break|continue|function|typeof|export)\b|\b(true|false|null|undefined|Math|JSON|Object|Number|String|Array|Infinity)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;
    const hl = (line) => { let out = '', last = 0, m; JS_TOKEN.lastIndex = 0;
      while ((m = JS_TOKEN.exec(line))) { const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : m[5] ? 'b' : 'f';
        out += esc(line.slice(last, m.index)) + '<i class="t' + cls + '">' + esc(m[0]) + '</i>'; last = m.index + m[0].length; if (!m[0].length) JS_TOKEN.lastIndex++; }
      return out + esc(line.slice(last)); };
    // the CSS side of each formula (Oct 23): 'css' where modern CSS does it faithfully (color-mix, relative oklch()),
    // 'hybrid' where a contrast has to be measured first, so JavaScript sets custom properties and CSS uses them,
    // 'none' where it only runs once per theme
    const CSSX = {
      'Contrast': ['none', '/* CSS can\'t measure contrast between two colors.\n   contrast-color() only returns black or white, and support is partial. */\ncolor: contrast-color(var(--bg));'],
      'OKLCH conversion': ['css', '/* browsers convert natively: any color can be written or read as oklch() */\n--brand: oklch(0.47 0.09 45);\n--brand-l: oklch(from var(--brand) l 0 0);  /* read its lightness */'],
      'Blend': ['css', '--soft: color-mix(in oklab, var(--ink), var(--bg) 60%);'],
      'Shift': ['css', '--hover: oklch(from var(--fill) calc(l - 0.09) c h);'],
      'Fit to sRGB, keeping the hue': ['css', '/* CSS Color 4 gamut-maps oklch() colors for the screen automatically,\n   lowering chroma and keeping lightness and hue */\ncolor: oklch(0.7 0.25 25);'],
      'Ink': ['hybrid', '/* CSS: the two inks, in Base\'s hue */\n--ink-dark: oklch(from var(--base) 0.25 0.025 h);\n--ink-light: oklch(from var(--base) 0.975 0.01 h);\n\n/* JavaScript: which one a surface uses needs a contrast comparison */\n.block { --ink: var(--ink-light); }  /* set per background */\n.block { color: var(--ink); }'],
      'Brand': ['hybrid', '/* JavaScript picks SecondaryColor, Shade1 or Ink per background,\n   by measuring contrast; CSS just uses the result */\n.block { --accent: var(--brand-on-base); }\n.block a, .block .btn { --c: var(--accent); }'],
      'Card surface from the palette': ['hybrid', '/* JavaScript picks Shade2, MainColor or Ink by contrast */\n.card { background: var(--card-from-palette); }'],
      'Card surface': ['hybrid', '/* JavaScript solves how far the card steps (ΔE and the contrast floor) and its chroma;\n   CSS writes the result as the block\'s own color, hue kept */\n.block { --card-dl: -0.033; --card-c: 1.1; }\n.card { background: oklch(from var(--bg) calc(l + var(--card-dl)) calc(c * var(--card-c)) h); }'],
      'Soft text': ['hybrid', '/* JavaScript finds how far Ink can fade and still read at 4.5:1 */\n.block { --soft-t: 48%; }\n::placeholder { color: color-mix(in oklab, var(--ink), var(--bg) var(--soft-t)); }'],
      'Borders': ['hybrid', '/* JavaScript finds how far Ink can fade and still reach 3:1 */\n.block { --line-t: 58%; }\n.field { border: 1px solid color-mix(in oklab, var(--ink), var(--bg) var(--line-t)); }'],
      'Dividers': ['hybrid', '/* JavaScript solves how far the line steps from the block (one and a half card steps);\n   CSS writes it as the block\'s own color, lighter or darker */\n.block { --divider-dl: -0.06; }\nhr { border-color: oklch(from var(--bg) calc(l + var(--divider-dl)) c h); }'],
      'Field states': ['css', '.field { border: 1px solid var(--line); box-shadow: inset 0 0 0 0 var(--line);\n  transition: border-color .12s ease-out, box-shadow .12s ease-out; }\n.field:hover { border-color: var(--accent-hover); box-shadow: inset 0 0 0 1px var(--accent-hover); }\n.field:focus { border-color: var(--accent);\n  box-shadow: inset 0 0 0 1px var(--accent), 0 0 0 2px var(--bg), 0 0 0 4px var(--ink); }\n.field[aria-invalid="true"] { border-color: var(--error); box-shadow: inset 0 0 0 1px var(--error); }\n/* --accent-hover: see Hover · pressed */'],
      'Button label': ['css', '/* the label is the surface color; no check needed */\n.btn { color: var(--bg); }'],
      'Hover and pressed': ['css', '/* --dir is -1 or 1, set once per surface: away from the surface */\n--accent-hover: oklch(from var(--accent) calc(l + var(--dir) * 0.09) c h);\n--accent-pressed: oklch(from var(--accent) calc(l + var(--dir) * 0.16) c h);\n.btn:hover { background: var(--accent-hover); }\n.btn:active { background: var(--accent-pressed); }\na:hover { color: var(--accent-hover); }\na:active { color: var(--accent-pressed); }\n.field:hover { border-color: var(--accent-hover); }'],
      'Disabled': ['css', '.btn:disabled { background: color-mix(in oklab, var(--fill), var(--bg) 60%);\n  color: color-mix(in oklab, var(--label), var(--bg) 60%); }'],
      'Secondary button hover and pressed': ['hybrid', '/* JavaScript caps each amount so the label keeps 4.5:1 */\n.btn2 { --hover-amount: 12%; --pressed-amount: 22%; }\n.btn2:hover { background: color-mix(in oklab, var(--bg), var(--c) var(--hover-amount)); }\n.btn2:active { background: color-mix(in oklab, var(--bg), var(--c) var(--pressed-amount)); }'],
      'Link states': ['css', 'a { color: var(--link); text-decoration: none;\n  background: linear-gradient(currentColor, currentColor) left bottom / 100% 1px no-repeat;\n  transition: background-size .12s ease-out, color .12s ease-out; }\na:hover { background-size: 100% 2px; color: var(--accent-hover); }\na:active { background-size: 100% 2px; color: var(--accent-pressed); }\na:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }'],
      'Focus ring': ['css', ':focus-visible { outline: none;\n  box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--ink); }'],
      'Status colors': ['hybrid', '/* JavaScript works out each status (hue, chroma, lightness for 4.5:1)\n   on the card surface */\n.block { --error: oklch(0.52 0.15 27); --msg-bg: var(--card); }\n.msg-error { color: var(--error); background: var(--msg-bg); }'],
    };
    const KIND = { css: 'Works in CSS', hybrid: 'CSS with values from JavaScript', none: 'JavaScript only' };
    // hex colors count as values (number color); digits inside a word (p3) don't; at-rules (@media) are keywords
    const CSS_TOKEN = /(\/\*[\s\S]*?\*\/|\/\*.*$)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|(--[\w-]+)|(#[0-9a-f]{3,8}(?![\w-])|(?<![\w.])-?\d+(?:\.\d+)?(?:%|px|s|ch)?)|([a-z-]+)(?=\()|(@[a-z-]+|[a-z-]+(?=\s*:(?!:)))|(:{1,2}[a-z-]+|[.#][a-z][\w-]*)/gi;
    const hlCss = (line) => { let out = '', last = 0, m; CSS_TOKEN.lastIndex = 0;
      while ((m = CSS_TOKEN.exec(line))) { const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'b' : m[4] ? 'n' : m[5] ? 'f' : m[6] ? 'k' : 'v';
        out += esc(line.slice(last, m.index)) + '<i class="t' + cls + '">' + esc(m[0]) + '</i>'; last = m.index + m[0].length; if (!m[0].length) CSS_TOKEN.lastIndex++; }
      return out + esc(line.slice(last)); };
    const codeBlock = (code, lang) => '<pre class="cs-fxcode">' + code.split('\n').map((l) => { const ind = (l.match(/^ */) || [''])[0].length; return '<span style="padding-left:' + (ind + 4) + 'ch;text-indent:-4ch">' + ((lang === 'css' ? hlCss : hl)(l.slice(ind)) || ' ') + '</span>'; }).join('') + '</pre>';
    CODE_BLOCK = codeBlock;
    // each formula carries the Guide's explanation in one line, with a link to that heading (Oct 24)
    const GUIDE_REF = {
      'Contrast': ['minimum', 'Every part that can carry the accent needs 4.5:1, not a minimum per part. That way a block has its accent on every part or on none, never Brand buttons next to Ink links, and every part passes at any text size. Borders and focus rings, which never decide the accent, need 3:1.'],
      'Ink': ['ink', 'Ink is the text color every part falls back to: a near-black or a near-white, whichever reads better on the surface. Both take the page\'s hue at a low chroma, so text belongs to the theme. Where neither tinted ink reaches 4.5:1, pure black or white is used.'],
      'Light and Dark backgrounds': ['lightdark', 'Light and Dark are the two backgrounds the system makes. Light is the light ink itself. Dark is a deeper near-black in the same hue, because the dark ink reads well as text but too soft as a background. The Neutrals switch decides both: with black and white ink, they are pure white and black.'],
      'Brand': ['styles', 'The block\'s accent is Brand if it reads at 4.5:1 on the background, else Alternate, the theme\'s second color. If neither reads, Tinted and Vivid are disabled for that background. With the corrected themes, every background has an accent.'],
      'Card surface': ['cards', 'A card is the block\'s own color, a step darker, or lighter on blocks too dark for that to show. It moves far enough to be seen, more on dark blocks, keeps the block\'s vividness, and moves less where the block\'s accent would stop reading.'],
      'Soft text': ['text', 'Placeholders, required markers, and kickers use Ink faded toward the surface, as far as 4.5:1 allows: quieter than body text, but still readable. Helper text stays in Ink.'],
      'Borders': ['lines', 'Borders mark a control: field borders, empty checkboxes, and radios. They are Ink faded as far as 3:1 allows, and look the same in every style.'],
      'Dividers': ['lines', 'Dividers only organize the layout: separators, kicker lines, the progress track. They use the card rule one and a half steps out, so they always show, even on a card, and need no minimum. In Vivid they lean toward Brand.'],
      'Button label': ['labels', 'The label of a primary button is the color of the surface it sits on, so the button looks cut out of the page, on every surface. Hover and pressed keep the label and move the fill away from it.'],
      'Hover and pressed': ['hover', 'Hover and pressed are one step for every part: the accent moves 0.09 or 0.16 in lightness, away from the surface. Buttons, links, and field borders share the same two colors, and contrast only goes up.'],
      'Secondary button hover and pressed': ['buttons', 'An outlined button has no fill to change, so hover and press add a light background in its own color, up to 12% and 22%. It stops where the label would drop under 4.5:1.'],
      'Disabled': ['disabled', 'A disabled part blends every color 60% toward the background: fill, label, border, and text alike. It looks unavailable, and it\'s exempt from contrast.'],
      'Link states': ['links', 'Links are underlined in every state, so they never rely on color: 1px at rest and visited, 2px on hover and pressed, which use the shared hover and pressed colors.'],
      'Focus ring': ['focus', 'Every interactive part shows the same focus ring in Ink, so people always see where they are: a 2px ring with a 2px gap, or an outline 3px away on links.'],
      'Field states': ['fields', 'Fields rest with a 1px border. Hover, focus, and error go to 2px without moving anything: hover in the shared hover color, focus in the accent with the focus ring, error in the error color with an icon.'],
      'Status colors': ['status', 'Error, success, warning, and info keep their red, green, amber, and blue hues, and reach 4.5:1. Success, warning, and info are tuned to the theme\'s Brand; error stays a clear red. Messages sit on the card surface, and every message has an icon.'],
      'Shift': ['hover', 'Hover and pressed move only the lightness, so a color stays the same color, just lighter or darker.'],
      'OKLCH conversion': [null, 'Every color is converted to OKLCH, lightness, chroma, and hue, to be measured and changed, then back to a hex value for the page.'],
      'Blend': [null, 'Mixing two colors, used for soft text, borders, disabled parts, and backgrounds. It runs in a straight line in OKLab, so the mix never passes through a third hue.'],
      'Fit to sRGB, keeping the hue': ['p3', 'A color made in OKLCH can be more saturated than a screen can show. This lowers its chroma until it fits, keeping its lightness and hue.']
    };
    let n = 0;
    const row = (o) => { n++;
      const made = TOKENS.filter((t) => t.formula === o.title);
      return '<article class="cs-fxr" id="fx-' + slug(o.title) + '"><header><h4>' + o.title + copyLink('formulas/fx-' + slug(o.title), o.title) + '</h4></header>' + (GUIDE_REF[o.title] ? '<p class="cs-fxwhy">' + codeify(esc(GUIDE_REF[o.title][1])) + '</p>' + (GUIDE_REF[o.title][0] ? '<a href="#" class="cs-golink cs-readmore" data-goto="guide|g-' + GUIDE_REF[o.title][0] + '">Read more in the Guide <span aria-hidden="true">→</span></a>' : '') : '') + '<code class="cs-fxsig">' + hl(o.sig) + '</code>'
        + '<dl class="cs-fxmeta">' + (made.length ? '<dt>Makes</dt><dd>' + made.map((t) => tokLink(t.id)).join(' ') + '</dd>' : '') + (o.use ? '<dt>Used for</dt><dd>' + o.use + '</dd>' : '') + '<dt>Must meet</dt><dd>' + codeify(o.min || 'No contrast minimum') + '</dd>' + (o.deps ? '<dt>Depends on</dt><dd><code>' + o.deps.join('</code>, <code>') + '</code></dd>' : '') + '</dl>'
        + '<div class="cs-fxlab">Rule</div><pre class="cs-fxrule">' + o.rule.split('\n').map((l) => hl(l)).join('\n') + '</pre>' + (o.note ? '<p class="cs-fxnote">' + codeify(o.note) + '</p>' : '')
        + (PER[o.title] ? '<div class="cs-fxlab">Examples <span class="cs-fxlabsub">' + esc(pal.name) + ', ' + S.style + '</span></div>' + perTable(PER[o.title]) : o.ex ? '<div class="cs-fxlab">Example <span class="cs-fxlabsub">' + esc(pal.name) + '</span></div>' + o.ex : '')
        + (o.code ? (() => { const cx = CSSX[o.title], css = S.codeLang === 'css' && cx;
          return '<div class="cs-fxlab">Code<span class="cs-langseg" role="radiogroup" aria-label="Code language"><button type="button" role="radio" aria-checked="' + !css + '" data-set="codeLang" data-val="js">JavaScript</button><button type="button" role="radio" aria-checked="' + !!css + '" data-set="codeLang" data-val="css">CSS</button></span>'
            + (css ? '<span class="cs-kind ' + cx[0] + '">' + KIND[cx[0]] + '</span>' : '') + '<button type="button" class="cs-copy" data-copy>Copy</button></div>' + (css ? codeBlock(cx[1], 'css') : codeBlock(o.code)); })() : '') + '</article>'; };
    const FXTOC = [];
    const sec = (title, intro, rows) => { const id = 'fxs-' + slug(title); let html = rows.join('');
      const list = [...html.matchAll(/<article class="cs-fxr" id="([^"]+)"><header><h4>([^<]*)</g)].map((m) => [m[1], m[2]]);
      // don't repeat: a section with one formula, or whose first formula has its name, shows that formula directly under
      // the section heading, without a section intro or a second heading (Oct 24)
      const merge = list.length === 1 || (list[0] && list[0][1] === title);
      if (merge) html = html.replace(/<article class="cs-fxr" id="([^"]+)"><header>[\s\S]*?<\/header>/, '<article class="cs-fxr cs-fxfirst" id="$1">');
      FXTOC.push([id, title, merge ? list.slice(1) : list]);
      return '<section class="cs-fxsec" id="' + id + '"><h3>' + title + copyLink('formulas/' + id, title) + '</h3>' + (intro && !merge ? '<p class="muted">' + intro + '</p>' : '') + html + '</section>'; };
    const min = E.minFor(T('link')), cs = b.cardSurface.hex, labelBg = S.label === 'bg';
    const hv = g('Primary button, hovered'), pr = g('Primary button, pressed'), s2h = g('Secondary button, hovered'), s2p = g('Secondary button, pressed'), lp = g('Link, pressed');
    const doc = '<header class="cs-fxhead"><h1>One set of formulas for every theme</h1><p class="cs-glead">Nothing here is tuned per theme: the same rules run on whatever colors a theme has, so only the inputs change.</p>%%FXTOCSEL%%' + confLink(CONF.formulas) + '<p>The examples show ' + esc(pal.name) + ' on three backgrounds (Base, Brand, and Inverted: light, saturated, and dark) in ' + S.style + '; switch the theme, style or any proposal under In review in the sidebar to see other inputs and results. Colors are hex strings, OKLCH is [L 0–1, C, H in radians], contrast is the WCAG 2.x ratio, and the code is what this page runs.</p><button type="button" class="cs-copy cs-copyall" data-copy="all">Copy all as a JavaScript module</button></header>'
      + sec('Foundations', 'The math everything else is built on. Every generated color is calculated in <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch" target="_blank" rel="noopener" class="cs-golink">OKLCH</a> and <a href="https://bottosson.github.io/posts/oklab/" target="_blank" rel="noopener" class="cs-golink">OKLab</a>, which match how people see lightness and color better than RGB or HSL: the same step looks like the same step on any hue. Blends run in a straight line in OKLab, so a raspberry over a cream stays a dusty pink instead of swinging through peach.', [
        row({ title: 'OKLCH conversion', sig: 'toOklch(hex: Hex): [L, C, H]   fromOklch([L, C, H]): Hex', use: 'Every generated color', rule: 'sRGB → linear → LMS (cube root) → OKLab → L, C = √(a² + b²), H = atan2(b, a)\n// C is the distance from gray, H the angle around it\nfromOklch clips each channel to 0…1 if the color is out of gamut   // use fitGamut to keep the hue', note: 'Björn Ottosson\'s OKLab. Use fitGamut when the hue must survive.', code: [src('toLin', toLin), src('toSrgb', toSrgb), src('toOklch', toOklch), src('fromOklch', fromOklch)].join('\n') }),
        row({ title: 'Blend', sig: 'mix(a: Hex, b: Hex, t: number): Hex', use: 'Soft text, borders, disabled, secondary button backgrounds', rule: 'OKLab:  L, a and b each La + (Lb − La)·t, a straight line between the two colors\nthen fitGamut, since that line can leave the gamut between two saturated colors\n// no swing round the hue circle: a raspberry over a cream stays dusty pink instead of going peach', code: [src('mixLab', mixLab), 'const mix = mixLab;'].join('\n') }),
        row({ title: 'Shift', sig: 'shiftL(hex: Hex, d: number): Hex', use: 'Hover, pressed', rule: 'L′ = clamp(L + d, 0, 1);  C, H unchanged', code: src('shiftL', shiftL) }),
        row({ title: 'Fit to sRGB, keeping the hue', sig: 'fitGamut(L, C, H): Hex', use: 'Status colors, corrected Brand', rule: 'keep L and H; if the color doesn\'t fit the gamut, C = the most chroma that fits at that L and H\n// found by halving the range (maxChroma); clipping each channel instead would change the hue\nP3: written as oklch() with 3 decimals, chroma rounded down; if the written value still falls\n    outside P3, C steps down 0.001 until it fits, and a value that fits sRGB is written as hex', code: src('fitGamut', fitGamut) })
      ])
      + sec('Contrast', 'How readability is measured, and how a block picks its accent.', [
        row({ title: 'Contrast', sig: 'contrast(a: Hex, b: Hex): number', use: 'Every check in the system', rule: 'L(c) = 0.2126·R + 0.7152·G + 0.0722·B   // R, G, B linearized sRGB\ncontrast = (Lmax + 0.05) / (Lmin + 0.05)   // 1 … 21; order of a and b doesn\'t matter', note: 'WCAG 2.x relative luminance. Text needs 4.5:1, UI parts and borders 3:1.', code: [src('norm', norm), src('lum', lum), src('contrast', contrast)].join('\n') }),
        row({ title: 'Brand', sig: 'brand(surface: Hex, min: number): { hex, brand }', use: 'Links, Tinted and Vivid buttons, headings, markers, icons', min: fmt(min) + ' on the surface', deps: ['contrast', 'ink'], rule: 'SecondaryColor   if contrast ≥ min\n' + 'else Shade1      if contrast ≥ min   // Alternate stands in, e.g. on the Brand background\n' + 'else ink(surface)   // the part goes neutral, it never goes unreadable', ex: ex([[pal.SecondaryColor, 'Brand'], [bg, S.bg]], b.block.link.hex), code: src('brand', F.brand) })
      ])
      + sec('Ink', 'Text, links and lines, all built from the ink.', [
        row({ title: 'Ink', sig: 'ink(surface: Hex): Hex', use: 'Body text and the fallback for every target', min: '4.5:1 on the surface (guaranteed)', deps: ['contrast', 'fitGamut'], rule: 'the one of Dark ink and Light ink with the higher contrast on the surface\nif it is under 4.5:1, Black or White instead   // only happens on mid-tone surfaces', note: S.inkv === 'pure' ? 'White / Black: Dark ink #000000, Light ink #FFFFFF.' : 'Art-directed: Dark ink OKLCH(0.25, 0.025, H of Base), or 0.05 below a darker Base, = ' + F.inkDark + ', Light ink OKLCH(0.975, 0.01, H of Base) = ' + F.inkLight + '.', ex: ex([[bg, S.bg]], E.ink(bg)), code: ['// inkDark = ' + F.inkDark + ', inkLight = ' + F.inkLight + ' for ' + pal.name, src('pick', F.pick), src('ink', F.ink)].join('\n') }),
        row({ title: 'Light and Dark backgrounds', sig: 'p.White = inkLight; p.Black = darkBg', use: 'The Light and Dark block backgrounds (the palette\'s White and Black slots)', min: 'Text on them is Ink, at 4.5:1', deps: ['ink'], rule: 'Light = inkLight                        // the light ink itself: OKLCH(0.975, 0.01, ink hue)\nDark  = OKLCH(darkL, 0.025, ink hue)       // the dark ink\'s hue and chroma, but deeper:\n        darkL = max(0.04, min(0.14, L(Base) − 0.05))   // vs 0.25 for the dark ink\n// text reads well at 0.25, but a background needs more depth\n// with black and white ink: Light = #FFFFFF, Dark = #000000, like the text', note: 'The Neutrals switch decides both. ' + (S.inkv === 'pure' ? 'Black and white ink: Light #FFFFFF, Dark #000000.' : 'Art-directed ink, ' + esc(pal.name) + ': Light ' + F.inkLight + ', Dark ' + F.darkBg + ' (the dark text ink is ' + F.inkDark + ').'), code: "// in engine(), after the inks\nconst darkBg = art ? fitGamut(Math.max(0.04, Math.min(0.14, baseL - 0.05)), 0.025, inkHue) : '#000000';\nif (art) { p.White = inkLight; p.Black = darkBg; }" }),
        row({ title: 'Soft text', sig: 'soft = closestPassing(ink(bg), bg, 4.5)', use: 'Placeholders, kicker titles', min: '4.5:1 on the background', deps: ['mix', 'contrast', 'ink'], rule: 'mix(Ink, bg, t), t = the largest of 0.60, 0.58, … 0 with contrast ≥ 4.5\n// as soft as it can get while still reading as text', note: 'Helper text uses regular Ink.', ex: exG('Soft text (placeholder)'), code: [src('closestPassing', closestPassing), 'const soft = closestPassing(ink(bg), bg, 4.5);'].join('\n') }),
        row({ title: 'Link states', sig: 'underline(state): width', use: 'Links', min: '4.5:1 on the background; 3:1 ring', deps: ['stateShift', 'ink'], rule: 'resting   link, underline 1px\nhover     accent-hover, underline 2px\npressed   accent-pressed, underline 2px\nfocus     2px ink(bg) outline, 3px offset, corners 0 on square themes, else 3px\nvisited   as resting\nunderline, color and outline animate 120ms ease-out\n// the underline marks the link, so meaning never depends on color alone', note: 'Colors come from Hover · pressed, shared with buttons and fields.', ex: lp ? ex([[lp.src, lp.from]], lp.hex) : '', code: '// underline: background linear-gradient(currentColor) at the bottom, size 100% 1px → 2px\nconst hover = stateShift(link, bg, 0.09), pressed = stateShift(link, bg, 0.16);' }),
        row({ title: 'Borders', sig: 'line = closestPassing(ink(bg), bg, 3)', use: 'Field borders, checkboxes, radios', min: '3:1 on the background', deps: ['closestPassing'], rule: 'mix(Ink, bg, t), t = the largest of 0.60, 0.58, … 0 with contrast ≥ 3\n// field borders, empty checkboxes, and radios: they mark a control, so they need 3:1\n// neutral in every style', ex: exG('Border'), code: 'const line = closestPassing(ink(bg), bg, 3);' }),
        row({ title: 'Dividers', sig: 'divider = derivedCard(bg, null, 0, LINE_STEPS)', use: 'Lines under kickers, separators, the progress track', min: '', deps: ['derivedCard', 'mixLab'], rule: 'the card rule, one and a half steps out: the block\'s own color, hue kept,\n  darker (lighter if L < 0.45) until ΔE ≥ 1.5·cardDE(L) and contrast ≥ cardCR(L)^1.5\nVivid, where the block uses SecondaryColor: tintLine(line, Brand)\n  H, C from mixLab(line, Brand, 0.25), L from the line   // as subtle as in the other styles\n// no minimum: they only organize the layout, so they follow the card', note: 'Same source and direction as the card, one more step, so lines always show on a card too.', code: "const line = derivedCard(bg, null, 0, LINE_STEPS);\nconst divider = vivid && fill === theme.SecondaryColor ? tintLine(line, fill) : line;\n" + src('tintLine', tintLine) })
      ])
      + sec('Buttons', 'What is specific to buttons. Their hover, pressed, and focus are under States.', [
        row({ title: 'Button label', sig: 'label(surface: Hex, fill: Hex): Hex', use: 'Primary buttons', min: '4.5:1 on the fill', deps: ['toOklch', 'fromOklch', 'contrast', 'ink'], rule: labelBg ? 'label = surface   // on every surface, mid-tones too\n// no extra check needed: the fill passed 4.5:1 on this surface, and the label is the same pair reversed' : 'ink(fill)', note: labelBg ? 'The surface on the fill is the same pair as the fill on the surface, which already passed. Hover and pressed keep the label; the fill moves away from it.' : 'Black or White, whichever reads better.', ex: ex([[b.block.btnFill.hex, 'Fill']], b.block.btnLabel.hex), code: labelBg ? 'const label = surface;' : 'const label = ink(fill);' }),
        row({ title: 'Secondary button hover and pressed', sig: 'stateSurface(bg: Hex, border: Hex, tmax: number): Hex', use: 'Secondary buttons: surface-hover and surface-pressed', min: '4.5:1 for the label on it', deps: ['mix', 'contrast'], rule: 'mix(bg, border, t), t = the largest of tmax, tmax − 0.01, … with contrast ≥ 4.5\nhover tmax 0.12 · pressed tmax 0.22\n// tinted toward the button color, and less where the label would drop under 4.5:1', ex: s2h && s2p ? ex([[bg, S.bg], [s2h.src, s2h.from]], s2h.hex) + ex([[bg, S.bg], [s2p.src, s2p.from]], s2p.hex) : '', code: [src('stateSurface', stateSurface), 'const hoverSurface = stateSurface(bg, border, 0.12), pressedSurface = stateSurface(bg, border, 0.22);'].join('\n') })
      ])
      + sec('Fields', 'Field borders in each state.', [
        row({ title: 'Field states', sig: 'fieldBorder(state): { color, width }', use: 'Inputs', min: '3:1 on the background (border); 4.5:1 for error text', deps: ['border', 'brand', 'ink', 'status'], rule: 'resting   line, 1px\nhover     accent-hover (see Hover · pressed), 2px\nfocus     accent (brand, Ink in Neutral), 2px + ring: 2px bg gap, 2px ink(bg)\nerror     error color, 2px\nthe 2nd pixel is an inset box-shadow, so nothing moves; 120ms ease-out\n// focus adds the ring so keyboard users can tell it from hover', code: "const accent = style !== 'Neutral' && fill.isBrand ? fill.hex : ink(bg);\nconst hover = stateShift(accent, bg, 0.09);\nconst border = { resting: [line, 1], hover: [hover, 2], focus: [accent, 2], error: [errorOnBg, 2] }[state];\n// CSS: border: 1px solid c; box-shadow: inset 0 0 0 (w − 1)px c [, 0 0 0 2px bg, 0 0 0 4px ink(bg) on focus]" })
      ])
      + sec('States', 'Shared by every interactive part.', [
        row({ title: 'Hover and pressed', sig: 'stateShift(accent: Hex, surface: Hex, step: number): Hex', use: 'Primary button fill, link text, field border: one accent-hover and one accent-pressed for all three', min: '4.5:1 for a label on the new fill and for link text; 3:1 for field borders', deps: ['shiftL', 'toOklch'], rule: 'accent-hover   = shiftL(accent, ∓0.09)\naccent-pressed = shiftL(accent, ∓0.16)\n// darker if the accent is darker than the surface, lighter otherwise:\n// away from the surface, so contrast only goes up\n// one rule for buttons, links, and field borders, so a state looks the same everywhere' + (labelBg ? '' : '\nlabel = ink(new fill)'), ex: hv && pr ? ex([[hv.src, hv.from]], hv.hex) + ex([[pr.src, pr.from]], pr.hex) : '', code: [src('stateShift', stateShift), 'const accentHover = stateShift(accent, bg, 0.09), accentPressed = stateShift(accent, bg, 0.16);'].join('\n') }),
        row({ title: 'Focus ring', sig: 'ring = ink(bg)', use: 'Buttons, fields, links', min: '3:1 on the background', deps: ['ink'], rule: '2px ring in ink(bg) with a 2px gap in the background color\n// the gap keeps the ring visible on a fill of the same color\nlinks: an outline 3px away instead   // so it doesn\'t sit on the letters', ex: ex([[bg, S.bg]], E.ink(bg)), code: 'const ring = ink(bg);\n// CSS: box-shadow: 0 0 0 2px bg, 0 0 0 4px ring' }),
        row({ title: 'Disabled', sig: 'disabled = mix(color, bg, 0.6)', use: 'Primary fill and label, secondary border, and label', min: '', deps: ['mix'], rule: 'every color of the part blended 60% toward the background\n// no contrast minimum: WCAG exempts disabled controls', ex: exG('Primary button, disabled'), code: 'const disabledFill = mix(fill, bg, 0.6), disabledLabel = mix(label, bg, 0.6);\nconst disabledBorder = mix(border, bg, 0.6);' })
      ])
      + sec('Status colors', 'Error, success, and warning.', [
        row({ title: 'Status colors', sig: "statusOf(name: 'error' | 'success' | 'warning' | 'info', surface: Hex, brand: Hex): Hex | null", use: 'Messages and field errors', min: '4.5:1 on the message surface', deps: ['toOklch', 'fitGamut', 'contrast', 'ink', 'derivedCard'], rule: 'success, warning, info:\n  H = anchor + clamp(0.2·gap(anchor, H(Brand)), −12°, 12°)   // anchors: success 150°, warning 75°, info 250°\n  // a small nudge toward Brand, so they belong to the theme\n  C = clamp(0.5·C(Brand) + 0.06, 0.09, 0.17)   // follows how vivid the theme is\nerror:\n  H = 27°, C = clamp(0.5·C(Brand) + 0.06, 0.15, 0.20)\n  // no nudge and more chroma: a muted or nudged red reads as rust or brown\nL = first step from 0.60 (0.01 steps, away from the surface first) with contrast ≥ 4.5\nnull if C had to drop under 0.06 to fit   // too gray to read as red, green, amber, or blue\nmessage surface = the card surface, always   // like the cards\nnull on it: ink(card)   // the icon carries the meaning', note: 'Every message has an icon, so meaning never relies on color.', ex: (() => { const xs = ['Error color', 'Success color', 'Warning color', 'Info color'].map(g).filter(Boolean); return xs.length ? '<div class="cs-fxex">' + xs.map((x) => sw(x.hex, x.label.split(' ')[0])).join('') + '</div>' : ''; })(), code: ['const STATUS_HUE = ' + JSON.stringify(STATUS_HUE) + ';', src('deg', deg), src('hueGap', hueGap), src('statusHC', statusHC), src('statusOf', statusOf)].join('\n') })
      ])
      + sec('Cards', 'The card surface. Everything on a card reuses the rules above.', [
        row({ title: 'Card surface', sig: 'derivedCard(block: Hex, accent: Hex | null, min = 4.5): Hex', use: 'Cards', min: 'Sits ΔE(L) away from the block (decorative); keeps the block\'s accent at its minimum', deps: ['toOklch', 'fitGamut', 'maxChroma', 'deltaE', 'contrast'], rule: 'the block\'s own color in OKLCH, hue kept:\n  L  darker, or lighter if L(block) < 0.45, until\n     ΔE_OKLab(card, block) ≥ 0.032 + 0.035·(1 − L)² + 0.06·max(0, (0.3 − L) / 0.3)²\n     and contrast(card, block) ≥ 1.06 + 0.3·(1 − L)³\n  C  darker cards keep the block\'s vividness: C × min(1.25, maxChroma(L card, H) / maxChroma(L block, H));\n     lighter cards (dark blocks) keep C as it is;\n     at least 0.02·(1 − L)² if the block has a hue\nif the accent would drop under its minimum: move less, then add chroma (up to ×1.6)\n// cards always keep the block\'s accent, so card and block match\n// the extra terms near black make up for OKLab understating dark differences on real screens', note: 'Same direction on every theme, and cards keep the block\'s color.', ex: ex([[bg, S.bg]], cs), code: [src('deltaE', deltaE), src('cardDE', cardDE), src('cardCR', cardCR), src('maxChroma', maxChroma), src('derivedCard', derivedCard)].join('\n') })
      ]);
    return '<div class="cs-gwrap"><div class="cs-fxdoc cs-doc">' + doc.replace('%%FXTOCSEL%%', () => tocSelect(FXTOC.flatMap(([id, t, rows]) => [[id, t, 0]].concat(rows.map(([rid, rt]) => [rid, rt, 1]))))) + '</div><nav class="cs-gtoc" aria-label="On this page"><b>On this page</b>' + FXTOC.map(([id, t, rows], n) => '<a href="#" data-gscroll="' + id + '"' + (n ? '' : ' aria-current="true"') + '>' + esc(t) + '</a>' + (rows.length ? '<div class="cs-gtocsub">' + rows.map(([rid, rt]) => '<a href="#" data-gscroll="' + rid + '">' + rt + '</a>').join('') + '</div>' : '')).join('') + '</nav></div>';
  };

  const failTab = () => {
    const list = failures();
    const all = S.scope === 'all', themes = all ? allPalettes().length : 1, scopeSw = '<div class="cs-scope">' + seg('scope', all ? 'all' : 'theme', [['theme', palette().name], ['all', 'All themes']]) + '</div>';
    // grouped and ordered like the Rules table: by importance, then block before card, then generated colors
    const idx = (id) => Math.max(0, TARGETS.findIndex((t) => t.id === id));
    const rank = ([label, x]) => idx(x.base) * 10 + (/card\)$/.test(label) ? 1 : 0) + (GEN_BASE[label] ? 2 : 0);
    const low = Object.entries(LOWEST).sort((a, b) => rank(a) - rank(b));
    // with All themes: one row per theme first, so every theme is visible, not just the ones that hold a closest call
    const themeTable = !all ? '' : secHead('By theme', 'Each theme checked on its 6 backgrounds and 3 styles, with its tightest spot.') + '<table class="cs-table"><thead><tr><th>Theme</th><th>Checks</th><th>Result</th><th>Tightest</th><th>Where</th><th>Contrast</th></tr></thead><tbody>'
      + BYTHEME.map((t) => '<tr><td>' + esc(t.name) + '</td><td>' + t.checks + '</td><td>' + (t.fails ? '<span class="cs-badge sm bad">' + t.fails + ' fail</span>' : '<span class="cs-badge sm ok">All pass</span>') + '</td><td>' + esc(t.low.label) + '</td><td>' + esc(t.low.where) + '</td><td>' + crCell(t.low.r) + '</td></tr>').join('') + '</tbody></table>';
    let grp = '';
    const lowTable = themeTable + secHead('Closest call per target', 'For each target, the one ' + (S.scope === 'all' ? 'theme, ' : '') + 'background and style where it comes nearest to its minimum' + (S.scope === 'all' ? ' across all themes, so a theme only appears here if it holds a target\'s tightest spot' : '') + '. Grouped like Targets.') + LEGENDS + '<table class="cs-table rules"><thead><tr><th>Target</th><th></th><th>Where</th><th>Color on surface</th><th>Contrast</th></tr></thead><tbody>'
      + low.map(([label, x]) => { const g = T(x.base) ? T(x.base).group : ''; const head = g !== grp ? '<tr class="grp"><td colspan="5">' + g + '</td></tr>' : ''; grp = g;
        return head + '<tr><td>' + esc(label) + ' ' + tokLink(tokOf(label, x.base, x.r)) + '</td><td>' + sample(x.r) + '</td><td>' + esc(x.where) + '</td><td class="cs-onpair">' + onPair(x.r) + '</td><td>' + crCell(x.r) + '</td></tr>'; }).join('') + '</tbody></table>';
    // Brand that quietly fell back to Ink: still readable, so not a failure, but the style lost its color there
    const dropBox = DROPS.length ? '<div class="cs-dropbox"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4M12 17h.01"/></svg><div><b>' + DROPS.length + ' targets lost their Brand color</b><span>They still pass, but fell back to Ink where Brand (or the Shade1 fallback) should show.</span></div></div>'
      + '<table class="cs-table"><thead><tr><th>Theme</th><th>Background</th><th>Style</th><th>Target</th><th>Why</th></tr></thead><tbody>' + DROPS.map(([p, bg, st, t, r]) => '<tr><td>' + esc(p) + '</td><td>' + bg + '</td><td>' + st + '</td><td>' + esc(t) + '</td><td class="muted">' + esc(r.why) + '</td></tr>').join('') + '</tbody></table>' : '';
    const fhead = pageHead('Every check, on every background', 'Each part and generated color, checked against its contrast minimum.');
    if (!list.length) return fhead + dropBox + '<div class="cs-allgood"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg><div><b>All ' + nChecks.toLocaleString('en-US') + ' checks pass</b><span>Every target and generated color on ' + (all ? themes + ' themes' : palette().name) + ' meets its minimum, on ' + BGS.length + ' backgrounds in ' + STYLES.length + ' styles.</span></div>' + scopeSw + '</div>' + lowTable;
    return fhead + scopeSw + dropBox + '<p class="muted">' + list.length + ' of ' + nChecks.toLocaleString('en-US') + ' checks fail their minimum' + (all ? ' across all themes,' : ' on ' + esc(palette().name) + ', across all') + ' backgrounds and styles (with the current switches). Gaps that aren\'t designed yet aren\'t counted.</p><table class="cs-table"><thead><tr><th>Palette</th><th>Background</th><th>Style</th><th>Target</th><th></th><th>Color on surface</th><th>Contrast</th></tr></thead><tbody>'
      + list.map(([p, bg, s, t, r]) => '<tr><td>' + esc(p) + '</td><td>' + bg + '</td><td>' + s + '</td><td>' + esc(t) + '</td><td>' + sample(r) + '</td><td class="cs-onpair">' + onPair(r) + '</td><td>' + crCell(r) + '</td></tr>').join('') + '</tbody></table>' + lowTable;
  };

  // ---- controls ----
  const seg = (name, value, opts, off) => '<div class="cs-seg" role="radiogroup" aria-label="' + esc(name) + '">' + opts.map(([v, l]) => '<button type="button" role="radio" aria-checked="' + (v === value) + '"' + (off && off.includes(v) ? ' aria-disabled="true"' : '') + ' data-set="' + name + '" data-val="' + v + '">' + l + '</button>').join('') + '</div>';
  const controls = (E) => {
    const brandOff = brandUnavailable(E);
    const pal = palette();
    const hint = (t) => '<p class="cs-hint">' + t + '</p>';
    return '<div class="cs-controls">'
      + '<div class="cs-sec">'
      + '<div class="cs-ctl"><label for="cs-theme">Theme</label>'
      + '<span class="cs-selwrap"><select id="cs-theme" data-set="palette">' + [...new Set(Object.keys(PALETTES).map((k) => (THEME_INFO[k] || {}).segment || 'Other'))].map((seg) => '<optgroup label="' + esc(seg) + '">' + Object.keys(PALETTES).filter((k) => ((THEME_INFO[k] || {}).segment || 'Other') === seg).map((k) => '<option value="' + k + '"' + (S.palette === k ? ' selected' : '') + '>' + esc(PALETTES[k].name) + '</option>').join('') + '</optgroup>').join('') + '<optgroup label="Your own"><option value="custom"' + (S.palette === 'custom' ? ' selected' : '') + '>Custom</option></optgroup></select>'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></div>'
      + (S.palette === 'custom' ? '<div class="cs-custom">' + [['MainColor', 'Base'], ['Shade1', 'Alternate'], ['SecondaryColor', 'Brand'], ['Shade2', 'Inverted']].map(([key, name]) => '<label class="cs-cpick"><span class="cs-cpsw"><input type="color" data-cust="' + key + '" value="' + srgbHex(S.custom[key]).toLowerCase() + '" aria-label="' + name + ' color"></span><span class="cs-cpname"><span>' + name + ' <span class="cs-bgalias">(' + key + ')</span></span><input type="text" class="cs-hexchip" data-cust="' + key + '" value="' + norm(S.custom[key]) + '" spellcheck="false" aria-label="' + name + ' hex"></span></label>').join('') + '</div>'
        : '<div class="cs-ctl"><label>Theme colors</label>' + seg('colors', S.colors, [['fixed', 'Corrected for 4.5:1'], ['original', 'Original']]) + '</div>')
      + '<div class="cs-ctl"><label>Background</label><div class="cs-bgs" role="radiogroup" aria-label="Background">' + BGS.map(([bg, key]) => '<button type="button" role="radio" class="cs-bgname" aria-checked="' + (S.bg === bg) + '" data-set="bg" data-val="' + bg + '"><span class="cs-bgsw" style="background:' + norm(E.p[key]) + '"></span><span class="cs-bgtxt"><span>' + bg + ' <span class="cs-bgalias">(' + key + ')</span></span><code class="cs-hexchip">' + norm(E.p[key]) + '</code></span></button>').join('') + '</div></div>'
      + '<details class="cs-gen"' + (S.genOpen ? ' open' : '') + '><summary><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg><span>Generated colors</span><span class="cs-gencount">' + GENLIST().length + '</span></summary><ul>'
      + GENLIST().map((g) => '<li title="' + esc((g.uses.length > 1 ? g.uses.join(', ') : g.label) + ': ' + g.how + ' (from ' + g.from + ')') + '"><span class="cs-gensw" style="background:' + g.hex + '"></span><span class="cs-gentxt"><b>' + (GEN_COMP(g.label) ? '<a href="#" class="cs-sidecomp" title="See it in Components: ' + esc(GEN_COMP(g.label)) + '" data-goto="components|comp-' + slug(GEN_COMP(g.label)) + '">' + esc(g.name) + '</a>' : esc(g.name)) + (LABEL_TOKEN[g.label] ? ' <a href="#" class="cs-sidetok" data-goto="colors|tok-' + LABEL_TOKEN[g.label] + '">' + LABEL_TOKEN[g.label] + '</a>' : '') + '</b><span>From <code>' + esc(g.from) + '</code>' + (g.chg ? '. ' + esc(g.chg).replace(/(L [−+]\d\.\d+|C ×[\d.]+|\d+%|[\d.]+:1)/g, '<code>$1</code>') : '') + '</span></span></li>').join('')
      + '</ul></details>'
      + '<div class="cs-ctl"><label>Style</label>' + seg('style', S.style, STYLES.map((s) => [s, s]), brandOff ? ['Tinted', 'Vivid'] : null) + (brandOff ? '<p class="cs-hint">Tinted and Vivid aren\'t available: neither Brand nor Alternate reads at ' + fmt(E.minFor(T('link'))) + ' on ' + S.bg + '.</p>' : '') + '</div>'
      + '<div class="cs-ctl"><label>Highlight</label>' + seg('show', S.show, [['off', 'Off'], ['derived', 'Generated']]) + '</div></div>'
      + '<div class="cs-sec"><div class="cs-sechead">In review</div>' + hint('Proposals that aren\'t decided yet. The first option is the proposal; switch to compare.')
      + '<div class="cs-ctl"><label>Neutrals</label>' + hint('The text colors (the inks), and the Light and Dark backgrounds made from them.') + seg('inkv', S.inkv, [['soft', 'Art-directed'], ['pure', 'Black and white']]) + '</div>'
      + '<div class="cs-ctl"><label>Button label</label>' + hint('The text color on primary buttons.') + seg('label', S.label, [['bg', 'Surface color'], ['ink', 'Ink']]) + '</div>'
      + '</div>'
      + '</div>';
  };


  const CSS = '.cs{font-family:"Euclid Circular",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#1a1a1a;font-size:14px;line-height:1.45;height:100%;display:flex;background:#f4f4f6;box-sizing:border-box}.cs-side{flex:0 0 384px;height:100%;overflow-y:auto;background:#151517;box-shadow:inset 0 1px 0 rgba(255,255,255,.06);color:#ffffff;border-right:1px solid #000;color-scheme:dark}.cs-sidehead{font-weight:500;font-size:15px}.cs-main{flex:1 1 auto;min-width:0;height:100%;overflow-y:auto;background:#151517;display:flex;flex-direction:column}.cs *{box-sizing:border-box}'
    + '.cs-top{position:sticky;top:0;z-index:5;min-width:0;background:#151517;padding:10px 20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}.cs .cs-main :is(p,li,dd,figcaption,blockquote,td,.ts-fdesc,.ts-calltx>span,.ts-ktx>span:last-child,.cs-grpdesc):not(.ts-frame *,.ts-site *){text-wrap-style:pretty}.cs .cs-main .cs-gtoc{position:sticky;gap:4px}.cs .cs-main .cs-gtoc>a,.cs .cs-main .cs-gtocsub>a{margin-left:22px;padding:4px 0;line-height:1.35;transition:color 150ms}.cs .cs-main .cs-gtocsub{border-left:0;padding-left:0;margin:0;gap:4px}.cs .cs-main .cs-gtocsub>a{margin-left:38px}.cs .cs-main .cs-gtoc a:hover{color:#151517}.cs .cs-main .cs-gtoc a.cs-gon{color:#106AEB}.cs .cs-main .cs-gtoc>b{margin-left:22px;margin-bottom:12px}.cs-gguide{position:absolute;left:0;top:0;width:24px;pointer-events:none;overflow:visible}.cs-gguide path{fill:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:round}.cs-gtrack{stroke:#efeff2}@media (min-width:1281px){.cs .cs-main .cs-gwrap:not(.ts-rmwrap){grid-template-columns:minmax(0,740px) 248px;gap:64px}.cs .cs-main .cs-gwrap.ts-tocwrap{grid-template-columns:minmax(0,1fr) 248px}}.cs-gmark{stroke:#106AEB;stroke-width:1!important;stroke-linecap:round!important;transition:stroke-dasharray 250ms cubic-bezier(.32,.72,0,1),stroke-dashoffset 250ms cubic-bezier(.32,.72,0,1),opacity 150ms}@media (prefers-reduced-motion:reduce){.cs-gmark{transition:none}}.cs .cs-main .cs-gtoc>b{font-size:var(--doc-tag);font-weight:500;letter-spacing:.04em!important;text-transform:uppercase;line-height:1.4}.cs-top::after{content:"";position:absolute;left:0;top:100%;width:12px;height:12px;background:radial-gradient(circle at 100% 100%,transparent 11.5px,#151517 12px);pointer-events:none}'
    + '.cs-controls{display:flex;flex-direction:column;gap:24px;padding:14px 12px 24px}.cs-sec{display:flex;flex-direction:column;gap:16px}.cs-sec+.cs-sec{border-top:1px solid #e3e3e8;padding-top:20px}.cs-sechead{font-weight:500;font-size:16px}.cs-hint{margin:-2px 0 2px;font-size:13px;line-height:1.45;color:#6b6b75}.cs-ctl{display:flex;flex-direction:column;gap:6px}.cs-ctl>label{font-size:15px;font-weight:500;color:#1a1a1a}'
    + '.cs-ctl select{appearance:none;-webkit-appearance:none;width:100%;padding-right:36px !important;height:38px;font-size:15px;border:1px solid #d6d6dd;border-radius:8px;padding:0 8px;font:inherit;background:#fff}.cs-pal{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px}.cs-pc{display:flex;align-items:center;gap:6px;font-size:14px;color:#5c5c66;cursor:pointer}.cs-pc input{width:26px;height:26px;padding:0;border:1px solid #d6d6dd;border-radius:6px;background:none;cursor:pointer}'
    + '.cs-bgs{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cs-bgname{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid #e3e3e8;border-radius:10px;background:#fff;cursor:pointer;font:inherit;text-align:left}.cs-bgname[aria-checked="true"]{border-color:#004ced;box-shadow:0 0 0 1px #004ced}.cs-bgsw{flex:none;width:32px;height:32px;border-radius:7px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}.cs-bgtxt{display:flex;flex-direction:column;font-size:var(--doc-label);font-weight:500;line-height:1.25}.cs-bgtxt .mono{font-weight:400;color:#6b6b75;font-size:11px}.cs-selwrap{position:relative;display:block}.cs-selwrap svg{position:absolute;right:12px;top:50%;width:14px;height:14px;margin-top:-7px;pointer-events:none;color:#3a3a42}.cs-bg{width:40px;height:40px;border-radius:8px;border:1px solid rgba(0,0,0,.12);cursor:pointer;outline:2px solid transparent;outline-offset:2px;padding:0}.cs-bg[aria-pressed="true"]{outline-color:#004ced}'
    + '.cs-seg{display:flex;background:#ececf0;border-radius:8px;padding:3px;gap:2px}.cs-seg button{flex:1 1 0;min-width:0;border:0;background:transparent;border-radius:6px;min-height:32px;padding:4px 8px;font:inherit;font-size:14px;cursor:pointer;color:#3a3a42}.cs-seg button[aria-checked="true"]{background:#fff;color:#000;box-shadow:0 1px 2px rgba(0,0,0,.12);font-weight:500}'
    + '.cs-tabscroll{overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-mask-image:var(--fade,none);mask-image:var(--fade,none);margin:0 -20px;padding:0 20px;scroll-padding-inline:40px}.cs-tabscroll::-webkit-scrollbar{display:none}.cs-tabs{display:inline-flex;flex:none;gap:2px;background:#3a3a42;border-radius:8px;padding:3px}.cs-tabs button{flex:none;white-space:nowrap}.cs-tabs button{display:inline-flex;align-items:center;gap:7px;border:0;background:none;font:inherit;font-size:var(--t-sm);font-weight:500;min-height:32px;padding:4px 14px;border-radius:6px;cursor:pointer;color:#fff}.cs-tabs button:hover:not([aria-selected="true"]){background:#45454e}.cs-tabs button[aria-selected="true"]{background:#cdcdd4;color:#151517}.cs-tabn{font-size:var(--t-xs);font-weight:500;color:#fff;background:#151517;border-radius:999px;padding:1px 8px;line-height:1.4}.cs-tabn.bad{background:#e5484d}'
    + '.cs-body{padding:20px;background:#f4f4f6;border-top-left-radius:12px;flex:1 0 auto}.cs-fxsec{margin:0;scroll-margin-top:72px}.cs-fxdoc{letter-spacing:-0.01em}.cs-fxr.cs-fxfirst{margin-top:6px}.cs-fxdoc .cs-fxtab{font-size:14px}.cs-fxdoc .cs-fxtab td{padding:10px 0}.cs-fxdoc .cs-fxtab td:first-of-type{gap:10px}.cs-fxdoc .cs-fxsw{font-size:var(--t-sm);gap:7px}.cs-fxdoc .cs-fxsw code{font-size:12px}.cs-fxdoc .cs-fxval{text-align:right!important;padding-left:16px!important;font-size:12px;vertical-align:middle}.cs-fxdoc .cs-fxlab{margin:24px 0 8px;font-size:15px;font-weight:500;letter-spacing:-0.01em;text-transform:none;color:#151517}.cs-fxlabsub{font-weight:400;color:#6b6b75}.cs-fxdoc .cs-fxsig{font-size:13px;margin:0;padding:4px 9px}.cs-fxdoc .cs-fxmeta{margin:16px 0 0}.cs-fxdoc .cs-fxnote{font-size:14.5px;line-height:1.55;color:#55555f;margin:8px 0 0}.cs-fxdoc .cs-fxcode,.cs-fxdoc .cs-fxrule{font-size:var(--doc-label)}.cs-fxhead{margin:0 0 10px}.cs-fxhead h1{margin:0 0 8px;font-size:34px;line-height:1.15;font-weight:500;letter-spacing:-0.03em;color:#151517}.cs-fxhead .cs-glead{margin:0 0 10px;font-size:18.5px;line-height:1.55;color:#3a3a42}.cs-fxhead p{margin:0 0 14px;font-size:16px;line-height:1.6;color:#3a3a42}.cs-fxdoc .cs-fxcode,.cs-fxdoc .cs-fxrule,.cs-fxdoc .cs-fxsig,.cs-fxdoc code{letter-spacing:0}.cs-fxdoc .cs-fxr{scroll-margin-top:72px}.cs-fxintro{margin:0 0 8px;padding:16px 18px;border-radius:10px;background:#eef0ff;color:#2a2f5a;font-size:15.5px;line-height:1.55}.cs-copy.cs-copyall{display:inline-block;margin:0;background:#151517;color:#fff;font-size:var(--t-sm);letter-spacing:0;padding:8px 14px;border-radius:8px}.cs-copy.cs-copyall:hover{background:#3a3a42}.cs-copyall:hover{background:#2a2f6e}.cs-fxintro b{display:block;font-size:14.5px;margin-bottom:2px;color:#1d2150}.cs-fxtab{width:100%;border-collapse:collapse;font-size:14px}.cs-fxtab th{width:90px;text-align:left;font-weight:500;color:#6b6b75;padding:7px 0;vertical-align:middle}.cs-fxtab td{padding:7px 0;border-top:1px solid #f0f0f3}.cs-fxtab tr:first-child td,.cs-fxtab tr:first-child th{border-top:0}.cs-fxtab th{border-top:1px solid #f0f0f3}.cs-fxtab td:first-of-type{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.cs-fxtab td:first-of-type svg{width:16px;height:16px;color:#6b6b75}.cs-fxval{text-align:right;white-space:nowrap;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:12px;color:#3a3a42;padding-left:12px!important}.cs-fxr{background:none;border-radius:0;box-shadow:none;padding:0;margin:40px 0 0;border:0}.cs-fxdoc h3,.cs-fxdoc h4{display:flex;align-items:center;gap:8px}.cs-fxdoc h3:hover .cs-glink,.cs-fxdoc h4:hover .cs-glink{opacity:1}.cs-fxsec>.muted+.cs-fxr{margin-top:12px}.cs-fxr header{display:flex;align-items:baseline;gap:10px}.cs-fxn{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:12px;color:#6b6b75}.cs-fxr h4{margin:0;font-size:19.5px;line-height:1.3;font-weight:500;letter-spacing:-0.02em}.cs-fxsig{display:inline-block;margin:8px 0 0;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:12.5px;background:#f3f3f6;padding:3px 8px;border-radius:5px;color:#3a3a42}.cs-fxr{container-type:inline-size}.cs-fxmeta{display:grid;grid-template-columns:120px minmax(0,1fr);gap:6px 14px;margin:16px 0 0;font-size:14.5px}.cs-fxmeta dt{color:#6b6b75}.cs-fxmeta dd{margin:0}.cs-fxmeta code{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:12px;background:#f3f3f6;padding:1px 5px;border-radius:4px}.cs-fxlab{display:flex;align-items:center;gap:10px;margin:16px 0 6px;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#6b6b75}.cs-fxrule,.cs-fxcode,.cs-fxsig{font-variant-ligatures:none;font-feature-settings:\'calt\' 0,\'liga\' 0}.cs-fxrule,.cs-fxcode{margin:0;padding:12px 14px;border-radius:8px;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:var(--doc-label);line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere}.cs-fxcode span{display:block}.cs-fxrule{background:#ffffff;color:#0a0a0a;box-shadow:inset 0 0 0 1px #e6e6eb}.cs-fxrule i,.cs-fxsig i{font-style:normal}.cs-fxsig .tc{color:#737373}.cs-fxsig .ts{color:#199f43}.cs-fxsig .tn{color:#1ca1c7}.cs-fxsig .tk{color:#d32a61}.cs-fxsig .tb{color:#d5901c}.cs-fxsig .tf{color:#693acf}.cs-fxsig .tv{color:#18a46c}.cs-fxrule .tc{color:#737373}.cs-fxrule .ts{color:#199f43}.cs-fxrule .tn{color:#1ca1c7}.cs-fxrule .tk{color:#d32a61}.cs-fxrule .tb{color:#d5901c}.cs-fxrule .tf{color:#693acf}.cs-fxrule .tv{color:#18a46c}.cs-fxcode{background:#0a0a0a;color:#fafafa;padding-left:52px!important;counter-reset:ln}.cs-fxcode span{position:relative;counter-increment:ln}.cs-fxcode span::before{content:counter(ln);position:absolute;left:-46px;width:30px;text-align:right;text-indent:0;color:#737373;user-select:none}.cs-fxcode i{font-style:normal}.cs-fxcode .tc{color:#737373}.cs-fxcode .ts{color:#5ecc71}.cs-fxcode .tn{color:#68cdf2}.cs-fxcode .tk{color:#ff678d}.cs-fxcode .tb{color:#ffab16}.cs-fxcode .tf{color:#9d6afb}.cs-langseg{display:inline-flex;gap:2px;background:#ececf3;border-radius:8px;padding:2px;text-transform:none;letter-spacing:0}.cs .cs-langseg button{border-radius:6px}.cs-langseg button{font:inherit;font-size:var(--t-sm);font-weight:500;border:0;background:none;color:#5a5a64;padding:2px 8px;border-radius:4px;cursor:pointer}.cs-langseg button[aria-checked="true"]{background:#fff;color:#1a1a1a;box-shadow:0 0 0 1px rgba(0,0,0,.06)}.cs-kind{text-transform:none;letter-spacing:0;font-size:11px;font-weight:500;border-radius:4px;padding:2px 7px}.cs-kind.css{background:#e3f6ec;color:#0b6b3f}.cs-kind.hybrid{background:#fff4d6;color:#8a5a00}.cs-kind.none{background:#ececf0;color:#45454e}.cs-fxcode .tv{color:#60d199}.cs-lang{font-size:10.5px;letter-spacing:.04em;text-transform:none;font-weight:500;color:#6272a4;background:#ececf3;border-radius:4px;padding:1px 6px}.cs-fxnote{margin:8px 0 0;font-size:13px;color:#6b6b75}@container (max-width:560px){.cs-fxmeta{grid-template-columns:minmax(0,1fr)}.cs-fxmeta dd{margin-bottom:6px}.cs-fxtab tr{display:grid;grid-template-columns:minmax(0,1fr)}.cs-fxtab th,.cs-fxtab td{border-top:0!important;padding:3px 0}.cs-fxtab tr{border-top:1px solid #f0f0f3;padding:6px 0}.cs-fxval{text-align:left!important;padding-left:0!important}}.cs-copy{margin-left:auto;font:inherit;font-size:var(--t-xs);letter-spacing:.04em;text-transform:none;background:#f3f3f6;border:0;border-radius:5px;padding:3px 9px;color:#3a3a42;cursor:pointer}.cs-copy:hover{background:#e6e6ea}.cs-fxsec h3{font-size:26px;line-height:1.2;font-weight:500;letter-spacing:-0.025em;color:#151517;margin:56px 0 8px}.cs-fxsec:first-of-type h3{margin-top:28px}.cs-fxsec>.muted{margin:0 0 8px;font-size:16.5px;line-height:1.6;color:#3a3a42}.cs-fxgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px}.cs-fxc{background:#fff;border-radius:10px;padding:16px;box-shadow:0 0 0 1px rgba(0,0,0,.06)}.cs-fxc h4{margin:0 0 10px;font-size:15px;font-weight:500}.cs-fxc pre{margin:0;padding:10px 12px;background:#f3f3f6;border-radius:6px;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:12.5px;line-height:1.6;white-space:pre-wrap;color:#1a1a1a}.cs-fxc p{margin:10px 0 0;font-size:13px;color:#6b6b75}.cs-fxex{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px}.cs-fxex svg{width:16px;height:16px;color:#6b6b75}.cs-fxsw{display:inline-flex;align-items:center;gap:6px;font-size:var(--t-sm)}.cs-fxsw i{width:20px;height:20px;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}.cs-fxsw b{font-weight:500}.cs-fxsw code{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:11.5px;background:#f3f3f6;padding:1px 5px;border-radius:4px}.cs-fxnone{font-style:normal}.muted{color:#6b6b75}.tiny{font-size:11px}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}'
    + '.cs-spec{display:flex;flex-direction:column;gap:20px}@container (max-width:860px){.cs-site .cs-split{grid-template-columns:minmax(0,1fr);gap:28px}.cs-site .cs-formgrid{grid-template-columns:minmax(0,1fr)}.cs-site .cs-form{max-width:none}.cs-site .cs-msgs{grid-template-columns:minmax(0,1fr)}.cs-site .cs-fstates{grid-template-columns:repeat(3,minmax(0,1fr))}}@container (max-width:640px){.cs-site .cs-grid{grid-template-columns:72px repeat(6,minmax(0,1fr));gap:12px 8px}.cs-site .cs-grid .cs-btn{padding-left:8px;padding-right:8px}.cs-site .cs-fstates{grid-template-columns:repeat(2,minmax(0,1fr))}}.cs-spec-left{min-width:0}'
    + '.cs-block{border-radius:10px;padding:24px;display:flex;flex-direction:column;gap:10px;box-shadow:0 0 0 1px rgba(0,0,0,.06)}.cs-block.compact{padding:12px;gap:6px;border-radius:8px}'
    + '.cs-chip{font-family:var(--bf,Mulish,sans-serif);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.cs-h2{text-transform:var(--ht,none);font-family:var(--hf);font-weight:var(--hw,600);font-size:30px;line-height:1.1}.compact .cs-h2{font-size:18px}'
    + '.cs-h3{display:block;text-transform:var(--ht,none);font-family:var(--hf);font-weight:var(--hw,600);font-size:20px;line-height:1.1}.compact .cs-h3{font-size:14px}.cs-p{display:block;font-family:var(--bf,Mulish,sans-serif);font-size:14px}.compact .cs-p{font-size:11px}'
    + '.cs-ul{list-style:none;margin:0;padding:0;font-family:var(--bf,Mulish,sans-serif);font-size:14px;display:flex;flex-direction:column;gap:4px}.cs-ul li{display:flex;align-items:center;gap:8px}.cs-dot{display:inline-block;width:7px;height:7px;border-radius:50%;flex:none;vertical-align:middle}'
    + '.cs-row{display:flex;align-items:center;gap:10px}.cs-badge-o{font-family:var(--bf,Mulish,sans-serif);font-size:11px;font-weight:700;border:1.5px solid;border-radius:20px;padding:1px 8px}.cs-sep{flex:1;height:1px}.compact .cs-row{display:none}'
    + '.cs-btns{display:flex;gap:8px;flex-wrap:wrap}.cs-btn{display:inline-block;font-family:var(--bf,Mulish,sans-serif);font-size:13px;font-weight:700;padding:8px 14px;border:1px solid transparent}.cs-btn.ghost{background:transparent}.compact .cs-btn{font-size:10px;padding:4px 8px}'
    + '.cs-card{border-radius:6px;padding:16px;display:flex;flex-direction:column;gap:6px;margin-top:6px}.compact .cs-card{padding:8px;gap:4px;margin-top:2px}'
    + '.cs-table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px #e3e3e8;font-size:var(--doc-small)}.cs-table th{text-align:left;font-weight:500;color:#5c5c66;font-size:var(--t-sm);padding:8px 10px;border-bottom:1px solid #e3e3e8}.cs-table td{padding:7px 10px;border-bottom:1px solid #f0f0f3;vertical-align:middle}.cs-table tr.grp td{background:#f7f7f9;font-weight:500;font-size:12px;color:#3a3a42;padding:6px 10px}'
    + '.cs-table.rules td.brand{color:#7a3fd1;font-weight:500}.cs-table.rules td.emph{color:#0b7a5c;font-weight:500}.cs-sw{display:inline-block;width:18px;height:18px;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);vertical-align:middle}'
    + '.cs-cr{display:inline-flex;align-items:center;gap:8px;vertical-align:middle;white-space:nowrap}.cs-crn{font-size:14px;font-weight:500;color:#151517;font-variant-numeric:tabular-nums;min-width:40px;text-align:right}.cs-crn i{font-style:normal;color:#6b6b75}.cs-crbar{position:relative;display:inline-block;width:56px;height:4px;border-radius:2px;background:#e6e6eb;flex:none}.cs-crbar i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:#9aa0a6}.cs-crbar u{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:#3a3a42;border-radius:1px}.cs-crw{font-size:12px;font-weight:500}.cs-cr.ok .cs-crw,.cs-cr.great .cs-crw{color:#0b6b3f}.cs-cr.ok .cs-crbar i{background:#3fae72}.cs-cr.great .cs-crbar i{background:#1f8a55}.cs-cr.close .cs-crw{color:#8a5a00}.cs-cr.close .cs-crbar i{background:#e0a106}.cs-cr.bad .cs-crw{color:#b42318}.cs-cr.bad .cs-crbar i{background:#e5484d}.cs-cr.none .cs-crw{color:#6b6b75}.cs-crmin{color:#6b6b75;font-weight:400}.cs-crblock{display:block;font-size:11.5px;margin-top:2px}.cs-crlegend{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-size:12.5px;color:#55555f;margin:6px 0 12px}.cs-crlegend b{font-weight:500}.cs-crlegend b.ok,.cs-crlegend b.great{color:#0b6b3f}.cs-crlegend b.close{color:#8a5a00}.cs-crlegend b.bad{color:#a1221a}.cs-crlegend .cs-crbar i{background:#3fae72}.cs-badge{display:inline-block;font-size:var(--t-xs);font-weight:500;border-radius:20px;padding:1px 8px;white-space:nowrap}.cs-badge.ok{background:#e3f6ec;color:#0b6b3f}.cs-badge.bad{background:#fde8e6;color:#a1221a}.cs-aa{display:inline-flex;align-items:center;justify-content:center;min-width:34px;padding:0 6px;box-sizing:border-box;height:24px;border-radius:5px;font-size:var(--t-xs);font-weight:500;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.cs-genpill{display:inline-block;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:500;background:#efeafe;color:#5b45c0;border-radius:4px;padding:1px 5px;line-height:1.4;white-space:nowrap}.cs-lchip{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:500;background:#e9e9ee;color:#3a3a42;padding:1px 5px;border-radius:4px;white-space:nowrap;font-variant-ligatures:none}.cs-gens li{margin-bottom:8px}.cs-compgrp{margin:32px 0 12px;font-size:20px;font-weight:500;letter-spacing:-0.02em;color:#151517}.cs-compgrp:first-of-type{margin-top:16px}.cs-comp{background:#fff;border-radius:10px;box-shadow:0 0 0 1px rgba(0,0,0,.06);padding:16px 18px;margin:0 0 12px;container-type:inline-size}.cs-comp h4{margin:0 0 12px;font-size:16px;font-weight:500}.cs-secindex{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}.cs-secindex a{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px #e3e3e8;color:#3a3a42;font-size:13px;text-decoration:none}.cs-secindex a:hover{box-shadow:inset 0 0 0 1px #b4b4bc;color:#151517}.cs-secindex a:focus-visible{outline:2px solid #151517;outline-offset:2px}.cs-secindex span{font-size:11.5px;color:#6b6b75;font-variant-numeric:tabular-nums}.cs-table tr.grp td{background:#f4f4f6;font-weight:500;font-size:14px;color:#151517;padding:10px 12px;border-top:0}.cs-main tr:has(+tr.grp)>td{border-bottom:0}.cs-allstyles{white-space:nowrap}.cs-allstyles span{margin-left:8px;font-size:12px;color:#6b6b75}.cs-status-quiet{font-size:12.5px;color:#6b6b75}.cs-targets td:first-child{min-width:190px}.cs-more{display:inline}.cs-more summary{display:inline;cursor:pointer;color:#6b6b75;font-size:var(--doc-label);list-style:none}.cs-more summary::-webkit-details-marker{display:none}.cs-more summary:hover{color:#151517;text-decoration:underline}.cs-more[open] summary{display:none}.cs-comp .cs-compspec{margin:-6px 0 14px;font-size:14px;line-height:1.5;color:#55555f;max-width:80ch}.cs-headlink{color:inherit;text-decoration:none;display:inline-flex;align-items:baseline;gap:6px}.cs-headlink .cs-arrow{color:#6b6b75;font-weight:400;transition:transform .12s ease-out,color .12s ease-out}.cs-headlink:hover{color:#151517}.cs-headlink:hover .cs-arrow{color:#151517}@media (hover:hover) and (pointer:fine){.cs-headlink:hover .cs-arrow{transform:translateX(3px)}}.cs-headlink:focus-visible{outline:2px solid #151517;outline-offset:2px;border-radius:2px}@media (prefers-reduced-motion:reduce){.cs-headlink .cs-arrow{transition:none}}.cs-compbody{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;align-items:start}.cs-comppv{border-radius:8px;padding:32px 36px;min-height:140px;display:flex;align-items:center;justify-content:flex-start;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);overflow-x:auto}.cs-csts{display:flex;flex-wrap:wrap;gap:24px 22px;align-items:flex-start}.cs-cst{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.cs-cstv{min-height:44px;display:flex;align-items:center}.cs-cstcap{font-family:"Euclid Circular",sans-serif;font-size:11.5px;letter-spacing:.02em;color:var(--cap)}.cs-cb{display:inline-flex;align-items:center;justify-content:center;font-family:var(--bf);font-size:15px;font-weight:700;line-height:1.2;padding:12px 22px;border:1px solid;white-space:nowrap}.cs-cf{display:block;width:220px;box-sizing:border-box;padding:11.5px 12.5px;border:1px solid;font-family:var(--bf);font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cs-comptab td{vertical-align:middle}.cs-comptab .cs-sw{display:inline-block;vertical-align:middle;margin-right:6px}@container (max-width:620px){.cs-compbody{grid-template-columns:minmax(0,1fr)}}.cs-tok{display:inline-block;margin:2px 4px 2px 0;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:500;padding:1px 6px;border-radius:4px;text-decoration:none;white-space:nowrap;font-variant-ligatures:none}.cs-tok.picked{background:#e9e9ee;color:#3a3a42}.cs-tok.generated{background:#efeafe;color:#5b45c0}a.cs-tok:hover{box-shadow:0 0 0 1px currentColor}.cs-tok.big{font-size:12.5px;padding:2px 7px}.cs-tokname{font-size:12px;color:#6b6b75;margin-top:3px}.cs-golink{color:#004ced;text-decoration:none;font-size:13px;white-space:nowrap}.cs-golink:hover{text-decoration:underline}.cs-invuse .cs-golink{display:block;line-height:1.6}.cs-inv td{vertical-align:top}.cs-invbg .cs-bgalias{display:block;font-weight:400;opacity:1;color:#6b6b75;font-size:var(--doc-label)}.cs-malias{color:#6b6b75;font-weight:400}.cs-why{min-width:200px;max-width:280px}.cs-why p{margin:6px 0 0;font-size:12.5px;line-height:1.45;color:#55555f}.cs-inv .cs-invaa{margin:2px 0}.cs-tgtlink{margin-top:6px;color:#6b6b75!important}.cs-inv .cs-invuse{min-width:180px;max-width:260px;line-height:1.5;color:#55555f}.cs-inv .cs-invuse .cs-golink{display:inline}.cs-inv .cs-invuse .cs-tgtlink{display:block}.cs-invbg{text-align:center;font-size:12px}.cs-invaa{display:block;margin:2px 0 6px}.cs-comptab .cs-aa{margin-right:6px;vertical-align:middle}.cs-compcol{white-space:nowrap}.cs-ruleparts span{display:inline-block;margin:2px 14px 2px 0;white-space:nowrap;font-size:13px}.cs-compspec{font-size:12.5px;color:#55555f;margin:8px 2px 0;line-height:1.45}.cs-invsw{display:block;width:34px;height:24px;border-radius:5px;margin:2px auto 6px}.cs-flash{animation:csflash 1.4s ease-out}@keyframes csflash{0%,30%{background:#fff4d6}100%{background:transparent}}.cs-sidetok{margin-left:6px;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:var(--doc-label);font-weight:500;color:#cfc4ff;background:#4a3f7a;padding:0 5px;border-radius:4px;text-decoration:none}.cs-sidetok:hover{background:#5b4f94}.cs-gwrap{display:grid;grid-template-columns:minmax(0,740px) 190px;gap:56px;align-items:start}.cs-guide{font-size:17.5px;line-height:1.65;color:#151517;letter-spacing:-0.02em}.cs-guide :is(b,strong,h4,h5,h6),.cs-doc :is(strong,h4,h5,h6){font-weight:500}.cs-guide .cs-lchip{font-size:.8em;padding:1px 5px;letter-spacing:0;vertical-align:.05em}.cs-guide .cs-golink{font-size:inherit;white-space:normal}.cs-guide .cs-golink:hover{text-decoration:underline}.cs-gintro{margin:0 0 8px}.cs-gintro ol{margin-bottom:14px}.cs-gtoc{position:sticky;top:72px;display:flex;flex-direction:column;gap:2px;font-size:var(--t-sm);letter-spacing:-0.01em;padding:2px 0}.cs-gtoc{max-height:calc(100dvh - 160px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}.cs-gtoc b{font-weight:500;color:#151517;margin-bottom:6px}.cs-gtoc a{color:#6b6b75;text-decoration:none;padding:3px 0;line-height:1.35}.cs-gtoc a:hover{color:#151517}.cs-gtoc a[aria-current]{color:#151517}.cs-gtocsub{display:flex;flex-direction:column;margin:1px 0 4px 2px;padding-left:11px;border-left:1px solid #e3e3e8}.cs-gtocsub a{padding:3px 0}.cs-guide section{scroll-margin-top:72px}.cs .cs-main .cs-guide h4>.cs-glink{top:-.1em}@media (max-width:1280px){.cs-gwrap{grid-template-columns:minmax(0,740px)}.cs-gtoc{display:none}}.cs-guide header{margin-bottom:8px}.cs-guide ol,.cs-guide ul{margin:0 0 14px;padding-left:22px}.cs-guide li{margin:0 0 8px}.cs-gmeta{font-size:14.5px;color:#6b6b75}.cs-gnote{background:#f4f4f6;border-radius:10px;padding:14px 16px;font-size:15.5px}.cs-body.doc{background:#fff}.cs-gsee{list-style:none;padding:12px 0 0!important;margin:16px 0 0!important;border-top:1px solid #e3e3e8;font-size:16px}.cs-gsee li{margin:0 0 4px!important}.cs-guide .cs-fxlab{letter-spacing:0;margin-top:14px}.cs-guide .cs-fxcode{letter-spacing:0;font-size:var(--doc-label);line-height:1.55;margin:0 0 16px}.cs-fxwhy{margin:8px 0 16px;font-size:16.5px;line-height:1.65;color:#151517}.cs-fxwhy .cs-golink{font-size:inherit;white-space:nowrap}.cs-p3row{display:flex;flex-wrap:wrap;gap:12px}.cs-p3col{flex:1;display:flex;flex-direction:column;gap:6px;font-size:var(--t-sm);color:#55555f}.cs-p3col>b{font-weight:500;color:#151517}.cs-p3col{gap:10px}.cs-p3line{display:flex;align-items:center;gap:10px}.cs-p3line>i{flex:none;width:36px;height:36px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.cs-p3line>span{display:flex;flex-direction:column;gap:2px;min-width:0}.cs-p3line code{font-family:\'JetBrains Mono\',monospace;font-size:12.5px;color:#3a3a42;letter-spacing:0;overflow-wrap:anywhere}.cs-p3sw{flex:1 1 140px;min-width:0;display:flex;flex-direction:column;gap:6px;font-size:var(--t-sm);color:#55555f}.cs-p3sw i{display:flex;align-items:center;justify-content:center;height:84px;border-radius:10px}.cs-p3sw b{font-size:var(--doc-lead);font-weight:500;font-style:normal}.cs-ggrid.cs-p3grid{grid-template-columns:minmax(0,1fr);gap:14px}.cs-p3row{max-width:560px}.cs-p3sw .cs-gchip code{white-space:nowrap}.cs-p3 figcaption{margin:0 0 8px}.cs-grefs{columns:2;column-gap:32px}.cs-grefs li{break-inside:avoid}.cs-glog ul{margin:0 0 8px}.cs-glog li{margin:0 0 4px}.cs-glogv{margin:28px 0 6px!important}.cs-glog .cs-glogv:first-child{margin-top:0!important}.cs-glogv{display:flex;align-items:baseline;gap:10px}.cs-glogv b{font-weight:500;font-size:var(--doc-h4);line-height:1.3;letter-spacing:-0.015em;color:#151517}.cs-glogv>span{color:#6b6b75;font-size:var(--doc-small)}.cs-doc .cs-glog .cs-glogsub{margin:16px 0 4px!important;font-size:var(--doc-body);font-weight:500;letter-spacing:-0.01em;color:#151517}.cs-doc .cs-glog .cs-glogv{margin-bottom:2px!important}.cs-gnum{font-variant-numeric:tabular-nums}.cs-gmuted{color:#6b6b75;font-size:.85em}.cs-ggrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px 16px;margin:8px 0 18px}.cs-gtile{margin:0}.cs-gacc{flex-direction:column;gap:10px}.cs-gsides td{text-align:center;padding:10px 6px!important}.cs-gsides th{text-align:center!important;padding:6px!important}.cs-gsides td:first-child,.cs-gsides th:first-child{text-align:left!important;padding-left:0!important;white-space:nowrap}.cs-gside{display:flex;width:56px;height:40px;margin:0 auto 6px;border-radius:6px;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);font-size:22px;font-weight:500;line-height:1}.cs-gsidelab{display:block;font-size:13.5px;color:#4a4a52}.cs-gsides td.alt{background:#f4f4f6}.cs-gacc b{font-size:30px;font-weight:500;line-height:1}.cs-gacc span{font-size:var(--t-sm);font-weight:500;padding:6px 14px;letter-spacing:0}.cs-gtblk{height:132px;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}.cs-gtblk div{width:62%;height:58%;border-radius:7px}.cs-gtile figcaption{display:flex;flex-direction:column;gap:3px;margin-top:8px;font-size:14px;letter-spacing:-0.01em}.cs-gtile figcaption b{font-weight:500}.cs-gtile{min-width:0}.cs-gtile figcaption span{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;color:#55555f}.cs-gex{display:flex;flex-direction:column;gap:6px;margin:4px 0 16px;font-size:14.5px}.cs-gpair{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.cs-gblk{display:inline-flex;align-items:center;justify-content:center;width:44px;height:28px;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}.cs-gblk span{width:26px;height:16px;border-radius:3px}.cs-gchip{display:inline-flex;align-items:center;gap:4px}.cs-gchip i{width:12px;height:12px;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}.cs-gchip code{font-family:\'JetBrains Mono\',monospace;font-size:13px;background:#e9e9ee;border-radius:4px;padding:1px 5px}.cs-spec-doc{max-width:1100px}.cs-spechead{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:24px;align-items:start;margin-bottom:18px}.cs-spechead h2{margin:0 0 6px;font-size:24px;font-weight:500;color:#151517}.cs-spechead p{margin:0;font-size:14px;line-height:1.5;color:#3a3a42}.cs-spechead dl{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:0;font-size:13px}.cs-spechead dt{color:#6b6b75}.cs-spechead dd{margin:0;color:#151517}.cs-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 22px}.cs-facts div{background:#fff;border-radius:10px;box-shadow:0 0 0 1px rgba(0,0,0,.06);padding:12px 14px}.cs-facts b{display:block;font-size:16px;font-weight:500;color:#151517}.cs-facts b a{font-size:16px;font-weight:500}.cs-facts span{display:block;font-size:12px;color:#6b6b75;margin-top:2px;line-height:1.4}.cs-spectab td{vertical-align:top}.cs-spectab td:first-child{white-space:nowrap}.cs-specnote{display:block;font-size:12px;color:#8a5a00;margin-top:3px}.cs-sp{display:inline-block;font-size:11px;font-weight:500;letter-spacing:.02em;border-radius:20px;padding:1px 8px;white-space:nowrap}.cs-sp.dec{background:#e3f6ec;color:#0b6b3f}.cs-sp.prop{background:#fff4d6;color:#8a5a00}.cs-speclist{margin:6px 0 18px;padding-left:18px;font-size:14px;line-height:1.5;color:#151517}.cs-speclist li{margin:4px 0}.cs-speclist span{color:#6b6b75}.cs-speclog{margin-top:8px;font-size:13px}.cs-speclog summary{cursor:pointer;font-weight:500;font-size:var(--doc-small);color:#151517;margin-bottom:8px}.cs-speclog dl{display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0}.cs-speclog dt{font-weight:500}.cs-speclog dd{margin:0;line-height:1.5;color:#3a3a42}@container (max-width:760px){.cs-spechead{grid-template-columns:minmax(0,1fr)}}.cs-toklegend{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:var(--t-sm);color:#55555f;margin:6px 0 4px}.cs-toklegend i{width:10px;height:10px;border-radius:50%;flex:none}.cs-toklegend i.picked{background:#c9c9d1}.cs-toklegend i.generated{background:#8b77e0;margin-left:10px}.cs-targets td{vertical-align:top}.cs-tlive{display:flex;align-items:center;gap:8px;min-height:28px}.cs-tlive+.cs-tlive{margin-top:4px}.cs-ttag{font-size:11.5px;color:#6b6b75;width:30px;flex:none}.cs-tfell{font-size:12px;color:#8a5a00;margin:2px 0 0 38px}.cs-tfell.muted{color:#6b6b75}.cs-tcomp{white-space:nowrap}.cs-thsub{display:block;font-weight:400;font-size:11.5px;color:#6b6b75;margin-top:1px}.cs-gentxt a.cs-sidecomp,.cs-gentxt a.cs-sidecomp:hover{color:#fff;text-decoration:none;text-decoration-line:underline;text-decoration-color:transparent;text-decoration-thickness:1px;text-underline-offset:3px;transition:text-decoration-color .12s ease-out}.cs-gentxt a.cs-sidecomp:hover{text-decoration-color:rgba(255,255,255,.7)}.cs-gentxt a.cs-sidecomp:focus-visible{outline:2px solid #fff;outline-offset:2px;border-radius:2px}a.cs-golink:hover{color:#004ced}a.cs-sidetok:hover{color:#cfc4ff}.cs-badge.close{background:#fff4d6;color:#8a5a00}.cs-badge.sm{font-size:var(--t-xs);padding:0 6px}'
    + '.cs-status{font-size:10px;font-weight:500;letter-spacing:.04em;border-radius:4px;padding:2px 6px;white-space:nowrap;text-transform:uppercase}.cs-status.decided{background:#e3f6ec;color:#0b6b3f}.cs-status.wip{background:#fff4d6;color:#8a5a00}.cs-status.eng{background:#e6eeff;color:#1d4fc4}'
    + '.cs-h{font-size:14px;font-weight:500;margin:20px 0 6px}.cs-gaps{margin:0;padding-left:18px;color:#3a3a42}'
    + '.cs-mini{display:grid;grid-template-columns:1.7fr 1fr;gap:10px;padding:14px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);font-family:var(--bf);text-align:left;min-height:150px}.cs-mhero{display:flex;flex-direction:column;gap:6px;min-width:0}.cs-mh1{overflow-wrap:anywhere;font-family:var(--hf);font-weight:var(--hw);text-transform:var(--ht);font-size:17px;line-height:1.05}.cs-mlead{font-size:9.5px;line-height:1.4}.cs-mlink{text-decoration:underline 1px;text-underline-offset:2px}.cs-mlist{margin:0;padding-left:12px;font-size:9px;line-height:1.45}.cs-mbtns{display:flex;gap:5px;margin-top:auto;flex-wrap:wrap}.cs-mbtn{display:inline-flex;align-items:center;justify-content:center;font-size:8.5px;font-weight:600;padding:4px 7px;border:1px solid;white-space:nowrap}.cs-mbtn.full{width:100%;margin-top:auto}.cs-mcard{display:flex;flex-direction:column;gap:6px;padding:10px;min-width:0}.cs-mh3{overflow-wrap:anywhere;font-family:var(--hf);font-weight:var(--hw);text-transform:var(--ht);font-size:12px;line-height:1.1}.cs-theme{max-width:1200px;margin:0 0 30px;padding:26px 28px;background:#fff;border-radius:14px;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 6px 24px rgba(0,0,0,.04)}.cs-theme-head{margin:0 0 20px;padding:0 0 18px;border-bottom:1px solid #eeeef2}.cs-theme-seg{margin:0 0 6px;font-size:13px;letter-spacing:.01em;color:#6b6b75}.cs-theme h2{margin:0 0 8px;font-size:44px;line-height:1.02;color:#151517}.cs-theme-mood{margin:0;font-size:18px;line-height:1.5;color:#3a3a42;max-width:60ch}.cs-theme-body{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:28px;align-items:start}.cs-theme dl{display:grid;grid-template-columns:120px minmax(0,1fr);gap:10px 18px;margin:0;font-size:14.5px;line-height:1.55;container-type:inline-size}.cs-theme dt{color:#6b6b75}.cs-theme dd{margin:0;color:#151517;text-wrap:pretty}.cs-theme dd b{font-weight:500}.cs-theme-sample{border-radius:12px;padding:24px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}.cs-theme-sample div{font-size:32px;line-height:1.08;margin:0 0 10px}.cs-theme-sample p{margin:0 0 16px;font-size:15px;line-height:1.5}.cs-theme-sample span{display:inline-block;padding:11px 20px;font-size:14px;font-weight:600}.cs-theme-roles{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:8px;font-size:14px}.cs-theme-roles li{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.cs-theme-roles i{width:22px;height:22px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);flex:none}.cs-theme-roles span{color:#55555f}.cs-theme-roles b{font-weight:500;color:#151517}.cs-theme-was{font-size:12.5px;color:#6b6b75}@media (max-width:1024px){.cs-theme dl{grid-template-columns:minmax(0,1fr);gap:2px 0}.cs-theme dd{margin-bottom:10px}}.cs-msec{margin:0 0 4px;font-size:20px;font-weight:500;letter-spacing:-0.015em;color:#151517}.cs-msub{margin:0 0 14px}.cs-mh span{display:block;margin-top:2px;font-size:12.5px;font-weight:400;letter-spacing:0;text-transform:none;color:#6b6b75}.cs-mrole{font-weight:400;color:#6b6b75;font-size:13.5px}.cs-matrix{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 12px;max-width:1200px}.cs-mh{font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#6b6b75}.cs-mrow{grid-column:1/-1;display:flex;align-items:center;gap:8px;margin-top:16px;font-size:15px;font-weight:600;color:#1a1a1a}.cs-mrow i{width:16px;height:16px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}.cs-mrow code{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:11.5px;font-weight:500;background:#e6e6eb;color:#3a3a42;padding:1px 6px;border-radius:4px}.cs-mh.side{display:flex;flex-direction:column;justify-content:center;gap:2px}'
    + '.cs-cell{border:0;padding:0;background:transparent;text-align:left;cursor:pointer;font:inherit;border-radius:10px;outline:2px solid transparent;outline-offset:2px}'
    // narrow cells (Oct 25): the card moves under the block's content and runs full width, instead of a squeezed side column
    + '.cs-cell{container-type:inline-size;min-width:0}@container (max-width:260px){.cs-mini{grid-template-columns:minmax(0,1fr)}}.cs-cell:hover{outline-color:#b4b4bc}.cs-cell.cur{outline-color:#151517}.cs-cellfoot{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 2px 0;font-size:11px}.cs-warn{color:#8a5a00;font-weight:500}'
    + '.cs-defs{margin-top:16px;display:flex;flex-direction:column;gap:6px;color:#3a3a42}.cs-defs p{margin:0}.cs-site{container-type:inline-size;border-radius:14px;padding:8px clamp(20px,5cqi,56px) 48px;box-shadow:0 0 0 1px rgba(0,0,0,.08);font-family:var(--bf)}.cs-sec2{padding-top:32px}.cs-mtile{display:flex;flex-direction:column;gap:10px;min-width:0}.cs-more{display:flex;flex-direction:column;gap:14px}.cs-mcap{font-family:"Euclid Circular",sans-serif;font-size:11px;letter-spacing:.02em;margin-top:22px}.cs-more>.cs-mcap:first-child{margin-top:0}.cs-mnav{display:flex;flex-direction:column;gap:14px;font-size:15px;margin-bottom:8px}.cs-site .cs-h1,.cs-site .cs-h3,.cs-site .cs-mh,.cs-site .cs-mh2,.cs-site .cs-faq summary span,.cs-comppv [style*="--hf"],.cs-mtile .cs-mh{text-wrap:balance}.cs-site .cs-lead,.cs-site .cs-p,.cs-site .cs-plead,.cs-site .cs-msmall,.cs-site .cs-pcardb>span,.cs-site blockquote,.cs-site .cs-faq p,.cs-site .cs-help{text-wrap:pretty}.cs-site .cs-pcardb>.cs-mh{text-wrap:balance}.cs-phead,.cs-psec,.cs-pfoot{width:100%;max-width:1120px;margin-left:auto;margin-right:auto;box-sizing:border-box}.cs-psteps{display:flex;flex-direction:column;gap:8px;max-width:640px}.cs-psteps ol li::marker{font-weight:700}.cs-phd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}.cs-phdt{display:flex;flex-direction:column;gap:10px;max-width:640px}.cs-plead{font-size:17px;line-height:1.55}.cs-peyebrow{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.cs-pcta{margin-top:auto;padding-top:14px;align-self:stretch;display:flex}.cs-pcta .cs-btn{width:100%;text-align:center}.cs-pcard .cs-pcardb{height:100%;box-sizing:border-box}.cs-pprice{font-size:30px;line-height:1.1;margin-top:6px}.cs-ptrack{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 48px) / 3);gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.cs-ptrack::-webkit-scrollbar{display:none}.cs-ptrack>*{scroll-snap-align:start}.cs-prevc{margin:0}.cs-prevc blockquote{margin:0;font-size:16px;line-height:1.55}.cs-prevc figcaption{font-size:14px;margin-top:auto;padding-top:6px}.cs-pstars{display:flex;gap:2px}.cs-parrows{display:flex;gap:10px;flex:none}.cs-pdots{display:flex;gap:8px;justify-content:center}.cs-pdot{width:10px;height:10px;padding:0;border-radius:50%;border:0;background:var(--doff);cursor:pointer;outline:none;transition:background-color .12s}.cs-pdot:not(.on):hover{background:var(--dh)}.cs-pdot.on{background:var(--don)}.cs-pdot:focus-visible{box-shadow:0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}.cs-pfaq .cs-phd{padding:0 14px}.cs-faqs{border-top:1px solid;max-width:760px}.cs-faq{border-bottom:1px solid}.cs-faq summary{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 14px;margin:0;font-size:20px;line-height:1.25;cursor:pointer;list-style:none;outline:none;border-radius:0;transition:color .12s,background-color .12s}.cs-faq summary::-webkit-details-marker{display:none}.cs-faq summary:hover{color:var(--lh)!important;background:var(--hb)}.cs-faq summary:active{color:var(--lp)!important;background:var(--hb)}.cs-faq summary:focus-visible{box-shadow:0 0 0 2px var(--ring)}.cs-faq summary svg{flex:none;transition:transform .15s}.cs-faq[open] summary svg{transform:rotate(180deg)}.cs-faq p{margin:0;padding:0 14px 20px;font-size:16px;line-height:1.6;max-width:640px}.cs-plbl{display:inline-flex;gap:10px;align-items:center;font-size:15px;cursor:pointer}.cs-pchecks{display:flex;flex-wrap:wrap;gap:12px 28px}.cs-pfs{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:12px 28px}.cs-pfs legend{padding:0;margin-bottom:10px;font-size:15px;font-weight:400;width:100%}.cs-rdo{appearance:none;-webkit-appearance:none;margin:0;flex:none;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--fb);background:transparent;cursor:pointer;outline:none;transition:border-color .12s,box-shadow .12s}.cs-rdo:hover{border-color:var(--fh);box-shadow:inset 0 0 0 1px var(--fh)}.cs-rdo:checked{border-color:var(--sf);background:radial-gradient(circle,var(--sf) 0 4.5px,transparent 5px)}.cs-rdo:checked:hover{border-color:var(--sh);background:radial-gradient(circle,var(--sh) 0 4.5px,transparent 5px);box-shadow:none}.cs-rdo:focus-visible{box-shadow:0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}@media (prefers-reduced-motion:reduce){.cs-ptrack{scroll-behavior:auto}.cs-faq summary svg{transition:none}}@container (max-width:860px){.cs-ptrack{grid-auto-columns:85%}.cs-phd{flex-direction:column;align-items:flex-start}}.cs-phead{display:flex;align-items:center;gap:28px;padding:24px 0;border-bottom:1px solid}.cs-plogo{font-size:22px;line-height:1}.cs-pnav{display:flex;gap:22px;margin-left:auto;font-size:15px}.cs-phead .cs-btn{padding:9px 18px}.cs-psec{padding-top:96px;display:flex;flex-direction:column;gap:28px}.cs-phero{padding-top:56px}.cs-pcards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.cs-pcard{overflow:hidden;display:flex;flex-direction:column;font-size:15px;line-height:1.5}.cs-pimg{aspect-ratio:16/9;display:flex;align-items:center;justify-content:center}.cs-pimg svg{width:34%;height:auto}.cs-pcardb{padding:28px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}.cs-pmeta{display:flex;gap:8px;align-items:center;margin-bottom:4px}.cs-pkick{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.cs-pbadge{font-size:11px;font-weight:700;padding:3px 9px}.cs-ul.cs-pfeat{display:flex;flex-direction:row;flex-wrap:wrap;gap:12px 32px;margin:8px 0 0;padding:0;list-style:none}.cs-pfeat li{display:flex;align-items:center;gap:10px}.cs-pwarn{max-width:520px}.cs-pprog{display:flex;flex-direction:column;gap:6px}.cs-pchecks{display:grid;gap:12px}.cs-pdone{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.cs-pfoot{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:112px;padding-top:28px;border-top:1px solid}@container (max-width:860px){.cs-pcards{grid-template-columns:minmax(0,1fr)}.cs-pnav{display:none}.cs-pdone{grid-template-columns:minmax(0,1fr)}}.cs-mgroup{display:flex;flex-direction:column;gap:14px}.cs-mpair{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:40px 64px;align-items:start}.cs-mcol{display:flex;flex-direction:column;gap:20px;min-width:0}.cs-mcol>.cs-btn{align-self:stretch}.cs-back{display:inline-flex;align-items:center;gap:4px;transition:color .12s ease-out}.cs-back:has(a:hover){color:var(--lh)!important}.cs-cal{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px 24px;font-size:14px}.cs-pick{font:inherit;font-family:var(--bf);font-weight:700;background:transparent;color:var(--c);border:1.5px solid var(--c);border-radius:var(--br);cursor:pointer;outline:none;transition:background-color .12s,color .12s,border-color .12s}.cs-pick:hover{background:var(--wh)}.cs-pick:active{background:var(--wp)}.cs-pick.on,.cs-pick.on:hover,.cs-pick.on:active{background:var(--wp);box-shadow:inset 0 0 0 .5px var(--c)}.cs-pick:focus-visible{box-shadow:0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}.cs-pick.on:focus-visible{box-shadow:inset 0 0 0 .5px var(--c),0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}.cs-pick:disabled{background:transparent;border-color:var(--cd);color:var(--cd);cursor:not-allowed}.cs-ibtn{width:40px;height:40px;padding:0;display:inline-flex;align-items:center;justify-content:center}.cs-day{height:40px;padding:0;font-size:14px}.cs-day.off{font-weight:400}.cs-day.off{display:flex;align-items:center;justify-content:center;border:1px solid transparent}.cs-slot{padding:10px;font-size:14px;width:100%}.cs-selwrap{position:relative;display:block}.cs-sel{appearance:none;-webkit-appearance:none;padding-right:40px;cursor:pointer}.cs-mselwrap{position:relative;display:block}.cs-input.live.cs-sel:invalid{color:var(--ph)}.cs-sel option{color:#151517}.cs-mselchev{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:flex;pointer-events:none}.cs-ta{resize:vertical;min-height:84px;line-height:1.5;display:block}.cs-input.live{color:var(--tx);border-radius:var(--r)}.cs-input.live::placeholder{color:var(--ph)}.cs-cdesc{display:flex;gap:10px;align-items:flex-start;font-size:15px;cursor:pointer}.cs-cdesc>span{display:flex;flex-direction:column;gap:2px}.cs-cbx{appearance:none;-webkit-appearance:none;margin:1px 0 0;flex:none;width:20px;height:20px;border:1.5px solid var(--fb);border-radius:min(var(--r),4px);background:transparent center/14px no-repeat;cursor:pointer;outline:none;box-shadow:inset 0 0 0 0 var(--fb),0 0 0 0 var(--bgc),0 0 0 0 var(--ring);transition:border-color .12s ease-out,background-color .12s ease-out,box-shadow .12s ease-out}.cs-cbx:hover{border-color:var(--fh);box-shadow:inset 0 0 0 1px var(--fh),0 0 0 0 var(--bgc),0 0 0 0 var(--ring)}.cs-cbx:active:not(:checked),.cs-rdo:active:not(:checked){border-color:var(--sp);box-shadow:inset 0 0 0 1px var(--sp)}.cs-cbx:checked{background-color:var(--sf);background-image:var(--mk);border-color:var(--sf);box-shadow:none}.cs-cbx:checked:hover{background-color:var(--sh);border-color:var(--sh)}.cs-cbx:focus-visible{box-shadow:inset 0 0 0 0 var(--fb),0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}.cs-banner{display:block;padding:12px 16px;font-size:15px;border-radius:var(--r)}.cs-qty{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--fb);border-radius:var(--r);padding:3px;font-size:15px;color:var(--tx)}.cs-qty b{min-width:22px;text-align:center}.cs-qbtn{font:inherit;font-size:17px;line-height:1;width:30px;height:30px;border:0;border-radius:max(0px,calc(var(--r) - 3px));background:transparent;color:var(--tx);cursor:pointer;outline:none;transition:color .12s ease-out,box-shadow .12s ease-out}.cs-qbtn:hover{color:var(--fh)}.cs-qbtn:focus-visible{box-shadow:0 0 0 2px var(--ring)}.cs-qbtn:disabled{color:var(--di);cursor:not-allowed}@media (prefers-reduced-motion:reduce){.cs-pick,.cs-cbx,.cs-qbtn,.cs-back{transition:none}}@container (max-width:860px){.cs-mpair{grid-template-columns:minmax(0,1fr)}.cs-cal{grid-template-columns:minmax(0,1fr)}}.cs-mwide{grid-column:1/-1}.cs-crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:14px}.cs-crumbsep{opacity:1}.cs-mcard{padding:24px;display:flex;flex-direction:column;gap:14px;font-size:14px;line-height:1.5}.cs-mcard hr{border:0;border-top:1px solid;margin:2px 0;width:100%}.cs-mrow2{display:flex;justify-content:space-between;gap:12px}.cs-mgap{display:flex;flex-direction:column;gap:4px}.cs-mh{font-size:19px;line-height:1.2}.cs-mh2{font-size:24px;line-height:1.15}.cs-mtotal{font-size:24px}.cs-msmall{font-size:12.5px;line-height:1.5;margin:0}.cs-meyebrow{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:-8px}.cs-lv{display:flex;flex-direction:column;gap:1px}.cs-lv span:first-child{font-size:12.5px}.cs-calhead{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;align-items:center;justify-items:center;margin-bottom:10px}.cs-calhead>b{grid-column:2/7}.cs-calgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center}.cs-wd{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 0}.cs-calside{display:flex;flex-direction:column;gap:10px;align-items:stretch;text-align:center}.cs-calfoot{grid-column:1/-1;display:flex;flex-direction:column;gap:8px;align-items:stretch;text-align:center}.cs-calfoot .cs-btn{width:100%}.cs-details{display:flex;flex-direction:column;gap:12px}.cs-dgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.cs-details .cs-btn{width:100%}.cs-mradio{display:flex;align-items:center;gap:12px}.cs-mbtns{margin-top:8px}.cs-mdone{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:28px 8px}.cs-sectitle{font-family:"Euclid Circular",sans-serif;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid;padding-bottom:8px;margin-bottom:24px}.cs-hero{display:flex;flex-direction:column;gap:20px;min-width:0}.cs-h1{display:block;font-family:var(--hf);font-weight:var(--hw,600);font-size:clamp(32px,5.4cqi,52px);line-height:1.08;text-transform:var(--ht,none)}.cs-lead{font-family:var(--bf);font-size:17px;line-height:1.55}.cs-list{margin:0;padding-left:20px;font-family:var(--bf);font-size:16px;line-height:1.6}.cs-list li::marker{font-size:1em}.cs-ul.big{font-size:16px;gap:8px}.cs-ul.big .cs-dot{width:5px;height:5px}.cs-crumb{font-family:var(--bf);font-size:13px}.cs-site .cs-btn{font-size:15px;padding:12px 22px}.cs-site .cs-chip{font-size:12px}.cs-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}.cs-card.big{padding:32px;gap:12px;margin:0;height:100%;box-sizing:border-box}.cs-card.big .cs-h3{font-size:28px;line-height:1.1}.cs-card.big .cs-p{font-size:16px;line-height:1.55}.cs-btn.live,.cs-btn.live2{font-family:var(--bf);cursor:pointer;outline:none;transition:background-color .12s,color .12s}.cs-btn.live{background:var(--b);color:var(--fg);border:1.5px solid var(--b)}.cs-btn.live:hover{background:var(--bh);border-color:var(--bh);color:var(--fgh)}.cs-btn.live:active{background:var(--bp);border-color:var(--bp);color:var(--fgp)}.cs-btn.live2{background:transparent;color:var(--c);border:1.5px solid var(--c)}.cs-btn.live2:hover{background:var(--bh)}.cs-btn.live2:active{background:var(--bp)}.cs-btn.live:focus-visible,.cs-btn.live2:focus-visible{box-shadow:0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}.cs-live-link{color:var(--l);text-decoration:none;background:linear-gradient(currentColor,currentColor) left bottom/100% 1px no-repeat;padding-bottom:1px;-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:3px;transition:background-size .12s ease-out,color .12s ease-out,outline-color .12s ease-out}.cs-input.live{width:100%;font-family:var(--bf);background:transparent;border:1px solid var(--fb);outline:none;margin:0;box-shadow:inset 0 0 0 var(--fw) var(--fb),0 0 0 0 var(--bgc),0 0 0 0 var(--ring);transition:border-color .12s ease-out,box-shadow .12s ease-out}.cs-input.live::placeholder{color:var(--ph);opacity:1}.cs-input.live:hover{border-color:var(--fh);box-shadow:inset 0 0 0 1px var(--fh),0 0 0 0 var(--bgc),0 0 0 0 var(--ring)}.cs-input.live:focus{border-color:var(--fa);box-shadow:inset 0 0 0 1px var(--fa),0 0 0 2px var(--bgc),0 0 0 4px var(--ring)}@media (prefers-reduced-motion:reduce){.cs-live-link,.cs-input.live,.cs-btn.live,.cs-btn.live2{transition:none}}.cs-live-link.nav{background-size:100% 0}.cs-live-link.cur{background-size:100% 2px}.cs-live-link:hover,.cs-live-link:visited:hover{color:var(--lh);background-size:100% 2px}.cs-live-link:visited,.cs-live-link:focus{color:var(--l)}.cs-live-link:active,.cs-live-link:hover:active{color:var(--lp);background-size:100% 2px}.cs-live-link{outline:2px solid transparent;outline-offset:3px}.cs-live-link:focus-visible{outline-color:var(--ring)}.cs-hero .cs-btns{gap:12px}.cs-cardbtn{margin-top:auto;padding-top:16px}.cs-cardbtn .cs-t{display:block}.cs-cardbtn .cs-btn{display:block;width:100%;text-align:center}.cs-states{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:20px}.cs-state{display:flex;flex-direction:column;align-items:flex-start;gap:8px}.cs-cap{font-family:"Euclid Circular",sans-serif;font-size:11px;letter-spacing:.02em}.cs-form{display:flex;flex-direction:column;gap:18px;max-width:440px}.cs-field{display:flex;flex-direction:column;gap:6px}.cs-field.dis{cursor:not-allowed}.cs-flabel{font-family:var(--bf);font-size:15px;font-weight:400}.cs-input{display:block;border:1px solid;padding:11.5px 12.5px;font-family:var(--bf);font-size:15px;background:transparent}.cs-help{display:block;font-family:var(--bf);font-size:13px;line-height:1.4}.cs-checks{display:flex;flex-wrap:wrap;gap:12px 24px}.cs-checks .cs-t{display:inline-flex;align-items:center;gap:8px;font-family:var(--bf);font-size:15px}.cs-check{width:20px;height:20px;border:1.5px solid;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;box-sizing:border-box}.cs-radio{width:20px;height:20px;border:1.5px solid;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box}.cs-radio span{width:10px;height:10px;border-radius:50%}.cs-progress{display:flex;flex-direction:column;gap:6px}.cs-track{display:block;height:6px;border-radius:3px;overflow:hidden}.cs-track span{display:block;height:100%;width:66%}.cs-msgs{display:flex;flex-direction:column;gap:8px}.cs-msg{display:block;border-left:3px solid;padding:6px 12px;font-family:var(--bf);font-size:14px;font-weight:600}.cs-msg.th{display:flex;align-items:flex-start;gap:8px;border-left:0;padding:10px 12px;line-height:20px}.cs-msg.th .cs-sticon{margin-top:1px}.cs-sticon{flex:none;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cs-help .cs-sticon{width:14px;height:14px;vertical-align:top;margin:calc((1.4em - 14px) / 2) 5px 0 0}.cs-t{display:inline-block;max-width:100%}.cs-t{position:relative}.cs-card{position:relative}.cs-site.derived .drv::before{content:\"from \" attr(data-from);position:absolute;top:0;right:0;transform:translate(12%,-60%);z-index:3;background:#6e56cf;color:#fff;font:600 10px/1 \"Euclid Circular\",sans-serif;letter-spacing:.02em;padding:4px 7px;border-radius:999px;border:2px solid #fff;white-space:nowrap;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.2)}.cs-legend{display:flex;align-items:center;gap:6px;font-size:13px;color:#6b6b75;margin-top:2px}.cs-legend-mark{width:16px;height:16px;border-radius:50%;display:inline-block;background-position:center;background-repeat:no-repeat;background-size:10px 10px}.cs-legend-mark.done{background-color:#16a34a;background-image:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4.25 13.5L8.75 18L19.75 6%27/%3E%3C/svg%3E\")}.cs-legend-mark.prov{background-color:#e5484d;margin-left:0 !important;background-image:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M19 5L5 19M5 5l14 14%27/%3E%3C/svg%3E\");margin-left:12px}.cs-split{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(240px,1fr);gap:40px;align-items:stretch}.cs-eyebrow{display:flex;align-items:center;gap:10px}.cs-hr{border:0;height:1px;margin:4px 0;width:100%}.cs-ul.icons li{gap:10px}.cs-na{color:#b4b4bc;font-size:13px}.cs-grid{display:grid;grid-template-columns:130px repeat(6,minmax(0,1fr));gap:14px 16px;align-items:center}.cs-formgrid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:24px 48px;align-items:start;margin-top:28px}.cs-fstates{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.cs-fstates .cs-state{align-items:stretch}.cs-fstates .cs-input{font-size:13px;padding:9.5px 10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cs-checks{display:grid;grid-template-columns:1fr;gap:12px}.cs-progress{margin-top:24px}.cs-msgs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:28px}.cs-scope{margin-bottom:14px;max-width:320px}.cs-lowh{margin:28px 0 4px;font-size:13px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#6b6b75}.cs-lowh+p.muted{margin:0 0 12px}.cs-dropbox{display:flex;gap:12px;align-items:flex-start;background:#fff4d6;color:#8a5a00;padding:16px 18px;border-radius:10px;margin-bottom:10px}.cs-dropbox svg{flex:none;width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cs-dropbox b{display:block;font-size:15px;font-weight:500;line-height:22px}.cs-dropbox span{display:block;margin-top:2px}.cs-dropbox+table{margin-bottom:20px}.cs-allgood{display:flex;gap:12px;align-items:flex-start;background:#e3f6ec;color:#0b6b3f;padding:16px 18px;border-radius:10px}.cs-allgood svg{flex:none;width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cs-allgood b{display:block;font-size:15px;font-weight:500;line-height:22px}.cs-allgood span{display:block;margin-top:2px;color:#2f6b4c}';

  // the Guide and Formulas as documentation (Oct 24): one type scale, a modular scale with ratio 1.2 (minor third) from a
  // 17px base, rounded: 14 (details), 17 (body), 20 (lead, H3), 24.5 (H2), 35 (H1); spacing from the text (1em between
  // paragraphs, 72px above a section, 44px above a subsection) and a 680px measure, about 70 characters a line

  // ---- the design system for the System view's own interface (Oct 25). Lisa's site, the mini pages and the
  // component previews keep their own type and spacing. Type: six sizes, 12 (code chips, counts, badges only), 14
  // (tables, labels, hints), 16 (text), 20 (section headings, leads), 28 (page titles), 40 (the theme name, the reading
  // tabs' title). Text: three grays that all reach 4.5:1 on the canvas (#151517, #4a4a52, #6b6b75). Space: 4, 8, 12, 16,
  // 24, 32, 48. Windows: phone up to 640px, tablet up to 1024px, laptop up to 1280px
  // the interface's design system (Oct 25), appended last so it wins: one type scale for every tab, Guide and Formulas
  // included (ratio 1.125 from a 17px body: 13.5, 15, 17, 19, 21.5, 24, 30.5), three text grays that all read at
  // 4.5:1, one page head and one section head, one white canvas. 13.5px is only for code, tokens, badges, and counts
  // the docs eat their own dog food (Nov 3, Alberto): one modular type scale, 16px × 1.125, steps −1 to 7 in rem; body text
  // on step 1 (18px), quieter text (contents, tables, legends, captions) on step 0 (16px), labels and code on −1; and one
  // space scale in multiples of the body size (3xs 4.5px to 2xl 72px). Rules name roles (--doc-label, -small, -body, -lead,
  // -h4, -h3, -h2, -h1), never a step; the old t-* names point at the roles
  const UI_CSS = '.cs{font-size:var(--t-sm);line-height:1.5}'
    // pages: one canvas, the same padding, the same head
    + '.cs-body,.cs-body.doc{background:#fff;padding:40px 48px 40px}@media (max-width:1024px){.cs-body,.cs-body.doc{padding:32px 24px 32px}}@media (max-width:640px){.cs-body,.cs-body.doc{padding:24px 16px 24px}}'
    + '.cs-pagehead,.cs-doc>header,.cs-fxhead{margin:0 0 40px;max-width:760px}.cs-kick{margin:0 0 8px;font-size:var(--t-sm);font-weight:500;color:var(--fg3)}'
    + ''
    + '.cs-doc .cs-fxhead p{font-size:var(--t-md)}'
    // anchors: every jump target lands below the sticky tab bar (58px), with some air
    + '.cs-body [id]{scroll-margin-top:84px}'
    // sections: the same heading and intro in every tab
    + '.cs-shead{margin:64px 0 20px;max-width:760px}.cs-compgrp{margin:0 0 8px;font-size:var(--t-h2);line-height:1.25;font-weight:500;letter-spacing:-0.02em;color:var(--fg);text-transform:none}'
    + '.cs-shead p{margin:0;font-size:var(--t-md);line-height:1.55;color:var(--fg2);text-wrap:pretty}.cs-compgrp{margin:64px 0 20px}.cs-compgrp:first-of-type{margin-top:8px}'
    + ''
    // body text: 17px in every tab; secondary text 15px in the second gray
    + '.cs-doc{--s-1:var(--t-sm);--s0:var(--t-md);--s1:var(--t-h3);--s2:var(--t-h2);--s4:var(--t-h1)}'
    + '.cs-body p.muted{font-size:var(--t-sm);line-height:1.55;color:var(--fg3)}.muted{color:var(--fg3)}.tiny{font-size:var(--t-xs)}'
    // tables: 15px rows, generous padding, headers in the third gray
    + '.cs-table{font-size:var(--t-sm);line-height:1.5}.cs-table th{font-size:var(--t-sm);font-weight:500;color:var(--fg3);letter-spacing:0}.cs-table td,.cs-table th{padding:12px 14px}.cs-table tr.grp td{font-size:var(--t-sm);padding:12px 14px}'
    + '.cs-tscroll .cs-table,.cs-body>.cs-table{box-shadow:0 0 0 1px var(--line);border-radius:10px}'
    // the smallest size: code, tokens, counts, badges, and status pills only
    + '.cs-lchip,.cs-tok,.cs-genpill,.cs-badge,.cs-secindex span,.cs-kind,.cs-gencount,.cs-status,.cs-tok.big,.cs-cstcap{font-size:var(--t-xs);font-weight:500;letter-spacing:0;text-transform:none}'
    + '.cs-status{display:inline-block;padding:2px 8px;border-radius:999px;line-height:1.4}'
    // labels, hints, meta, legends, and links in tables: 15px
    + '.cs-hint,.cs-cellfoot,.cs-crw,.cs-crlegend,.cs-toklegend,.cs-why p,.cs-allstyles span,.cs-more summary,.cs-theme-was,.cs-secindex a,.cs-crblock,.cs-thsub,.cs-invbg .cs-bgalias,.cs-malias,.cs-crn{font-size:var(--t-sm)}'
    + '.cs-comp .cs-compspec,.cs-defs p{font-size:var(--t-md);line-height:1.55;color:var(--fg2)}'
    + '.cs-tactions{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px;margin:0 0 40px}.cs .cs-tactions .cs-tbtn{display:inline-block;background:#151517;color:#fff;font-size:var(--t-sm);font-weight:500;padding:8px 14px;border-radius:8px;text-decoration:none;transition:background-color .12s}.cs .cs-tactions .cs-tbtn:hover{background:#3a3a42}.cs .cs-tactions .cs-tbtn:focus-visible{outline:2px solid #1d4fd7;outline-offset:2px}.cs-tlink{font-size:var(--t-md)}.cs-suites td:first-child{white-space:nowrap}.cs-suites td:last-child{text-align:right;font-variant-numeric:tabular-nums}.cs-suites td{vertical-align:top}.cs-tscroll+.cs-shead{margin-top:40px}.cs-tcount{display:inline-block;vertical-align:middle;margin-left:8px;padding:1px 8px;border-radius:999px;background:#f0f0f3;color:#4a4a52;font-size:var(--t-xs);font-weight:500;letter-spacing:0;line-height:1.6}'
    + '.cs-tcmd{margin:0 0 12px;padding:16px 20px;border-radius:10px;background:#0a0a0a;color:#fafafa;font:13.5px/1.7 \"JetBrains Mono\",monospace;overflow-x:auto}.cs-tnote{margin:0;color:var(--fg2);font-size:var(--t-md);max-width:760px;text-wrap:pretty}'
    + '.cs-leg{display:flex;flex-wrap:wrap;align-items:center;gap:6px 20px;margin:0;font-size:var(--t-sm);line-height:1.5;color:var(--fg2);text-wrap:pretty}.cs-leg span{display:inline-flex;align-items:center;gap:8px}.cs-tgtabout{max-width:100%}'
    + '.cs-conflink{display:inline-flex;align-items:center;gap:6px;margin:16px 0 0;padding:4px 10px;border-radius:999px;background:#e9f0ff;color:#1d4fd7;font-size:var(--t-sm);font-weight:500;line-height:1.4;text-decoration:none;transition:background-color .12s}.cs-conflink::after{content:"\\2197";font-size:.9em}.cs-conflink:hover{background:#dbe6ff}.cs .cs-lead:has(+.cs-conflink),.cs .cs-glead:has(+.cs-conflink){margin-bottom:0}.cs .cs-conflink{margin:16px 0 0}.cs .cs-doc .cs-conflink{margin:16px 0 28px}.cs-conflink:focus-visible{outline:2px solid #1d4fd7;outline-offset:2px}.cs-body .cs-conflink,.cs-doc a.cs-conflink{font-size:var(--t-sm);line-height:1.5;letter-spacing:normal}.cs-doc a.cs-conflink[target=_blank]::after{content:"\\2197"}'
    + '.cs-body :where(b,strong):not(:where(.cs-site,.cs-comppv,.cs-tbig,.cs-cell,.cs-ggrid) *){font-weight:500}'
    // jump chips: an optional dot inside, a quiet count
    + '.cs-secindex{gap:8px;margin:0 0 24px}.cs-secindex a{gap:8px;padding:6px 8px 6px 14px;color:var(--fg)}.cs-secindex a i{width:10px;height:10px;border-radius:50%;flex:none}.cs-secindex a i.picked{background:#c9c9d1}.cs-secindex a i.generated{background:#8b77e0}'
    + '.cs-secindex span{background:#f0f0f3;color:var(--fg2);line-height:1.4;padding:1px 8px;border-radius:999px;font-variant-numeric:tabular-nums}'
    // legends: quiet lines right above the table they explain
    + '.cs-legends{display:flex;flex-direction:column;gap:8px;margin:0 0 48px;padding:10px 16px;border-radius:8px;background:#f7f7f9;width:fit-content;max-width:100%;box-sizing:border-box}.cs-legends .cs-toklegend,.cs-legends .cs-crlegend{font-size:var(--t-sm);line-height:1.4;letter-spacing:-0.01em}.cs-legends .cs-toklegend,.cs-legends .cs-crlegend{margin:0}.cs-legends p{margin:0}.cs-toklegend,.cs-crlegend{color:var(--fg2);gap:6px 20px}.cs-crlegend span{white-space:nowrap}.cs-crlegend b{font-weight:500}.cs-toklegend span{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}.cs-toklegend i.generated{margin-left:0}.cs-body>.cs-toklegend{margin:0 0 16px}'
    + '.cs-targets td:last-child,.cs-targets th:last-child{min-width:260px}.cs-onpair{white-space:nowrap;color:var(--fg3)}'
    // Failures: the theme switch and the result sit under the page head
    + '.cs-scope{margin:0 0 20px}.cs-allgood,.cs-dropbox{margin:0 0 8px}.cs .cs-allgood{background:#fff;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line);padding:16px 20px;border-radius:10px;align-items:center;gap:14px;width:fit-content;max-width:100%;box-sizing:border-box;margin:0 0 48px}.cs .cs-allgood svg{color:#1f8a4c;width:24px;height:24px}.cs .cs-allgood b{font-weight:500;color:var(--fg);line-height:1.4}.cs .cs-allgood span{color:var(--fg2);margin-top:2px}.cs-body .cs-scope .cs-seg{display:inline-flex;gap:2px;padding:3px;border-radius:8px;background:#f0f0f3;box-shadow:none;width:auto}.cs-body .cs-scope .cs-seg button{padding:6px 14px;border-radius:6px;background:transparent;color:var(--fg2);font-size:var(--t-sm);font-weight:500;box-shadow:none}.cs-body .cs-scope .cs-seg button[aria-checked=true]{background:#fff;color:var(--fg);box-shadow:0 1px 2px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04)}.cs-body .cs-scope .cs-seg button:focus-visible{outline:2px solid #1d4fd7;outline-offset:1px}.cs-body .cs-scope{max-width:none;margin:0 0 20px}.cs-body .cs-scope .cs-seg button{white-space:nowrap;flex:none;min-width:0}.cs .cs-allgood{width:auto;margin:0}.cs .cs-allgood>div{flex:1;min-width:0}.cs .cs-allgood .cs-scope{margin:0;flex:none}@media (max-width:640px){.cs .cs-allgood{flex-wrap:wrap}.cs .cs-allgood .cs-scope{flex-basis:100%}}.cs-legends:has(+.cs-tscroll),.cs-legends:has(+table),section>.cs-legends{margin-bottom:16px}.cs-spec{max-width:1200px}.cs-tlist{margin:0;display:grid;gap:20px;max-width:1200px}.cs-tsuite{border-radius:12px;border:1px solid var(--line);background:#fff;overflow:hidden}.cs-tsuite header{padding:18px 22px 16px;background:#f7f7f9;border-bottom:1px solid var(--line)}.cs-tsuite h3{display:flex;align-items:center;gap:8px;margin:0;font-size:var(--t-lg);font-weight:500;color:var(--fg)}.cs-tsuite header p{margin:6px 0 0;color:var(--fg2);font-size:var(--t-sm);line-height:1.5;max-width:860px;text-wrap:pretty}.cs-tcols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:40px;padding:6px 22px 8px}.cs-tsuite ul{list-style:none;margin:0;padding:0}.cs-tsuite li:last-child{border-bottom:0}@media (max-width:900px){.cs-tcols{grid-template-columns:minmax(0,1fr)}.cs-tcols ul:first-child li:last-child{border-bottom:1px solid #f0f0f3}}.cs-tsuite li{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0f0f3;font-size:var(--t-sm);line-height:1.5;color:var(--fg);text-wrap:pretty}.cs-tsuite li svg{flex:none;width:16px;height:16px;margin-top:2px;fill:none;stroke:#1f8a4c;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cs-testlist .cs-tnum{width:40px;color:var(--fg3);font-variant-numeric:tabular-nums;text-align:right;padding-right:4px}.cs-testlist td{vertical-align:top}.cs-testlist tr.grp td{padding-top:14px;padding-bottom:12px}.cs-inv thead th{vertical-align:top}.cs-grpdesc{display:block;margin-top:2px;font-weight:400;color:#4a4a52;text-wrap:pretty}.cs-tgname{display:flex;align-items:center;gap:8px;font-weight:500;color:var(--fg)}.cs-tgname .cs-tcount{margin-left:0}.cs-tgdesc{display:block;margin-top:4px;font-weight:400;color:var(--fg2);max-width:860px;text-wrap:pretty}.cs-tlistsec h3{margin:0 0 10px;font-size:var(--t-lg);font-weight:500;color:var(--fg)}.cs-tlistsec ol{margin:0;padding-left:24px;display:grid;gap:6px;font-size:var(--t-md);line-height:1.5;color:var(--fg2)}.cs-tlistsec li{text-wrap:pretty}.cs-tlistsec li::marker{color:var(--fg3);font-variant-numeric:tabular-nums}.cs .cs-tbig{border-radius:14px;box-shadow:0 0 0 1px rgba(0,0,0,.08)}.cs-allgood b,.cs-dropbox b{font-size:var(--t-md)}.cs-allgood span,.cs-dropbox span{font-size:var(--t-sm)}'
    // the Theme tab: no card, the page head, then what the theme is and a sample beside it
    + '.cs-theme{background:none;box-shadow:none;border-radius:0;padding:0;margin:0}.cs-theme .cs-pagehead h1{font-size:var(--t-h1)}'
    + '.cs-theme-body{gap:56px}.cs-theme dl{font-size:var(--t-md);line-height:1.55;gap:16px 24px;grid-template-columns:136px minmax(0,1fr)}.cs-theme dt{font-size:var(--t-sm);font-weight:500;color:var(--fg3);padding-top:2px}.cs-theme dd{margin:0;color:var(--fg)}'
    + '.cs-gstyles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:24px 0 8px}.cs-gstyles figure{margin:0;min-width:0;display:flex;flex-direction:column}.cs-gstyle{display:flex;flex-direction:column;align-items:flex-start;padding:28px 24px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);flex:1}.cs-gskick{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px}.cs-gshead{font-size:34px;line-height:1.05;overflow-wrap:anywhere}.cs-gsbody{display:block;margin:10px 0 0;font-size:15px;line-height:1.4;text-wrap:pretty}.cs-gsbtns{display:flex;flex-direction:column;align-self:stretch;gap:8px;margin:20px 0 0}.cs-gsbtns span{display:block;text-align:center;font-size:13px;font-weight:700;padding:8px 14px;border:1.5px solid;white-space:nowrap}.cs-gstyles figcaption{margin:0 0 10px;font-size:var(--t-sm);font-weight:500;color:#151517}.cs-gstyles+.cs-gmuted{margin-top:12px}@media (max-width:640px){.cs-gstyles{grid-template-columns:1fr}}'
    + '.cs-tbig{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,1fr);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);overflow:hidden;margin:0 0 8px}.cs-tvis{padding:64px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;min-width:0}.cs-tkick{margin:0 0 16px;font-size:var(--t-md);font-weight:700;letter-spacing:.08em;text-transform:uppercase}.cs-thead{font-size:104px;line-height:1.05;letter-spacing:-0.01em;overflow-wrap:anywhere}.cs-tvis .cs-tbody{margin:20px 0 0;font-size:30px;line-height:1.35;max-width:24ch;text-wrap:pretty}.cs-tdots{display:flex;margin:16px 0 0}.cs-tdots button{width:40px;height:40px;border-radius:50%;margin-right:-10px;border:0;padding:0;cursor:pointer}.cs-tdots button:focus-visible{outline:2px solid currentColor;outline-offset:4px}.cs-tbtns{display:flex;flex-wrap:wrap;gap:20px;margin:48px 0 0}.cs-tbtns span,.cs-tbtns button{display:inline-block;font-size:20px;font-weight:700;padding:18px 34px;border:1.5px solid;white-space:nowrap}.cs-tbtns button{appearance:none;margin:0;line-height:normal;cursor:pointer;transition:background-color .12s ease-out,border-color .12s ease-out,box-shadow .12s ease-out}.cs-tbtns .cs-tb1{background:var(--f);border-color:var(--f);color:var(--l)}.cs-tbtns .cs-tb1:hover{background:var(--fh);border-color:var(--fh)}.cs-tbtns .cs-tb1:active{background:var(--fp);border-color:var(--fp)}.cs-tb2{background:transparent;border-color:var(--c);color:var(--c)}.cs-tb2:hover{background:var(--wh)}.cs-tb2:active{background:var(--wp)}.cs-tbtns button:focus-visible{outline:none;box-shadow:0 0 0 2px var(--tb-bg),0 0 0 4px var(--tb-ring)}@media (prefers-reduced-motion:reduce){.cs-tbtns button{transition:none}}.cs-tstyle{display:inline-flex;align-self:flex-start;gap:2px;margin:0 0 36px;padding:3px;border-radius:calc(var(--trad) + 3px);box-shadow:inset 0 0 0 1.5px var(--tbtn2)}.cs-tstyle button{font:inherit;font-family:"Euclid Circular",sans-serif;font-size:var(--t-sm);font-weight:500;color:var(--tbtn2);background:none;border:0;border-radius:var(--trad);padding:8px 18px;cursor:pointer}.cs-tstyle button[aria-pressed="true"]{background:var(--tfill);color:var(--tlabel)}.cs-tstyle button[aria-disabled="true"]{opacity:.35;cursor:not-allowed}.cs-tstyle button:focus-visible{outline:2px solid var(--tink);outline-offset:3px}.cs-tdesc{display:flex;flex-direction:column;justify-content:flex-start;padding:56px 48px;border-left:1px solid var(--tline);font-size:var(--t-md);line-height:1.6}.cs-tdesc h3{margin:32px 0 8px;font-size:var(--t-h3);line-height:1.25}.cs-tdesc h3:first-child{margin-top:0}.cs-tdesc p{margin:0}.cs-tdescin{margin-block:auto}.cs-tdesc ul{list-style:none;margin:0;padding:0}.cs-tdesc li{margin:0 0 2px}.cs-tdesc li b{font-weight:600}.cs-tbig a.cs-golink,.cs-tbig a.cs-golink:visited{color:var(--tlink)}.cs-tbig a.cs-golink:hover{color:var(--tlinkh)}.cs-tdesc .cs-tmore{display:flex;align-items:center;gap:6px;width:max-content;margin-top:8px;text-decoration:none;font-weight:500}.cs-tmore svg{width:1.05em;height:1.05em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .12s ease-out}@media (hover:hover) and (pointer:fine){.cs-tmore:hover svg{transform:translateX(3px)}}@media (prefers-reduced-motion:reduce){.cs-tmore svg{transition:none}}.cs-tdesc .cs-lchip{background:color-mix(in srgb,var(--tink) 12%,transparent);color:inherit}.cs .cs-body .cs-tbig .cs-tdesc code.cs-lchip{color:var(--tlink)}@media (max-width:1100px){.cs-tbig{grid-template-columns:minmax(0,1fr)}.cs-tdesc{border-left:0;border-top:1px solid var(--tline);padding:40px}.cs-tvis{padding:40px}.cs-thead{font-size:80px}}@media (max-width:640px){.cs-tvis,.cs-tdesc{padding:28px 24px}.cs-thead{font-size:48px}.cs-tvis .cs-tbody{font-size:20px}}.cs-theme-roles{font-size:var(--t-sm)}.cs-theme-roles b{font-weight:500}.cs-rolet{color:var(--fg3);margin-left:4px}'
    + '.cs-matrix{gap:12px 16px}.cs-colhead{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;padding:0 0 10px;border-bottom:1px solid var(--line)}.cs-colhead b{font-size:var(--t-md);font-weight:500;color:var(--fg)}.cs-colhead span{font-size:var(--t-sm);color:var(--fg3)}'
    + '.cs-mrow{margin-top:28px;font-size:var(--t-md);font-weight:500;color:var(--fg);gap:10px}.cs-mrow:first-of-type{margin-top:16px}.cs-mrow .cs-lchip{font-weight:500}'
    // components
    + '.cs-comp{padding:0;margin:0 0 56px;background:none;box-shadow:none;border-radius:0}.cs-comp h4{font-size:var(--t-lg);font-weight:500;margin:0 0 6px}.cs-comp .cs-compspec{margin:0 0 20px}'
    // the contrast cell, quiet: regular weights, a thin bar in full color, a 1px gray mark at the minimum; only Just
    // passes and Fails keep a color in words, Passes and Exceeds are gray (the bar still shows how far it goes)
    + '.cs-crn{font-weight:400;color:var(--fg);min-width:36px}.cs-crn i{color:var(--fg3)}.cs-cr{gap:10px}'
    + '.cs-crbar{width:44px;height:3px;border-radius:2px;background:#ececf0}.cs-crbar i{border-radius:2px}.cs-crbar u{top:-3px;bottom:-3px;width:1px;margin-left:0;background:#9a9aa4;border-radius:0}'
    + '.cs-cr.ok .cs-crbar i,.cs-legends .cs-crbar i{background:#3fae72}.cs-cr.great .cs-crbar i{background:#1f8a55}.cs-cr.close .cs-crbar i{background:#e0a106}.cs-cr.bad .cs-crbar i{background:#e5484d}'
    + '.cs-crw{font-weight:400}.cs-cr.ok .cs-crw,.cs-cr.great .cs-crw,.cs-cr.none .cs-crw{color:var(--fg3)}.cs-cr.close .cs-crw{color:#8a5a00}.cs-cr.bad .cs-crw{color:#b42318}'
    + '.cs-crlegend b{font-weight:400}.cs-crlegend b.ok,.cs-crlegend b.great{color:var(--fg2)}.cs-crlegend b.close{color:#8a5a00}.cs-crlegend b.bad{color:#b42318}'
    + '.cs-lchip{font-weight:400;color:var(--fg2)}'
    // the specimen's tooltip
    + '.cs-tip{position:fixed;z-index:50;max-width:320px;display:flex;flex-direction:column;gap:4px;padding:10px 12px;border-radius:8px;background:#151517;color:#d9d9e0;font-size:var(--t-sm);line-height:1.45;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.18)}.cs-tip[hidden]{display:none}.cs-tip b{color:#fff;font-weight:500}'
    + '.cs-tiprow{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.cs-tip i{width:14px;height:14px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}.cs-tip code{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:var(--t-xs);color:#ececf0;background:#3a3a42;padding:0 5px;border-radius:4px}'
    // sidebar: labels 17, controls and hints 15
    + '.cs-side .cs-ctl > label,.cs-sidehead{font-size:var(--t-md);font-weight:500}.cs-side .cs-sechead{font-size:var(--t-lg);font-weight:500;letter-spacing:-0.01em}.cs-side .cs-hint{font-size:var(--t-sm)}.cs-side .cs-seg button,.cs-side select{font-size:var(--t-sm)}'
    // every paragraph and list wraps without short last lines; previews keep their own settings
    + ''
    // a link is always the size of the text it sits in (code-chip tokens are chips, not text links)
    + '.cs a:not(.cs-tok):not(.cs-sidetok):not(.cs-conflink):not(.cs-site a):not(.cs-mini a):not(.cs-comppv a):not(.ts-frame a){font-size:inherit;line-height:inherit}'
    // phones: the sidebar sits above the content instead of beside it
    + '@media (max-width:640px){.cs{flex-direction:column;overflow-y:auto}.cs-side{flex:none;height:auto;overflow:visible}.cs-main{height:auto;overflow:visible;flex:none}.cs-theme dl{grid-template-columns:minmax(0,1fr);gap:4px 0}.cs-theme dd{margin-bottom:12px}.cs-theme-body{gap:32px}}'
    // every value chip in the canvas is one size, the scale's code step, whatever text it sits in (Oct 27)
    + '.cs .cs-body code{font-size:var(--t-xs)}.cs .cs-body .cs-gmuted{font-size:inherit}.cs .cs-body .cs-fxval{font-size:var(--t-sm)}.cs .cs-body code:not(.cs-tcmd code){color:#1b1b1f;font-weight:400}';
  const DOC_CSS = '.cs-body.doc{padding:44px 56px 44px}'
    + '.cs-mdcopy{position:relative;float:right;display:inline-flex;align-items:center;gap:6px;margin:4px 0 0 16px}.cs-mdcopy::after{content:attr(data-tip);position:absolute;top:calc(100% + 8px);right:0;padding:8px 12px;border-radius:4px;background:#151517;color:#fff;font-size:.875rem;font-weight:400;line-height:1.3;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.16);pointer-events:none;opacity:0;transition:opacity .1s ease;z-index:10}.cs-mdcopy[data-tip]::after{opacity:1}@media (prefers-reduced-motion:reduce){.cs-mdcopy,.cs-mdcopy::after{transition:none}}'
    // narrow windows (the canvas is the window minus the 384px sidebar): less side padding, and wide tables scroll inside
    // themselves instead of pushing the page sideways (Oct 25)
    + ''
    + '@media (max-width:1024px){.cs-body.doc{padding:32px 24px 32px}.cs-gtab,.cs-doc .cs-fxtab{display:block;max-width:100%;overflow-x:auto}}'
    + ''
    + '.cs .cs-main .cs-legends{margin-bottom:16px}.cs .cs-main :is(header>.cs-legends,header+.cs-legends,.cs-pagehead+.cs-legends),.cs .cs-main .cs-tactions,.cs .cs-main :is(article.cs-guide,.cs-fxdoc)>header{margin-bottom:40px}.cs .cs-main :is(article.cs-guide,.cs-fxdoc)>header:has(+ :is(.cs-legends,.cs-tactions,.cs-gtocsel)){margin-bottom:16px}.cs .cs-main :is(article.cs-guide,.cs-fxdoc)>header>:last-child{margin-bottom:0}'
    + '.cs .cs-main :is(.cs-pagehead,article.cs-guide>header,.cs-fxdoc>header,.cs-doc>header){max-width:740px;box-sizing:border-box}.cs .cs-main :is(.cs-pagehead,article.cs-guide>header,.cs-fxdoc>header,.cs-doc>header) .cs-lead{max-width:none}'
    + '.cs-sr{display:inline-block;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;vertical-align:top}'
    + ''
    + '.cs .cs-main :is(.cs-glead,.cs-lead):has(~ :is(.cs-legends,.cs-tactions,.cs-gtocsel)){margin-bottom:16px}.cs .cs-main .cs-gtocsel{margin-bottom:16px}:is(.cs-pagehead,.cs-fxhead,.cs-doc>header,article>header):has(+ :is(.cs-legends,.cs-tactions,.cs-gtocsel)){margin-bottom:16px}:is(.cs-pagehead,.cs-fxhead,.cs-doc>header,article>header):has(+ :is(.cs-legends,.cs-tactions,.cs-gtocsel))>:last-child{margin-bottom:0}'
    + '.cs-main .cs-doc :is(h1,h2,h3,h4)+:is(h2,h3,h4,h5),.cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article),.cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article)>:is(h2,h3,h4,h5):first-child,.cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article)>header:first-child>:is(h2,h3,h4,h5){margin-top:0}.cs-doc .cs-readmore{display:block;width:max-content;margin:-4px 0 18px;font-weight:500}.cs-doc .cs-readmore span{display:inline-block;transition:transform .12s ease-out}@media (hover:hover) and (pointer:fine){.cs-doc .cs-readmore:hover span{transform:translateX(3px)}}'
    // docs spacing (Nov 3, Alberto: use what we learned on the spacing side): every gap is one --doc-space token; heading gaps
    // step down with the level (h2 m, h3 and formula names s), paragraphs s, parts l, sections xl on each side of the divider
    + '.cs .cs-main :is(.cs-glead,.cs-lead):has(~ :is(.cs-legends,.cs-tactions,.cs-gtocsel)){margin-bottom:var(--doc-space-s)}.cs .cs-main .cs-gtocsel{margin-bottom:var(--doc-space-s)}.cs .cs-main :is(article.cs-guide,.cs-fxdoc)>header,.cs .cs-main .cs-pagehead{margin-bottom:var(--doc-space-xl)}.cs .cs-main :is(article.cs-guide,.cs-fxdoc)>header:has(+ :is(.cs-legends,.cs-tactions,.cs-gtocsel)),.cs .cs-main .cs-pagehead:has(+ :is(.cs-legends,.cs-tactions,.cs-gtocsel)){margin-bottom:var(--doc-space-s)}.cs .cs-main :is(header>.cs-legends,header+.cs-legends,.cs-pagehead+.cs-legends),.cs .cs-main .cs-tactions{margin-bottom:var(--doc-space-xl)}.cs .cs-main .cs-shead{margin-bottom:var(--doc-space-m)}.cs .cs-main .cs-fxsec>.cs-fxr{margin-top:var(--doc-space-l)}.cs .cs-main .cs-fxr>header{margin-bottom:var(--doc-space-s)}.cs .cs-main .cs-fxr>header:has(+.ts-updated){margin-bottom:0}.cs .cs-main .cs-fxr>header+.ts-updated{margin:var(--doc-space-3xs) 0 var(--doc-space-s)}.cs .cs-main .cs-fxr>.cs-fxsig{display:block;width:fit-content;max-width:100%;margin:0 0 var(--doc-space-s)}.cs .cs-main .cs-fxr>.cs-fxsig+.cs-fxmeta{margin-top:0}.cs .cs-main .cs-fxwhy:has(+.cs-readmore){margin-bottom:var(--doc-space-3xs)}.cs .cs-main .cs-fxwhy+.cs-readmore{margin:0 0 var(--doc-space-m)}.cs .cs-main :is(section,article,.cs-gsub)>:is(ul,ol):not(.ts-cmpkey,.ts-flow,.ts-pipe)>li+li{margin-top:var(--doc-space-2xs)}.cs .cs-main .cs-doc :is(h1,h2,h3,h4)+:is(h2,h3,h4,h5),.cs .cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article),.cs .cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article)>:is(h2,h3,h4,h5):first-child,.cs .cs-main .cs-doc :is(h1,h2,h3,h4)+:is(section,article)>header:first-child>:is(h2,h3,h4,h5){margin-top:0}'
    // the corrections the type system gives sites, on the docs too (Nov 3, Alberto): hanging punctuation, optical sizing,
    // kerning and ligatures; paragraphs and lists stop at 55ch; heading line height from Euclid Circular's own metrics
    // (glyph 0.978 + leading 0.29 × 16px / size, measured in the browser: capitals 0.71em, ascent 1em, descent 0.268em);
    // big headings tighter by trackAt() (h1 -0.007em, h2 -0.0036em, smaller 0); lining, even-width numbers in headings;
    // body tracking 0 (Euclid measures 0.31 and 0.17 x-heights beside n and o, like Mulish, so it isn't a loose font)
    + '.cs .cs-main{overflow-anchor:none}.cs .cs-main .cs-table,.cs .cs-main .cs-table :is(th,td,td>span,td>b,th>span){font-size:var(--doc-label)}.cs .cs-main .cs-table :is(code,.cs-lchip,.cs-tok,.ts-tok,.ts-cmpbadge){font-size:var(--doc-tag)}.cs .cs-gtoc b{font-size:var(--doc-tag);text-transform:uppercase;letter-spacing:.08em}.cs .cs-main .cs-doc{font-optical-sizing:auto;hanging-punctuation:first allow-end last;font-kerning:auto;font-feature-settings:"liga" 1,"clig" 1;letter-spacing:0}'
    + '.cs-doc a.cs-golink,.cs-doc .cs-golink{font-size:inherit;line-height:inherit;letter-spacing:inherit;white-space:normal}.cs-doc a[target="_blank"]::after{content:"↗";display:inline-block;margin-left:.12em;font-size:.78em;line-height:1;vertical-align:.08em;text-decoration:none}'
    + '.cs-gwrap{grid-template-columns:minmax(0,740px) 200px;gap:80px}@media (max-width:1280px){.cs-gwrap{grid-template-columns:minmax(0,740px)}}'
    + '.cs-gtocsel{display:none;margin:0 0 24px;font-size:var(--t-sm);letter-spacing:-0.01em}.cs-gtocselbox{position:relative;display:block;max-width:420px}.cs-gtocselbox::after{content:"";position:absolute;right:17px;top:50%;width:7px;height:7px;margin-top:-6px;border:solid #55555f;border-width:0 1.5px 1.5px 0;transform:rotate(45deg);pointer-events:none}.cs-gtocsel select{appearance:none;-webkit-appearance:none;width:100%;font:inherit;font-size:15px;color:#151517;background:#fff;border:1px solid #d9d9e0;border-radius:8px;padding:10px 40px 10px 16px;cursor:pointer;text-overflow:ellipsis}.cs-gtocsel select:hover{border-color:#b4b4bc}.cs-gtocsel select:focus-visible{outline:2px solid #151517;outline-offset:2px}@media (max-width:1280px){.cs-gtocsel{display:block}}'
    + '.cs-doc{--s-1:14px;--s0:16px;--s1:20px;--s2:28px;--s4:40px;font-size:var(--s0);line-height:1.65;letter-spacing:-0.011em}'
    + ''
    + ''
    + ''
    + '.cs-doc header{margin:0 0 8px}.cs-doc .cs-fxhead p{font-size:var(--s0);color:#4a4a52}'
    + ''
    + ''
    + '.cs-doc .cs-fxr h4{margin:0 0 10px}.cs-doc .cs-fxr{margin:56px 0 0}.cs-doc .cs-fxr.cs-fxfirst{margin:0}.cs-doc .cs-fxsec>.muted+.cs-fxr{margin-top:36px}.cs-doc .cs-fxsec>.muted{font-size:var(--s0);color:#4a4a52;margin:0 0 8px}'
    + '.cs-doc ul,.cs-doc ol{margin:0 0 1em;padding-left:1.35em}.cs-doc li{margin:0 0 .45em;padding-left:.15em}.cs-doc li::marker{color:#6b6b75}.cs-doc ol li::marker{font-variant-numeric:tabular-nums}'
    + '.cs-doc .cs-gsee,.cs-doc .cs-gnote{font-size:var(--s-1);line-height:1.55}.cs-doc .cs-gnote{padding:16px 18px;margin:0 0 1.2em}'
    + '.cs-doc .cs-fxmeta{font-size:var(--s-1);line-height:1.55;gap:6px 16px;margin:18px 0 0}.cs-doc .cs-fxnote{font-size:var(--s-1);line-height:1.55;margin:10px 0 0}'
    + '.cs-doc .cs-fxlab{font-size:var(--s-1);font-weight:500;color:#151517;margin:28px 0 10px}.cs-doc .cs-fxlabsub{font-weight:400}'
    + '.cs-doc .cs-fxtab{font-size:var(--s-1)}.cs .cs-main table th code.cs-lchip,.cs .cs-main .cs-table thead th code.cs-lchip{font-size:inherit;text-transform:none;letter-spacing:0;vertical-align:baseline}.cs .cs-table th,.cs .cs-main .cs-table thead th{font-size:var(--doc-tag);font-weight:500;line-height:1.4;letter-spacing:.04em!important;text-transform:uppercase;color:#6b6b75}'
    + '.cs-doc .cs-fxsig{font-size:13px;line-height:1.5}.cs-doc .cs-fxcode,.cs-doc .cs-fxrule{font-size:var(--doc-label);line-height:1.65}.cs-doc .cs-lchip{font-size:.8em}'
    + '.cs-doc .cs-ggrid{margin:8px 0 1.6em}.cs-doc .cs-gtile figcaption{font-size:var(--s-1);line-height:1.5}'
    + '.cs-gtoc{font-size:var(--t-sm);line-height:1.4;top:84px}.cs-gtoc b{font-size:var(--t-sm);letter-spacing:.02em;color:#6b6b75;font-weight:500;margin-bottom:8px}.cs-gtoc a{padding:4px 0}.cs-gtocsub{margin:2px 0 6px 2px}';
  const SIDE_CSS = '.cs-gen{margin-top:-8px;background:#3a3a42;border-radius:8px}.cs-gen summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:8px;font-size:var(--doc-small);color:#fff}.cs-gen summary:hover{background:#45454e}.cs-gen[open] summary{border-radius:8px 8px 0 0}.cs-gen summary::-webkit-details-marker{display:none}.cs-gen summary svg{flex:none;width:14px;height:14px;color:#fff;transform:rotate(-90deg);transition:transform .15s}.cs-gen[open] summary svg{transform:rotate(0deg)}.cs-gencount{margin-left:auto;font-size:12px;font-weight:500;color:#fff;background:#151517;border-radius:999px;padding:1px 8px}.cs-gen ul{list-style:none;margin:0;padding:4px 12px 12px;display:flex;flex-direction:column;gap:10px}.cs-gen li{display:flex;gap:10px;align-items:flex-start}.cs-genpair{flex:none;display:flex;align-items:center;gap:3px;color:#a9a9b3}.cs-genpair svg{width:12px;height:12px}.cs-gensw{flex:none;width:20px;height:20px;border-radius:5px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2)}.cs-gentxt{display:flex;flex-direction:column;gap:1px;font-size:var(--doc-label);line-height:1.3;min-width:0}.cs-gentxt b{font-weight:500;color:#fff}.cs-gentxt span{color:#a9a9b3;line-height:1.6}.cs-gentxt code{font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:var(--doc-label);font-weight:500;color:#ececf0;background:#4c4c56;padding:1px 5px;border-radius:4px;white-space:nowrap}.cs-gennote{font-size:12px;line-height:1.45;color:#a9a9b3;display:block !important}.cs-genok{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#8e8e99 !important;margin-top:2px}.cs-genhex{margin-left:auto;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#a9a9b3}'
    + '.cs-side .cs-sechead{color:#fff}.cs-side .cs-sec+.cs-sec{border-top-color:#2c2c32}.cs-side .cs-hint{color:#a9a9b3;margin:-5px 0 2px}.cs-side a.cs-wcag{color:inherit;text-decoration:underline;text-decoration-color:#6b6b75;text-underline-offset:2px}.cs-side a.cs-wcag:hover{color:#fff;text-decoration-color:currentColor}.cs-side a.cs-wcag:focus-visible{outline:2px solid #fff;outline-offset:2px;border-radius:2px}.cs-side .cs-ctl>label{color:#fff}'
    + '.cs-side .cs-ctl select{background:#3a3a42;color:#fff;border:0}.cs-side .cs-selwrap svg{color:#fff}'
    + '.cs-side .cs-seg{background:#3a3a42}.cs-side .cs-seg button{color:#fff}.cs-seg button[aria-disabled="true"]{opacity:.3;cursor:not-allowed}.cs-side .cs-seg button:hover:not([aria-checked="true"]){background:#45454e}.cs-side .cs-seg button[aria-checked="true"]{background:#cdcdd4;color:#151517;box-shadow:none}'
    + '.cs-bgalias{font-size:var(--doc-label);font-weight:400;opacity:.62;white-space:nowrap}.cs-side .cs-bgname{background:#3a3a42;border-color:transparent;color:#fff}.cs-side .cs-bgname:hover{background:#45454e}.cs-side .cs-bgname[aria-checked="true"]{background:#cdcdd4;border-color:#cdcdd4;box-shadow:none;color:#151517}.cs-side .cs-bgname[aria-checked="true"] .mono{color:#45454e}.cs-custom{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:-6px}.cs-cpick{display:flex;align-items:center;gap:10px;padding:6px;border-radius:10px;background:#3a3a42;cursor:pointer}.cs-cpsw{position:relative;flex:none;width:30px;height:30px;border-radius:7px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.cs-cpsw input{position:absolute;inset:-8px;width:46px;height:46px;border:0;padding:0;background:none;cursor:pointer}.cs-cpname{display:flex;flex-direction:column;font-size:14px;font-weight:500;line-height:1.25;min-width:0}.cs-cpname input.cs-hexchip{width:76px;border:0;outline:none;font:inherit}.cs-cpname input.cs-hexchip:focus{box-shadow:0 0 0 1px #cdcdd4}.cs-side .cs-hexchip{display:inline-block;align-self:flex-start;margin-top:3px;font-family:\'JetBrains Mono\',ui-monospace,Menlo,monospace;font-size:var(--doc-label);font-weight:500;color:#ececf0;background:#4c4c56;padding:1px 5px;border-radius:4px;line-height:1.4}.cs-side .cs-bgname[aria-checked="true"] .cs-hexchip{background:#b4b4bc;color:#151517}.cs-side .cs-bgtxt .mono{color:#a9a9b3}.cs-side .cs-bgsw{box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}';
  let root = null; var GEN = [];
  const PRESETS = {
    after: { colors: 'fixed', inkv: 'soft', label: 'bg' },
    before: { colors: 'original', inkv: 'pure', label: 'ink' }
  };
  const presetOf = () => Object.keys(PRESETS).find((k) => Object.entries(PRESETS[k]).every(([key, v]) => S[key] === v)) || null;
  let onChangeFn = null;
  const brandUnavailable = (E) => !Object.values(E.block(S.bg, 2).block).some((r) => r.brand);
  // tab keys and the names their links use (Oct 26): #system/theme, #system/targets, …
  const TAB_SLUG = { specimen: 'specimen', matrix: 'theme', patterns: 'patterns', guide: 'guide', formulas: 'formulas', colors: 'colors', rules: 'targets', components: 'components', tests: 'tests', failures: 'failures' };
  const tabFromSlug = (x) => Object.keys(TAB_SLUG).find((k) => TAB_SLUG[k] === x || k === x);
  const render = () => {
    if (!root) return;
    let E = engine(palette(), S);
    if (S.style !== 'Neutral' && brandUnavailable(E)) { S.style = 'Neutral'; save(); }
    const nFail = failures().length;
    const spec = specimen(E), fx = formulas(E), nFx = (fx.match(/class="cs-fxr[ "]/g) || []).length;
    const nTargets = TARGETS.reduce((n, t) => n + (RULE_PARTS[t.id] ? RULE_PARTS[t.id].length : 1), 0);
    const tabs = [['specimen', 'Specimen'], ['matrix', 'Theme'], ['patterns', 'Color patterns'], ['guide', 'Guide'], ['formulas', 'Formulas<span class="cs-tabn">' + nFx + '</span>'], ['colors', 'Colors<span class="cs-tabn">' + TOKENS.length + '</span>'], ['rules', 'Targets<span class="cs-tabn">' + nTargets + '</span>'], ['components', 'Components<span class="cs-tabn">' + NCOMP + '</span>'], ['failures', 'Failures<span class="cs-tabn' + (nFail ? ' bad' : '') + '">' + nFail + '</span>']];
    const body = S.tab === 'guide' ? guideTab(E) : S.tab === 'matrix' ? matrix(E) : S.tab === 'rules' ? rules(E) : S.tab === 'failures' ? failTab() : S.tab === 'formulas' ? fx : S.tab === 'colors' ? colorsTab(E) : S.tab === 'components' ? componentsTab(E) : S.tab === 'tests' ? testsTab() : S.tab === 'patterns' ? (window.TypeSystem && window.TypeSystem.patternsHTML ? window.TypeSystem.patternsHTML() : '') : spec;
    // keep both scroll positions across re-renders: the canvas and the sidebar
    const main = root.querySelector('.cs-main'), mainScroll = main ? main.scrollTop : 0, side = root.querySelector('.cs-side'), sideScroll = side ? side.scrollTop : 0;
    root.innerHTML = '<style>' + CSS + SIDE_CSS + DOC_CSS + UI_CSS + (window.TypeSystem && window.TypeSystem.patternsCSS ? window.TypeSystem.patternsCSS() : '') + '</style><div class="cs"><aside class="cs-side" aria-label="Settings">' + controls(E) + '</aside>'
      + '<div class="cs-main"><div class="cs-top"><div class="cs-tabscroll"><div class="cs-tabs" role="tablist">' + tabs.map(([k, l]) => '<button type="button" role="tab" aria-selected="' + (S.tab === k) + '" data-set="tab" data-val="' + k + '">' + l + '</button>').join('') + '</div></div></div>'
      // wide tables scroll sideways inside their own box, so the page never does (Oct 25, found by the tests)
      + '<div class="cs-body' + (S.tab === 'guide' || S.tab === 'formulas' || S.tab === 'patterns' ? ' doc' : '') + '">' + body.replace(/<table class="cs-table[\s\S]*?<\/table>/g, (t) => '<div class="cs-tscroll">' + t + '</div>') + '</div></div></div>';
    const m2 = root.querySelector('.cs-main'); if (m2) m2.scrollTop = mainScroll;
    const s2 = root.querySelector('.cs-side'); if (s2) s2.scrollTop = sideScroll;
    const ts = root.querySelector('.cs-tabscroll'); if (ts) { ts.scrollLeft = tabScroll; const on = ts.querySelector('[aria-selected="true"]'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' }); tabFade(ts); }
    root.querySelectorAll('.cs-site [title]').forEach((x) => { x.dataset.tip = x.title; x.setAttribute('aria-description', x.title); x.removeAttribute('title'); });
    tableFades(); copyButtons(root); wcagLinks(root); tocGuide(root);
    // the address follows the tab, so any tab can be linked (#system/targets); a heading link on the same tab stays
    const want = '#system/' + TAB_SLUG[S.tab];
    if (location.hash !== want && location.hash.indexOf(want + '/') !== 0) { try { history.replaceState(null, '', location.pathname + location.search + want); } catch (e) { /* the viewer may not allow it */ } }
    if (onChangeFn) onChangeFn(presetOf());
  };

  // the specimen's tooltips (Oct 25): hovering or focusing any part says what it is, its color, what it sits on, and
  // its contrast. Parts with a rule carry it (their former title); anything else is measured from what's on screen
  const rgbHex = (c) => { const m = (c || '').match(/[\d.]+/g); return m ? '#' + m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase() : null; };
  const behind = (el) => { for (; el; el = el.parentElement) { const b = getComputedStyle(el).backgroundColor; if (b && !/rgba\([^)]*,\s*0\)|transparent/.test(b)) return rgbHex(b); } return '#FFFFFF'; };
  const KIND = { A: 'Link', BUTTON: 'Button', INPUT: 'Field', TEXTAREA: 'Field', SELECT: 'Field', LABEL: 'Label', LI: 'List item', H1: 'Heading', H2: 'Heading', H3: 'Heading', H4: 'Heading', SUMMARY: 'Question', SMALL: 'Small print' };
  const tipFor = (el) => {
    const site = el.closest && el.closest('.cs-site'); if (!site) return null;
    const own = el.closest('[data-tip]');
    if (own && site.contains(own)) { const m = /^(.*?): (#[0-9A-Fa-f]{6}|oklch\([^)]*\)) · (.*?) · ([\d.]+:1)(?: \(min ([\d.]+:1)\))?/.exec(own.dataset.tip);
      if (m) return { el: own, label: m[1], hex: m[2], why: m[3], ratio: m[4], min: m[5], against: behind(own) }; }
    // no rule attached: measure the text color against what's behind it
    const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ? el : null; if (!t) return null;
    const hex = rgbHex(getComputedStyle(t).color), against = behind(t), r = contrast(hex, against);
    const kind = KIND[t.tagName] || (t.closest('a') ? 'Link' : t.closest('button') ? 'Button' : 'Text');
    return { el: t, label: kind, hex, against, ratio: fmt(r), measured: true };
  };
  const sw = (c) => '<i style="background:' + c + '"></i><code>' + c + '</code>';
  const showTip = (info, x, y) => {
    let t = root.querySelector('.cs-tip'); if (!t) { t = document.createElement('div'); t.className = 'cs-tip'; t.setAttribute('role', 'tooltip'); root.appendChild(t); }
    if (!info) { t.hidden = true; return; }
    t.innerHTML = '<b>' + esc(info.label) + '</b><span class="cs-tiprow">' + sw(info.hex) + ' on ' + sw(info.against) + '</span>'
      + (info.why ? '<span>' + esc(info.why) + '</span>' : '') + '<span>Contrast ' + info.ratio + (info.min ? ', needs ' + info.min : '') + '</span>';
    t.hidden = false; const w = t.offsetWidth, h = t.offsetHeight;
    t.style.left = Math.max(8, Math.min(innerWidth - w - 8, x + 14)) + 'px'; t.style.top = (y + 18 + h > innerHeight - 8 ? y - h - 12 : y + 18) + 'px';
  };
  // the tab bar scrolls sideways when it doesn't fit (Oct 25): it fades out on the side that has more tabs
  let tabScroll = 0;
  // a 40px fade on whichever side has more to scroll to: the tab bar and, since Oct 25, wide tables
  const edgeFade = (el) => { const l = el.scrollLeft > 1, rgt = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    el.style.setProperty('--fade', 'linear-gradient(to right,' + (l ? 'transparent' : '#000') + ' 0,#000 40px,#000 calc(100% - 40px),' + (rgt ? 'transparent' : '#000') + ' 100%)'); };
  const tabFade = (el) => { tabScroll = el.scrollLeft; edgeFade(el); };
  // ---- Copy page (Nov 2, Alberto): every doc page's title has a button that copies the whole page as Markdown, so people
  // can paste it into an LLM. Headings, paragraphs, lists (nested), tables, and code; charts, controls, and contents
  // lists are left out. Shared by the Color and Type views (copyButtons(root) after every render)
  const MD_SKIP = '.ts-off,.cs-top,.cs-tabbar,script,style,svg,button,input,select,textarea,.cs-glink,.cs-gtocsel,.cs-gtoc,.cs-legends,.ts-unitbar,.cs-mdcopy,[hidden]';
  const mdText = (s) => s.replace(/\s+/g, ' ');
  const mdInline = (n) => { if (n.nodeType === 3) return mdText(n.nodeValue); if (n.nodeType !== 1 || n.matches(MD_SKIP)) return '';
    const t = n.tagName, inner = () => [...n.childNodes].map(mdInline).join('');
    if (t === 'BR') return ' ';
    if (t === 'CODE') return '`' + n.textContent.trim() + '`';
    if (t === 'B' || t === 'STRONG') { const x = inner().trim(); return x ? '**' + x + '** ' : ''; }
    if (t === 'I' || t === 'EM') { const x = inner().trim(); return x ? '*' + x + '* ' : ''; }
    if (t === 'A') { const x = inner().trim(), h = n.getAttribute('href') || ''; return /^https?:/.test(h) ? '[' + x + '](' + h + ')' : x; }
    if (n.childElementCount > 1 && !/^inline/.test(getComputedStyle(n).display)) return [...n.childNodes].map(mdInline).join(' ');
    return inner(); };
  const mdLine = (n) => mdInline(n).replace(/ +([.,;:!?)])/g, '$1').replace(/\s+/g, ' ').trim();
  const mdCell = (n) => mdLine(n).replace(/\|/g, '\\|') || ' ';
  const mdList = (n, depth) => { let k = 0; return [...n.children].filter((li) => li.tagName === 'LI').map((li) => { k++;
    const sub = [...li.children].filter((c) => c.tagName === 'OL' || c.tagName === 'UL'), own = li.cloneNode(true);
    own.querySelectorAll(':scope > ol, :scope > ul').forEach((x) => x.remove());
    const pad = '   '.repeat(depth), mark = n.tagName === 'OL' ? k + '. ' : '- ';
    return pad + mark + mdLine(own) + sub.map((s) => '\n' + mdList(s, depth + 1)).join(''); }).join('\n'); };
  const mdTable = (t) => { const rows = [...t.querySelectorAll('tr')]; if (!rows.length) return '';
    const head = rows[0], cols = Math.max(...rows.map((r) => [...r.cells].reduce((a, c) => a + (c.colSpan || 1), 0)));
    const line = (r) => { const cells = [...r.cells].flatMap((c) => [mdCell(c)].concat(Array((c.colSpan || 1) - 1).fill(' '))); while (cells.length < cols) cells.push(' '); return '| ' + cells.join(' | ') + ' |'; };
    return [line(head), '|' + Array(cols).fill(' --- ').join('|') + '|'].concat(rows.slice(1).map(line)).join('\n'); };
  const mdPre = (p) => { const spans = [...p.children].filter((c) => c.tagName === 'SPAN');
    const lines = spans.length ? spans.map((s) => ' '.repeat(Math.max(0, (parseFloat(s.style.paddingLeft) || 4) - 4)) + s.textContent.replace(/\s+$/, '')) : p.textContent.split('\n');
    return '```\n' + lines.join('\n') + '\n```'; };
  const mdBlocks = (el) => { const out = [];
    const walk = (n) => { if (n.nodeType !== 1 || n.matches(MD_SKIP)) return; const t = n.tagName;
      if (/^H[1-6]$/.test(t)) { const x = mdLine(n); if (x) out.push('#'.repeat(+t[1]) + ' ' + x); return; }
      if (t === 'P' || t === 'FIGCAPTION' || t === 'SUMMARY' || t === 'BLOCKQUOTE') { const x = mdLine(n); if (x) out.push(t === 'SUMMARY' ? '**' + x + '**' : t === 'BLOCKQUOTE' ? '> ' + x : x); return; }
      if (t === 'OL' || t === 'UL') { const x = mdList(n, 0); if (x.trim()) out.push(x); return; }
      if (t === 'TABLE') { out.push(mdTable(n)); return; }
      if (t === 'PRE') { out.push(mdPre(n)); return; }
      // a box with no block inside it (a label and its value, a row of chips) is one line
      const kids = [...n.childNodes], loose = n.textContent.trim() && !n.querySelector('p,div,section,table,ol,ul,h1,h2,h3,h4,h5,h6,pre,figure,header,article,details,dl,li');
      if (loose) { const x = mdLine(n); if (x) out.push(x); return; }
      kids.forEach(walk); };
    walk(el); return out.join('\n\n').replace(/\n{3,}/g, '\n\n') + '\n'; };
  // the Markdown mark (M and a down arrow in a rounded box), in the HugeIcons stroke style
  const COPY_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 15V9L9 12L12 9V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 9V15M15 13L17 15L19 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // every WCAG success criterion links to its place in the WCAG 2.2 spec (Nov 3, Alberto), in both views: plain text
  // ("WCAG 1.4.4") and the cs-gnum spans that keep the number out of the value chips
  const WCAG_SC = { '1.4.1': 'use-of-color', '1.4.3': 'contrast-minimum', '1.4.4': 'resize-text', '1.4.10': 'reflow', '1.4.11': 'non-text-contrast', '1.4.12': 'text-spacing', '2.3.3': 'animation-from-interactions', '2.4.7': 'focus-visible', '2.5.8': 'target-size-minimum' };
  const wcagA = (n) => '<a class="cs-wcag" href="https://www.w3.org/TR/WCAG22/#' + WCAG_SC[n] + '" target="_blank" rel="noopener">' + n + '<span class="cs-sr"> (WCAG 2.2, opens in a new tab)</span></a>';
  const wcagLinks = (el) => { if (!el) return; const SKIP = 'a, pre, textarea, script, style, svg, .ts-site, .ts-frame, select, option, button';
    el.querySelectorAll('.cs-gnum').forEach((g) => { const n = g.textContent.trim(), prev = g.previousSibling;
      if (WCAG_SC[n] && !g.closest(SKIP) && prev && prev.nodeType === 3 && /WCAG\s*$/.test(prev.nodeValue)) g.innerHTML = wcagA(n); });
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), hits = [];
    while (w.nextNode()) { const t = w.currentNode; if (/WCAG \d\.\d+\.\d+/.test(t.nodeValue) && !t.parentElement.closest(SKIP + ', code')) hits.push(t); }
    hits.forEach((t) => { const span = document.createElement('span'); span.innerHTML = t.nodeValue.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(/WCAG (\d\.\d+\.\d+)/g, (m, n) => (WCAG_SC[n] ? 'WCAG ' + wcagA(n) : m)); t.replaceWith(...span.childNodes); }); };
  // ---- Contents guide (Nov 12, Alberto, after haz.dev's table of contents): one line runs down the contents list and
  // bends with a smooth S-curve where a part is indented; a blue stretch of the same line marks the item being read and
  // slides along the path (stroke-dasharray, 250ms on the panel's curve, none with reduced motion), and that item sits
  // on a soft pill. Built from the links' own boxes after every render, resize, and spy update; the dropdown for narrow
  // windows names the section being read
  const SVGNS = 'http://www.w3.org/2000/svg';
  const tocGuide = (scope) => { const nav = scope && scope.querySelector('.cs-gtoc'); if (!nav) return;
    const links = [...nav.querySelectorAll('a[data-gscroll]')], cur = links.filter((a) => a.hasAttribute('aria-current')).pop();
    links.forEach((a) => a.classList.toggle('cs-gon', a === cur));
    const sel = scope.querySelector('.cs-gtocsel select'); if (sel && sel.options[0]) { const main = scope.querySelector('.cs-main'); sel.options[0].textContent = cur && main && main.scrollTop > 40 ? cur.textContent : 'On this page'; }
    if (!nav.offsetParent) return;  // hidden (narrow windows use the dropdown)
    let svg = nav.querySelector(':scope > svg.cs-gguide');
    const key = links.map((a) => a.offsetTop + ',' + a.offsetHeight + ',' + a.offsetLeft).join(';');
    if (!svg || svg.dataset.key !== key) {
      if (!svg) { svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'cs-gguide'); svg.setAttribute('aria-hidden', 'true'); svg.innerHTML = '<path class="cs-gtrack"/><path class="cs-gmark"/>'; nav.prepend(svg); }
      svg.dataset.key = key; const h = nav.scrollHeight; svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 24 ' + h);
      const pts = links.map((a) => ({ x: a.offsetLeft - 14.5, t: a.offsetTop + 6, b: a.offsetTop + a.offsetHeight - 5 }));
      const probe = svg.querySelector('.cs-gtrack'); let d = '', out = [];
      // each bend is a straight diagonal with its two corners rounded (Nov 12, Alberto: the sharp corners read as a zigzag)
      // the curves live in the gap between two items; the run beside an item gives up 4px at the end that meets a bend, so the
      // step is close to 45 degrees (Nov 12, Alberto: flatter read as aggressive)
      const R = 3, GIVE = 2;
      pts.forEach((q) => { q.t0 = q.t; q.b0 = q.b; });
      pts.forEach((q, i) => { const pv = pts[i - 1], nx = pts[i + 1]; if (pv && pv.x !== q.x) q.t = q.t0 + GIVE; if (nx && nx.x !== q.x) q.b = q.b0 - GIVE; });
      pts.forEach((q, i) => { const pv = pts[i - 1], nx = pts[i + 1], ys = q.t, ye = q.b;
        if (!pv) d = 'M' + q.x + ' ' + ys;
        else if (pv.x === q.x) d += 'L' + q.x + ' ' + ys;
        else { const c1y = pv.b + R, c2y = q.t - R, dx = q.x - pv.x, dy = c2y - c1y, len = Math.hypot(dx, dy) || 1, r = Math.min(R, len / 2), ux = dx / len * r, uy = dy / len * r;
          d += 'Q' + pv.x + ' ' + c1y + ' ' + (pv.x + ux) + ' ' + (c1y + uy) + 'L' + (q.x - ux) + ' ' + (c2y - uy) + 'Q' + q.x + ' ' + c2y + ' ' + q.x + ' ' + ys; }
        probe.setAttribute('d', d); const l0 = probe.getTotalLength(); d += 'L' + q.x + ' ' + ye; probe.setAttribute('d', d); q.ye = ye; out.push([l0 + (pv && pv.x !== q.x ? 0 : 2), probe.getTotalLength() - (nx && nx.x !== q.x ? 0 : 2)]); });  // the marker's stretch: 2px in from a plain end, flush where the run already gave 2px to a bend
      svg._len = out; svg._total = probe.getTotalLength(); svg.querySelector('.cs-gmark').setAttribute('d', d);
    }
    // the marker rides on the line itself, so it slides along the bends (Nov 12, Alberto); each item's stretch comes from _len
    const old = nav.querySelector(':scope > .cs-gmarker'); if (old) old.remove();
    const mk = svg.querySelector('.cs-gmark'), seg = svg._len[links.indexOf(cur)];
    if (!seg) { mk.style.opacity = '0'; return; }
    mk.style.opacity = '1'; mk.style.strokeDasharray = Math.max(1, seg[1] - seg[0]) + ' ' + (svg._total + 10); mk.style.strokeDashoffset = -seg[0];
  };
  const copyButtons = (el) => el && el.querySelectorAll('.cs-main h1').forEach((h) => { if (h.closest('.ts-stage, .ts-frame, .ts-site, .cs-spec, iframe') || !h.closest('.cs-doc, article.cs-guide, .cs-pagehead, .cs-fxhead')) return; if (h.previousElementSibling && h.previousElementSibling.classList.contains('cs-mdcopy')) return;
    h.insertAdjacentHTML('beforebegin', '<button type="button" class="cs-mdcopy nGmfC-Co VomA4PNW ITy1-TaR cys0c2OP" aria-label="Copy page as Markdown, to paste into an LLM">' + COPY_ICON + '<span class="_-0hK-2pD HXbUiHUv _3tX5eQm8">Copy as Markdown</span></button>'); });
  if (!window.__csMdCopy) { window.__csMdCopy = true;
    document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('.cs-mdcopy'); if (!b) return;
      const page = b.closest('article, .cs-doc, .cs-main') || document.body, md = mdBlocks(page);
      const done = (t) => { b.setAttribute('data-tip', t); clearTimeout(b._t); b._t = setTimeout(() => b.removeAttribute('data-tip'), 1600); };
      (navigator.clipboard ? navigator.clipboard.writeText(md) : Promise.reject()).then(() => done('Copied the page as Markdown'), () => done('Couldn’t copy the page')); }); }
  const tableFades = () => root && root.querySelectorAll('.cs-tscroll').forEach(edgeFade);
  const onToggle = (e) => { if (e.target.matches && e.target.matches('details.cs-gen')) { S.genOpen = e.target.open; save(); } };
  const onClick = (e) => {
    const gs = e.target.closest('[data-gscroll]');
    if (gs) { e.preventDefault(); const el = root.querySelector('#' + gs.dataset.gscroll); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); return; }
    const cl = e.target.closest('[data-copylink]');
    if (cl) { const url = location.origin + location.pathname + location.search + '#system/' + cl.dataset.copylink;
      try { history.replaceState(null, '', url); } catch (err) { /* the viewer may not allow it */ }
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).catch(() => {}).finally(() => { cl.classList.add('copied'); cl.title = 'Copied'; setTimeout(() => { cl.classList.remove('copied'); cl.title = 'Copy link'; }, 1400); });
      return; }
    const go2 = e.target.closest('[data-goto]');
    if (go2) { e.preventDefault(); const [tab, id] = go2.dataset.goto.split('|'); S.tab = tab; save(); render();
      const el = id ? root.querySelector('#' + id) : null; if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('cs-flash'); setTimeout(() => el.classList.remove('cs-flash'), 1400); } return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { const pre = cp.dataset.copy === 'all' ? null : cp.parentElement.nextElementSibling;
      const text = pre ? [...pre.children].map((l) => ' '.repeat(Math.max(0, parseInt(l.style.paddingLeft, 10) - 4)) + l.textContent).join('\n') : MODULE_SRC();
      navigator.clipboard.writeText(text).then(() => { cp.textContent = 'Copied'; setTimeout(() => { cp.textContent = 'Copy'; }, 1200); }, () => { cp.textContent = 'Select and copy'; }); return; }
    const go = e.target.closest('[data-go]');
    if (go) { const [bg, st] = go.dataset.go.split('|'); S.bg = bg; S.style = st; S.tab = 'specimen'; save(); render(); return; }
    // sidebar buttons, and links in the text that do the same (the Theme tab's siblings, Tinted and Vivid)
    const el = e.target.closest('button[data-set], a[data-set]');
    if (el && el.tagName === 'A') e.preventDefault();
    if (el && el.getAttribute('aria-disabled') === 'true') return;
    if (!el) return;
    S[el.dataset.set] = el.dataset.val; save(); render();
  };
  const onInput = (e) => {
    if (e.target.matches('.cs-gtocsel select')) { const t = e.target.value && root.querySelector('#' + e.target.value); e.target.value = ''; if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); return; }
    if (e.target.matches('select[data-set="palette"]')) { S.palette = e.target.value; save(); render(); }
    // custom colors: the picker commits on close; the hex field on Enter or blur, ignored unless it's a valid hex
    // the text field also takes oklch(L C H), for wide-gamut (Display P3) theme colors (Oct 25)
    if (e.target.matches('[data-cust]')) { const raw = e.target.value.trim(), lch = /^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.-]+\s*\)$/i.test(raw);
      const v = lch ? raw.replace(/^OKLCH/i, 'oklch').replace(/([\d.]+)%/, (m, n) => String(n / 100)) : raw.replace(/^#?/, '#');
      // beyond P3 it keeps lightness and hue and gives up chroma; a color that fits sRGB is stored as hex
      if (lch) { const [L, C, H] = toOklch(v); S.custom[e.target.dataset.cust] = norm(inGamutMode('p3', () => fitGamut(Math.min(1, L), C, H))); save(); }
      else if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) { S.custom[e.target.dataset.cust] = norm(v); save(); } render(); }
  };

  // ---- for the CMS view (phase 2), unused on purpose: the CMS went back to the v3.0 engine on Oct 25 so both conflict
  // variants can be tested on Lisa's own colors. Kept for phase 2: Calm with the corrected colors and the In review
  // switches (ink, button label, gamut); cmsColors() returns every color a block and its cards need, for the CMS to set
  // as CSS custom properties on the block
  const CMS_CUSTOM = { name: 'Custom', hex: '#C98F75' }; // a clay where neither Brand nor Alternate reads: the Conflict state
  const cmsEngine = () => engine(Object.assign({}, PALETTES.calm, FIXES.calm), Object.assign({}, S, { card: 'derived', rule: 'aa45', fallback: 'shade2', blend: 'lab', status: 'theme', lines: 'card2' }));
  const cmsBackgrounds = () => { const E = cmsEngine();
    return BGS.map(([name, key]) => ({ name, hex: norm(E.p[key]), dark: toOklch(E.p[key])[0] < 0.5 })).concat([{ name: CMS_CUSTOM.name, hex: CMS_CUSTOM.hex, dark: false, custom: true }]); };
  const cmsHex = (bgName) => { const b = cmsBackgrounds().find((x) => x.name === bgName); return b ? b.hex : bgName; };
  // whether the background gets an accent (Brand, or Alternate where Brand can't be read); without one, Tinted and
  // Vivid are disabled
  const cmsHasAccent = (bgName) => Object.values(cmsEngine().block(cmsHex(bgName), 2).block).some((x) => x.brand);
  const cmsColors = (bgName, style) => {
    const E = cmsEngine(), si = Math.max(0, STYLES.indexOf(style)), b = E.block(cmsHex(bgName), si), cal = E.p;
    const labelOnFill = (f, lab) => (S.label === 'bg' ? lab : E.ink(f));
    // one surface (the block or its card) and its targets
    const set = (sf, t, heading) => {
      const inkS = E.ink(sf), fill = t.btnFill.hex, h = stateShift(fill, sf, HOVER), pr = stateShift(fill, sf, PRESSED);
      const acc = t.btnFill.brand ? fill : inkS, tint = si === 2 && norm(fill) === norm(cal.SecondaryColor);
      const div = derivedCard(sf, null, 0, LINE_STEPS);
      return { surface: sf, ink: t.body.hex, 'ink-h': stateShift(t.body.hex, sf, HOVER), soft: closestPassing(inkS, sf, 4.5), heading, 'heading-h': stateShift(heading, sf, HOVER), 'heading-p': stateShift(heading, sf, PRESSED),
        kicker: t.kicker.hex, link: t.link.hex, 'link-h': stateShift(t.link.hex, sf, HOVER), 'link-p': stateShift(t.link.hex, sf, PRESSED),
        marker: t.marker.hex, icon: t.icon.hex, btn: fill, 'btn-ink': t.btnLabel.hex, 'btn-h': h, 'btn-p': pr, 'btn-ink-h': labelOnFill(h, t.btnLabel.hex), 'btn-ink-p': labelOnFill(pr, t.btnLabel.hex),
        btn2: t.btn2.hex, 'btn2-h': stateSurface(sf, t.btn2.hex, 0.12), 'btn2-p': stateSurface(sf, t.btn2.hex, 0.22), 'btn2-dis': mix(t.btn2.hex, sf, 0.6),
        ring: inkS, line: closestPassing(inkS, sf, 3), 'field-h': stateShift(acc, sf, HOVER), 'field-f': acc, divider: tint ? tintLine(div, fill) : div,
        error: statusOf('error', b.cardSurface.hex, cal.SecondaryColor) || inkS };
    };
    return { block: set(b.bg, b.block, b.block.heading.hex), card: set(b.cardSurface.hex, b.card, b.card.cardHeading.hex) };
  };
  window.ColorSystem = {
    cmsColors, cmsBackgrounds, cmsHasAccent, CMS_CUSTOM,
    // every theme's palette, for the Type system's Shapes tab (Oct 30)
    palettes: allPalettes,
    // the specimen's choice and quantity controls (Oct 24): select one in a group; step the quantity, 1 at least
    pick: (el) => { el.parentNode.querySelectorAll('.cs-pick.on').forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); }); el.classList.add('on'); el.setAttribute('aria-pressed', 'true'); },
    slide: (el, d, to) => { const sec = el.closest('.cs-prev'), tr = sec.querySelector('.cs-ptrack'), step = tr.clientWidth + 24, n = Math.max(0, Math.round((tr.scrollWidth - tr.clientWidth) / step));
      const cur = Math.round(tr.scrollLeft / step), i = Math.max(0, Math.min(n, to == null ? cur + d : to)); tr.scrollTo({ left: i * step, behavior: 'smooth' });
      sec.querySelectorAll('.cs-pdot').forEach((x, m) => x.classList.toggle('on', m === i)); const [pv, nx] = sec.querySelectorAll('.cs-parrows .cs-ibtn'); pv.disabled = i === 0; nx.disabled = i >= n; },
    qty: (el, d) => { const b = el.parentNode.querySelector('b'), n = Math.max(1, +b.textContent + d); b.textContent = n; el.parentNode.querySelector('.cs-qbtn').disabled = n <= 1; },
    mount(el) {
      if (!el || el === root) return;
      if (!document.getElementById('cs-fonts')) { const l = document.createElement('link'); l.id = 'cs-fonts'; l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l); }
      root = el;
      el.addEventListener('click', onClick);
      el.addEventListener('change', onInput);
      el.addEventListener('toggle', onToggle, true);
      el.addEventListener('pointermove', (e) => showTip(tipFor(e.target), e.clientX, e.clientY));
      el.addEventListener('pointerleave', () => showTip(null));
      el.addEventListener('focusin', (e) => { const i = tipFor(e.target); const r = e.target.getBoundingClientRect(); showTip(i, r.left, r.bottom); });
      el.addEventListener('focusout', () => showTip(null));
      // #system/guide/<section> opens the Guide at that heading (the copy-link buttons write these)
      const m = /^#system\/(guide|formulas)\/([\w-]+)/.exec(location.hash), tid = m ? (m[1] === 'guide' ? 'g-' : '') + m[2] : null;
      const mt = /^#system\/([a-z]+)/.exec(location.hash), linked = mt && tabFromSlug(mt[1]);
      // the System view opens on Specimen, the first tab, unless a link points at another one
      S.tab = linked || 'specimen'; save();
      render();
      if (m) setTimeout(() => { const t = root.querySelector('#' + tid); if (t) t.scrollIntoView({ block: 'start' }); root.querySelectorAll('.cs-gtoc a').forEach((x) => { if (x.dataset.gscroll === tid) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); }); }, 50);
      // the contents column marks the section being read
      el.addEventListener('scroll', (e) => { const c = e.target.classList; if (!c) return; if (c.contains('cs-tabscroll')) tabFade(e.target); else if (c.contains('cs-tscroll')) edgeFade(e.target); }, true);
      window.addEventListener('resize', () => { const ts = root && root.querySelector('.cs-tabscroll'); if (ts) tabFade(ts); tableFades(); });
      el.addEventListener('scroll', () => { const nav = root.querySelector('.cs-gtoc'); if (!nav) return; const main = root.querySelector('.cs-main'), top = main.getBoundingClientRect().top + 120;
        const items = [...root.querySelectorAll('.cs-guide section[id], .cs-fxdoc .cs-fxsec[id], .cs-fxdoc .cs-fxr[id]')];
        let cur = items.length ? items[0].id : null; items.forEach((sec) => { if (sec.getBoundingClientRect().top <= top) cur = sec.id; });
        nav.querySelectorAll('a').forEach((a) => { if (a.dataset.gscroll === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); tocGuide(root);
        }, true);
    },
    // for the Editor later (phase 2): same engine, same rules
    engine, TARGETS, PALETTES, FIXES, moduleSource: () => MODULE_SRC(),
    applyPreset(name) { if (!PRESETS[name]) return; Object.assign(S, PRESETS[name]); save(); render(); },
    // for the test suite (color-style/tests/, Oct 25): read-only access to the engine's math and a full sweep. sweep()
    // and snapshot() work on a copy of the settings and put everything back, so they never change what the page shows
    _test: {
      contrast, toOklch, fromOklch, norm, lum, inGamut, gamutOf, fitGamut, maxChroma, mixLab, shiftL, stateShift, stateSurface,
      derivedCard, cardDE, cardCR, deltaE, statusOf, statusHC, oklchCss, closestPassing, tintLine, inGamutMode, fmt, deg, hueGap, HOVER, PRESSED, LINE_TINT, LINE_STEPS, MIN, BGS, STYLES,
      settings: () => Object.assign({}, S),
      themes: () => Object.keys(PALETTES).map((k) => [k, themed(k)]),
      // every check on every theme (plus extra palettes, e.g. a P3 custom one), as the Failures tab runs it
      sweep(opts = {}, extra = []) {
        const keepS = Object.assign({}, S), keepGen = GEN;
        try { Object.assign(S, opts, { scope: 'all' }); if (S.palette === 'custom') S.palette = 'calm';
          const fails = failures().map(([theme, bg, style, label, r]) => ({ theme, bg, style, label, ratio: r.ratio, min: r.min }));
          let checks = nChecks; const drops = DROPS.slice();
          extra.forEach((pal) => { const keepC = S.custom; S.custom = pal; S.palette = 'custom'; S.scope = 'theme';
            failures().forEach(([theme, bg, style, label, r]) => fails.push({ theme: 'custom', bg, style, label, ratio: r.ratio, min: r.min }));
            checks += nChecks; drops.push(...DROPS); S.custom = keepC; S.palette = 'calm'; S.scope = 'all'; });
          return { fails, checks, drops };
        } finally { Object.keys(S).forEach((k) => delete S[k]); Object.assign(S, keepS); GEN = keepGen; }
      },
      // every color the system computes for one theme: per background and style, the block and card targets and the
      // generated colors (GEN, LAST_CHECKS)
      snapshot(key, pal, opts = {}) {
        const keepS = Object.assign({}, S), keepGen = GEN, out = {};
        try { Object.assign(S, opts); const E = engine(pal || themed(key), S);
          BGS.forEach(([bg]) => STYLES.forEach((st, si) => { const b = E.block(bg, si); specimenFull(b, si, E, E.p);
            const o = { bg: norm(b.bg), card: norm(b.cardSurface.hex) };
            Object.entries(b.block).forEach(([id, r]) => { o['block.' + id] = norm(r.hex); });
            Object.entries(b.card).forEach(([id, r]) => { o['card.' + id] = norm(r.hex); });
            GEN.forEach((g) => { o['gen.' + g.label] = norm(g.hex); });
            LAST_CHECKS.forEach(({ label, r }) => { o['check.' + label] = norm(r.hex); });
            out[bg + '/' + st] = o; }));
          return out;
        } finally { Object.keys(S).forEach((k) => delete S[k]); Object.assign(S, keepS); GEN = keepGen; }
      }
    },
    presetOf, onChange(fn) { onChangeFn = fn; },
    // the Type system (typesystem.js, Oct 28) reuses the shell: sidebar, tabs, page and section heads, controls
    shellCSS: () => CSS + SIDE_CSS + DOC_CSS + UI_CSS, pageHead, secHead, seg, esc, FONTS, STYLES, tocSelect, copyButtons, wcagLinks, tocGuide, toMarkdown: mdBlocks,
    // the font table, for the Type system's documentation (Oct 29)
    fontLH: () => FONT_LH,
    fontFallback: () => FONT_FALLBACK,
    fontMetrics: () => FONT_METRICS, fontTrack: () => FONT_TRACK,
    themeInfo: () => THEME_INFO,
    // value chips for documentation prose (numbers, px, ratios), shared with the Type system's docs
    codeify: (html) => codeify(html),
    // the Type system shares the theme and the style with this view (Oct 28): one theme sets colors and fonts
    theme: {
      get: () => ({ palette: PALETTES[S.palette] ? S.palette : 'calm', style: S.style }),
      // a new theme drops a borrowed font pair: it brings its own fonts
      set(patch) { if (patch.palette && patch.palette !== S.palette && !('fontPair' in patch)) patch = Object.assign({ fontPair: null }, patch); Object.assign(S, patch); save(); render(); },
      // the font pair (Nov 1): the key of the theme whose fonts the current theme borrows, or null for its own
      fontPair: () => (S.fontPair && S.fontPair !== S.palette && PALETTES[S.fontPair] ? S.fontPair : null),
      setFontPair(k) { S.fontPair = k && k !== S.palette ? k : null; save(); render(); },
      // [segment, [[key, name], ...]], in the order of the Theme select
      groups: () => [...new Set(Object.keys(PALETTES).map((k) => (THEME_INFO[k] || {}).segment || 'Other'))].map((g) => [g, Object.keys(PALETTES).filter((k) => ((THEME_INFO[k] || {}).segment || 'Other') === g).map((k) => [k, PALETTES[k].name])]),
      fonts: () => { const p = themed(PALETTES[S.palette] ? S.palette : 'calm'), fm = FONT_LH[fontName(p.hf)] || { lh: [0, 0] }; return { hf: p.hf, hw: p.hw, bf: p.bf, upper: !!p.upper || !!fm.caps, capsOnly: !!fm.caps, radius: p.radius == null ? 0 : p.radius, heading: fontName(p.hf), body: fontName(p.bf), lh: fm.lh[0], lhCaps: fm.lh[1] }; },
      // any theme's card for a theme picker (the CMS's Appearance panel, Oct 31), without switching to it: its name, fonts,
      // button radius, four palette colors, and one block's heading and button colors in one style (Base and Tinted by
      // default; Light for buttons drawn on a white card)
      card: memoized('card', function (k, style, bgName, raw) { const p = themed(k, raw), fm = FONT_LH[fontName(p.hf)] || {}, E = engine(p, S), b = E.block(bgName || 'Base', Math.max(0, STYLES.indexOf(style || 'Tinted'))), x = b.block, hx = (r) => r ? norm(r.hex) : null;
        return { key: k, name: p.name, hf: p.hf, hw: p.hw, bf: p.bf, upper: !!p.upper || !!fm.caps, radius: p.radius == null ? 0 : p.radius, bg: norm(b.bg), ink: hx(x.heading), body: hx(x.body),
          btn: hx(x.btnFill), btnInk: hx(x.btnLabel), btn2: hx(x.btn2), dots: [p.MainColor, p.Shade1, p.SecondaryColor, p.Shade2].map(norm) }; }),
      // whether a background gets an accent in a theme (Brand, or Alternate where Brand can't be read); without one,
      // Tinted and Vivid look like Neutral, so the CMS's Block Design dims them (Nov 1, for the CMS site)
      hasAccent: memoized('accent', (pk, bgName) => Object.values(engine(themed(pk), S).block(bgName, 2).block).some((x) => x && x.brand)),
      // a block's colors on one background, in one style: the same engine and rules as the specimen here
      // k (Nov 1): another theme's palette instead of the current one, for the CMS site, which keeps Rossi's colors
      colors: memoized('colors', function (bgName, style, pk) {
        const P = pk ? themed(pk) : palette(), E = engine(P, S), b = E.block(bgName, Math.max(0, STYLES.indexOf(style || S.style))), k = b.block, c = b.card, hx = (r) => r ? norm(r.hex) : null;
        // the parts the Components tab draws, for the Type system's specimen (Oct 28): dividers (the card rule, one and a
        // half card steps out, tinted in Vivid where the fill is Brand), field borders (3:1), soft text (4.5:1), the
        // secondary button, and the same set on the block's card surface
        const si = Math.max(0, STYLES.indexOf(style || S.style)), cs = b.cardSurface.hex, inkB = E.ink(b.bg), inkC = E.ink(cs);
        const tint = si === 2 && norm(k.btnFill.hex) === norm(P.SecondaryColor), ctint = si === 2 && norm(c.btnFill.hex) === norm(P.SecondaryColor);
        return { bg: b.bg, body: hx(k.body), heading: hx(k.heading), kicker: hx(k.kicker), link: hx(k.link), marker: hx(k.marker), icon: hx(k.icon), btn: hx(k.btnFill), btnInk: hx(k.btnLabel), btn2: hx(k.btn2),
          divider: norm(dividerOn(b.bg, k.btnFill.hex, tint)), line: norm(closestPassing(inkB, b.bg, 3)), soft: norm(closestPassing(inkB, b.bg, 4.5)),
          card: hx(b.cardSurface), cardHeading: hx(c.cardHeading), cardBody: hx(c.body), cardKicker: hx(c.kicker), cardMarker: hx(c.marker), cardIcon: hx(c.icon), cardBtn: hx(c.btnFill), cardBtnInk: hx(c.btnLabel), cardBtn2: hx(c.btn2),
          cardDivider: norm(ctint ? tintLine(derivedCard(cs, null, 0, LINE_STEPS), c.btnFill.hex) : derivedCard(cs, null, 0, LINE_STEPS)), cardLine: norm(closestPassing(inkC, cs, 3)),
          // the buttons' states, as on the Theme tab (Oct 29): the primary fill moves to accent-hover and accent-pressed,
          // the secondary gets surface-hover and surface-pressed, and the focus ring is the surface's Ink
          btnHover: norm(stateShift(k.btnFill.hex, b.bg, HOVER)), btnPressed: norm(stateShift(k.btnFill.hex, b.bg, PRESSED)), btn2Hover: norm(stateSurface(b.bg, k.btn2.hex, 0.12)), btn2Pressed: norm(stateSurface(b.bg, k.btn2.hex, 0.22)), ring: norm(inkB),
          cardBtnHover: norm(stateShift(c.btnFill.hex, cs, HOVER)), cardBtnPressed: norm(stateShift(c.btnFill.hex, cs, PRESSED)), cardBtn2Hover: norm(stateSurface(cs, c.btn2.hex, 0.12)), cardBtn2Pressed: norm(stateSurface(cs, c.btn2.hex, 0.22)), cardRing: norm(inkC),
          // links (Oct 29): accent-hover and accent-pressed of the link color, and of the body color for navigation links
          linkHover: norm(stateShift(k.link.hex, b.bg, HOVER)), linkPressed: norm(stateShift(k.link.hex, b.bg, PRESSED)), inkHover: norm(stateShift(k.body.hex, b.bg, HOVER)), inkPressed: norm(stateShift(k.body.hex, b.bg, PRESSED)),
          cardLink: hx(c.link), cardLinkHover: norm(stateShift(c.link.hex, cs, HOVER)), cardLinkPressed: norm(stateShift(c.link.hex, cs, PRESSED)), cardInkHover: norm(stateShift(c.body.hex, cs, HOVER)), cardInkPressed: norm(stateShift(c.body.hex, cs, PRESSED)) };
      }),
    }
  };
})();
