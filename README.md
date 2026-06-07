# Cosmos Explorer 3D
**Ročníková práce - Webové technologie (2. ročník)**  
**Autor:** Tomáš Vrabec  
**Živý web:** [https://tomasvrabec.github.io/space_explorer/](https://tomasvrabec.github.io/space_explorer/)

## Použité technologie
* Čisté HTML5, CSS3, Vanilla JavaScript, Web Audio API
* Žádné frameworky (bez React, Tailwind, atd.)

## Adresářová struktura
* `css/style.css` - Styly a 3D animace
* `js/script.js` - 3D matematika, kamera, zvuky
* `index.html` - Hlavní HTML, SEO
* `robots.txt` / `sitemap.xml` - Pro crawlery

## Technický rozbor

### 1. Výkon (Performance)
**Popis:** Žádné externí obrázky (pouze CSS gradienty). Zvuky generuje Web Audio API bez načítání souborů. V JS použit `DocumentFragment` proti zasekávání DOMu.
```javascript
// Minimalizace DOM reflows:
const frag = document.createDocumentFragment();
frag.appendChild(blip);
radarBlips.appendChild(frag); 
```

### 2. SEO
**Popis:** Sémantické HTML, meta tagy, `sitemap.xml` s obrázky, `robots.txt` a JSON-LD strukturovaná data pro vzdělávací weby.
```html
<script type="application/ld+json">
{"@type": "WebApplication", "name": "Cosmos Explorer 3D"}
</script>
```

### 3. Přístupnost (Accessibility)
**Popis:** Planety fungují jako `<button>` s `aria-label`. Pohyb z klávesnice. Čtečky obrazovky čtou změny přes `aria-live`.
```html
<div id="aria-live" aria-live="assertive"></div>
```

### 4. Sociální sítě
**Popis:** Open Graph a Twitter Cards zajistí náhledový obrázek při sdílení na sítích.
```html
<meta property="og:title" content="Cosmos Explorer 3D">
```

### 5. UI/UX
**Popis:** "CosmosOS" glassmorphism, 3 různé 3D perspektivy, plynulé transition křivky a interaktivní syntetizované zvuky.

### 6. AI Integrace
**Popis:** LLM modely pomohly vygenerovat Web Audio API kódy pro zvuky a pomohly sjednotit transform-listy pro plynulé 3D přechody kamery.

## AI Deník
1. **Prompt:** "Vytvoř Web Audio syntezátor pro vesmírný ambient." -> **Přínos:** Funkční zvuk bez potřeby externích mp3.
2. **Prompt:** "Při kliku na planetu se sekne obraz, chybí interpolace CSS." -> **Přínos:** AI sjednotila počet transform funkcí a vyřešila záseky.

## Spuštění
1. Stáhnout projekt a otevřít složku (např. ve VS Code).
2. Spustit přes rozšíření **Live Server**.

## Galerie
![Desktop](https://via.placeholder.com/800x400.png?text=Desktop)
![Detail](https://via.placeholder.com/800x400.png?text=Detail+a+Radar)
![Mobil](https://via.placeholder.com/300x500.png?text=Mobil)