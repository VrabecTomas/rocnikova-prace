/* ==========================================================================
   COSMOS EXPLORER 3D - MAIN ENGINE
   ========================================================================== */


document.addEventListener('DOMContentLoaded', () => {});


// ==========================================================================
// SOUND ENGINE — Web Audio API (no external files needed)
// ==========================================================================

const SoundEngine = (() => {
    let ctx = null;
    let masterGain = null;
    let ambienceNode = null;
    let ambienceGain = null;
    let isMuted = false;

    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 1;
            masterGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // Deep ambient space drone — layered oscillators + noise
    function startAmbience() {
        if (ambienceNode) return;
        const c = getCtx();

        ambienceGain = c.createGain();
        ambienceGain.gain.value = 0;
        ambienceGain.connect(masterGain);

        // Sub-bass hum
        const o1 = c.createOscillator();
        o1.type = 'sine';
        o1.frequency.value = 40;
        const g1 = c.createGain(); g1.gain.value = 0.18;
        o1.connect(g1); g1.connect(ambienceGain);
        o1.start();

        // Mid drone
        const o2 = c.createOscillator();
        o2.type = 'triangle';
        o2.frequency.value = 80;
        const g2 = c.createGain(); g2.gain.value = 0.06;
        o2.connect(g2); g2.connect(ambienceGain);
        o2.start();

        // Shimmer
        const o3 = c.createOscillator();
        o3.type = 'sine';
        o3.frequency.value = 320;
        const lfo = c.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = c.createGain(); lfoGain.gain.value = 8;
        lfo.connect(lfoGain); lfoGain.connect(o3.frequency);
        lfo.start();
        const g3 = c.createGain(); g3.gain.value = 0.012;
        o3.connect(g3); g3.connect(ambienceGain);
        o3.start();

        // Noise layer
        const bufLen = c.sampleRate * 2;
        const buffer = c.createBuffer(1, bufLen, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const noise = c.createBufferSource();
        noise.buffer = buffer; noise.loop = true;
        const noiseFilter = c.createBiquadFilter();
        noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = 200; noiseFilter.Q.value = 0.5;
        const noiseGain = c.createGain(); noiseGain.gain.value = 0.015;
        noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ambienceGain);
        noise.start();

        ambienceNode = { o1, o2, o3, lfo, noise };

        // Fade in
        ambienceGain.gain.setTargetAtTime(1, c.currentTime, 3);
    }

    // Sci-fi planet selection beep
    function playPlanetSelect() {
        const c = getCtx();
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain); gain.connect(masterGain);
        osc.start(now); osc.stop(now + 0.35);

        // Click tick
        const osc2 = c.createOscillator();
        const g2 = c.createGain();
        osc2.type = 'square'; osc2.frequency.value = 300;
        g2.gain.setValueAtTime(0.08, now); g2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc2.connect(g2); g2.connect(masterGain);
        osc2.start(now); osc2.stop(now + 0.07);
    }

    // Warp / teleport whoosh
    function playWarp() {
        const c = getCtx();
        const now = c.currentTime;

        // Rising sweep
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
        const gain = c.createGain();
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        const filter = c.createBiquadFilter();
        filter.type = 'bandpass'; filter.frequency.value = 800; filter.Q.value = 2;
        osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
        osc.start(now); osc.stop(now + 0.65);

        // Noise burst
        const bufLen = c.sampleRate;
        const buffer = c.createBuffer(1, bufLen, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
        const noise = c.createBufferSource();
        noise.buffer = buffer;
        const nGain = c.createGain();
        nGain.gain.setValueAtTime(0.15, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        noise.connect(nGain); nGain.connect(masterGain);
        noise.start(now); noise.stop(now + 0.55);
    }

    // Eerie atmosphere entry tone
    function playAtmosphereEnter() {
        const c = getCtx();
        const now = c.currentTime;

        // Deep rumble
        const o1 = c.createOscillator();
        o1.type = 'sine'; o1.frequency.value = 55;
        const g1 = c.createGain();
        g1.gain.setValueAtTime(0, now);
        g1.gain.linearRampToValueAtTime(0.3, now + 1.5);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 4);
        o1.connect(g1); g1.connect(masterGain);
        o1.start(now); o1.stop(now + 4.1);

        // Eerie sweep
        const o2 = c.createOscillator();
        o2.type = 'triangle'; o2.frequency.setValueAtTime(220, now);
        o2.frequency.exponentialRampToValueAtTime(110, now + 3);
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0, now);
        g2.gain.linearRampToValueAtTime(0.12, now + 0.8);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
        o2.connect(g2); g2.connect(masterGain);
        o2.start(now); o2.stop(now + 3.6);

        // Shimmer pulse
        const o3 = c.createOscillator();
        o3.type = 'sine'; o3.frequency.value = 880;
        const lfo = c.createOscillator();
        lfo.frequency.value = 3;
        const lfoG = c.createGain(); lfoG.gain.value = 0.04;
        lfo.connect(lfoG); lfoG.connect(g2.gain);
        lfo.start(now);
        const g3 = c.createGain();
        g3.gain.setValueAtTime(0, now);
        g3.gain.linearRampToValueAtTime(0.04, now + 0.5);
        g3.gain.exponentialRampToValueAtTime(0.001, now + 2);
        o3.connect(g3); g3.connect(masterGain);
        o3.start(now); o3.stop(now + 2.1); lfo.stop(now + 2.1);
    }

    // Shooting star chime
    function playShootingStar() {
        const c = getCtx();
        const now = c.currentTime;
        [1046, 1318, 1568].forEach((freq, i) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, now + i * 0.07);
            gain.gain.linearRampToValueAtTime(0.06, now + i * 0.07 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
            osc.connect(gain); gain.connect(masterGain);
            osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.45);
        });
    }

    function setMute(muted) {
        isMuted = muted;
        if (!masterGain) return;
        masterGain.gain.setTargetAtTime(muted ? 0 : 1, getCtx().currentTime, 0.3);
    }

    function toggleMute() {
        setMute(!isMuted);
        return isMuted;
    }

    return { startAmbience, playPlanetSelect, playWarp, playAtmosphereEnter, playShootingStar, toggleMute, isMuted: () => isMuted };
})();

    // --- 1. DATA WITH CUSTOM ENVIRONMENT WARNINGS ---

    const DB = {

        sun: { name: "SLUNCE", type: "HVĚZDA G-TYPU", dist: "0 km", temp: "5500 °C", grav: "274 m/s²", year: "GALAKTICKÝ", moons: "0", atm: "Vodík, Helium", desc: "Obrovská rotující koule žhavé plazmy. Slunce generuje energii jadernou fúzí a tvoří 99.8% hmoty celé soustavy.", envType: "fire", envWarning: "EXTRÉMNÍ RADIACE A ŽHAVÁ PLAZMA", exploreText: "VSTOUPIT DO KORÓNY" },

        mercury: { name: "MERKUR", type: "TERESTRICKÁ", dist: "57.9M km", temp: "430 °C", grav: "3.7 m/s²", year: "88 Dní", moons: "0", atm: "Žádná", desc: "Nejmenší a nejrychlejší planeta. Nemá atmosféru, takže nedokáže udržet teplo. Povrch je zjizven krátery.", envType: "none", envWarning: "VAKUUM A EXTRÉMNÍ VÝKYVY TEPLOT", exploreText: "PŘISTÁT NA POVRCHU" },

        venus: { name: "VENUŠE", type: "TERESTRICKÁ", dist: "108.2M km", temp: "465 °C", grav: "8.87 m/s²", year: "225 Dní", moons: "0", atm: "Oxid uhličitý, Síra", desc: "Pekelný svět s hustou, toxickou atmosférou z oxidu uhličitého. Tlak na povrchu by rozdrtil ponorku.", envType: "toxic", envWarning: "TOXICKÁ ATMOSFÉRA, DRTIVÝ TLAK", exploreText: "PŘISTÁT V PEKLE" },

        earth: { name: "ZEMĚ", type: "OBYVATELNÁ", dist: "149.6M km", temp: "15 °C", grav: "9.8 m/s²", year: "365 Dní", moons: "1", atm: "Dusík, Kyslík", desc: "Náš domov. Jediný známý svět s tekutou vodou na povrchu a komplexním životem.", envType: "clouds", envWarning: "OPTIMÁLNÍ PODMÍNKY PRO ŽIVOT", exploreText: "VSTOUPIT DO ATMOSFÉRY" },

        mars: { name: "MARS", type: "TERESTRICKÁ", dist: "227.9M km", temp: "-65 °C", grav: "3.72 m/s²", year: "687 Dní", moons: "2", atm: "Řídká (CO2)", desc: "Rudá planeta plná prachu a rzi. Nalezneme zde gigantické kaňony a nejvyšší sopku soustavy Olympus Mons.", envType: "dust", envWarning: "NÍZKÝ TLAK, GLOBÁLNÍ PÍSEČNÁ BOUŘE", exploreText: "PŘISTÁT V PRACHU" },

        jupiter: { name: "JUPITER", type: "PLYNNÝ OBR", dist: "778.5M km", temp: "-110 °C", grav: "24.7 m/s²", year: "11.8 Let", moons: "95", atm: "Vodík, Helium", desc: "Král planet. Obrovská plynná koule s ikonickou Velkou rudou skvrnou. Uvnitř se nachází tekuté kovové jádro.", envType: "storm", envWarning: "EXTRÉMNÍ BOUŘE, TEKUTÉ KOVOVÉ JÁDRO", exploreText: "PONOŘIT SE DO BOUŘE" },

        saturn: { name: "SATURN", type: "PLYNNÝ OBR", dist: "1.4B km", temp: "-140 °C", grav: "10.4 m/s²", year: "29.5 Let", moons: "146", atm: "Vodík, Helium", desc: "Klenot sluneční soustavy. Známý svým obrovským komplexním prstencovým systémem z ledu a prachu.", envType: "rings", envWarning: "SILNÉ VĚTRY, PRSTENCOVÝ SYSTÉM", exploreText: "PROLETĚT PRSTENCI" },

        uranus: { name: "URAN", type: "LEDOVÝ OBR", dist: "2.9B km", temp: "-195 °C", grav: "8.69 m/s²", year: "84 Let", moons: "28", atm: "Vodík, Helium, Metan", desc: "Planeta rotující na boku, pravděpodobně kvůli pradávné kolizi. Má velmi chladnou atmosféru a bledě modrou barvu.", envType: "ice", envWarning: "MRAZIVÉ LEDOVÉ JÁDRO, EXTRÉMNÍ CHLAD", exploreText: "PROZKOUMAT LED" },

        neptune: { name: "NEPTUN", type: "LEDOVÝ OBR", dist: "4.5B km", temp: "-200 °C", grav: "11.15 m/s²", year: "165 Let", moons: "16", atm: "Vodík, Helium, Metan", desc: "Nejvzdálenější planeta. Temný, chladný svět bičovaný nadzvukovými větry. První planeta objevená matematikou.", envType: "wind", envWarning: "NADZVUKOVÉ VĚTRY, TEMNÁ BOUŘE", exploreText: "VSTOUPIT DO VICHŘICE" }

    };



    const ORBIT_RADII = { mercury: 180, venus: 280, earth: 390, mars: 500, jupiter: 820, saturn: 1150, uranus: 1450, neptune: 1750 };

    const ORBIT_SPEEDS = { mercury: 4.1, venus: 1.6, earth: 1.0, mars: 0.5, jupiter: 0.08, saturn: 0.03, uranus: 0.01, neptune: 0.005 };



    // --- 2. ASTEROID BELT ---

    const asteroidBelt = document.getElementById('asteroid-belt');

    for (let i = 0; i < 120; i++) {

        const ast = document.createElement('div');

        ast.className = 'asteroid';

        const r = 520 + Math.random() * 280;

        const angle = Math.random() * Math.PI * 2;

        const x = Math.cos(angle) * r;

        const y = Math.sin(angle) * r;

        const z = (Math.random() - 0.5) * 40;

        const size = 1 + Math.random() * 3;

       

        ast.style.width = size + 'px'; ast.style.height = size + 'px';

        ast.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(90deg)`;

        asteroidBelt.appendChild(ast);

    }



    // --- 3. CANVAS ENGINE ---

    const canvas = document.getElementById('deep-space');

    const ctx = canvas.getContext('2d');

    let width, height;

    let particles = [], gasBands = [], nebulae = [], shootingStars = [];

    let canvasMode = 'space', isWarping = false, warpSpeed = 0;



    const TRAIL_COLORS = {

        mercury: '153,153,153', venus: '230,138,0', earth: '77,166,255',

        mars: '255,112,77', jupiter: '211,156,126', saturn: '238,221,170',

        uranus: '51,153,255', neptune: '0,34,204'

    };



    // Project a local solar-system (x,y) position to 2D canvas coords

    function project3D(lx, ly) {

        const rX = camRotX * Math.PI / 180;

        const rZ = camRotZ * Math.PI / 180;

        // rotateX

        const py = ly * Math.cos(rX), pz = ly * Math.sin(rX);

        // rotateZ

        const qx = lx * Math.cos(rZ) - py * Math.sin(rZ);

        const qy = lx * Math.sin(rZ) + py * Math.cos(rZ);

        // Perspective

        const d = perspVal / (perspVal + pz);

        return { x: width / 2 + qx * d, y: height / 2 + qy * d };

    }



    function initCanvas() {

        width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight;

        particles = []; gasBands = [];

       

        if (canvasMode === 'space') {

            // Stars

            for (let i = 0; i < 600; i++) particles.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5, alpha: Math.random(), pulse: Math.random() * 0.02 });

            // Nebula clouds (regenerate on resize)

            nebulae = [

                { x: width * 0.15, y: height * 0.20, r: 280, cr: '0,80,200',   a: 0.055 },

                { x: width * 0.80, y: height * 0.70, r: 320, cr: '120,0,220',  a: 0.045 },

                { x: width * 0.55, y: height * 0.85, r: 220, cr: '200,40,0',   a: 0.040 },

                { x: width * 0.25, y: height * 0.75, r: 260, cr: '0,160,100',  a: 0.035 },

                { x: width * 0.85, y: height * 0.15, r: 200, cr: '180,0,180',  a: 0.030 }

            ];

        } else if (canvasMode === 'storm' || canvasMode === 'rings') {

            for(let i=0; i<25; i++) gasBands.push({ y: (height/25) * i, speed: (Math.random() - 0.5) * 8, h: 40 + Math.random() * 80, color: (Math.random() > 0.5) ? 'rgba(211,156,126,0.15)' : 'rgba(232,195,169,0.1)', phase: Math.random() * 10 });

            for (let i = 0; i < 150; i++) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() * 10) + 5, vy: 0, r: 1, alpha: Math.random() * 0.3 });

        } else {

            for (let i = 0; i < 200; i++) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, r: Math.random() * 4 + 1, alpha: Math.random() * 0.5 });

        }

    }



    function triggerWarp() {

        if(canvasMode !== 'space') return;

        isWarping = true; warpSpeed = 0;

        setTimeout(() => { isWarping = false; }, 600);

    }



    function drawCanvas() {

        if (isWarping && canvasMode === 'space') {

            warpSpeed += 1.5;

            ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#fff'; ctx.beginPath();

            particles.forEach(p => {

                const dx = p.x - width/2, dy = p.y - height/2, dist = Math.sqrt(dx*dx + dy*dy) || 1;

                ctx.moveTo(p.x, p.y);

                p.x += (dx / dist) * warpSpeed * 8; p.y += (dy / dist) * warpSpeed * 8;

                ctx.lineTo(p.x, p.y);

                if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) { p.x = width/2 + (Math.random()-0.5)*20; p.y = height/2 + (Math.random()-0.5)*20; }

            });

            ctx.stroke();

        } else if (canvasMode === 'space') {

            ctx.clearRect(0, 0, width, height);



            // 1. NEBULAE — colorful gas clouds behind stars

            nebulae.forEach(n => {

                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);

                grad.addColorStop(0,   `rgba(${n.cr},${n.a})`);

                grad.addColorStop(0.5, `rgba(${n.cr},${n.a * 0.4})`);

                grad.addColorStop(1,   'transparent');

                ctx.fillStyle = grad;

                ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);

            });



            // 2. STARS

            ctx.fillStyle = '#ffffff';

            particles.forEach(p => {

                p.alpha += p.pulse; if (p.alpha > 1 || p.alpha < 0.2) p.pulse = -p.pulse;

                ctx.globalAlpha = p.alpha; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();

            });



            // 3. SHOOTING STARS

            for (let i = shootingStars.length - 1; i >= 0; i--) {

                const s = shootingStars[i];

                const progress = s.life / s.maxLife;

                ctx.globalAlpha = progress * 0.9;

                const grad = ctx.createLinearGradient(s.x - s.vx * s.len, s.y - s.vy * s.len, s.x, s.y);

                grad.addColorStop(0, 'transparent');

                grad.addColorStop(1, '#ffffff');

                ctx.strokeStyle = grad;

                ctx.lineWidth = 1.5;

                ctx.beginPath();

                ctx.moveTo(s.x - s.vx * s.len, s.y - s.vy * s.len);

                ctx.lineTo(s.x, s.y);

                ctx.stroke();

                s.x += s.vx; s.y += s.vy; s.life--;

                if (s.life <= 0) shootingStars.splice(i, 1);

            }



            // 4. ORBIT TRAILS (projected from 3D to 2D)

            if (!focusMode) {

                ctx.lineWidth = 1.5;

                Object.keys(ORBIT_RADII).forEach(id => {

                    const r = ORBIT_RADII[id];

                    const speed = ORBIT_SPEEDS[id];

                    const endAngle = simulationTime * speed;

                    const trailArc = Math.PI * 0.5; // 90° trail

                    const steps = 40;

                    const color = TRAIL_COLORS[id] || '255,255,255';



                    ctx.beginPath();

                    for (let s = 0; s <= steps; s++) {

                        const a = (endAngle - trailArc) + (trailArc * s / steps);

                        const pt = project3D(Math.cos(a) * r, Math.sin(a) * r);

                        s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);

                    }

                    // Gradient from transparent (old) to planet color (current)

                    const tailPt = project3D(Math.cos(endAngle - trailArc) * r, Math.sin(endAngle - trailArc) * r);

                    const headPt = project3D(Math.cos(endAngle) * r, Math.sin(endAngle) * r);

                    const tGrad = ctx.createLinearGradient(tailPt.x, tailPt.y, headPt.x, headPt.y);

                    tGrad.addColorStop(0, `rgba(${color},0)`);

                    tGrad.addColorStop(1, `rgba(${color},0.5)`);

                    ctx.strokeStyle = tGrad;

                    ctx.stroke();

                });

            }

        } else if (canvasMode === 'storm' || canvasMode === 'rings') {

            ctx.fillStyle = '#110d0a'; ctx.fillRect(0, 0, width, height);

            gasBands.forEach(b => {

                const wave = Math.sin(simulationTime * 5 + b.phase) * 20;

                ctx.fillStyle = b.color; ctx.fillRect(0, b.y + wave, width, b.h);

            });

            ctx.fillStyle = 'rgba(255,255,255,0.2)';

            particles.forEach(p => {

                p.x += p.vx; if (p.x > width) p.x = 0;

                ctx.fillRect(p.x, p.y, 60, 2);

            });

        } else {

            ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 0, width, height); ctx.fillStyle = getEnvColor(canvasMode);

            particles.forEach(p => {

                p.x += p.vx; p.y += p.vy;

                if (p.x > width) p.x = 0; if (p.x < 0) p.x = width;

                if (p.y > height) p.y = 0; if (p.y < 0) p.y = height;

                ctx.globalAlpha = p.alpha; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();

            });

        }

        ctx.globalAlpha = 1;

    }

   

    function getEnvColor(mode) {

        switch(mode) {

            case 'dust': return '#ff6600'; case 'toxic': return '#ccff00';

            case 'clouds': return '#ffffff'; case 'ice': return '#00ffff';

            case 'wind': return '#0000ff'; case 'fire': return '#ff0000';

            default: return '#ffffff';

        }

    }



    initCanvas(); window.addEventListener('resize', initCanvas);



    // --- 4. 3D CAMERA ENGINE ---

    const camera = document.getElementById('camera'), sceneContainer = document.getElementById('scene-container');

    const timeSlider = document.getElementById('time-slider'), timeVal = document.getElementById('time-val');

   

    let camRotX = 65, camRotZ = 0, isDragging = false, startMouseX, startMouseY;

    let timeScale = 1, simulationTime = 0, focusMode = false, activePlanetId = null;

    let isPaused = false;



    // --- PERSPECTIVE-BASED ZOOM (feels like a real camera lens) ---

    let perspVal = 1500, perspTarget = 1500;

    const PERSP_MIN = 350, PERSP_MAX = 5000;

    let zoomAnimId = null;



    function animateZoom() {

        const diff = perspTarget - perspVal;

        if (Math.abs(diff) < 0.5) { perspVal = perspTarget; sceneContainer.style.perspective = perspVal + 'px'; updateZoomBadge(); zoomAnimId = null; return; }

        perspVal += diff * 0.1;

        sceneContainer.style.perspective = perspVal + 'px';

        updateZoomBadge();

        zoomAnimId = requestAnimationFrame(animateZoom);

    }



    function zoomBy(factor) {

        perspTarget = Math.min(PERSP_MAX, Math.max(PERSP_MIN, perspTarget * factor));

        if (!zoomAnimId) zoomAnimId = requestAnimationFrame(animateZoom);

    }



    function updateZoomBadge() {

        const badge = document.getElementById('zoom-badge');

        // Map perspective to a 0.25x–4x display (inverse: smaller persp = more zoomed in)

        const displayZoom = (1500 / perspVal).toFixed(2);

        if (badge) badge.textContent = `ZOOM ${displayZoom}x`;

    }



    // Helper: apply camera rotation only (no scale — zoom handled by perspective)

    function applyCameraTransform(transition) {

        if (transition) {

            camera.style.transition = transition;

            setTimeout(() => camera.style.transition = 'transform 0.1s ease-out', parseFloat(transition) * 1000 + 50);

        }

        // Always include scale(1) translate(0,0) so transform lists match focus-mode transforms
        // This prevents browser from snapping instead of interpolating
        camera.style.transform = `rotateX(${camRotX}deg) rotateZ(${camRotZ}deg) scale(1) translate(0px, 0px)`;

    }



    document.addEventListener('mousedown', (e) => {

        if (e.target.closest('.ui-layer') || focusMode || document.body.classList.contains('surface-active')) return;

        isDragging = true; startMouseX = e.clientX; startMouseY = e.clientY;

    });



    document.addEventListener('mousemove', (e) => {

        if (!focusMode && canvasMode === 'space' && !isWarping) { canvas.style.transform = `translate(${(e.clientX - width/2) * -0.01}px, ${(e.clientY - height/2) * -0.01}px)`; }

        if (!isDragging || isViewTransitioning) return;

        camRotZ -= (e.clientX - startMouseX) * 0.2; camRotX -= (e.clientY - startMouseY) * 0.2;

        camRotX = Math.max(10, Math.min(85, camRotX));

        applyCameraTransform();

        startMouseX = e.clientX; startMouseY = e.clientY;

        updatePlanetCounterRotation();

    });



    document.addEventListener('mouseup', () => { isDragging = false; });

    document.addEventListener('mouseleave', () => { isDragging = false; });



    const planets = document.querySelectorAll('.planet');

    function updatePlanetCounterRotation() {

        if (focusMode) return;

        // Always use exactly 3 transform functions to match enterFocusMode format
        planets.forEach(p => p.style.transform = `translate(-50%, -50%) rotateZ(${-camRotZ}deg) rotateX(${-camRotX}deg)`);

    }



    timeSlider.addEventListener('input', (e) => { timeScale = parseFloat(e.target.value); timeVal.textContent = timeScale.toFixed(1) + 'x'; });

   

    document.getElementById('reset-cam-btn').addEventListener('click', () => {

        if (focusMode) exitFocusMode();

        camRotX = 65; camRotZ = 0;

        perspTarget = 1500;

        if (!zoomAnimId) zoomAnimId = requestAnimationFrame(animateZoom);

        applyCameraTransform('1s cubic-bezier(0.2, 0.8, 0.2, 1)');

        updatePlanetCounterRotation();

    });



    // --- SCROLL WHEEL ZOOM (perspective-based, feels natural) ---

    document.addEventListener('wheel', (e) => {

        if (document.body.classList.contains('surface-active')) return;

        e.preventDefault();

        // scroll down = zoom out (increase perspective), scroll up = zoom in

        const factor = e.deltaY > 0 ? 1.08 : 0.92;

        zoomBy(factor);

    }, { passive: false });



    // +/- keyboard zoom

    document.addEventListener('keydown', (e) => {

        if (e.key === '=' || e.key === '+') zoomBy(0.88);

        if (e.key === '-' || e.key === '_') zoomBy(1.12);

    });



    const wrappers = {};

    Object.keys(ORBIT_RADII).forEach(id => wrappers[id] = document.querySelector(`.${id}-wrapper`));

    const radarBlips = document.getElementById('radar-blips'), radarScale = 50 / 1750;



    function animate() {

        // Spawn shooting star randomly (~every 4 seconds at 60fps)

        if (canvasMode === 'space' && Math.random() < 0.004) {

            const angle = Math.random() * Math.PI * 2;

            const speed = 8 + Math.random() * 12;

            shootingStars.push({

                x: Math.random() * width,

                y: Math.random() * height * 0.5,

                vx: Math.cos(angle) * speed,

                vy: Math.abs(Math.sin(angle)) * speed * 0.4 + 2,

                life: 40 + Math.random() * 30,

                maxLife: 60,

                len: 12 + Math.random() * 20

            });

            // Play a subtle chime for shooting stars (1 in 3 chance to avoid spam)
            if (Math.random() < 0.33) SoundEngine.playShootingStar();

        }



        drawCanvas();

        if (!isPaused) simulationTime += 0.01 * timeScale;

        if (!focusMode) {

            asteroidBelt.style.transform = `rotateZ(${simulationTime * 0.1}deg)`;

            radarBlips.innerHTML = '';

            const frag = document.createDocumentFragment();

            Object.keys(wrappers).forEach(id => {

                if(!wrappers[id]) return;

                const r = ORBIT_RADII[id], speed = ORBIT_SPEEDS[id], angle = simulationTime * speed;

                const x = Math.cos(angle) * r, y = Math.sin(angle) * r;

                wrappers[id].style.transform = `translate(${x}px, ${y}px)`;

                const blip = document.createElement('div');

                blip.className = 'blip';
                blip.style.left = `${50 + (x * radarScale)}%`;
                blip.style.top  = `${50 + (y * radarScale)}%`;

                if(id === 'earth') blip.style.background = 'var(--neon-blue)';

                frag.appendChild(blip);

            });

            radarBlips.appendChild(frag);

        }

        requestAnimationFrame(animate);

    }



    // --- 5. SMOOTH CAMERA & CUSTOM ATMOSPHERES ---

    const hudPanel = document.getElementById('hud-panel');

    const liveRegion = document.getElementById('aria-live');

    const teleportSelect = document.getElementById('teleport-select');

   

    let typeTimeout;

    function typeText(element, text) {

        clearTimeout(typeTimeout); element.innerHTML = ''; let i = 0;

        function type() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; typeTimeout = setTimeout(type, 10); } }

        type();

    }



    // Direct click in solar system = NO WARP, just smooth camera swoop

    planets.forEach(btn => {

        const handleClick = (e) => {

            e.stopPropagation();

            SoundEngine.playPlanetSelect();

            const wrapper = e.currentTarget.closest('.celestial-wrapper');

            const id = wrapper.getAttribute('data-id');

            if(focusMode) exitFocusMode();

            setTimeout(() => enterFocusMode(id, wrapper), 50);

        };

        btn.addEventListener('click', handleClick);

        btn.addEventListener('keydown', (e) => {

            if (e.key === 'Enter' || e.key === ' ') {

                e.preventDefault();

                handleClick(e);

            }

        });

    });



    // Dropdown Teleport = WARP EFFECT

    teleportSelect.addEventListener('change', (e) => {

        const id = e.target.value;

        if(!id) return;

        const wrapper = document.querySelector(`.${id}-wrapper`);

        if(wrapper) {

            if(focusMode) exitFocusMode();

            SoundEngine.playWarp();

            triggerWarp();

            setTimeout(() => enterFocusMode(id, wrapper), 200);

        }

        e.target.value = '';

    });



    // Timeout handles for focus enter/exit — cleared on rapid clicks
    let focusEnterTimer = null, focusExitTimer = null;

    function enterFocusMode(id, wrapper) {

        focusMode = true; activePlanetId = id;

        const data = DB[id];

       

        let x = 0, y = 0;

        if (id !== 'sun') {

            const match = wrapper.style.transform.match(/translate\(([^p]+)px,\s*([^p]+)px\)/);

            if (match) { x = parseFloat(match[1]); y = parseFloat(match[2]); }

        }



        const scale = id === 'sun' ? 1.5 : (id === 'jupiter' || id === 'saturn' ? 3 : 6);

       

        camera.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

        camera.style.transform = `rotateX(0deg) rotateZ(0deg) scale(${scale}) translate(${-x}px, ${-y}px)`;

        planets.forEach(p => {

            p.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // Use SAME 3-function format as updatePlanetCounterRotation to allow smooth interpolation
            p.style.transform = `translate(-50%, -50%) rotateZ(0deg) rotateX(0deg)`;

        });



        // Clear any pending exit timer, then set enter timer
        if (focusExitTimer) { clearTimeout(focusExitTimer); focusExitTimer = null; }
        if (focusEnterTimer) clearTimeout(focusEnterTimer);
        focusEnterTimer = setTimeout(() => {

            if(focusMode) {

                camera.style.transition = 'transform 0.1s ease-out';

                planets.forEach(p => p.style.transition = 'transform 0.3s');

            }

        }, 1250);



        document.getElementById('hud-title').textContent = data.name;

        document.getElementById('hud-title').setAttribute('data-text', data.name);

        document.getElementById('hud-type').textContent = data.type;

        document.getElementById('data-dist').textContent = data.dist;

        document.getElementById('data-temp').textContent = data.temp;

        document.getElementById('data-grav').textContent = data.grav;

        document.getElementById('data-year').textContent = data.year;

        document.getElementById('data-moons').textContent = data.moons;

        document.getElementById('data-atm').textContent = data.atm;

        typeText(document.getElementById('hud-desc'), data.desc);

       

        const btnExplore = document.getElementById('btn-explore');

        if (btnExplore) {

            btnExplore.textContent = data.exploreText || "VSTOUPIT DO ATMOSFÉRY";

        }

       

        hudPanel.classList.add('active'); hudPanel.setAttribute('aria-hidden', 'false');

        liveRegion.textContent = `Zaměřeno na ${data.name}.`;

    }



    function exitFocusMode() {

        focusMode = false; activePlanetId = null;

        // Clear any pending enter timer so it can't override our exit
        if (focusEnterTimer) { clearTimeout(focusEnterTimer); focusEnterTimer = null; }

        // Set planet transitions BEFORE updating transforms so they animate smoothly
        planets.forEach(p => p.style.transition = 'transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1)');

        applyCameraTransform('1s cubic-bezier(0.2, 0.8, 0.2, 1)');

        updatePlanetCounterRotation();

       

        if (focusExitTimer) clearTimeout(focusExitTimer);
        focusExitTimer = setTimeout(() => {

            if(!focusMode) {

                camera.style.transition = 'transform 0.1s ease-out';

                planets.forEach(p => p.style.transition = 'transform 0.3s');

            }

        }, 1100);

        hudPanel.classList.remove('active'); hudPanel.setAttribute('aria-hidden', 'true');

    }



    document.getElementById('close-hud').addEventListener('click', exitFocusMode);

   

    // CUSTOM ENVIRONMENT DISPLAY

    document.getElementById('btn-explore').addEventListener('click', () => {

        if(!activePlanetId) return;

        SoundEngine.playAtmosphereEnter();

        sceneContainer.classList.add('surface-mode');

        document.body.classList.add('surface-active');

        hudPanel.classList.remove('active');

       

        canvasMode = DB[activePlanetId].envType;

        initCanvas();

       

        // Update custom text for the environment based on the DB

        const envText = document.querySelector('.env-warning');

        envText.textContent = DB[activePlanetId].envWarning;

        envText.setAttribute('data-text', DB[activePlanetId].envWarning);

       

        if (activePlanetId === 'earth') {

            envText.style.color = 'var(--neon-green)';

            envText.style.textShadow = '0 0 20px var(--neon-green)';

        } else {

            envText.style.color = 'var(--neon-red)';

            envText.style.textShadow = '0 0 20px var(--neon-red)';

        }



        setTimeout(() => {

            document.getElementById('env-hud').classList.remove('visually-hidden');

            liveRegion.textContent = `Vstup do atmosféry: ${DB[activePlanetId].name}. ${DB[activePlanetId].envWarning}`;

        }, 1500);

    });



    document.getElementById('btn-leave-env').addEventListener('click', () => {

        sceneContainer.classList.remove('surface-mode');

        document.body.classList.remove('surface-active');

        document.getElementById('env-hud').classList.add('visually-hidden');

       

        canvasMode = 'space'; initCanvas();

        setTimeout(() => hudPanel.classList.add('active'), 1000);

    });



    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape' && focusMode && !document.body.classList.contains('surface-active')) exitFocusMode();

    });







    // -------------------------------------------------------

    // CAMERA VIEW PRESETS

    // -------------------------------------------------------

    // Transition lock — prevents mouse drag from interrupting view animations
    let isViewTransitioning = false;

    const VIEW_PRESETS = {

        'view-top':       { rotX: 88,  rotZ: 0,   persp: 1500, label: 'HORNÍ POHLED'   },

        'view-side':      { rotX: 5,   rotZ: 0,   persp: 3000, label: 'BOČNÍ POHLED'   },

        'view-cinematic': { rotX: -75, rotZ: 30,  persp: 2200, label: 'POHLED Z HLUBINY' }

    };



    document.querySelectorAll('.btn-view').forEach(btn => {

        btn.addEventListener('click', () => {

            if (focusMode) exitFocusMode();

            const preset = VIEW_PRESETS[btn.id];

            if (!preset) return;



            // Highlight active button

            document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));

            btn.classList.add('active');



            // Lock mouse drag during transition
            isViewTransitioning = true;
            setTimeout(() => { isViewTransitioning = false; }, 1300);

            // Animate via applyCameraTransform so transform list always has 4 functions
            camRotX = preset.rotX;
            camRotZ = preset.rotZ;
            applyCameraTransform('1.2s cubic-bezier(0.34, 1.2, 0.64, 1)');

            updatePlanetCounterRotation();

            // Auto-zoom to best perspective for this view

            if (preset.persp) { perspTarget = preset.persp; if (!zoomAnimId) zoomAnimId = requestAnimationFrame(animateZoom); }

            liveRegion.textContent = preset.label;

        });

    });



    // Re-activate TOP button on reset

    document.getElementById('reset-cam-btn').addEventListener('click', () => {

        document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));

        document.getElementById('view-top').classList.add('active');

    });



    // -------------------------------------------------------

    // PAUSE / PLAY

    // -------------------------------------------------------

    const pauseBtn = document.getElementById('pause-btn');

    pauseBtn.addEventListener('click', () => {

        isPaused = !isPaused;

        pauseBtn.textContent  = isPaused ? '▶' : '⏸';

        pauseBtn.title        = isPaused ? 'Play' : 'Pause';

        pauseBtn.classList.toggle('paused', isPaused);

        liveRegion.textContent = isPaused ? 'Simulace pozastavena.' : 'Simulace spuštěna.';

    });



    // Space bar = pause toggle

    document.addEventListener('keydown', (e) => {

        if (e.key === ' ' && e.target === document.body) {

            e.preventDefault();

            pauseBtn.click();

        }

    });



    // -------------------------------------------------------

    // FULLSCREEN

    // -------------------------------------------------------

    document.getElementById('fullscreen-btn').addEventListener('click', () => {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen().catch(() => {});

            document.getElementById('fullscreen-btn').textContent = '⛶';

        } else {

            document.exitFullscreen();

        }

    });

    document.addEventListener('fullscreenchange', () => {

        const btn = document.getElementById('fullscreen-btn');

        if (btn) btn.textContent = document.fullscreenElement ? '✕' : '⛶';

    });



    // -------------------------------------------------------

    // PATCH animate() to respect isPaused

    // -------------------------------------------------------

    // We wrap simulationTime increment so pausing freezes orbits

    const _rawAnimate = animate;



    // -----------------------------------------------    // --- SOUND MUTE BUTTON LOGIC ---

    (() => {

        const muteBtn = document.getElementById('sound-btn');

        if (muteBtn) {

            muteBtn.addEventListener('click', () => {

                const muted = SoundEngine.toggleMute();

                muteBtn.textContent = muted ? '🔇' : '🔊';

                muteBtn.title = muted ? 'Sound Off' : 'Sound On';

            });

        }

    })();

    setTimeout(() => {

        document.body.classList.remove('loading');

        updatePlanetCounterRotation();

        updateZoomBadge();

        // Start ambient sound on first user interaction (browser autoplay policy)
        const startSoundOnInteraction = () => {
            SoundEngine.startAmbience();
            document.removeEventListener('click', startSoundOnInteraction);
            document.removeEventListener('keydown', startSoundOnInteraction);
            document.removeEventListener('wheel', startSoundOnInteraction);
        };
        document.addEventListener('click', startSoundOnInteraction);
        document.addEventListener('keydown', startSoundOnInteraction);
        document.addEventListener('wheel', startSoundOnInteraction);

        animate();

    }, 1500);

    window.onerror = () => false;

    window.addEventListener('error', e => e.preventDefault());

    window.addEventListener('unhandledrejection', e => e.preventDefault());