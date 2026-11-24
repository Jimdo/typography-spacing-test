// Companion (Nov 5, Alberto: "the content factor needs to be controlled from Companion", then "mock it up, in the
// prototype"): the Companion side panel in the CMS, built from the CompanionKit Figma file (Nvq0S1JYnC8eBm4kTkX9ko,
// system 2.5): the Pinned panel and its header (792:22483), the Wayfinder with "Next for your business" as a tip and
// its reason (675:3409, B), the Check card (795:5124, 4.3), the Status line, the "Your words" choice card (988:508, G),
// and Remember this? (867:5990). It mocks one job: content suggestions that fit the headings' mood. Companion reads the
// page, compares it with what the mood asks for (TypeSystem.MOOD_FIT), and suggests words; it never changes a size.
// Outside React, like specs.js: the CMS mounts it into its right-hand slot (mount(el, api)) and calls update() when the
// settings change. The buttons are real JUI Buttons; the header's icon buttons copy Companion's (32px, 8px corners).
(function () {
  'use strict';
  if (window.CompanionPanel) return;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // the icons, exported from the CompanionKit panel (HugeIcons, Stroke Standard, 16px)
  const SVG = (inner, w) => '<svg width="' + (w || 16) + '" height="16" viewBox="0 0 ' + (w || 16) + ' 16" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  const IC = {
    newChat: SVG('<path d="M12.6784 5.19061L9.18917 8.67985C8.4923 9.37672 8.14387 9.72516 7.71927 9.96242C7.29467 10.1997 6.29207 10.4384 5.33334 10.6667C5.56161 9.70794 5.80033 8.70534 6.03759 8.28074C6.27485 7.85614 6.62329 7.5077 7.32016 6.81084L10.8094 3.32159L11.7439 2.38709C12.26 1.87097 13.0968 1.87097 13.6129 2.38709C14.129 2.9032 14.129 3.73999 13.6129 4.2561L12.6784 5.19061ZM10.8094 3.32159L12.6784 5.19061"/><path d="M14 8C14 10.8284 14 12.2426 13.1213 13.1213C12.2426 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213C2 12.2426 2 10.8284 2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2"/>'),
    history: SVG('<path d="M3.36534 5.73739L1.69192 5.63551C2.89143 2.46952 6.33535 0.666284 9.69308 1.56284C13.2694 2.51775 15.3936 6.17372 14.4377 9.72869C13.4818 13.2837 9.80776 15.3914 6.23148 14.4365C3.57615 13.7275 1.7213 11.5294 1.33335 8.98926"/><path d="M8 5.33301V7.99967L9.33333 9.33301"/>'),
    minimize: SVG('<path d="M13.333 8L2.66634 8"/>'),
    plus: SVG('<path d="M7.99999 2.66699L7.99999 13.3337M13.3333 8.00033L2.66666 8.00033"/>'),
    mic: SVG('<path d="M11.3333 4.66634V7.33301C11.3333 9.17396 9.84095 10.6663 8 10.6663C6.15905 10.6663 4.66666 9.17396 4.66666 7.33301V4.66634C4.66666 2.82539 6.15905 1.33301 8 1.33301C9.84095 1.33301 11.3333 2.82539 11.3333 4.66634Z"/><path d="M17 7H14M17 11H14"/><path d="M13.3333 7.33301C13.3333 10.2785 10.9455 12.6663 8 12.6663M8 12.6663C5.05448 12.6663 2.66666 10.2785 2.66666 7.33301M8 12.6663V14.6663M8 14.6663H10M8 14.6663H6"/>', 18),
    tick: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6.75L4.25 9L9.75 3" stroke="currentColor" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    up: SVG('<path d="M4.66667 2L2 2.00001C1.63181 2.00001 1.33333 2.29849 1.33333 2.66668V8C1.33333 8.36819 1.63181 8.66667 2 8.66667H4.66667"/><path d="M11.9651 2H4.66667V8.66667L9.27718 13.3333L9.32447 13.2855C10.288 12.3102 10.5586 10.835 10.0052 9.57465L9.6065 8.66667H13.3483C14.2557 8.66667 14.8914 7.75977 14.5916 6.89287L13.2085 2.89287C13.0236 2.35808 12.5249 2 11.9651 2Z"/>'),
    down: SVG('<path d="M4.66667 13.3332L2 13.3332C1.63181 13.3332 1.33334 13.0347 1.33334 12.6665V7.33317C1.33334 6.96498 1.63181 6.6665 2 6.6665H4.66667"/><path d="M11.9651 13.3333H4.66667V6.66667L9.27718 2L9.32447 2.04787C10.288 3.02314 10.5586 4.49832 10.0052 5.75868L9.60651 6.66667H13.3483C14.2557 6.66667 14.8914 7.57357 14.5916 8.44047L13.2085 12.4405C13.0236 12.9752 12.5249 13.3333 11.9651 13.3333Z"/>'),
    map: SVG('<path d="M14.6667 6.66634V6.14467C14.6667 4.85159 14.6667 4.20505 14.2762 3.80334C13.8856 3.40164 13.2571 3.40164 12 3.40164H10.6142C10.0027 3.40164 9.99763 3.40045 9.44767 3.12523L7.22659 2.01377C6.29924 1.5497 5.83556 1.31767 5.34159 1.33379C4.84763 1.34992 4.39919 1.61173 3.50231 2.13535L2.68373 2.61325C2.02493 2.99787 1.69554 3.19018 1.51444 3.5101C1.33334 3.83003 1.33334 4.21963 1.33334 4.99883V10.4768C1.33334 11.5006 1.33334 12.0125 1.56152 12.2975C1.71335 12.487 1.92612 12.6145 2.16134 12.6567C2.51485 12.7202 2.94766 12.4675 3.81326 11.9622C4.40105 11.619 4.96675 11.2626 5.66992 11.3592C6.25914 11.4402 6.80667 11.812 7.33334 12.0755"/><path d="M5.33334 1.33301L5.33334 11.333"/><path d="M10 3.33301V6.33301"/><path d="M12.2055 14.4557C12.061 14.591 11.8678 14.6667 11.6667 14.6667C11.4657 14.6667 11.2724 14.591 11.1279 14.4557C9.80421 13.2087 8.03031 11.8156 8.89539 9.79322C9.36313 8.69972 10.4859 8 11.6667 8C12.8475 8 13.9703 8.69972 14.4381 9.79322C15.302 11.8131 13.5325 13.213 12.2055 14.4557Z"/>'),
    web: SVG('<path d="M1.66667 4.66699V11.3337C1.66667 12.9905 3.00982 14.3337 4.66667 14.3337L11.3333 14.3337C12.9902 14.3337 14.3333 12.9905 14.3333 11.3337V4.66699C14.3333 3.01014 12.9902 1.66699 11.3333 1.66699H4.66667C3.00981 1.66699 1.66667 3.01014 1.66667 4.66699Z"/><path d="M2 6H14"/><path d="M8.66667 8.66699H11.3333M8.66667 11.3337H9.73333"/><path d="M6 6V14"/>'),
    // text-font (HugeIcons Pro, the Type view's) for a title, and a paragraph's lines for a text, at 16px
    title: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 19L9 5H7L2 19M4 14H12"/><path d="M16.5 11.5L16.6298 11.3053C17.1735 10.4898 18.0887 10 19.0688 10C20.6876 10 22 11.3124 22 12.9312V18.5M22 14H18.561C17.1466 14 16 15.1466 16 16.561C16 17.908 17.092 19 18.439 19H18.7408C19.2376 19 19.725 18.865 20.151 18.6094L20.3033 18.518C21.3559 17.8864 22 16.7489 22 15.5213V14Z"/></svg>',
    text: SVG('<path d="M2.66667 3.33333H13.3333M2.66667 6.66667H13.3333M2.66667 10H13.3333M2.66667 13.3333H8.66667"/>'),
    // ai-magic, the Launcher's sparkle (CompanionKit 728:13426), for what Companion can do in the editor
    magic: '<svg width="16" height="16" viewBox="28 20 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M38 27L37.4842 28.3941C36.8077 30.222 36.4695 31.136 35.8028 31.8028C35.136 32.4695 34.222 32.8077 32.3941 33.4842L31 34L32.3941 34.5158C34.222 35.1923 35.136 35.5305 35.8028 36.1972C36.4695 36.864 36.8077 37.778 37.4842 39.6059L38 41L38.5158 39.6059C39.1923 37.778 39.5305 36.864 40.1972 36.1972C40.864 35.5305 41.778 35.1923 43.6059 34.5158L45 34L43.6059 33.4842C41.778 32.8077 40.864 32.4695 40.1972 31.8028C39.5305 31.136 39.1923 30.222 38.5158 28.3941L38 27Z"/><path d="M46 23L45.7789 23.5975C45.489 24.3809 45.3441 24.7726 45.0583 25.0583C44.7726 25.3441 44.3809 25.489 43.5975 25.7789L43 26L43.5975 26.2211C44.3809 26.511 44.7726 26.6559 45.0583 26.9417C45.3441 27.2274 45.489 27.6191 45.7789 28.4025L46 29L46.2211 28.4025C46.511 27.6191 46.6559 27.2274 46.9417 26.9417C47.2274 26.6559 47.6191 26.511 48.4025 26.2211L49 26L48.4025 25.7789C47.6191 25.489 47.2274 25.3441 46.9417 25.0583C46.6559 24.7726 46.511 24.3809 46.2211 23.5975L46 23Z"/></svg>'
  };

  // what Companion knows about the business (its business profile, mocked for Rossi). The headings fact comes from
  // Appearance, through the CMS
  const PROFILE = [['Business', 'Italian restaurant, Hamburg'], ['Goal', 'More table bookings'], ['Tone', 'Warm, short sentences']];
  // the rewrites, written for Rossi from its own words (the product writes them with AI, in the site's language and
  // tone): keyed by the text they replace, so a text that changed, or another site, simply gets no suggestion
  const TITLES = {
    'The table is set. It has been for forty years.': { name: 'cover title', where: 'Cover, Home', opts: ['The table is set.', 'Set for forty years.', 'Forty years at the table.'] },
    // the bar's Long title (Nov 5): the owner's longer cover title, and three ways to say it shorter in its own words
    'The table is set at Rossi di Cassa, and it has been for forty years, with the same ragù and the same welcome.': { name: 'cover title', where: 'Cover, Home', opts: ['The table is set at Rossi di Cassa', 'The same ragù, the same welcome', 'Forty years at Rossi di Cassa'] }
  };
  const TEXTS = [
    { starts: 'Rossi opened in 1987', name: 'story', where: '“Good food doesn’t need explaining”, Home',
      // each option edits the text element's paragraphs, by index: cut one, or keep part of it
      opts: [{ label: 'Cut this paragraph', cut: [2] },
        { label: 'Keep its last three sentences', keep: { 2: 'Source the best ingredients we can find. Cook them properly. Serve them with care.' } }] }
  ];

  const S = { later: {}, offered: {}, tid: null, host: null, api: null, thread: [], confirmed: false, remembered: false, askedRemember: false, orig: new Map(), seen: 0, roots: [], focus: null, say: '' };

  // how many lines a title takes at Mobile, measured in its own font with a canvas, wrapped word by word
  function linesOf(el, text, px, room) {
    const d = el.ownerDocument, cs = d.defaultView.getComputedStyle(el), cv = d.createElement('canvas').getContext('2d');
    cv.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + px + 'px ' + cs.fontFamily;
    const words = (cs.textTransform === 'uppercase' ? text.toUpperCase() : text).trim().split(/\s+/).filter(Boolean);
    let n = 1, cur = '';
    words.forEach((w) => { const t = cur ? cur + ' ' + w : w; if (cv.measureText(t).width > room && cur) { n++; cur = w; } else cur = t; });
    return n;
  }
  const wordsIn = (s) => s.trim().split(/\s+/).filter(Boolean).length;
  const visible = (el) => el.style.display !== 'none';

  // the suggestions: every title and text that asks for more than the mood allows, titles first (the cover first),
  // then texts, in page order. Only the ones the prototype has rewrites for
  // ---- shorter versions from the site's own words (Nov 5, Alberto: it has to work on any text, in every variant). The
  // product writes them with AI; the prototype only cuts: a title to its sentences and clauses, a text to fewer paragraphs
  // or to each paragraph's first sentence. Rossi's two prepared rewrites (TITLES, TEXTS) are used when the text matches
  const tidy = (x) => x.trim().replace(/[,;:–—-]+$/, '').trim();
  function titleCuts(t, fits) {
    // a cut has to stand on its own as a title: it starts like one (a capital or a number), never mid-phrase (and, with, which…)
    const out = [], add = (x) => { x = tidy(x); if (x && x !== t && x.split(/\s+/).length >= 2 && /^[\p{Lu}\d"“‘]/u.test(x) && !out.includes(x)) out.push(x); };
    (t.match(/[^.!?]+[.!?]?/g) || [t]).forEach(add);
    t.split(/[,;:–—]|\s-\s/).forEach(add);
    let ok = out.filter(fits).sort((a, b) => b.length - a.length);
    if (!ok.length) { const w = t.split(/\s+/); for (let n = w.length - 1; n >= 2; n--) { const x = tidy(w.slice(0, n).join(' ')); if (fits(x)) { ok = [x]; break; } } }
    return ok.slice(0, 3);
  }
  function textCuts(texts, limit) {
    const words = (arr) => arr.reduce((a, x) => a + wordsIn(x), 0), opts = [];
    // cut the longest paragraphs after the first until it fits
    const cut = [], left = texts.map((x, i) => [i, x]);
    while (words(left.map((x) => x[1])) > limit && left.length > 1) { const rest = left.slice(1).sort((a, b) => wordsIn(b[1]) - wordsIn(a[1])); const drop = rest[0]; cut.push(drop[0]); left.splice(left.indexOf(drop), 1); }
    if (cut.length && words(left.map((x) => x[1])) <= limit) opts.push({ label: cut.length > 1 ? 'Cut ' + cut.length + ' paragraphs' : 'Cut one paragraph', cut });
    // keep each paragraph's first sentence
    const keep = {}; texts.forEach((x, i) => { const f = (x.match(/[^.!?]+[.!?]/) || [x])[0].trim(); if (f !== x.trim()) keep[i] = f; });
    if (Object.keys(keep).length) { const res = texts.map((x, i) => keep[i] || x); if (words(res) <= limit) opts.push({ label: 'Keep each paragraph’s first sentence', keep }); }
    return opts;
  }
  const NUM = ['', 'one way', 'two ways', 'three ways'];
  const FEEL = { subtle: 'A shorter title keeps the page calm and easy to take in.', balanced: 'A shorter title lets the page breathe, and still says it all.', expressive: 'Bold headings say more with fewer words.' };
  function conveys(tip) { const it = S.api && S.api.intent ? S.api.intent() : {}, g = window.TypeSystem ? window.TypeSystem.get() : {};
    return (it.direction ? it.brand + ' feels ' + it.direction.toLowerCase() + '. ' : '') + (FEEL[g.scale] || FEEL.balanced); }
  const DEFAULTS = [
    ['Take table bookings online', 'Guests can book a table any time, even when you’re busy in the kitchen.', 'web'],
    ['Get found on Google Maps', 'Add Rossi to Google Maps, so people nearby find you when they look for dinner.', 'map'],
    ['Ask guests for reviews', 'New guests trust what others say. A short message after a visit brings more reviews.', 'text']];
  const clip = (t) => { const w = t.trim().split(/\s+/); return w.length > 5 ? w.slice(0, 4).join(' ') + '…' : t.trim(); };

  // the suggestions: every title and text that asks for more than the headings allow, titles first (the cover first), then
  // texts, in page order. Measured live: the editor redraws Companion when the page's words change
  function tips(apiIn) {
    const api = apiIn || S.api, d = api && api.doc(), TS = window.TypeSystem;
    if (!d || !TS || !TS.MOOD_FIT) return [];
    const g = TS.get(), t = TS.sys(g), fit = TS.MOOD_FIT[g.scale] || TS.MOOD_FIT.balanced, m = api.mood();
    const room = (TS.VMIN || 360) - 2 * t.space('block-x').min, out = [];
    [...d.querySelectorAll('section h1, section h2')].filter((h) => !h.closest('blockquote, figure, [data-review], [data-reviews], footer')).forEach((h, hi) => {
      const now = h.textContent.trim(); if (!now) return;
      const px = t.style(h.tagName === 'H1' ? 'h1' : 'h2').min, n = linesOf(h, now, px, room);
      if (n <= fit.lines) return;
      const pre = TITLES[now], cover = h.tagName === 'H1' || !!h.closest('[data-hero]');
      const name = pre ? pre.name : cover ? 'cover title' : 'title “' + clip(now) + '”';
      const fits = (x) => linesOf(h, x, px, room) <= fit.lines;
      const cands = pre ? pre.opts : titleCuts(now, fits); if (!cands.length) return;
      out.push({ id: 'title:' + hi, kind: 'title', el: h, n, fit, name, where: pre ? pre.where : cover ? 'Cover, Home' : 'Title, Home',
        tip: cover ? 'Shorten your cover title' : 'Shorten a title', reason: (cover ? 'It' : '“' + clip(now) + '”') + ' takes ' + n + ' lines on phones. ' + m.Adj + ' headings read best in ' + fit.lines + ' or fewer.',
        nudge: (cover ? 'Your cover title' : 'A title') + ' takes ' + n + ' lines on phones with ' + m.adj + ' headings.',
        ask: cover ? 'Shorten my cover title' : 'Shorten the title “' + clip(now) + '”',
        intro: null, introN: cands.length,
        pick: 'Your ' + (cover ? 'cover title' : 'title') + ', ' + NUM[cands.length], pickSub: 'In your heading font, and how it fits on phones', use: 'Use this title',
        opts: cands.map((txt) => ({ txt, meta: (() => { const k = linesOf(h, txt, px, room); return k + (k === 1 ? ' line' : ' lines') + ' on phones'; })() })),
        done: (cover ? 'Cover title' : 'Title') + ' changed', kept: 'Kept your ' + (cover ? 'cover title' : 'title'), back: 'Your ' + (cover ? 'cover title' : 'title') + ' is back' });
    });
    const groups = new Map();
    d.querySelectorAll('section [data-el="text"][data-elg]').forEach((p) => {
      if (p.closest('[data-hero], [data-pcard], [data-card], footer, blockquote') || !visible(p) || !p.textContent.trim()) return;
      const k = p.dataset.elg; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(p);
    });
    groups.forEach((els, k) => {
      const texts = els.map((p) => p.textContent.trim()), n = texts.reduce((a, x) => a + wordsIn(x), 0); if (n <= fit.words) return;
      const pre = TEXTS.find((x) => texts[0].startsWith(x.starts)), sec = els[0].closest('section'), h2 = sec && sec.querySelector('h2');
      const name = pre ? pre.name : 'text' + (h2 ? ' under “' + clip(h2.textContent) + '”' : '');
      const raw = pre ? pre.opts : textCuts(texts, fit.words); if (!raw.length) return;
      const result = (o) => texts.map((x, i) => (o.cut && o.cut.includes(i)) ? null : (o.keep && o.keep[i]) || x).filter(Boolean);
      out.push({ id: 'text:' + k, kind: 'text', els, n, fit, name, where: pre ? pre.where : (h2 ? '“' + clip(h2.textContent) + '”, Home' : 'Home'),
        tip: pre ? 'Shorten your ' + pre.name : 'Shorten a text', reason: 'It runs ' + n + ' words. ' + m.Adj + ' headings read best with ' + fit.words + ' or fewer.',
        nudge: (pre ? 'Your ' + pre.name : 'A text') + ' runs ' + n + ' words, long for ' + m.adj + ' headings.',
        ask: 'Shorten my ' + name,
        intro: 'With ' + m.adj + ' headings, short texts read best. Your ' + name + ' runs ' + n + ' words. Here it is ' + NUM[raw.length] + ', in your own words:',
        pick: 'Your ' + (pre ? pre.name : 'text') + ', ' + NUM[raw.length], pickSub: pre ? pre.where : 'Fewer words, all of them yours', use: 'Use this text',
        opts: raw.map((o) => { const paras = result(o), i = (o.cut || [])[0], kk = o.keep ? Object.keys(o.keep)[0] : null;
          return { o, paras, txt: paras.join(' '), cut: i != null ? texts[i] : null, now: kk != null ? o.keep[kk] : null, meta: paras.reduce((a, x) => a + wordsIn(x), 0) + ' words in all' }; }),
        done: (pre ? 'Story' : 'Text') + ' shortened', kept: 'Kept your ' + (pre ? pre.name : 'text'), back: 'Your ' + (pre ? pre.name : 'text') + ' is back' });
    });
    return out;
  }

  // ---- applying an edit on the draft: the site's own text nodes change where they can (so the page's renderer keeps
  // owning them); a title someone edited by hand may hold several nodes, so it's rewritten whole. Undo puts it all back
  function apply(tip, opt) {
    const undo = [], el = tip.el;
    if (tip.kind === 'title') {
      if (el.childNodes.length === 1 && el.firstChild.nodeType === 3) { undo.push([el.firstChild, el.firstChild.nodeValue]); el.firstChild.nodeValue = opt.txt; }
      else { undo.push([el, { html: el.innerHTML }]); el.textContent = opt.txt; }
      arrive(el); flash(el);
    } else {
      tip.els.forEach((p, i) => {
        if (opt.o.cut && opt.o.cut.includes(i)) { undo.push([p, null, p.style.display]); p.style.display = 'none'; }
        else if (opt.o.keep && opt.o.keep[i]) { if (p.childNodes.length === 1 && p.firstChild.nodeType === 3) { undo.push([p.firstChild, p.firstChild.nodeValue]); p.firstChild.nodeValue = opt.o.keep[i]; } else { undo.push([p, { html: p.innerHTML }]); p.textContent = opt.o.keep[i]; } }
      });
      flash(tip.els[0].parentElement);
    }
    S.api.changed();
    return undo;
  }
  function revert(undo) { (undo || []).slice().reverse().forEach(([n, v, disp]) => { if (v === null) n.style.display = disp || ''; else if (v && v.html != null) { n.innerHTML = v.html; arrive(n); } else { n.nodeValue = v; arrive(n.parentElement); } }); S.api.changed(); }
  // the changed element shows in the page for a moment (CompanionKit's Highlight in the product, 997:1416)
  // the element a featured suggestion is about, tinted on the page while it's offered
  function hint(el) { const d = S.api && S.api.doc(); if (!d) return;
    if (!d.getElementById('cmp-hint-css')) { const s = d.createElement('style'); s.id = 'cmp-hint-css'; s.textContent = 'html [data-cmp-hint]{background:rgba(16,106,235,.18);box-shadow:0 0 0 6px rgba(16,106,235,.18);border-radius:4px}'; d.head.appendChild(s); }
    d.querySelectorAll('[data-cmp-hint]').forEach((x) => { if (x !== el) x.removeAttribute('data-cmp-hint'); }); if (el) el.setAttribute('data-cmp-hint', ''); }
  // plan 011: new words on the page arrive, so the reflow happens under a short blur instead of jumping
  function arrive(el) { if (!el || !el.animate) return; const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: 200, easing: 'cubic-bezier(.32,.72,0,1)' }); }
  function flash(el) {
    const d = el.ownerDocument;
    if (!d.getElementById('cmp-flash-css')) { const s = d.createElement('style'); s.id = 'cmp-flash-css';
      s.textContent = '@keyframes cmpFlash{from{box-shadow:0 0 0 4px rgba(16,106,235,.7)}to{box-shadow:0 0 0 14px rgba(16,106,235,0)}}'
        + 'html [data-cmp-flash]{border-radius:4px;animation:cmpFlash 1.2s cubic-bezier(.32,.72,0,1) 2}'
        + '@media (prefers-reduced-motion: reduce){html [data-cmp-flash]{animation:none;box-shadow:0 0 0 3px #106AEB}}';
      d.head.appendChild(s); }
    el.removeAttribute('data-cmp-flash'); void el.offsetWidth; el.setAttribute('data-cmp-flash', '');
    try { el.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' }); } catch (e) { /* older engines */ }
    setTimeout(() => el.removeAttribute('data-cmp-flash'), 2600);
  }

  // ---- the thread
  const push = (...items) => { S.thread.push(...items); };
  function act(a, i) {
    const it = S.thread[i], T = tips();
    if (a === 'ause' || a === 'alater' || a === 'amore') {
      const ac = actions().find((x) => x.id === S.tid); if (!ac) { S.api.toast('That suggestion no longer applies'); return; }
      if (a === 'alater') { S.later['a:' + ac.id] = true; say('Later'); }
      else if (a === 'amore') { S.api.openSizing(); return; }
      else { const wrap = S.host && S.host.querySelector('.cmp-featwrap'); S.using = true;
        const go = () => { S.using = false; push({ t: 'user', text: ac.ask }, { t: 'done', label: 'Done', text: ac.done, action: ac, back: ac.back }); S.focus = 'last'; say(ac.done); render(); };
        ac.run(); if (wrap) { wrap.classList.add('cmp-going'); setTimeout(go, 250); } else go(); return; }
    } else if (a === 'usebest' || a === 'others' || a === 'later') {
      const tip = T.find((x) => x.id === S.tid); if (!tip) { S.api.toast('That suggestion no longer applies'); return; }
      const drop = () => { S.thread = S.thread.filter((x) => !(x.t === 'feat' && x.tipId === tip.id)); };
      if (a === 'later') { S.later[tip.id] = true; drop(); say('Later'); }
      else if (a === 'usebest') { if (S.using) return; const opt = tip.opts[0], undo = apply(tip, opt), wrap = S.host && S.host.querySelector('.cmp-featwrap');
        const go = () => { S.using = false; drop(); push({ t: 'say', text: 'I changed your ' + tip.name + '. The old one is one Undo away.' }, { t: 'done', label: 'Done', text: tip.name.charAt(0).toUpperCase() + tip.name.slice(1) + ', “' + opt.txt + '”', undo, kind: tip.kind, back: tip.back, tip, opt });
          S.focus = 'last'; say('Done'); render(); };
        // plan 012: the page changes on the click; the card shrinks away where it stood, then its Done line rises in
        if (wrap) { S.using = true; wrap.classList.add('cmp-going'); setTimeout(go, 250); return; }
        go(); return; }
      else { S.confirmed = true; drop(); push({ t: 'user', text: 'Show me other versions' }, { t: 'agent', tipId: tip.id }, { t: 'pick', tipId: tip.id, sel: 0 }); S.focus = 'last'; }
    } else if (a === 'action') {
      const ac = actions().find((x) => x.id === i); if (!ac) { S.api.toast('That suggestion no longer applies'); return; }
      push({ t: 'user', text: ac.ask }); ac.run();
      push({ t: 'done', label: 'Done', text: ac.done, action: ac, back: ac.back }); S.focus = 'last'; say(ac.done);
    } else if (a === 'tip' || a === 'follow') {
      const tip = T.find((x) => x.id === i) || T[0]; if (!tip) { S.api.toast('That suggestion no longer applies'); return; }
      if (a === 'follow') S.thread = S.thread.filter((x) => x.t !== 'follow');
      push({ t: 'user', text: tip.ask });
      if (!S.confirmed) push({ t: 'check', tipId: tip.id }); else push({ t: 'agent', tipId: tip.id }, { t: 'pick', tipId: tip.id, sel: 0 });
      S.focus = 'last';
    } else if (a === 'confirm') {
      const m = S.api.mood();
      S.confirmed = true; S.thread[i] = { t: 'status', kind: 'ok', label: 'Confirmed', text: 'Restaurant, bookings, ' + m.adj + ' headings' };
      push({ t: 'agent', tipId: it.tipId }, { t: 'pick', tipId: it.tipId, sel: 0 }); S.focus = 'last'; say('Confirmed');
    } else if (a === 'use') {
      const tip = T.find((x) => x.id === it.tipId); if (!tip) { S.api.toast('That text has changed since'); return; }
      const opt = tip.opts[it.sel || 0], undo = apply(tip, opt);
      S.thread[i] = Object.assign({}, it, { answered: true, chose: opt.txt });
      push({ t: 'done', label: 'Done', text: tip.kind === 'title' ? 'Now “' + opt.txt + '”' : tip.done + ' to ' + opt.meta.replace(' in all', ''), undo, kind: tip.kind, back: tip.back, tip, opt });
      if (!S.askedRemember && tip.kind === 'title') { S.askedRemember = true; push({ t: 'remember' }); }
      followUp(); S.focus = 'last'; say(tip.done);
    } else if (a === 'skip') {
      const tip = T.find((x) => x.id === it.tipId);
      S.thread[i] = Object.assign({}, it, { answered: true, skipped: true });
      push({ t: 'status', kind: 'skip', label: 'Skipped', text: tip ? tip.kept : 'Kept as it is' }); followUp(); say('Skipped');
    } else if (a === 'undo') {
      if (it.action) it.action.undo(); else revert(it.undo); S.thread[i] = Object.assign({}, it, { undone: true }); say('Undone'); if (!it.action) followUp();
    } else if (a === 'redo') {
      if (it.action) { it.action.run(); S.thread[i] = Object.assign({}, it, { undone: false }); } else { S.thread[i] = Object.assign({}, it, { undone: false, undo: apply(it.tip, it.opt) }); followUp(); } say('Done');
    } else if (a === 'remember') {
      S.remembered = true; S.thread[i] = { t: 'status', kind: 'ok', label: 'Remembered', text: 'Keep titles short with ' + S.api.mood().adj + ' headings' }; say('Remembered');
    } else if (a === 'notnow') { S.thread.splice(i, 1); }
    else if (a === 'calmer') { S.api.openSizing(); }
    else if (a === 'new') { S.thread = []; S.confirmed = false; S.later = {}; S.offered = {}; S.focus = 'top'; }
    else if (a === 'history' || a === 'generic' || a === 'send' || a === 'attach' || a === 'mic' || a === 'thumb') S.api.toast('Only the content suggestions work in this prototype');
    else if (a === 'close') { S.api.close(); return; }
    render();
  }
  // after an answer, the next suggestion follows, one at a time, the way the Wayfinder ranks them
  function followUp() { S.thread = S.thread.filter((x) => x.t !== 'follow'); const next = tips()[0]; if (next) push({ t: 'follow', tipId: next.id }); }
  function say(t) { S.say = t; const l = S.host && S.host.querySelector('.cmp-live'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = t; }, 50); } }

  // ---- markup, in CompanionKit's parts
  const btn = (style, label, a, i, extra) => '<span class="cmp-btn" data-style="' + style + '" data-label="' + esc(label) + '" data-act="' + a + '" data-i="' + (i == null ? '' : i) + '"' + (extra || '') + '></span>';
  const iconBtn = (a, label, icon) => '<button type="button" class="cmp-ib" data-act="' + a + '" aria-label="' + esc(label) + '" data-tip="' + esc(label) + '">' + icon + '</button>';
  const status = (kind, label, text) => '<div class="cmp-status" data-kind="' + kind + '"><span class="cmp-mark">' + IC.tick + '</span><span class="cmp-sl">' + esc(label) + '</span><span class="cmp-st">' + esc(text) + '</span></div>';
  const head = (title, sub) => '<div class="cmp-chead"><h3 class="cmp-ctitle" tabindex="-1">' + esc(title) + '</h3>' + (sub ? '<p class="cmp-csub">' + esc(sub) + '</p>' : '') + '</div>';
  const tipRow = (tip, a) => '<button type="button" class="cmp-tip" data-act="' + a + '" data-i="' + tip.id + '"><span class="cmp-tile">' + (tip.kind === 'title' ? IC.title : tip.kind === 'action' ? IC.magic : IC.text) + '</span><span class="cmp-tiptx"><span class="cmp-tipt">' + esc(tip.tip) + '</span><span class="cmp-tipr">' + esc(tip.reason) + '</span></span></button>';
  const rowPlain = (label, icon) => '<button type="button" class="cmp-row" data-act="generic"><span class="cmp-tile">' + icon + '</span><span>' + esc(label) + '</span></button>';

  const actions = () => { try { return (S.api && S.api.actions ? S.api.actions() : []).map((a) => Object.assign({ kind: 'action' }, a)); } catch (e) { return []; } };
  // the featured rewrite (CompanionKit's One featured tip and Rewrite a headline): the shorter version, why it fits what the
  // site wants to convey, the measured fact, and Later, Other versions, Use this
  function featHTML(feat) { const best = feat.opts[0], fonts = fontsOf();
    return '<div class="cmp-featwrap"><div class="cmp-feat" data-feat="' + esc(feat.id) + '"><div class="cmp-feathead"><span class="cmp-tile">' + IC.magic + '</span><span class="cmp-tipt">' + (feat.name === 'cover title' ? 'A shorter cover title' : 'A shorter title') + '</span></div>'
      + '<p class="cmp-featnew" style="font-family:' + esc(fonts.head) + ';font-weight:' + fonts.headW + '">' + esc(best.txt) + '</p>'
      + '<p class="cmp-featwhy">' + esc(conveys(feat)) + '</p><p class="cmp-featfact">Now ' + feat.n + ' lines on phones, then ' + esc(best.meta.replace(' on phones', '')) + '.</p>'
      + '<div class="cmp-featfoot">' + btn('subtle', 'Later', 'later', null, ' data-tid="' + esc(feat.id) + '"') + btn('subtle', 'Other versions', 'others', null, ' data-tid="' + esc(feat.id) + '"') + btn('primary', 'Use this', 'usebest', null, ' data-tid="' + esc(feat.id) + '"') + '</div></div></div>'; }
  // a small page in the theme, drawn from the type system: a Title over text, two blocks apart by their real block padding,
  // so Now and Suggested show what changes (the panel's Sizing faces, after index.html's pageFace)
  function miniPage(v) { const TS = window.TypeSystem, CS = window.ColorSystem; if (!TS) return '';
    let c = {}; try { c = CS.theme.card(CS.theme.get().palette); } catch (e) { c = { bg: '#fff', ink: '#000', body: '#333', hf: 'serif', hw: 500 }; }
    let A = null; try { A = CS.theme.colors('Alternate', 'Tinted'); } catch (e) { /* no engine */ } A = A || { bg: '#eee', heading: c.ink, body: c.body };
    const t = TS.sys(Object.assign({}, TS.get(), v)), b0 = TS.sys(Object.assign({}, TS.defaults(), { density: 'compact' })).space('block-y').max;
    const py = Math.round(8 * t.space('block-y').max / b0), body = t.style('body').max, f = 6 * body / 20, hs = Math.round(f * t.style('h3').max / body);
    const ln = (w, col) => '<i style="display:block;width:' + w + '%;height:' + Math.max(2, Math.round(f * 0.5)) + 'px;margin-top:' + Math.round(f * 0.7) + 'px;border-radius:1px;background:color-mix(in srgb,' + col + ' 45%,transparent)"></i>';
    const blk = (title, col, lc, bg) => '<span style="display:block;padding:' + py + 'px 10px;' + (bg ? 'background:' + bg + ';flex:1 0 auto' : '') + '"><span style="display:block;font-family:' + esc(c.hf) + ';font-weight:' + c.hw + ';font-size:' + hs + 'px;line-height:1;color:' + col + ';white-space:nowrap">' + title + '</span>' + ln(80, lc) + ln(56, lc) + '</span>';
    return '<span class="cmp-mini" style="background:' + c.bg + '">' + blk('Title', c.ink, c.body || c.ink) + blk('Title', A.heading || c.ink, A.body || c.body || c.ink, A.bg) + '</span>'; }
  // the visual of an action's card: Now and Suggested pages for Optimize, today's and the new text for the switch
  function actVisual(a) {
    if (a.card.visual === 'optimize') return '<div class="cmp-nowsug"><figure>' + miniPage(a.card.from) + '<figcaption>Now</figcaption></figure><span class="cmp-arrow" aria-hidden="true">→</span><figure>' + miniPage(a.card.to) + '<figcaption>Suggested</figcaption></figure></div>';
    if (a.card.visual === 'switch') { const fonts = fontsOf();
      const side = (label, big, small, lh, w) => '<figure><span class="cmp-mini" style="padding:10px;justify-content:flex-start;gap:4px"><span style="font-family:' + esc(fonts.head) + ';font-weight:' + fonts.headW + ';font-size:' + big + 'px;line-height:' + lh + '">The table is set.</span><span style="font-size:' + small + 'px;line-height:1.5;color:#555;max-width:' + w + '">Traditional Italian cooking made with the care it deserves.</span></span><figcaption>' + label + '</figcaption></figure>';
      return '<div class="cmp-nowsug">' + side('Today', 13, 6.5, 1.3, '100%') + '<span class="cmp-arrow" aria-hidden="true">→</span>' + side('New', 19, 9, 1.05, '22ch') + '</div>'; }
    return ''; }
  function actHTML(a) {
    return '<div class="cmp-featwrap"><div class="cmp-feat" data-act-feat="' + esc(a.id) + '"><div class="cmp-feathead"><span class="cmp-tile">' + IC.magic + '</span><span class="cmp-tipt">' + esc(a.card.head) + '</span></div>'
      + actVisual(a) + '<p class="cmp-featbig">' + esc(a.card.big) + '</p><p class="cmp-featwhy">' + esc(a.card.why) + '</p>'
      + (a.card.facts && a.card.facts.length ? '<ul class="cmp-featfacts">' + a.card.facts.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '')
      + '<div class="cmp-featfoot">' + btn('subtle', 'Later', 'alater', null, ' data-tid="' + esc(a.id) + '"') + (a.card.more ? btn('subtle', a.card.more, 'amore', null, ' data-tid="' + esc(a.id) + '"') : '') + btn('primary', a.card.use || 'Use this', 'ause', null, ' data-tid="' + esc(a.id) + '"') + '</div></div></div>'; }
  // (Nov 5, Alberto: "Companion should make the suggestions at the right time") a moment: the owner stopped editing a text, or
  // closed Appearance after changing the headings. The first title that no longer fits, and hasn't been offered in this chat,
  // comes forward: inside the conversation when Companion is open, or back to the editor (for its message by the launcher)
  // when it's closed
  const MOMENT = { edit: (t) => 'Your ' + t.name + ' is longer now. I have a shorter one, in your own words:', appearance: (t) => 'With your new headings, your ' + t.name + ' runs long. Here’s a shorter one:' };
  function moment(api, kind) { if (api) S.api = api;
    const tip = tips().find((t) => t.kind === 'title' && !S.later[t.id] && !S.offered[t.id]); if (!tip) return null;
    S.offered[tip.id] = true;
    if (!S.host) return tip;
    if (S.thread.length) { push({ t: 'say', text: (MOMENT[kind] || MOMENT.edit)(tip) }, { t: 'feat', tipId: tip.id }); S.focus = 'last'; }
    render(); return 'shown'; }
  function home() {
    const T = tips(), first = T[0], A = actions(), only = A.some((a) => a.only);
    // (Nov 5, Alberto) Companion here suggests only typography and spacing: the stage's own offer, then words that don't fit
    // the headings, one at a time; nothing about the rest of the business
    // words that don't fit come first: they're what the owner just did
    const rows = (only || !first ? '' : tipRow(first, 'tip')) + (only ? A.filter((a) => a.only) : A).map((a) => tipRow(a, 'action')).join('');
    const n = (only ? A.filter((a) => a.only).length : A.length) + (only || !first ? 0 : 1);
    // Today and January (Nov 5, Alberto): Companion's own suggestions, as CompanionKit's Wayfinder has them (675:3409, B): at
    // most three, each with its reason, picked for Rossi and its goal, more table bookings. No typography here: Today has
    // today's type, and January's new type needs nothing from the owner
    if (S.api && S.api.stage && ['today', 'jan'].includes(S.api.stage())) return '<div class="cmp-welcome"><h2 class="cmp-hi" tabindex="-1">Hi Sam, how can I help you today?</h2><p>Ask me about anything to do with your website or business.</p></div>'
      + '<section class="cmp-sec" aria-label="Next for your business"><h3 class="cmp-label">Next for your business</h3><div class="cmp-list">'
      + DEFAULTS.map(([t, r, ic]) => '<button type="button" class="cmp-tip" data-act="generic"><span class="cmp-tile">' + IC[ic] + '</span><span class="cmp-tiptx"><span class="cmp-tipt">' + esc(t) + '</span><span class="cmp-tipr">' + esc(r) + '</span></span></button>').join('')
      + '</div></section>';
    // (Nov 5, Alberto) the improvement already written: a title that doesn't fit is offered as one featured card, after
    // CompanionKit's One featured tip (675:3409, E) and Rewrite a headline (913:18547): the rewrite, why it fits what the
    // site wants to convey, Use this (it applies at once, with Undo), Other versions, and Later
    const feat = !only && first && first.kind === 'title' && !S.later[first.id] ? first : null;
    const afeat = !feat ? (only ? A.filter((a) => a.only) : A).find((a) => a.card && !S.later['a:' + a.id]) : null;
    if (afeat) { const rest = A.filter((a) => a !== afeat && !only).map((a) => tipRow(a, 'action')).join('') + (first && first.kind !== 'title' ? tipRow(first, 'tip') : '');
      return '<div class="cmp-welcome"><h2 class="cmp-hi" tabindex="-1">Hi Sam, I have an idea for Rossi</h2></div>' + actHTML(afeat)
        + (rest ? '<section class="cmp-sec" aria-label="More suggestions"><h3 class="cmp-label">Also</h3><div class="cmp-list">' + rest + '</div></section>' : ''); }
    if (feat) { S.offered[feat.id] = true; const rest = (only ? A.filter((a) => a.only) : A).map((a) => tipRow(a, 'action')).join('');
      return '<div class="cmp-welcome"><h2 class="cmp-hi" tabindex="-1">Hi Sam, I have an idea for your ' + esc(feat.name) + '</h2></div>' + featHTML(feat)
        + (rest ? '<section class="cmp-sec" aria-label="More suggestions"><h3 class="cmp-label">Also</h3><div class="cmp-list">' + rest + '</div></section>' : ''); }
    const welcome = '<div class="cmp-welcome"><h2 class="cmp-hi" tabindex="-1">' + (n ? 'Hi Sam, here’s how your text could read better' : 'Hi Sam, your text reads well') + '</h2><p>' + (n ? 'I look at your site’s typography and spacing, and suggest what fits how you want to come across.' : 'Your typography and spacing fit how you want to come across. I’ll suggest something when that changes, like a longer title or bolder headings.') + '</p></div>';
    return welcome + (n ? '<section class="cmp-sec" aria-label="Suggestions"><h3 class="cmp-label">' + (n === 1 ? 'My suggestion' : 'My suggestions') + '</h3><div class="cmp-list">' + rows + '</div></section>' : '');
  }

  function item(it, i, T, fonts) {
    const tip = it.tipId ? T.find((x) => x.id === it.tipId) || it.tipSnap : null;
    if (tip && it.tipId) it.tipSnap = tip;
    const m = S.api.mood();
    if (it.t === 'say') return '<p class="cmp-agent">' + esc(it.text) + '</p>';
    if (it.t === 'feat') return tip && !S.later[tip.id] ? featHTML(tip) : '';
    if (it.t === 'user') return '<div class="cmp-user"><p class="cmp-bubble">' + esc(it.text) + '</p></div>';
    if (it.t === 'status') return status(it.kind, it.label, it.text);
    // the intro says why in what the site wants to convey (Nov 5, Alberto), then what follows
    if (it.t === 'agent') return tip ? '<p class="cmp-agent">' + esc(tip.intro || (conveys(tip) + ' Here ' + (tip.introN === 1 ? 'is one way' : 'are ' + NUM[tip.introN].replace(' ways', '') + ' ways') + ' to say it shorter, from your own words, set as it will look:')) + '</p>' : '';
    if (it.t === 'check') return '<div class="cmp-card">' + head('Before I start, is this right?', tip ? tip.where : '')
      + '<dl class="cmp-facts">' + PROFILE.concat([['Headings', m.fact]]).map(([k, v]) => '<div class="cmp-fact"><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>'
      + '<div class="cmp-foot">' + btn('primary', 'Looks right', 'confirm', i) + '</div></div>';
    if (it.t === 'pick') {
      if (!tip) return '';
      if (it.answered) return '';
      const rows = tip.opts.map((o, k) => '<button type="button" role="radio" class="cmp-opt" aria-checked="' + (k === (it.sel || 0)) + '" tabindex="' + (k === (it.sel || 0) ? 0 : -1) + '" data-act="sel" data-i="' + i + '" data-k="' + k + '">'
        + (tip.kind === 'title' ? '<span class="cmp-optt" style="font-family:' + esc(fonts.head) + ';font-weight:' + fonts.headW + '">' + esc(o.txt) + '</span>'
          : '<span class="cmp-optp" style="font-family:' + esc(fonts.body) + '">' + (o.cut ? '<s>' + esc(o.cut) + '</s>' : esc(o.now)) + '</span>')
        + '<span class="cmp-optm">' + esc((tip.kind === 'text' ? o.o.label + ' · ' : '') + o.meta) + '</span></button>').join('');
      const calm = tip.kind === 'title' && m.key !== 'subtle'
        ? '<div class="cmp-alt"><p>Want to keep it as it is? Calmer headings fit it too.</p>' + btn('subtle', 'Open Sizing', 'calmer', i) + '</div>' : '';
      return '<div class="cmp-card">' + head(tip.pick, tip.pickSub) + '<div class="cmp-opts" role="radiogroup" aria-label="' + esc(tip.pick) + '">' + rows + '</div>'
        + '<div class="cmp-foot">' + btn('subtle', 'Skip', 'skip', i) + btn('primary', tip.use, 'use', i) + '</div></div>' + calm;
    }
    if (it.t === 'done') return (it.undone ? status('skip', 'Undone', it.back) : status('ok', it.label, it.text))
      + '<div class="cmp-acts">' + iconBtn('thumb', 'Not helpful', IC.down) + iconBtn('thumb', 'Helpful', IC.up)
      + '<button type="button" class="cmp-undo" data-act="' + (it.undone ? 'redo' : 'undo') + '" data-i="' + i + '">' + (it.undone ? 'Redo' : 'Undo') + '</button></div>';
    if (it.t === 'remember') return '<div class="cmp-card">' + head('Remember this for next time?', 'Keep titles short with ' + m.adj + ' headings.')
      + '<div class="cmp-foot">' + btn('subtle', 'Not now', 'notnow', i) + btn('primary', 'Yes, remember', 'remember', i) + '</div></div>';
    if (it.t === 'follow') { const nt = T.find((x) => x.id === it.tipId); return nt ? '<section class="cmp-sec" aria-label="Next"><h3 class="cmp-label">Next</h3><div class="cmp-list">' + tipRow(nt, 'follow') + '</div></section>' : ''; }
    return '';
  }

  function fontsOf() {
    const d = S.api && S.api.doc(), o = { head: 'serif', headW: 600, body: 'sans-serif' }; if (!d) return o;
    const h = d.querySelector('section h1, section h2'), p = d.querySelector('section p');
    if (h) { const cs = d.defaultView.getComputedStyle(h); o.head = cs.fontFamily; o.headW = cs.fontWeight; }
    if (p) o.body = d.defaultView.getComputedStyle(p).fontFamily;
    return o;
  }

  // ---- render, with JUI's Button mounted into each placeholder
  const unmount = () => { S.roots.splice(0).forEach((r) => { try { r.unmount(); } catch (e) { /* gone */ } }); };
  function mountButtons() {
    const J = window.JimdoUI, R = window.React, D = window.ReactDOM; if (!S.host) return;
    if (!J || !J.Button || !R || !D || !D.createRoot) { setTimeout(mountButtons, 200); return; }
    S.host.querySelectorAll('.cmp-btn:not(.cmp-juihost)').forEach((b) => {
      b.classList.add('cmp-juihost');
      const r = D.createRoot(b); S.roots.push(r);
      const props = { buttonStyle: b.dataset.style, buttonSize: 'small', noGutter: true, onClick: () => { S.tid = b.dataset.tid || null; act(b.dataset.act, b.dataset.i === '' ? null : +b.dataset.i); } };
      (D.flushSync || ((f) => f()))(() => r.render(R.createElement(J.Button, props, b.dataset.label)));
    });
  }
  function render() {
    if (!S.host || !S.api) return;
    unmount();
    const body = S.host.querySelector('.cmp-body'), T = tips(), fonts = fontsOf();
    const html = S.thread.length ? S.thread.map((it, i) => { const h = item(it, i, T, fonts); return h ? '<div class="cmp-item' + (i >= S.seen ? ' cmp-in' : '') + '">' + h + '</div>' : ''; }).join('') : home();
    body.innerHTML = html; S.seen = S.thread.length;
    hint(!S.thread.length && body.querySelector('.cmp-feat') ? (T.find((x) => x.id === body.querySelector('.cmp-feat').dataset.feat) || {}).el : null);
    mountButtons();
    if (S.focus === 'last') { const cards = body.querySelectorAll('.cmp-ctitle, .cmp-sl'); const f = cards[cards.length - 1]; requestAnimationFrame(() => { body.scrollTo({ top: body.scrollHeight, behavior: reduce() ? 'auto' : 'smooth' }); if (f && f.classList.contains('cmp-ctitle')) f.focus({ preventScroll: true }); }); }
    else if (S.focus === 'top') { const h = body.querySelector('.cmp-hi'); if (h) h.focus({ preventScroll: true }); body.scrollTop = 0; }
    S.focus = null;
  }

  const CSS = `
.cmp{position:relative;display:flex;flex-direction:column;height:100%;min-height:0;background:#fff;border-left:1px solid #e6e6e6;box-sizing:border-box;color:#000;font-family:inherit}
.cmp *{box-sizing:border-box}
.cmp-head{flex:none;display:flex;align-items:center;justify-content:space-between;gap:8px;height:48px;padding:8px 16px}
.cmp-head>div{display:flex;gap:8px}
.cmp-ib{position:relative;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;padding:0;border:0;border-radius:8px;background:transparent;color:#000;cursor:pointer;transition:background-color 150ms ease}
@media (hover:hover){.cmp-ib:hover{background:rgba(0,0,0,.04)}}
.cmp-ib:active{background:rgba(0,0,0,.08)}
.cmp :is(button,[tabindex]):focus-visible{outline:2px solid #004ced;outline-offset:1px}
.cmp [tabindex="-1"]:focus{outline:none}
.cmp-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:24px;padding:16px}
.cmp-item{display:flex;flex-direction:column;gap:12px}
.cmp-in{animation:cmpIn 200ms cubic-bezier(.32,.72,0,1) both}
@keyframes cmpIn{from{opacity:0;transform:translateY(4px)}}
@keyframes cmpFade{from{opacity:0}}
@media (prefers-reduced-motion:reduce){.cmp-in{animation:cmpFade 200ms ease both}}
.cmp-welcome{display:flex;flex-direction:column;gap:4px}
.cmp-hi{margin:0;font-size:18px;line-height:1.4;font-weight:500}
.cmp-welcome p{margin:0;font-size:16px;line-height:24px}
.cmp-sec{display:flex;flex-direction:column;gap:16px}
.cmp-label{margin:0;font-size:14px;line-height:22px;font-weight:500;color:#6d6d6d}
.cmp-list{display:flex;flex-direction:column;gap:4px;margin:0 -8px}
.cmp-plain{gap:12px;margin:-4px -8px}
.cmp-tip,.cmp-row{display:flex;align-items:flex-start;gap:12px;width:100%;padding:8px;border:0;border-radius:8px;background:transparent;color:#000;font:inherit;text-align:left;cursor:pointer;transition:background-color 150ms ease}
.cmp-row{align-items:center;padding:4px 8px;font-size:16px;line-height:24px}
@media (hover:hover){.cmp-tip:hover,.cmp-row:hover{background:#f8f8f8}}
.cmp-tip:active,.cmp-row:active{background:#f2f2f2}
.cmp-tile{flex:none;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:#eff0ff;color:#001453}
.cmp-tiptx{display:flex;flex-direction:column;gap:2px;min-width:0}
.cmp-tipt{font-size:14px;line-height:18px;font-weight:500}
.cmp-tipr{font-size:14px;line-height:18px;color:#6d6d6d}
.cmp-featwrap{display:grid;grid-template-rows:1fr;opacity:1;transition:grid-template-rows 250ms cubic-bezier(.32,.72,0,1),opacity 200ms cubic-bezier(.32,.72,0,1)}
.cmp-featwrap>.cmp-feat{min-height:0;overflow:hidden;transition:padding 250ms cubic-bezier(.32,.72,0,1)}
.cmp-featwrap.cmp-going{grid-template-rows:0fr;opacity:0}
.cmp-featwrap.cmp-going>.cmp-feat{padding-top:0;padding-bottom:0}
@media (prefers-reduced-motion:reduce){.cmp-featwrap{transition:opacity 200ms ease}.cmp-featwrap.cmp-going{grid-template-rows:1fr}}
.cmp-feat{display:flex;flex-direction:column;gap:8px;padding:16px;border-radius:12px;background:#eff0ff}
.cmp-feathead{display:flex;align-items:center;gap:12px}
.cmp-feathead .cmp-tile{background:#ffffff}
.cmp-featbig{margin:4px 0 0;font-size:18px;line-height:24px;font-weight:500;color:#001453}
.cmp-featfacts{margin:0;padding-left:18px;font-size:14px;line-height:22px;color:#000}
.cmp-featfacts li+li{margin-top:2px}
.cmp-nowsug{display:flex;align-items:center;gap:8px;margin:4px 0}
.cmp-nowsug figure{flex:1 1 0;margin:0;display:flex;flex-direction:column;gap:4px;min-width:0}
.cmp-nowsug figcaption{font-size:12px;line-height:16px;color:#6d6d6d;text-align:center}
.cmp-arrow{flex:none;color:#6d6d6d;font-size:14px}
.cmp-mini{display:flex;flex-direction:column;height:96px;overflow:hidden;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);background:#fff}
.cmp-featnew{margin:4px 0 0;font-size:22px;line-height:1.25;color:#001453}
.cmp-featwhy{margin:0;font-size:14px;line-height:22px;color:#000}
.cmp-featfact{margin:0;font-size:12px;line-height:16px;color:#6d6d6d}
.cmp-featfoot{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:8px}
.cmp-user{display:flex;justify-content:flex-end}
.cmp-bubble{margin:0;max-width:300px;padding:12px 16px;background:#f8f8f8;border-radius:24px 0 24px 24px;font-size:16px;line-height:24px}
.cmp-agent{margin:0;font-size:16px;line-height:24px}
.cmp-card{display:flex;flex-direction:column;gap:16px;padding:16px;border:1px solid #e6e6e6;border-radius:12px;background:#fff}
.cmp-chead{display:flex;flex-direction:column;gap:4px;padding-right:24px}
.cmp-ctitle{margin:0;font-size:16px;line-height:20px;font-weight:500}
.cmp-ctitle:focus{outline:none}
.cmp-csub{margin:0;font-size:14px;line-height:22px;color:#6d6d6d}
.cmp-facts{margin:0;padding:4px;background:#f8f8f8;border-radius:8px}
.cmp-fact{display:flex;flex-direction:column;gap:2px;padding:6px 40px 6px 8px;border-radius:8px;font-size:14px;line-height:22px}
.cmp-fact dt{color:#6d6d6d}
.cmp-fact dd{margin:0}
.cmp-foot{display:flex;justify-content:flex-end;align-items:center;gap:8px}
.cmp-opts{display:flex;flex-direction:column;gap:4px}
.cmp-opt{display:flex;flex-direction:column;gap:2px;width:100%;padding:10px 12px;border:0;border-radius:8px;background:#f8f8f8;color:#000;text-align:left;cursor:pointer;font:inherit;transition:background-color 150ms ease}
@media (hover:hover){.cmp-opt:hover{background:#f2f2f2}}
.cmp-opt[aria-checked="true"]{background:#eff0ff;color:#001453}
.cmp-optt{font-size:20px;line-height:1.3}
.cmp-optp{font-size:14px;line-height:20px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.cmp-optp s{color:#6d6d6d;text-decoration-thickness:1px}
.cmp-optm{font-size:12px;line-height:16px;color:#6d6d6d}
.cmp-opt[aria-checked="true"] .cmp-optm{color:#001453;opacity:.75}
.cmp-alt{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:-12px;padding:0 4px}
.cmp-alt p{margin:0;font-size:14px;line-height:22px;color:#6d6d6d}
.cmp-alt .cmp-btn{flex:none}
.cmp-status{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:14px;line-height:22px}
.cmp-mark{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;color:#00260d}
.cmp-status[data-kind="skip"] .cmp-mark{color:#6d6d6d}
.cmp-sl{flex:none;font-weight:500;color:#00260d}
.cmp-status[data-kind="skip"] .cmp-sl{color:#6d6d6d}
.cmp-st{min-width:0;color:#6d6d6d}
.cmp-acts{display:flex;align-items:center;gap:0;margin:-8px 0 0 -8px}
.cmp-acts .cmp-ib{color:#6d6d6d}
.cmp-undo{height:32px;padding:0 8px;border:0;border-radius:8px;background:transparent;color:#6d6d6d;font:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:background-color 150ms ease}
@media (hover:hover){.cmp-undo:hover{background:rgba(0,0,0,.04)}}
.cmp-foot2{flex:none;display:flex;flex-direction:column;gap:8px;padding:0 12px 12px}
.cmp-input{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid #e6e6e6;border-radius:12px;background:#fff}
.cmp-input textarea{display:block;width:100%;height:32px;padding:8px 8px 0;border:0;resize:none;font:inherit;font-size:16px;line-height:24px;color:#000;background:transparent}
.cmp-input textarea::placeholder{color:#6d6d6d}
.cmp-input textarea:focus{outline:none}
.cmp-input:focus-within{border-color:#004ced}
.cmp-iacts{display:flex;justify-content:space-between}
.cmp-note{margin:0;text-align:center;font-size:12px;line-height:19px;color:#6d6d6d}
.cmp-note a{color:#004ced;text-decoration:none}
.cmp-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

  function mount(host, api) {
    if (!document.getElementById('cmp-css')) { const s = document.createElement('style'); s.id = 'cmp-css'; s.textContent = CSS; document.head.appendChild(s); }
    if (S.host === host && S.api) { S.api = api; render(); return; }
    S.host = host; S.api = api; S.seen = S.thread.length; S.focus = 'top';
    host.innerHTML = '<div class="cmp">'
      + '<div class="cmp-live" aria-live="polite" aria-atomic="true"></div>'
      + '<div class="cmp-head"><div>' + iconBtn('new', 'New chat', IC.newChat) + iconBtn('history', 'History', IC.history) + '</div><div>' + iconBtn('close', 'Close Companion', IC.minimize) + '</div></div>'
      + '<div class="cmp-body"></div>'
      + '<div class="cmp-foot2"><div class="cmp-input"><textarea rows="1" aria-label="Message Companion" placeholder="How can I help your business?"></textarea>'
      + '<div class="cmp-iacts">' + iconBtn('attach', 'Add files', IC.plus) + iconBtn('mic', 'Dictate', IC.mic) + '</div></div>'
      + '<p class="cmp-note"><a href="#" data-act="mistakes">AI can make mistakes.</a> Please review the results.</p></div></div>';
    host.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b || !host.contains(b) || b.classList.contains('cmp-btn')) return;
      e.preventDefault();
      const a = b.dataset.act, i = b.dataset.i;
      if (a === 'sel') { const it = S.thread[+i]; if (it) { it.sel = +b.dataset.k; render(); const r = host.querySelectorAll('.cmp-opt')[it.sel]; if (r) r.focus(); } return; }
      if (a === 'mistakes') { S.api.toast('Only the content suggestions work in this prototype'); return; }
      act(a, (a === 'tip' || a === 'follow' || a === 'action') ? i : (i === '' || i == null ? null : +i));
    });
    // arrow keys move the choice, like every radio group in the CMS
    host.addEventListener('keydown', (e) => {
      const r = e.target.closest && e.target.closest('.cmp-opt');
      if (r && /^(ArrowDown|ArrowUp|ArrowRight|ArrowLeft|Home|End)$/.test(e.key)) {
        e.preventDefault(); const it = S.thread[+r.dataset.i], n = host.querySelectorAll('.cmp-opt').length;
        it.sel = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : ((it.sel || 0) + (/Down|Right/.test(e.key) ? 1 : -1) + n) % n;
        render(); const f = host.querySelectorAll('.cmp-opt')[it.sel]; if (f) f.focus();
      }
      if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); S.api.toast('Only the content suggestions work in this prototype'); }
      if (e.key === 'Escape') S.api.close();
    });
    render();
    if (S.pending) { const id = S.pending; S.pending = null; S.thread = []; act('tip', id); }
  }
  function unmountPanel() { unmount(); S.host = null; }
  // the CMS calls this when a setting, the mood, or the page changes
  // a redraw waits while the featured card collapses (plan 012): go() draws once it's done
  function update() { if (S.host && S.api && !S.using) render(); }

  // open on a suggestion (from the editor's Shorten with Companion): at once when mounted, else on the next mount
  function start(id) { if (S.host && S.api) { S.thread = []; act('tip', id); } else S.pending = id; }
  window.CompanionPanel = { mount, update, start, moment, unmount: unmountPanel, tips: (api) => tips(api), reset: () => { S.thread = []; S.confirmed = false; S.askedRemember = false; S.remembered = false; S.later = {}; S.offered = {}; } };
})();
