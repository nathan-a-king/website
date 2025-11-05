# Color System Documentation

## Overview
The color system now uses **CSS custom properties as the single source of truth** to eliminate duplication and improve maintainability.

## Architecture

### CSS Custom Properties (globals.css)
Colors are defined once in [src/styles/globals.css](src/styles/globals.css) and automatically adapt to light/dark mode:

```css
:root {
  --color-bg: #FAF9F5;
  --color-text-primary: #141413;
  --color-text-secondary: #3D3D3A;
  --color-text-tertiary: #73726C;
  --color-accent: #CC6B4A;
  --color-accent-blue: #2E5A91;
  --color-accent-purple: #9B8FD6;
  --color-border: rgba(31, 30, 29, 0.15);
  --color-surface: #F8F7F4;
}

.dark {
  --color-bg: #252522;
  --color-text-primary: #FFFFFF;
  /* ... dark mode values ... */
}
```

### Tailwind Integration (tailwind.config.js)
Tailwind classes reference these CSS variables:

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
    'accent-blue': 'var(--color-accent-blue)',
    'accent-purple': 'var(--color-accent-purple)',
    border: 'var(--color-border)',

    // Static colors (backward compatibility)
    cream: '#FAF9F5',
    charcoal: '#141413',
    // ... etc
  }
}
```

## Usage

### Adaptive Classes (Standard Approach)
Use adaptive classes that automatically switch with theme - this is how all components are now built:

```jsx
// ✅ Standard approach - automatically adapts to dark mode
<div className="bg-brand-bg text-brand-text-primary">
  <h1 className="text-brand-text-primary">Hello</h1>
  <p className="text-brand-text-secondary">Description</p>
  <button className="bg-brand-accent border-brand-border">Click me</button>
</div>
```

### Static Classes (For Special Cases)
Static colors are available when you need specific values that shouldn't change with theme:

```jsx
// Use only when you specifically need a fixed color
<div className="bg-brand-terracotta text-white">
  Always terracotta, regardless of theme
</div>
```

### Option 3: Direct CSS Variables
Use CSS variables directly in custom styles:

```jsx
// ✅ Good for custom styling
<div style={{ backgroundColor: 'var(--color-bg)' }}>
  Content
</div>
```

## Examples

### Before Migration (Old Pattern)
```jsx
// ❌ Old - verbose with manual dark: variants
<div className="bg-brand-cream dark:bg-brand-ink text-brand-charcoal dark:text-brand-cream border-brand-gray-border dark:border-white/10">
  <h1 className="text-brand-charcoal dark:text-brand-cream">Title</h1>
  <p className="text-brand-gray-medium dark:text-brand-gray-light">Text</p>
</div>
```

### After Migration (Current Pattern)
```jsx
// ✅ Current - clean and adaptive
<div className="bg-brand-bg text-brand-text-primary border-brand-border">
  <h1 className="text-brand-text-primary">Title</h1>
  <p className="text-brand-text-secondary">Text</p>
</div>
```

## Benefits

1. **Single Source of Truth**: Colors defined once in `globals.css`
2. **Automatic Theme Switching**: No need for `dark:` variants
3. **Easy Maintenance**: Update one place, changes apply everywhere
4. **Runtime Flexibility**: Can dynamically update CSS variables if needed
5. **Backward Compatible**: Static classes still work for existing code

## Color Reference

### Adaptive Colors
| Variable | Light Mode | Dark Mode | Tailwind Class |
|----------|-----------|-----------|----------------|
| `--color-bg` | `#FAF9F5` | `#252522` | `bg-brand-bg` |
| `--color-surface` | `#F8F7F4` | `#323230` | `bg-brand-surface` |
| `--color-text-primary` | `#141413` | `#FFFFFF` | `text-brand-text-primary` |
| `--color-text-secondary` | `#3D3D3A` | `#E5E4E0` | `text-brand-text-secondary` |
| `--color-text-tertiary` | `#73726C` | `#B5B4B0` | `text-brand-text-tertiary` |
| `--color-accent` | `#CC6B4A` | `#CC6B4A` | `bg-brand-accent` |
| `--color-accent-blue` | `#2E5A91` | `#2E5A91` | `bg-brand-accent-blue` |
| `--color-accent-purple` | `#9B8FD6` | `#9B8FD6` | `bg-brand-accent-purple` |
| `--color-border` | `rgba(31,30,29,0.15)` | `rgba(250,249,245,0.15)` | `border-brand-border` |

### Static Colors (for reference)
- `brand-cream`: `#FAF9F5` (light mode background)
- `brand-charcoal`: `#141413` (light mode text)
- `brand-ink`: `#252522` (dark mode background)
- `brand-terracotta`: `#CC6B4A` (accent)
- `brand-blue`: `#2E5A91` (secondary accent)
- `brand-purple`: `#9B8FD6` (tertiary accent)
