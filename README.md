# 🚀 Cosmos Explorer 3D
**Ročníková práce — Webové technologie (2. ročník)**  
**Autor:** Tomáš Vrabec  
**Živý web:** [https://tomasvrabec.github.io/space_explorer/html/](https://tomasvrabec.github.io/space_explorer/html/)

> Interaktivní 3D simulace sluneční soustavy v reálném čase. Prozkoumejte všechny planety, upravte rychlost času, vstupte do atmosféry každého světa a poslouchejte syntetizované vesmírné zvuky — vše bez jediného externího obrázku nebo zvukového souboru.

---

## 📁 Použité technologie

| Technologie | Využití |
|-------------|---------|
| **HTML5** | Sémantická struktura, ARIA, JSON-LD |
| **CSS3** | 3D transformace, Flexbox, glassmorphism, animace |
| **Vanilla JavaScript ES6+** | Herní smyčka, 3D kamera, fyzika orbit |
| **Web Audio API** | Syntetizované zvuky bez externích souborů |
| **Google Fonts** | Space Mono, Syncopate |

**IDE:** Visual Studio Code + rozšíření Live Server  
**Žádné frameworky** — bez React, Vue, Bootstrap, Tailwind ani jiných knihoven.

---

## 📂 Adresářová struktura

```
space_explorer/
│
├── html/
│   └── index.html          # Hlavní HTML stránka (vstupní bod)
│
├── css/
│   └── style.css           # Veškeré styly, 3D animace, glassmorphism
│
├── js/
│   └── script.js           # Herní engine, kamera, fyzika, zvuky, HUD
│
├── images/                 # Screenshoty pro dokumentaci (galerie)
│
├── robots.txt              # Instrukce pro vyhledávací roboty
├── sitemap.xml             # Mapa webu pro SEO
└── README.md               # Tato dokumentace
```

---

## 🔧 Technický rozbor

### 1. ⚡ Výkon (Performance)

**Teoretický popis:**  
Klíčovým cílem bylo eliminovat všechny HTTP požadavky na obrázky a zvuky. Planety jsou vykresleny čistými CSS gradienty (`radial-gradient`, `repeating-linear-gradient`), hvězdné pozadí a mlhoviny jsou renderovány na HTML5 `<canvas>`. Zvuky jsou generovány za běhu pomocí Web Audio API — žádné `.mp3` soubory se nestahují. Aby animace neblokovala hlavní vlákno, používám `requestAnimationFrame` místo `setInterval`. Dávkové operace do DOMu jsou prováděny přes `DocumentFragment`, čímž se minimalizuje počet reflow operací.

```javascript
// Minimalizace DOM reflow — vše vloženo najednou přes fragment
const frag = document.createDocumentFragment();
Object.keys(wrappers).forEach(id => {
    const blip = document.createElement('div');
    blip.className = 'blip';
    blip.style.left = `${50 + (x * radarScale)}%`;
    blip.style.top  = `${50 + (y * radarScale)}%`;
    frag.appendChild(blip);
});
radarBlips.appendChild(frag); // Jediný DOM zápis místo N zápisů
```

```css
/* Planety bez jediného obrázku — pouze CSS gradienty */
.earth-sphere {
    background:
        radial-gradient(circle at 60% 40%, #228b22 0%, transparent 25%),
        radial-gradient(circle at 20% 70%, #228b22 0%, transparent 30%),
        radial-gradient(circle at 30% 30%, #4da6ff, #003399, #001133);
}
```

---

### 2. 🔍 SEO

**Teoretický popis:**  
SEO (Search Engine Optimization) zajišťuje, že vyhledávače jako Google dokáží stránku správně indexovat a zobrazit. Použil jsem sémantické HTML5 elementy (`<main>`, `<header>`, `<aside>`), správnou hierarchii nadpisů (jediné `<h1>`), kompletní sadu `<meta>` tagů, `robots.txt` pro instrukce crawlerům a `sitemap.xml` pro mapu webu. Strukturovaná data ve formátu JSON-LD pomáhají Googlu pochopit typ stránky.

```html
<!-- Strukturovaná data — říkáme Googlu, co stránka je -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Cosmos Explorer 3D",
  "applicationCategory": "EducationalApplication",
  "author": { "@type": "Person", "name": "Tomáš Vrabec" }
}
</script>

<!-- Kompletní meta tagy -->
<meta name="description" content="Interaktivní 3D simulace sluneční soustavy.">
<meta name="keywords"    content="vesmír, 3D, simulace, planety, HTML5">
<meta name="robots"      content="index, follow">
```

```xml
<!-- sitemap.xml — mapa webu pro vyhledávače -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tomasvrabec.github.io/space_explorer/html/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

### 3. ♿ Přístupnost (Accessibility)

**Teoretický popis:**  
Přístupnost (WCAG 2.1) zajišťuje, že web mohou používat i lidé s hendikepem — například nevidomí uživatelé se čtečkami obrazovky nebo lidé ovládající web pouze klávesnicí. Každá planeta je implementována jako `<button>` (ne `<div>`), takže je přirozeně focusovatelná klávesnicí. `aria-label` popisuje obsah pro čtečky. Dynamické změny (výběr planety, pauza) jsou oznamovány přes `aria-live` region.

```html
<!-- Planety jako focusovatelné <button> s aria-label -->
<button class="planet earth" aria-label="Země">
    <div class="planet-sphere earth-sphere"></div>
    <span class="planet-name">ZEMĚ</span>
</button>

<!-- Live region — čtečky obrazovky oznamují změny -->
<div id="aria-live" class="visually-hidden" aria-live="assertive"></div>

<!-- HUD panel jako dialog s aria atributy -->
<aside id="hud-panel" role="dialog" aria-labelledby="hud-title" aria-hidden="true">
```

```javascript
// Oznamování změn čtečkám obrazovky
liveRegion.textContent = `Zaměřeno na ${data.name}.`;

// Klávesnicová ovladatelnost — Escape zavírá panel
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusMode) exitFocusMode();
    if (e.key === ' ' && e.target === document.body) pauseBtn.click();
});
```

---

### 4. 📱 Sociální sítě

**Teoretický popis:**  
Open Graph protokol (vyvinutý Facebookem) a Twitter/X Cards zajišťují, že při sdílení odkazu na sociálních sítích se zobrazí hezký náhled s obrázkem, nadpisem a popisem — místo holé URL. Implementuje se sadou `<meta>` tagů v `<head>`.

```html
<!-- Open Graph — pro Facebook, LinkedIn, WhatsApp -->
<meta property="og:title"       content="Cosmos Explorer 3D">
<meta property="og:description" content="Neuvěřitelná interaktivní simulace sluneční soustavy.">
<meta property="og:type"        content="website">
<meta property="og:url"         content="https://tomasvrabec.github.io/space_explorer/">
<meta property="og:image"       content="https://tomasvrabec.github.io/space_explorer/images/og-preview.png">

