# 🏛️ Celebratify AI — Enterprise Architectural Blueprint

> **Technical Specification & Design Patterns Catalog**  
> PromptWars Challenge 5: Autonomous Celebration & Event Planning Engine

---

## 1. Architectural Principles

Celebratify AI is architected in accordance with **Clean Architecture** and **SOLID Design Principles** to ensure high cohesion, low coupling, deterministic predictability, and zero side-effects.

```mermaid
flowchart TD
    subgraph PresentationLayer ["1. Presentation Layer (Atomic React Components)"]
        Dashboard[Overview Dashboard & Readiness Gauge]
        BudgetUI[Budget KPI Grid & Expense Table]
        TimelineUI[Milestone Roadmap & Run-of-Show]
        VendorUI[Vendor Pipeline CRM & AI Modal]
        StudioUI[6-Tone Copywriter & Artisan Menus]
    end

    subgraph DomainLayer ["2. Domain & State Layer (Pure Business Logic)"]
        EventContext[EventContext Central State Graph]
        Hooks[Custom Hooks: useEventMetrics, useDebounce, useLocalStorage]
        Calculations[Pure O(N) Variance & Milestone Calculators]
    end

    subgraph ServiceLayer ["3. Application Services & AI Layer"]
        GeminiService[Gemini API Client & Heuristic Fallback Engine]
        StorageService[Local Storage Data Access Object - DAO]
        ExportService[CSV / JSON Serializers & Dossier Formatter]
    end

    subgraph SecurityLayer ["4. Cross-Cutting Security & Quality"]
        ZodValidator[Strict Zod Schemas]
        Sanitizer[XSS & Prompt Injection Filters]
        ErrorBoundary[React Enterprise Error Boundary]
    end

    PresentationLayer <--> DomainLayer
    DomainLayer <--> ServiceLayer
    PresentationLayer <--> SecurityLayer
```

---

## 2. Software Design Patterns Catalog

### A. Strategy Pattern (Multi-Event Theme & Currency Engines)
- **Problem**: Different celebrations require drastically distinct aesthetic tokens (fonts, palettes, badges) and financial denominations without contaminating component logic.
- **Solution**: The `EVENT_PRESETS` catalog and `CURRENCIES` dictionary act as runtime strategies. Swapping an event or currency applies a drop-in calculation and styling strategy without re-mounting or mutating historical data.

### B. Factory Pattern (Generative Plan Synthesis)
- **Problem**: Synthesizing a comprehensive, multi-dimensional event plan (budgets, milestones, vendors, menus, invitations) requires coordinated object instantiation.
- **Solution**: `generateCompleteEventPlan()` serves as an abstract factory. It returns a fully validated, deeply typed `EventData` instance conforming to `createEventSchema`.

### C. Fallback / Null-Object Pattern (Offline-First Heuristics)
- **Problem**: External cloud LLM inference APIs can experience network partition, rate limits, or absence of credentials.
- **Solution**: `callGeminiApi()` utilizes a defensive circuit-breaker fallback. If the network or credentials fail, the high-intelligence deterministic heuristic generator immediately fulfills the contract with zero downtime.

### D. Observer Pattern (Reactive Context Engine)
- **Problem**: Deep component trees need immediate access to budget metrics and timeline progress without prop drilling.
- **Solution**: `EventContext` broadcasts state updates to subscriber components. Memoized selectors (`useEventMetrics`) compute derived state only when relevant dependencies mutate.

---

## 3. Separation of Concerns & Sub-Modular Decomposition

To maintain strict single-responsibility boundaries:
- **`BudgetKpiGrid.tsx`**: Pure presentation of Target Budget, Estimated, Actual, and Remaining Buffer cards.
- **`BudgetExpenseTable.tsx`**: Tabular rendering with category filtering, paid status toggles, and deletion.
- **`BudgetOverview.tsx`**: Lightweight coordinator handling modals and action dispatching (< 120 lines).
- **`ErrorBoundary.tsx`**: Dedicated failure-domain isolation with WCAG `role="alert"` announcements.

---

## 4. Security & Defensive Invariants

1. **Input Sanitization**: All user strings pass through `sanitizeInput()` (stripping `<>` tags) before Zod parsing.
2. **Prompt Injection Hardening**: `sanitizePromptText()` filters adversarial command sequences (`ignore previous instructions`, `system:`) and restricts character length to 1,500 characters.
3. **Immutability Invariant**: Context reducers and setters return fresh object copies via object-spread and array `.map()` / `.filter()`, preventing unintended memory-leak side-effects.

---

## 5. Verification & Testing Topology

Celebratify AI enforces a 3-tier testing pyramid:
1. **Unit & Calculation Tier**: Validates numerical precision, rounding, and negative buffer handling.
2. **Schema & Security Tier**: Verifies Zod boundary enforcement, XSS filtering, and injection neutrality.
3. **Accessibility & Integration Tier**: Tests keyboard focus traversal, ARIA announcements, and screen-reader skip links.
