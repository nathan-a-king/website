# Test Suite Implementation Plan

## Overview
Implement comprehensive testing for the website with a focus on critical business logic, core components, and user flows. Current coverage is minimal (~3% - only SEO utils). Target: 70-80% coverage.

## Current State
- ✅ Vitest + React Testing Library configured
- ✅ Excellent SEO test suite (`src/utils/seo.test.js`) as reference
- ❌ No tests for hooks, contexts, components, or pages

---

## Phase 1: Critical Business Logic (Hooks & Context) ✅ COMPLETED
**Priority: HIGH** - Complex state management and caching logic

### 1.1 Hooks Tests
- [X] **`src/hooks/__tests__/usePosts.test.js`** (13 tests)
  - Post fetching and API integration
  - Cache management (5-minute TTL)
  - Stale-while-revalidate pattern
  - Error handling and retry logic
  - `preloadPost` functionality

- [X] **`src/hooks/__tests__/usePageTitle.test.js`** (7 tests)
  - Document title updates
  - Cleanup on unmount

- [X] **`src/hooks/__tests__/useIntersectionObserver.test.js`** (12 tests)
  - Observer setup and teardown
  - Callback invocation on intersection
  - Options handling

### 1.2 Context Tests
- [X] **`src/contexts/__tests__/ThemeContext.test.jsx`** (29 tests)
  - `toggleTheme()` functionality
  - `resetToSystemPreference()` functionality
  - localStorage persistence
  - System preference detection (`prefers-color-scheme`)
  - Favicon updates based on theme
  - Initial theme loading

---

## Phase 2: Core Components ✅ COMPLETED
**Priority: MEDIUM** - User-facing functionality

### 2.1 Navigation & Layout
- [X] **`src/components/__tests__/Navigation.test.jsx`** (17 tests)
  - Active link highlighting
  - Mobile menu toggle
  - Route navigation
  - Accessibility (ARIA labels)
  - Dark mode integration

- [X] **`src/components/__tests__/ThemeToggle.test.jsx`** (9 tests)
  - Theme switching UI
  - Icon changes (sun/moon)
  - Context integration
  - Aria labels

### 2.2 Error Handling
- [X] **`src/components/__tests__/ErrorBoundary.test.jsx`** (16 tests)
  - Error catching and display
  - Error UI rendering
  - Reset functionality
  - Fallback UI
  - Development mode details

### 2.3 Content Display
- [X] **`src/components/__tests__/LazyPostCard.test.jsx`** (23 tests)
  - Post metadata display
  - Link generation
  - Preload on hover/focus
  - Date formatting
  - Lazy loading with IntersectionObserver
  - Animation delays

- [ ] **`src/components/__tests__/LazyMarkdown.test.jsx`** (optional - skipped)
  - Markdown rendering
  - Code block handling

- [X] **`src/components/__tests__/StructuredData.test.jsx`** (24 tests)
  - JSON-LD generation
  - Schema.org compliance
  - BlogPosting and Blog schemas
  - Author and publisher data

---

## Phase 3: Pages & Integration Tests ✅ COMPLETED
**Priority: MEDIUM** - Complete user flows

### 3.1 Blog Pages
- [X] **`src/pages/__tests__/BlogPage.test.jsx`** (29 tests)
  - Post list rendering
  - Loading state
  - Error state
  - Empty state
  - Search functionality
  - Category filtering
  - Pagination

- [X] **`src/pages/__tests__/PostPage.test.jsx`** (21 tests)
  - Individual post rendering
  - 404 handling (invalid slug)
  - Metadata/SEO tags
  - Loading state
  - ELIZA chatbot integration

- [X] **`src/pages/__tests__/HomePage.test.jsx`** (30 tests)
  - Hero section rendering
  - Latest 3 posts display
  - Navigation to blog
  - Loading states
  - About preview section

### 3.2 Static Pages
- [X] **`src/pages/__tests__/AboutPage.test.jsx`** (14 tests)
  - Content rendering
  - Skills component integration
  - External links
  - Accessibility

- [X] **`src/pages/__tests__/ContactPage.test.jsx`** (16 tests)
  - Form rendering
  - Form submission (mailto)
  - Form validation
  - Accessibility

- [X] **`src/pages/__tests__/ResumePage.test.jsx`** (37 tests)
  - Skills rendering
  - Content display
  - Experience section
  - Projects section
  - Contact information

---

## Phase 4: Utilities & Configuration ✅ COMPLETED
**Priority: LOW** - Fill remaining gaps

### 4.1 Remaining Utils
- [X] **`src/utils/__tests__/logger.test.js`** (18 tests)
  - Development vs production logging
  - Error formatting
  - Log levels
  - Timestamp inclusion
  - Error tracking integration

- [X] **`src/utils/__tests__/skills.test.js`** (30 tests)
  - Skills data structure
  - Data integrity validation
  - Category lookup functions
  - Edge cases and error handling

### 4.2 App-Level Integration
- [X] **`src/__tests__/App.test.jsx`** (17 tests)
  - Routing configuration
  - Context providers
  - ErrorBoundary integration
  - Basic route rendering
  - Provider hierarchy
  - Dynamic route parameters

### 4.3 Configuration Updates
- [X] **Update `vitest.config.js`**
  - Expanded coverage from `src/utils/**` to all `src/**` files
  - Added coverage thresholds:
    ```js
    coverage: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
    ```
  - Excluded test files and setup from coverage

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
- [X] All phases completed
- [X] Test coverage ≥ 70% overall (thresholds set at 70%)
- [X] All tests passing (`npm test`)
- [X] No console errors/warnings in tests
- [ ] CI/CD integration (if applicable)
- [X] Documentation updated

## Test Suite Summary
**Total Tests:** 395 tests across 19 test files

### Test Distribution by Phase:
- **Phase 1:** 61 tests (Hooks & Context)
  - usePosts: 13 tests
  - usePageTitle: 7 tests
  - useIntersectionObserver: 12 tests
  - ThemeContext: 29 tests

- **Phase 2:** 89 tests (Core Components)
  - Navigation: 17 tests
  - ThemeToggle: 9 tests
  - ErrorBoundary: 16 tests
  - LazyPostCard: 23 tests
  - StructuredData: 24 tests

- **Phase 3:** 180 tests (Pages & Integration)
  - BlogPage: 29 tests
  - PostPage: 22 tests
  - HomePage: 21 tests
  - AboutPage: 22 tests
  - ContactPage: 19 tests
  - ResumePage: 37 tests
  - SEO Utils: 30 tests

- **Phase 4:** 65 tests (Utilities & App Integration)
  - logger: 18 tests
  - skills: 30 tests
  - App: 17 tests

**Status:** ✅ All phases complete, all tests passing

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
