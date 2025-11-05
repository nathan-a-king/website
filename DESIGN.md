# Design System Documentation

This document describes the design system used in this website, inspired by Claude.ai's visual aesthetic.

## Philosophy

The design system emphasizes:
- **Warmth & Sophistication**: Warm neutral tones with elegant serif typography
- **Clarity**: Clean layouts with intentional whitespace
- **Consistency**: Unified patterns across all components
- **Accessibility**: Proper contrast ratios and focus states
- **Maintainability**: Single source of truth for design tokens

## Color System

### Architecture

Colors are defined once in [src/styles/globals.css](src/styles/globals.css) using CSS custom properties that automatically adapt to light/dark mode:

```css
:root {
  --color-bg: #FAF9F5;              /* Warm cream background */
  --color-surface: #F8F7F4;         /* Subtle surface color */
  --color-text-primary: #141413;    /* Primary text */
  --color-text-secondary: #3D3D3A;  /* Secondary text */
  --color-text-tertiary: #73726C;   /* Tertiary text */
  --color-accent: #CC6B4A;          /* Terracotta accent */
  --color-accent-blue: #2E5A91;     /* Blue accent */
  --color-accent-purple: #9B8FD6;   /* Purple accent */
  --color-border: rgba(31, 30, 29, 0.15); /* Subtle borders */
}

.dark {
  --color-bg: #252522;
  --color-surface: #323230;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #E5E4E0;
  --color-text-tertiary: #B5B4B0;
  --color-border: rgba(250, 249, 245, 0.15);
}
```

### Tailwind Integration

The [tailwind.config.js](tailwind.config.js) references these CSS variables:

```javascript
colors: {
  brand: {
    // Adaptive colors (automatically switch with theme)
    bg: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    'text-primary': 'var(--color-text-primary)',
    'text-secondary': 'var(--color-text-secondary)',
    'text-tertiary': 'var(--color-text-tertiary)',
    accent: 'var(--color-accent)',

    // Static colors (for specific use cases)
    cream: '#FAF9F5',
    charcoal: '#141413',
    ink: '#252522',
    terracotta: '#CC6B4A',
    // ...
  }
}
```

### Color Palette

| Usage | Light Mode | Dark Mode | Tailwind Class |
|-------|-----------|-----------|----------------|
| **Backgrounds** |
| Primary Background | `#FAF9F5` Warm Cream | `#252522` Charcoal | `bg-brand-cream dark:bg-brand-ink` |
| Surface/Cards | `#F8F7F4` Soft | `#323230` Surface | `bg-brand-soft dark:bg-brand-surface` |
| **Text** |
| Primary | `#141413` Charcoal | `#FFFFFF` White | `text-brand-charcoal dark:text-brand-cream` |
| Secondary | `#3D3D3A` Gray Medium | `#E5E4E0` Gray Light | `text-brand-gray-medium dark:text-brand-gray-light` |
| Tertiary | `#73726C` Gray | `#B5B4B0` Gray | `text-brand-gray-light` |
| **Accents** |
| Primary | `#CC6B4A` Terracotta | (same) | `text-brand-terracotta` |
| Secondary | `#2E5A91` Blue | (same) | `text-brand-blue` |
| Tertiary | `#9B8FD6` Purple | (same) | `text-brand-purple` |
| **Borders** |
| Standard | `rgba(31,30,29,0.15)` | `rgba(250,249,245,0.15)` | `border-brand-gray-border dark:border-white/10` |

### Usage Examples

```jsx
// Standard card with adaptive colors
<div className="bg-brand-soft dark:bg-brand-charcoal/20 border border-brand-gray-border dark:border-white/10">
  <h2 className="text-brand-charcoal dark:text-brand-cream">Title</h2>
  <p className="text-brand-gray-medium dark:text-brand-gray-light">Description</p>
</div>

// Button with accent color
<button className="bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90">
  Click me
</button>
```

## Typography

### Font Families

- **Serif**: Georgia (Headings, display text)
- **Sans-serif**: Avenir (Body, UI elements)
- **Monospace**: System monospace stack (Code blocks)

### Typography Scale

```jsx
// Display heading (Hero sections)
<h1 className="text-4xl md:text-5xl font-serif font-light">

// Large heading (Page titles)
<h1 className="text-3xl md:text-4xl font-serif font-normal">

// Medium heading (Section titles)
<h2 className="text-2xl md:text-3xl font-serif font-normal">

// Small heading (Card titles)
<h3 className="text-xl font-serif font-normal">

// Body text
<p className="text-base font-sans">

// Small text (Captions, metadata)
<span className="text-sm font-sans">
```

### Custom Typography Classes

Defined in [src/styles/fonts.css](src/styles/fonts.css):

```css
.heading-display {
  font-family: Georgia, serif;
  font-weight: 300;        /* Light */
  letter-spacing: -0.02em; /* Tight */
}

.heading-large {
  font-family: Georgia, serif;
  font-weight: 400;        /* Normal */
  letter-spacing: -0.01em;
}

.text-ui {
  font-family: 'Avenir', sans-serif;
  font-weight: 400;
}
```

## Spacing & Layout

### Container Widths

- **Content**: `max-w-4xl` (1024px) - Blog posts, main content
- **Wide**: `max-w-5xl` (1280px) - Homepage, listings
- **Full**: `max-w-6xl` (1536px) - Special layouts

### Spacing Scale

Use Tailwind's default spacing scale consistently:
- **Tight**: `gap-2`, `space-y-2` (0.5rem / 8px)
- **Normal**: `gap-4`, `space-y-4` (1rem / 16px)
- **Relaxed**: `gap-6`, `space-y-6` (1.5rem / 24px)
- **Loose**: `gap-8`, `space-y-8` (2rem / 32px)

