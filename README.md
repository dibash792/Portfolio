# Dibash Lamichhane — Personal Portfolio & 3D Digital Experience

A digital experience designed and built from scratch for **Dibash Lamichhane** — Grade 11 Science student at National School of Sciences (NSS), student-builder, educator, and spiritual seeker exploring technology and inner peace.

---

## 🌟 Core Highlights & Architectural Features

### 1. 3D Cinematic Disintegration Intro
- Loads Dibash's actual portrait (`/dibash-portrait.jpg`).
- Elegant HUD percentage counter tied to real image initialization and offscreen canvas buffer preparation.
- At 100%, triggers the 3D scattering animation: the portrait breaks into **irregular polygonal / Voronoi shards** that disperse outward in 3D space with randomized pitch/yaw/roll rotations, outward z-depth velocity, and specular edge illumination.
- Seamlessly dissolves into the live Hero section rendered beneath.
- Accessible **Skip Intro [ESC]** button and navigation **Replay Intro** control.

### 2. Dual Worlds Experience
- **World A: The Outer World (Technology & Ambition)**
  - Futuristic dark canvas, deep black and slate surfaces, crisp typography.
  - Electric-cyan (`#00f2fe`) and neon blue accents, fine grid lines, and interactive Three.js 3D constellation field responding to cursor movement.
  - Interactive 3D perspective portrait tilt with dynamic specular reflection.
- **World B: The Inner World (Yoga & Inner Peace)**
  - Dedicated section reflecting Dibash's exploration of **Hatha Yoga** and **Kriya Yoga**.
  - Sincere disclaimer clarifying he is a practitioner and student, not an instructor.
  - Interactive **4-Phase Conscious Pranayama Mandala** (Puraka Inhale 4s, Kumbhaka Hold 4s, Rechaka Exhale 4s, Shunya Rest 4s) with expanding sacred geometry.
  - Dedicated space for his verified life intention: *"Seeking inner peace is the main goal of my life."* with reserved space for his future written reflections.

### 3. Complete Bilingual Support (English / नेपाली)
- One-click global language switch that persists in `localStorage`.
- Full Devanagari typography support using Google Font **Mukta**.
- Complete translations across all interface elements, badges, project breakdowns, skills, timeline, and forms.

### 4. Dual Theme System (Dark / Light)
- Centralized CSS Custom Properties token engine.
- 4 full working combinations tested:
  - English + Dark
  - English + Light
  - Nepali + Dark
  - Nepali + Light

### 5. Honest Projects & Skills
- **RollX**: Indoor quad-skating website concept in Lalbandi, Nepal (prototype status, state management & local recreation focus).
- **NSS STEM & Olympiads Hub**: School olympiad activities, quizzes, and logic debugging challenges.
- **Python Creative Art**: Generative fractals, parametric curves, and mathematical sketches.
- **AI Exploration Lab**: Practical workflows, prompt engineering, and student automation.
- Zero fake proficiency percentage bars; categorized into authentic practice and exploration stages.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Dev Server URL: `http://localhost:5173/`

---

## 📁 Project Structure

```
portfolio/
├── public/
│   └── dibash-portrait.jpg      # High-resolution portrait of Dibash
├── src/
│   ├── components/
│   │   ├── CinematicIntro.tsx   # 3D Voronoi portrait shatter & loader
│   │   ├── TechBackground3D.tsx # Three.js interactive spatial field
│   │   ├── Navigation.tsx       # Glass navbar with lang, theme & replay toggles
│   │   ├── Hero.tsx             # 3D tilting portrait card with HUD badges
│   │   ├── About.tsx            # Narrative split layout & dimension cards
│   │   ├── Projects.tsx         # 3D perspective cards + breakdown modal
│   │   ├── Skills.tsx           # Category filtered growth clusters
│   │   ├── Timeline.tsx         # NSS, STEM Vice Head & Bal Uddhar teaching
│   │   ├── YogaSection.tsx      # World B sanctuary & breathing mandala
│   │   ├── Philosophy.tsx       # Verified life intention quote & reflections
│   │   ├── SpeakingGrowth.tsx   # Public speaking & pedagogical clarity
│   │   ├── Contact.tsx          # Interactive form & verified social links
│   │   ├── Footer.tsx           # Status beacon & Nepal origin acknowledgement
│   │   └── Icons.tsx            # Bespoke SVG icons for GitHub & LinkedIn
│   ├── i18n/
│   │   └── translations.ts      # Complete English and Nepali dictionaries
│   ├── types.ts                 # TypeScript type definitions
│   ├── index.css                # Master CSS custom properties & 3D tokens
│   ├── App.tsx                  # Master application orchestrator
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML template with Google Fonts (Outfit, Inter, Mukta)
├── package.json
└── vite.config.ts
```
