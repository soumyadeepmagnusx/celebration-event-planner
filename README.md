# 🎉 Celebratify AI — Intelligent Celebration & Event Planner
> **PromptWars [Challenge 5] Celebration & Event Planner Official Submission**  
> *An autonomous GenAI-powered planning director that helps users organize royal weddings, milestone birthdays, and community celebrations with automated budgets, execution timelines, vendor CRM, and creative studio synthesis.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-26%20Passing-green?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-emerald?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployments & Quick Links

- **Production Live App (Vercel)**: [https://celebration-event-planner-spectronz.vercel.app](https://celebration-event-planner-spectronz.vercel.app)
- **Public GitHub Repository**: [https://github.com/soumyadeepmagnusx/celebration-event-planner](https://github.com/soumyadeepmagnusx/celebration-event-planner)
- **Video Walkthrough Demo (1080p Full HD)**: [Google Drive Demo Stream](https://drive.google.com/file/d/1a6_16MOVayTil4H9UGiuPWKL9hc5BaZh/view?usp=sharing)

---

## 🏛️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph UI ["User Interface Layer (Tailwind CSS & Lucide)"]
        Nav[Navbar & Dark Mode Controller]
        Header[Event Header & Preset Theme Switcher]
        Tabs[Navigation Tabs: Dashboard | Budget | Timelines | Vendors | Studio | Dossier]
        EB[React Enterprise Error Boundary]
    end

    subgraph StateManagement ["State & Context Layer"]
        EC[EventProvider Context]
        Hooks[Custom Hooks: useEventMetrics | useDebounce | useLocalStorage]
        Storage[LocalStorage Persistence & Schema Migrations]
    end

    subgraph AIAndServices ["GenAI Intelligence Layer"]
        Gemini[Google Gemini API / Heuristic Fallback Engine]
        BudgetAI[AI Budget Variance & Reallocation Engine]
        VendorAI[AI Inquiry & Negotiation Drafter]
        StudioAI[AI 6-Tone Copywriter & Artisan Menu Synthesizer]
    end

    subgraph SecurityAndValidation ["Security & Quality Layer"]
        Zod[Runtime Zod Schema Validation]
        Sanitizer[XSS & Prompt Injection Defensive Filters]
        A11y[WCAG 2.1 AA Focus & Screen Reader Landmarks]
    end

    EB --> UI
    UI <--> StateManagement
    StateManagement <--> AIAndServices
    UI <--> SecurityAndValidation
```

---

## 💎 Core Architecture & Enterprise Features

### 1. 🏛️ Multi-Event Architecture & Theme Engine
- **Three Production Presets**:
  1. *Julian & Elena’s Conservatory Soirée* (Royal Wedding, Rose & Champagne palette, Playfair Display typography)
  2. *NOVA // 30: Midnight Penthouse Odyssey* (Milestone 30th Birthday, Cyber Velvet & Electric Magenta palette, dark neon aesthetic)
  3. *Solstice Earth & Artisan Commons* (Green Community Festival, Botanical Emerald & Terracotta palette, community styling)
- **Dynamic CSS Variable Theming**: Single-click dynamic palette injection changing accent gradients, card badges, borders, and typography.

### 2. 💰 Smart Budget Planner & AI Optimizer
- **Variance Calculations**: Real-time category-by-category estimated vs. actual expenses, paid liquid deposits, and buffer telemetry.
- **Instant Multi-Currency Switching**: Seamless conversion across USD (`$`), INR (`₹`), EUR (`€`), and GBP (`£`).
- **AI Budget Reallocation**: Scans category overages and computes smart fund reallocations (e.g. trimming print stationery to offset floral installation spikes).

### 3. ⏱️ Phased Milestones & Day-Of Run-of-Show
- **High-Level Milestone Roadmap**: Checkpoints from 12 Months, 6 Months, 3 Months, 1 Month, and Event Week.
- **Minute-by-Minute Day-Of Run-of-Show**: Time-stamped execution schedule with designated team leads, room/zones, and live checkoffs.

### 4. 🤝 Vendor Checklists & Contract Negotiation CRM
- **Pipeline Kanban**: Lifecycle tracking from `Researching` ➔ `Contacted` ➔ `Quoted` ➔ `Booked` ➔ `Completed`.
- **AI Contract Negotiation**: Generates tailored inquiry letters with mandatory legal reschedule and weather contingency clauses.

### 5. 🎨 GenAI Creative Ideation Studio
- **6-Tone Invitation Copywriter**: Authors invitations in *Royal & Formal*, *Warm & Heartfelt*, *Witty & Playful*, *Poetic*, and *Modern Minimalist* tones.
- **Artisan Menus & Dietary Safety**: Curates welcome drinks, canapés, and signature mains with dedicated Vegan, Gluten-Free, and Allergen badges.
- **Curated Music Playlists**: Spotify-style mood playlists with track suggestions and key-moment entrance soundtracks.
- **AI Speech & Toast Ghostwriter**: 2.5-minute custom speeches tailored to the speaker's role with delivery cues.
- **Plan B Contingency Shield**: Proactive protocols for severe weather, vendor delays, and crowd overages.

---

## 🧪 Comprehensive Automated Testing (26 / 26 Passing)

Celebratify AI features an automated test suite using **Vitest** and **React Testing Library**:

| Test Suite File | Tests | Focus Area |
| :--- | :---: | :--- |
| `src/test/calculations.test.ts` | 4 | Budget variance, category distribution, milestone velocity, vendor commitments |
| `src/test/validation.test.ts` | 6 | Zod schema parsing, XSS tag stripping, and LLM prompt injection defenses |
| `src/test/geminiService.test.ts` | 9 | Plan synthesis, vendor letter generation, menu generation, speech ghostwriting |
| `src/test/Accessibility.test.tsx` | 4 | WCAG 2.1 AA keyboard navigation, skip-to-content links, ARIA roles, dialog modal traps |
| `src/test/ErrorBoundary.test.tsx` | 2 | Enterprise error boundary fallback, role="alert", error diagnostics, reload recovery |
| `src/test/hooks.test.ts` | 1 | Memoized metrics aggregation and performance optimization |

```bash
# Run test suite
npm test -- --run
```

---

## 🛡️ Security & Defensive Engineering

1. **Zero Secret Leakage**: API keys are client-side only (BYOK) or leverage the zero-dependency offline heuristic simulation engine.
2. **Strict Zod Runtime Validation**: Every form input is strictly validated through Zod schemas before entering the state graph.
3. **Dual-Layer Sanitization**:
   - `sanitizeInput()`: Strips HTML angle brackets to prevent Stored XSS.
   - `sanitizePromptText()`: Neutralizes adversarial LLM prompt injections (e.g. `ignore previous instructions`, `system:` overrides).
4. **React Error Boundary**: Enterprise-grade error boundaries catch rendering exceptions with graceful fallback recovery.

---

## 📂 Modular Clean Code Directory Structure

```
celebration-event-planner/
├── .editorconfig               # Cross-editor formatting specifications
├── .eslintrc.json              # Strict TypeScript & React Hooks ESLint configuration
├── .prettierrc                 # Code formatting standards
├── index.html                  # HTML5 entry with WCAG language and viewport tags
├── package.json                # Lean dependencies (Vite, React, Lucide, Zod, Vitest)
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Bundler optimization and Vitest configuration
└── src/
    ├── components/             # Single-responsibility presentation components
    │   ├── budget/             # Smart Budget & Multi-Currency Switcher
    │   ├── chat/               # AI Co-Planner slide-over drawer
    │   ├── common/             # ErrorBoundary, Modal, Navbar, ProgressBar
    │   ├── dashboard/          # Executive KPI Overview & Readiness Score
    │   ├── event/              # EventHeader & Preset Switcher
    │   ├── ideas/              # GenAI Creative Studio
    │   ├── print/              # Printable Master Dossier (Binder Format)
    │   ├── timeline/           # Milestones & Minute-by-Minute Run-of-Show
    │   └── vendors/            # Vendor Pipeline CRM & Negotiation Letter Generator
    ├── constants/              # Category definitions, currency configs, luxury presets
    ├── context/                # EventContext global state engine
    ├── hooks/                  # useEventMetrics, useDebounce, useLocalStorage
    ├── services/               # Gemini AI API, Storage, Export/Import services
    ├── test/                   # Vitest unit & integration test suites
    ├── types/                  # Strict TypeScript interfaces and schemas
    └── utils/                  # Pure calculation, formatting, and validation utilities
```

---

## 🚀 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/soumyadeepmagnusx/celebration-event-planner.git
cd celebration-event-planner

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run automated test suite
npm test -- --run

# 5. Build optimized production bundle
npm run build
```

---

## 📄 License
This project is open-source under the **MIT License**.