### Section Spacing

```jsx
// Standard section
<section className="py-24 px-6 sm:px-10">

// Compact section
<section className="py-12 px-6">
```

## Borders & Shadows

### Border Styles

**Standard Pattern**:
```jsx
border border-brand-gray-border dark:border-white/10
```

**With Hover**:
```jsx
border border-brand-gray-border dark:border-white/10
hover:border-brand-terracotta/30 dark:hover:border-brand-terracotta/40
```

### Border Radius

- `rounded-lg` (8px) - Default for cards, buttons
- `rounded` (4px) - Small elements
- `rounded-xl` (12px) - Larger containers

### Shadow Tokens

Defined in [tailwind.config.js](tailwind.config.js):

```javascript
boxShadow: {
  'subtle': '0 1px 2px rgba(0, 0, 0, 0.04)',
  'card': '0 1px 3px rgba(0, 0, 0, 0.06)',
  'sm': '0 2px 4px rgba(0, 0, 0, 0.04)',
  'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
}
```

**Usage**:
```jsx
<div className="shadow-card">  // Cards, elevated elements
<div className="shadow-subtle"> // Minimal elevation
```

## Component Patterns

### Cards

```jsx
<Card className="border border-brand-gray-border dark:border-white/10
                 bg-brand-cream dark:bg-brand-ink
                 rounded-lg shadow-card
                 hover:border-brand-terracotta/30
                 transition-all duration-200">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Buttons

**Primary Button**:
```jsx
<button className="px-6 py-3
                   bg-brand-charcoal text-brand-cream
                   rounded-lg font-medium
                   hover:bg-brand-charcoal/90
                   focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50
                   transition-all duration-200">
  Primary Action
</button>
```

**Secondary Button**:
```jsx
<button className="px-6 py-3
                   border border-brand-gray-border dark:border-white/15
                   text-brand-charcoal dark:text-brand-cream
                   rounded-lg font-medium
                   hover:bg-brand-soft dark:hover:bg-white/5
                   transition-all duration-200">
  Secondary Action
</button>
```

### Form Inputs

```jsx
<input className="w-full px-4 py-3
                  border border-brand-gray-border dark:border-white/15
                  bg-brand-cream dark:bg-brand-ink
                  text-brand-charcoal dark:text-brand-cream
                  rounded-lg
                  focus:ring-2 focus:ring-brand-terracotta/50
                  focus:border-transparent
                  transition-colors
                  placeholder-brand-gray-light" />
```

### Navigation

```jsx
<nav className="bg-brand-cream dark:bg-brand-ink
                border border-brand-gray-border dark:border-white/10
                rounded-lg shadow-card">
  <a className="text-brand-charcoal dark:text-brand-cream
                hover:text-brand-terracotta
                transition-colors">
    Link
  </a>
</nav>
```

## Animations & Transitions

### Standard Transitions

```jsx
transition-colors duration-200  // Color changes
transition-all duration-200     // Multiple properties
```

### Custom Animations

Defined in [src/styles/globals.css](src/styles/globals.css):

```css
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes drawLine {
  0% { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
}
```

**Usage**:
```jsx
<div className="opacity-0 animate-fadeIn"
     style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
```

## Dark Mode

### Implementation

Dark mode uses Tailwind's `class` strategy with context management:

```jsx
import { useTheme } from '../contexts/ThemeContext';

function Component() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="bg-brand-cream dark:bg-brand-ink">
      {/* Content */}
    </div>
  );
}
```

### Best Practices

1. **Always provide dark mode variants** for backgrounds, text, and borders
2. **Use semantic color tokens** instead of hard-coded colors
3. **Test both modes** during development
4. **Maintain contrast ratios** for accessibility (WCAG AA minimum)

## Accessibility

### Focus States

Always include visible focus indicators:

```jsx
focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50
```

### Color Contrast

Ensure minimum contrast ratios:
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text** (18pt+): 3:1 minimum
- **UI components**: 3:1 minimum

### Semantic HTML

Use appropriate semantic elements:
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for blog posts
- `<section>` for sections
- `<button>` for interactive elements

## Migration Guide

### From Old to New System

**Old approach** (manual dark mode):
```jsx
<div className="bg-white dark:bg-gray-900 border-2 border-gray-200">
```

**New approach** (design system):
```jsx
<div className="bg-brand-cream dark:bg-brand-ink border border-brand-gray-border dark:border-white/10">
```

### Key Changes

1. **Colors**: Use `brand-*` color tokens
2. **Borders**: Standardize on `border border-brand-gray-border dark:border-white/10`
3. **Shadows**: Use `shadow-card` or `shadow-subtle`
4. **Typography**: Apply serif fonts to headings with `font-serif`
5. **Border Radius**: Use `rounded-lg` (8px) as default

## File Structure

```
src/
├── styles/
│   ├── globals.css      # CSS custom properties, animations
│   ├── fonts.css        # Font families, typography utilities
│   └── animations.css   # Keyframe animations
├── contexts/
│   └── ThemeContext.jsx # Dark mode management
└── components/
    └── ui/              # Reusable UI components
```

## References

- [COLOR_SYSTEM.md](COLOR_SYSTEM.md) - Detailed color system documentation
- [tailwind.config.js](tailwind.config.js) - Tailwind configuration
- [src/styles/globals.css](src/styles/globals.css) - CSS custom properties
- [src/styles/fonts.css](src/styles/fonts.css) - Typography system

## Inspiration

This design system is inspired by:
- **Claude.ai** - Warm, sophisticated aesthetic with elegant typography
- **Tailwind CSS** - Utility-first approach
- **Modern Web Design** - Clean layouts, intentional whitespace, subtle interactions