<!-- Twitter/X Cards -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="Cosmos Explorer 3D">
<meta name="twitter:description" content="Interaktivní 3D vesmír v prohlížeči.">
```

---

### 5. 🎨 UI/UX

**Teoretický popis:**  
Design vychází z estetiky „CosmosOS" — tmavé pozadí (`#02040a`), neonové modré akcenty, glassmorphism panely a 3D CSS transformace. Celý layout používá Flexbox pro top-bar a UI vrstvu. Tři přednastavené pohledy (TOP, SIDE, CINEMATIC) mění `rotateX` a perspektivu kamery. Animace používají `cubic-bezier` křivky pro přirozeně vypadající pohyb. Responzivita je řešena přes `@media` query s `hidden-mobile` třídou.

```css
/* Glassmorphism panel — moderní UI trend */
.hud-panel {
    background: rgba(6, 11, 25, 0.65);
    border: 1px solid rgba(0, 243, 255, 0.3);
    backdrop-filter: blur(10px);
    box-shadow: -20px 0 50px rgba(0,0,0,0.8);
}

/* Plynulé 3D přechody kamery s vlastní křivkou */
camera.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

/* Responzivita */
@media (max-width: 768px) {
    .hidden-mobile { display: none !important; }
    .hud-panel { width: calc(100vw - 2rem); }
}
```

