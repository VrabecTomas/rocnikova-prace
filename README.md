# Cosmos Explorer 3D

## Úvod

**Cosmos Explorer 3D** je interaktivní webová aplikace zobrazující sluneční soustavu ve 3D prostředí. Uživatel může sledovat pohyb planet, měnit pohled kamery a získávat informace o jednotlivých planetách. Projekt byl vytvořen jako ročníková práce z webových technologií.

**Živý web:** https://tomasvrabec.github.io/space_explorer/html/

---

## Použité technologie

* HTML5 – struktura stránky
* CSS3 – vzhled, animace a responzivita
* JavaScript (ES6+) – logika aplikace
* Web Audio API – generování zvuků
* Google Fonts

**IDE:** Visual Studio Code + Live Server

---

## Adresářová struktura

```text
space_explorer/
├── html/
├── css/
├── js/
├── images/
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Technický rozbor

### 1. Performance

Pro plynulé animace je použit `requestAnimationFrame`, který optimalizuje vykreslování a snižuje zatížení prohlížeče.

```javascript
requestAnimationFrame(updateScene);
```

### 2. SEO

Projekt obsahuje meta tagy, sitemap.xml a strukturovaná data pro lepší indexaci vyhledávači.

```html
<meta name="description" content="Interaktivní 3D simulace sluneční soustavy">
```

### 3. Přístupnost

Použity jsou ARIA atributy a ovládání pomocí klávesnice, aby byl web přístupnější pro všechny uživatele.

```html
<button aria-label="Země">Země</button>
```

### 4. Sociální sítě

Open Graph tagy zajišťují správné zobrazení náhledu při sdílení odkazu.

```html
<meta property="og:title" content="Cosmos Explorer 3D">
```

### 5. UI/UX

Aplikace využívá responzivní design, moderní vzhled a plynulé animace pro lepší uživatelský zážitek.

```css
@media (max-width: 768px) {
  .hidden-mobile { display: none; }
}
```

### 6. AI Integrace

AI byla využita při návrhu některých funkcí, opravě chyb a tvorbě dokumentace.

```javascript
function startAmbience() {
   const osc = ctx.createOscillator();
}
```

---

## AI Deník

* Návrh 3D kamery a ovládání.
* Generování zvuků pomocí Web Audio API.
* Hledání a oprava chyb v JavaScriptu.
* Tvorba technické dokumentace a README.

---

## Instalace a spuštění

1. Stáhněte projekt.
2. Otevřete složku ve Visual Studio Code.
3. Nainstalujte rozšíření Live Server.
4. Spusťte soubor `index.html` pomocí Live Serveru.

---

## Galerie

### Desktop verze

# 🚀 Cosmos Explorer 3D

## Úvod

**Cosmos Explorer 3D** je interaktivní webová aplikace zobrazující sluneční soustavu ve 3D prostředí. Uživatel může sledovat pohyb planet, měnit pohled kamery a získávat informace o jednotlivých planetách. Projekt byl vytvořen jako ročníková práce z webových technologií.

**Živý web:** https://tomasvrabec.github.io/space_explorer/html/

---

## Použité technologie

* HTML5 – struktura stránky
* CSS3 – vzhled, animace a responzivita
* JavaScript (ES6+) – logika aplikace
* Web Audio API – generování zvuků
* Google Fonts

**IDE:** Visual Studio Code + Live Server

---

## Adresářová struktura

```text
space_explorer/
├── html/
├── css/
├── js/
├── images/
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Technický rozbor

### 1. Performance

Pro plynulé animace je použit `requestAnimationFrame`, který optimalizuje vykreslování a snižuje zatížení prohlížeče.

```javascript
requestAnimationFrame(updateScene);
```

### 2. SEO

Projekt obsahuje meta tagy, sitemap.xml a strukturovaná data pro lepší indexaci vyhledávači.

```html
<meta name="description" content="Interaktivní 3D simulace sluneční soustavy">
```

### 3. Přístupnost

Použity jsou ARIA atributy a ovládání pomocí klávesnice, aby byl web přístupnější pro všechny uživatele.

```html
<button aria-label="Země">Země</button>
```

### 4. Sociální sítě

Open Graph tagy zajišťují správné zobrazení náhledu při sdílení odkazu.

```html
<meta property="og:title" content="Cosmos Explorer 3D">
```

### 5. UI/UX

Aplikace využívá responzivní design, moderní vzhled a plynulé animace pro lepší uživatelský zážitek.

```css
@media (max-width: 768px) {
  .hidden-mobile { display: none; }
}
```

### 6. AI Integrace

AI byla využita při návrhu některých funkcí, opravě chyb a tvorbě dokumentace.

```javascript
function startAmbience() {
   const osc = ctx.createOscillator();
}
```

---

## AI Deník

* Návrh 3D kamery a ovládání.
* Generování zvuků pomocí Web Audio API.
* Hledání a oprava chyb v JavaScriptu.
* Tvorba technické dokumentace a README.

---

## Instalace a spuštění

1. Stáhněte projekt.
2. Otevřete složku ve Visual Studio Code.
3. Nainstalujte rozšíření Live Server.
4. Spusťte soubor `index.html` pomocí Live Serveru.

### Desktop verze

<img width="1897" height="904" alt="desktop png" src="https://github.com/user-attachments/assets/2a3becf7-498e-4567-9358-d1fe10df8adc" />

### Detail planety

<img width="1566" height="894" alt="detail png" src="https://github.com/user-attachments/assets/8c52d4cf-419f-4fce-8d78-abcc73bb5025" />

### Mobilní verze
<img width="499" height="789" alt="mobile png" src="https://github.com/user-attachments/assets/13b78111-0aad-4d11-87fc-5c0dc2ebcb7e" />
