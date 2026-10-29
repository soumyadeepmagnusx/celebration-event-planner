# 🤝 Contributing to Celebratify AI

Thank you for contributing to Celebratify AI! This project adheres to strict clean code principles, full TypeScript type safety, and 100% test pass rates.

## 🛠️ Development Workflow

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/soumyadeepmagnusx/celebration-event-planner.git
   cd celebration-event-planner
   npm install
   ```

2. **Branching Model**:
   - Feature branches: `feat/feature-name`
   - Bug fixes: `fix/bug-description`
   - Refactoring: `refactor/scope`

3. **Code Quality Gates**:
   Before submitting a Pull Request, ensure all checks pass:
   ```bash
   # Type check
   npx tsc --noEmit

   # Lint check
   npm run lint

   # Test suite
   npm test -- --run

   # Production build
   npm run build
   ```

4. **Standards & Conventions**:
   - Every utility function must have **TSDoc/JSDoc** documentation (`@param`, `@returns`).
   - All forms must use **Zod runtime validation** (`utils/validation.ts`).
   - Interactive elements must maintain **WCAG 2.1 AA accessibility** (keyboard focus, ARIA tags).