```javascript
// Tři 3D pohledy — přepínání perspektivy kamery
const VIEW_PRESETS = {
    'view-top':       { rotX: 88,  rotZ: 0,  persp: 1500 },
    'view-side':      { rotX: 5,   rotZ: 0,  persp: 3000 },
    'view-cinematic': { rotX: 55,  rotZ: 25, persp: 1800 }
};
```

---

### 6. 🤖 AI Integrace

**Teoretický popis:**  
Umělá inteligence (LLM — Large Language Model, konkrétně Antigravity IDE od Google DeepMind) byla použita v několika fázích projektu: návrh architektonické struktury 3D enginu, generování komplexního Web Audio API kódu pro syntetizované zvuky, ladění CSS transform interpolace pro plynulé 3D animace a psaní dokumentace. AI nástroj fungoval jako zkušený kolega — navrhl řešení, vysvětlil teorii a pomohl odladit chyby.

```javascript
// Příklad AI-generovaného kódu: vesmírný ambient syntetizátor
// Web Audio API — žádné soubory, vše v reálném čase
function startAmbience() {
    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = 40; // Sub-bass hum

    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = 80; // Mid drone

    // LFO pro shimmer efekt
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(o3.frequency); // Modulace frekvence
}
```

---

## 📓 AI Deník

| # | Prompt | Co AI přinesla |
|---|--------|----------------|
| 1 | *"Vytvoř Web Audio API syntezátor pro vesmírný ambient — sub-bass hum, mid drone a shimmer s LFO."* | Funkční 4-vrstvý zvukový engine (oscilátory + šum) bez jediného audio souboru |
| 2 | *"Při kliku na planetu se animace sekne. Pravděpodobně problém s CSS transform interpolací."* | AI diagnostikovala, že `translate(-50%,-50%)` a `scale()` musí mít stejný počet transform funkcí — opravila záseky |
| 3 | *"Navrhni 3D kamerový systém s drag, scroll-zoom a přednastavenými pohledy."* | Celý kamerový engine s `perspective`, `rotateX/Z` a plynulými přechody |
| 4 | *"CSS soubor byl zkrácen, chybí radar sweep a blip styly. Doplň vše co chybí."* | Radar s `conic-gradient` sweep animací, orbit kruhy a pulzujícími blips |
| 5 | *"Oprav bug: zoomTarget není definovaný proměnná v reset funkci."* | AI identifikovala překlep `zoomTarget` → `perspTarget` |
| 6 | *"Napiš kompletní README.md pro školní ročníkovou práci s technickým rozborem."* | Tato dokumentace |

---

## 🚀 Instalace a spuštění

### Lokálně (doporučeno):
1. Stáhni nebo naklonuj repozitář
2. Otevři složku ve **VS Code**
3. Nainstaluj rozšíření **Live Server** (Ritwick Dey)
4. Klikni pravým tlačítkem na `html/index.html` → **"Open with Live Server"**
5. Web se otevře na `http://127.0.0.1:5500/html/`

### Přímé otevření:
- Otevři soubor `html/index.html` přímo v prohlížeči Chrome/Edge/Firefox

> ⚠️ Zvuky vyžadují první klik nebo interakci (browser autoplay policy)

---

## 🖼️ Galerie

### Hlavní pohled (TOP)
![Desktop - hlavní pohled](./images/desktop.png)

### Detail planety (HUD panel)
![Detail planety](./images/detail.png)

### Mobilní verze
![Mobilní verze](./images/mobile.png)

---

## ✅ Checklist splnění zadání

- [x] Čisté HTML5, CSS3, Vanilla JS (ES6+)
- [x] Žádné JS ani CSS frameworky
- [x] Výkon: Canvas rendering, DocumentFragment, Web Audio API, CSS gradienty
- [x] SEO: meta tagy, JSON-LD, sitemap.xml, robots.txt, sémantické HTML
- [x] Přístupnost: ARIA, aria-live, klávesnice, button elementy
- [x] Sociální sítě: Open Graph + Twitter Cards
- [x] UI/UX: glassmorphism, 3D animace, Flexbox, responzivní design
- [x] AI Integrace: dokumentováno v AI deníku
- [x] README s tech. rozborem, snippety a AI deníkem