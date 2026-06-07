# 🚀 Cosmos Explorer 3D

## Úvod

Interaktivní 3D simulace sluneční soustavy vytvořená v HTML, CSS a JavaScriptu.

**Živý web:** https://tomasvrabec.github.io/space_explorer/html/

## Použité technologie

* HTML5
* CSS3
* JavaScript (ES6+)
* Web Audio API

**IDE:** Visual Studio Code + Live Server

## Adresářová struktura

```text
html/
css/
js/
images/
README.md
```

## Technický rozbor

### Performance

Optimalizace animací pomocí `requestAnimationFrame`.

```javascript
requestAnimationFrame(updateScene);
```

### SEO

Meta tagy a sitemap.xml.

```html
<meta name="description" content="3D simulace sluneční soustavy">
```

### Přístupnost

ARIA atributy a ovládání klávesnicí.

```html
<button aria-label="Země">Země</button>
```

### Sociální sítě

Open Graph pro sdílení odkazů.

```html
<meta property="og:title" content="Cosmos Explorer 3D">
```

### UI/UX

Responzivní design a animace.

```css
@media(max-width:768px){ .hidden-mobile{display:none;} }
```

### AI Integrace

AI pomohla s kódem, laděním a dokumentací.

```javascript
function startAmbience(){}
```

## AI Deník

* Návrh 3D kamery
* Generování zvuků pomocí Web Audio API
* Opravy chyb
* Tvorba README

## Instalace

1. Otevři projekt ve VS Code.
2. Spusť `index.html` přes Live Server.

## Galerie

* Desktop screenshot
* Mobilní screenshot
* Detail planety
