# Test Suite Implementation Plan

## Overview
Implement comprehensive testing for the website with a focus on critical business logic, core components, and user flows. Current coverage is minimal (~3% - only SEO utils). Target: 70-80% coverage.

## Current State
- ✅ Vitest + React Testing Library configured
- ✅ Excellent SEO test suite (`src/utils/seo.test.js`) as reference
- ❌ No tests for hooks, contexts, components, or pages

---

## Phase 1: Critical Business Logic (Hooks & Context)
**Priority: HIGH** - Complex state management and caching logic

### 1.1 Hooks Tests
- [X] **`src/hooks/__tests__/usePosts.test.js`**
  - Post fetching and API integration
  - Cache management (5-minute TTL)
  - Stale-while-revalidate pattern
  - Error handling and retry logic
  - `preloadPost` functionality

- [X] **`src/hooks/__tests__/usePageTitle.test.js`**
  - Document title updates
  - Cleanup on unmount

- [X] **`src/hooks/__tests__/useIntersectionObserver.test.js`**
  - Observer setup and teardown
  - Callback invocation on intersection
  - Options handling

### 1.2 Context Tests
- [X] **`src/contexts/__tests__/ThemeContext.test.jsx`**
  - `toggleTheme()` functionality
  - `resetToSystemPreference()` functionality
  - localStorage persistence
  - System preference detection (`prefers-color-scheme`)
  - Favicon updates based on theme
  - Initial theme loading

---

## Phase 2: Core Components
**Priority: MEDIUM** - User-facing functionality

### 2.1 Navigation & Layout
- [ ] **`src/components/__tests__/Navigation.test.jsx`**
  - Active link highlighting
  - Mobile menu toggle
  - Route navigation
  - Accessibility (ARIA labels)

- [ ] **`src/components/__tests__/ThemeToggle.test.jsx`**
  - Theme switching UI
  - Icon changes (sun/moon)
  - Context integration

### 2.2 Error Handling
- [ ] **`src/components/__tests__/ErrorBoundary.test.jsx`**
  - Error catching and display
  - Error UI rendering
  - Reset functionality
  - Fallback UI

### 2.3 Content Display
- [ ] **`src/components/__tests__/LazyPostCard.test.jsx`**
  - Post metadata display
  - Link generation
  - Preload on hover
  - Date formatting

- [ ] **`src/components/__tests__/LazyMarkdown.test.jsx`** (optional)
  - Markdown rendering
  - Code block handling

- [ ] **`src/components/__tests__/StructuredData.test.jsx`**
  - JSON-LD generation
  - Schema.org compliance

---

## Phase 3: Pages & Integration Tests
**Priority: MEDIUM** - Complete user flows

### 3.1 Blog Pages
- [ ] **`src/pages/__tests__/BlogPage.test.jsx`**
  - Post list rendering
  - Loading state
  - Error state
  - Empty state

- [ ] **`src/pages/__tests__/PostPage.test.jsx`**
  - Individual post rendering
  - 404 handling (invalid slug)
  - Metadata/SEO tags
  - Loading state

- [ ] **`src/pages/__tests__/HomePage.test.jsx`**
  - Hero section rendering
  - Latest 3 posts display
  - Navigation to blog

### 3.2 Static Pages
- [ ] **`src/pages/__tests__/AboutPage.test.jsx`**
  - Content rendering

- [ ] **`src/pages/__tests__/ContactPage.test.jsx`**
  - Content rendering

- [ ] **`src/pages/__tests__/ResumePage.test.jsx`**
  - Skills rendering
  - Content display

---

## Phase 4: Utilities & Configuration
**Priority: LOW** - Fill remaining gaps

### 4.1 Remaining Utils
- [ ] **`src/utils/logger.test.js`**
  - Development vs production logging
  - Error formatting
  - Log levels

- [ ] **`src/utils/skills.test.js`**
  - Skills data structure
  - Data transformations (if any)

### 4.2 App-Level Integration
- [ ] **`src/__tests__/App.test.jsx`**
  - Routing configuration
  - Context providers
  - ErrorBoundary integration
  - Basic route rendering

### 4.3 Configuration Updates
- [ ] **Update `vitest.config.js`**
  - Expand coverage from `src/utils/**` to all `src/**` files
  - Add coverage thresholds:
    ```js
    coverage: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
    ```
  - Exclude test files and setup from coverage

---

## Testing Principles

### Follow Existing Patterns
- Reference `src/utils/seo.test.js` for style and structure
- Use descriptive test names: `describe('Component/Function')` → `it('should do X when Y')`
- Group related tests with nested `describe` blocks

### React Testing Library Best Practices
- Use user-centric queries: `getByRole`, `getByLabelText`, `getByText`
- Avoid implementation details: don't test state directly
- Test behavior, not implementation
- Use `userEvent` for interactions (not `fireEvent`)

### Mocking Strategy
- Mock `fetch` for API calls (MSW or vi.fn())
- Mock `localStorage` and `matchMedia` for browser APIs
- Mock `react-router-dom` for routing tests
- Keep mocks simple and focused

### What to Test
✅ **DO test:**
- User interactions and flows
- Props and state changes
- Error states and edge cases
- Accessibility features
- Critical business logic

❌ **DON'T test:**
- Third-party library internals
- CSS styling (use visual regression if needed)
- Trivial getters/setters
- Implementation details

---

## Success Criteria
- [ ] All phases completed
- [ ] Test coverage ≥ 70% overall
- [ ] All tests passing (`npm test`)
- [ ] No console errors/warnings in tests
- [ ] CI/CD integration (if applicable)
- [ ] Documentation updated

---

## Commands Reference
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:run      # Run tests once (CI)
npm run test:coverage # Generate coverage report
```

## Implementation Notes
- Start with Phase 1 (highest risk/complexity)
- Tests can be implemented incrementally
- Each test file should be self-contained
- Run tests frequently during development
- Update this document as you complete items (check boxes)

---

**Created:** 2025-11-05
**Target Completion:** TBD
**Estimated Effort:** 12-16 hours for comprehensive coverage
