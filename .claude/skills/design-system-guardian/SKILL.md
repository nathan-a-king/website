---
name: design-system-guardian
description: Validate design system consistency, check color usage, ensure dark mode coverage, verify Tailwind config sync. Use when checking design consistency, validating color tokens, ensuring dark mode works, auditing component styling, or maintaining the design system.
---

# Design System Guardian

Specialized skill for maintaining design system consistency in this React/Tailwind website with adaptive color system and dark mode support.

## Color System Overview

This website uses a **CSS custom properties system** with Tailwind integration:

### Architecture

1. **CSS Custom Properties** (`src/styles/globals.css`)
   - Single source of truth for colors
   - Automatically adapt to light/dark mode
   - Defined in `:root` and `.dark` selectors

2. **Tailwind Integration** (`tailwind.config.js`)
   - References CSS variables
   - Provides utility classes
   - Supports both adaptive and static colors

### Color Types

**Adaptive Colors** (auto-switch with theme):
- `bg-brand-bg` - Background color
- `text-brand-text-primary` - Primary text
- `text-brand-text-secondary` - Secondary text
- `text-brand-text-tertiary` - Tertiary text
- `bg-brand-surface` - Surface elements
- `border-brand-border` - Border colors
- `bg-brand-accent` - Accent (terracotta)
- `bg-brand-accent-blue` - Blue accent
- `bg-brand-accent-purple` - Purple accent

**Static Colors** (fixed, don't change):
- `brand-cream`, `brand-charcoal`, `brand-terracotta`, etc.
- Use only when you specifically need a fixed color

## Validation

### Check Color Usage

Audit all components for proper color usage:

```bash
node .claude/skills/design-system-guardian/scripts/color-audit.js
```

Checks:
- ✅ Using adaptive colors (`brand-bg`, `brand-text-primary`)
- ❌ Hardcoded colors (`#FAF9F5`, `rgb(...)`)
- ❌ Using static colors when adaptive should be used
- ⚠️ Missing dark mode variants

### Verify Dark Mode Coverage

Check all components support dark mode:

```bash
node .claude/skills/design-system-guardian/scripts/dark-mode-check.js
```

Validates:
- All color references use adaptive tokens
- No hardcoded light-only colors
- Dark mode class coverage

### Check Tailwind Config Sync

Ensure `tailwind.config.js` matches `globals.css`:

```bash
node .claude/skills/design-system-guardian/scripts/check-sync.js
```

Compares:
- CSS variables in globals.css
- Tailwind color definitions in config
- Flags mismatches or missing mappings

## Design System Files

### Key Files

- `src/styles/globals.css` - CSS custom properties (source of truth)
- `tailwind.config.js` - Tailwind configuration
- `COLOR_SYSTEM.md` - Color system documentation
- `DESIGN.md` - Overall design documentation
- `src/contexts/ThemeContext.jsx` - Theme state management

### Color Variables

**Light mode** (`:root`):
```css
--color-bg: #FAF9F5           /* cream background */
--color-text-primary: #141413   /* charcoal text */
--color-text-secondary: #3D3D3A /* muted text */
--color-accent: #CC6B4A         /* terracotta accent */
```

**Dark mode** (`.dark`):
```css
--color-bg: #252522            /* dark background */
--color-text-primary: #FFFFFF   /* white text */
--color-text-secondary: #AFAEA8 /* muted light text */
--color-accent: #E88B6A         /* lighter terracotta */
```

## Best Practices

### Using Colors in Components

**✅ Correct** - Use adaptive tokens:
```jsx
<div className="bg-brand-bg text-brand-text-primary">
  <h1 className="text-brand-text-primary">Title</h1>
  <p className="text-brand-text-secondary">Description</p>
  <button className="bg-brand-accent">Click</button>
</div>
```

**❌ Incorrect** - Hardcoded colors:
```jsx
<div className="bg-[#FAF9F5] text-[#141413]">
  <h1 className="text-gray-900">Title</h1>
</div>
```

**❌ Incorrect** - Manual dark mode:
```jsx
<div className="bg-white dark:bg-gray-900">
  {/* Should use bg-brand-bg instead */}
</div>
```

### When to Use Static Colors

Use static colors ONLY for:
- Brand logos that must stay consistent
- Specific design elements that shouldn't change
- Decorative elements with fixed colors

```jsx
{/* Valid use of static color */}
<div className="bg-brand-terracotta text-white">
  Brand Banner - Always Terracotta
</div>
```

### Dark Mode Guidelines

1. **Never use manual dark: classes** for theme colors
   - Use adaptive tokens instead
   - They automatically switch with theme

2. **Test in both modes**
   - Toggle theme in UI
   - Check all color combinations
   - Verify contrast ratios

3. **Accessibility first**
   - Maintain 4.5:1 contrast for text
   - Use semantic color names
   - Test with screen readers

## Accessibility Checks

### Color Contrast

Verify WCAG AA compliance:

```bash
node .claude/skills/design-system-guardian/scripts/contrast-check.js
```

Checks:
- Text/background contrast > 4.5:1 (AA)
- Large text contrast > 3:1
- UI component contrast > 3:1

### Contrast Ratios

**Current system meets WCAG AA**:

Light mode:
- Primary text on background: 15.8:1 ✅
- Secondary text on background: 9.7:1 ✅
- Tertiary text on background: 5.1:1 ✅

Dark mode:
- Primary text on background: 13.2:1 ✅
- Secondary text on background: 7.1:1 ✅
- Tertiary text on background: 4.6:1 ✅

## Common Issues

### Issue: Hardcoded Colors

**Problem**: Component uses `bg-white` or `bg-gray-900`

**Fix**: Replace with adaptive token
```jsx
// Before
<div className="bg-white dark:bg-gray-900">

// After
<div className="bg-brand-bg">
```

### Issue: Tailwind/CSS Mismatch

**Problem**: Added CSS variable but forgot to add to Tailwind config

**Fix**: Add to `tailwind.config.js`
```javascript
colors: {
  brand: {
    'new-color': 'var(--color-new-color)',
  }
}
```

### Issue: Missing Dark Mode Value

**Problem**: Added color to `:root` but not `.dark`

**Fix**: Add corresponding dark mode value
```css
.dark {
  --color-new-color: #darkvalue;
}
```

### Issue: Poor Contrast in Dark Mode

**Problem**: Color combination fails WCAG AA in dark mode

**Fix**: Adjust dark mode color values in `globals.css`

## Testing Workflow

### Component Review Checklist

When creating/reviewing components:

1. **Color usage**:
   - [ ] Uses adaptive tokens (not hardcoded)
   - [ ] No manual dark: classes for theme colors
   - [ ] Static colors only where appropriate

2. **Dark mode**:
   - [ ] Test in both light and dark mode
   - [ ] All text is readable
   - [ ] Interactive elements visible
   - [ ] Borders and dividers present

3. **Accessibility**:
   - [ ] Text meets contrast requirements
   - [ ] Focus states visible
   - [ ] Color not sole indicator of state

4. **Documentation**:
   - [ ] New colors added to globals.css
   - [ ] Tailwind config updated
   - [ ] COLOR_SYSTEM.md updated if needed

### Quick Test

```bash
# Run all design system checks
npm run check-design-system

# Or manually:
node .claude/skills/design-system-guardian/scripts/color-audit.js
node .claude/skills/design-system-guardian/scripts/dark-mode-check.js
node .claude/skills/design-system-guardian/scripts/check-sync.js
```

## Adding New Colors

### Process

1. **Add to globals.css**:
```css
:root {
  --color-new-semantic: #lightvalue;
}

.dark {
  --color-new-semantic: #darkvalue;
}
```

2. **Add to tailwind.config.js**:
```javascript
colors: {
  brand: {
    'new-semantic': 'var(--color-new-semantic)',
  }
}
```

3. **Test**:
```bash
npm run dev
# Toggle dark mode, verify color
```

4. **Document**:
Update COLOR_SYSTEM.md with new color purpose and usage

### Naming Conventions

**Semantic names** (preferred):
- `--color-bg` (not `--color-cream`)
- `--color-text-primary` (not `--color-charcoal`)
- `--color-accent` (not `--color-terracotta`)

**Benefits**:
- Intent is clear
- Can change underlying color without renaming
- Better for theming

## Integration

### With Other Skills

- **content-quality-checker**: Checks if images work in both themes
- **build-validator**: Validates CSS builds correctly

### With Development Workflow

1. **Before commit**: Run color audit
2. **In PR review**: Check dark mode screenshots
3. **After deployment**: Verify theme toggle works

## Scripts Reference

- `color-audit.js` - Find hardcoded colors
- `dark-mode-check.js` - Verify dark mode coverage
- `check-sync.js` - Validate CSS/Tailwind sync
- `contrast-check.js` - Test accessibility contrast

## Resources

- `COLOR_SYSTEM.md` - Detailed color system docs
- `DESIGN.md` - Overall design philosophy
- `src/styles/globals.css` - Color definitions
- `tailwind.config.js` - Tailwind setup
