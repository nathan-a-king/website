# Interactive Components in Blog Posts

This guide explains how to embed interactive React components within your markdown blog posts.

## How It Works

The blog system supports embedding interactive React components using special marker syntax in your markdown files. These components are lazy-loaded for optimal performance and rendered seamlessly within your content.

## Available Components

### 1. ELIZA Chatbot
**Marker:** `[[ELIZA_CHATBOT]]`

Embeds an interactive ELIZA chatbot (classic AI therapy bot from the 1960s).

**Example:**
```markdown
Try talking to ELIZA below:

[[ELIZA_CHATBOT]]

ELIZA demonstrates early natural language processing.
```

### 2. Vector Store Visualizer
**Marker:** `[[VECTOR_STORE_VIZ]]`

Embeds an interactive 2D visualization of vector embeddings with search functionality.

**Example:**
```markdown
Here's how vector search works:

[[VECTOR_STORE_VIZ]]

The visualization shows document clusters in embedding space.
```

### 3. Chiplet Timeline
**Marker:** `[[CHIPLET_TIMELINE]]`

Embeds an interactive SVG timeline comparing predictions vs reality for chip architecture evolution.

**Example:**
```markdown
The industry evolution is visualized below:

[[CHIPLET_TIMELINE]]

This timeline shows how predictions compared to reality.
```

## Creating New Interactive Components

To add a new interactive component to the blog system, follow these steps:

### Step 1: Create the Component

Create your component in `src/components/YourComponent.tsx` (or `.jsx`):

```tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const YourComponent = () => {
  const { isDarkMode } = useTheme();
  const [state, setState] = useState(initialState);

  return (
    <div className="my-12 w-full">
      <div className="bg-brand-surface rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-brand-text-primary text-center mb-6">
          Your Component Title
        </h3>

        {/* Your interactive content here */}

        <p className="text-center text-sm text-brand-text-tertiary mt-4">
          Interactive hint or instructions
        </p>
      </div>
    </div>
  );
};

export default YourComponent;
```

**Best Practices:**
- Use `useTheme()` hook for dark mode support
- Use Tailwind brand color classes (`brand-surface`, `brand-text-primary`, etc.)
- Add responsive design with Tailwind breakpoints
- Include loading states for async operations
- Make it keyboard accessible
- Add hover states and transitions for interactivity

### Step 2: Register the Component in PostPage.jsx

1. **Import the component** (lazy-loaded):
```jsx
const YourComponent = lazy(() => import('../components/YourComponent.tsx'));
```

2. **Define a unique marker constant**:
```jsx
const YOUR_COMPONENT_MARKER = '[[YOUR_COMPONENT]]';
```

3. **Add to the segment parser** (in the `postSegments` useMemo):
```jsx
content = content.replace(new RegExp(escapeRegex(YOUR_COMPONENT_MARKER), 'g'), '||YOUR||');
```

4. **Update the split regex**:
```jsx
const parts = content.split(/(\|\|ELIZA\|\||\|\|VECTOR\|\||\|\|CHIPLET\|\||\|\|YOUR\|\|)/);
```

5. **Add the mapping**:
```jsx
return parts.map(part => {
  if (part === '||ELIZA||') return { type: 'eliza', content: '' };
  if (part === '||VECTOR||') return { type: 'vector', content: '' };
  if (part === '||CHIPLET||') return { type: 'chiplet', content: '' };
  if (part === '||YOUR||') return { type: 'your', content: '' };
  return { type: 'markdown', content: part };
});
```

6. **Add the render case** (in the JSX where segments are rendered):
```jsx
{segment.type === 'your' && (
  <div className="my-10">
    <Suspense fallback={<div className="text-sm text-brand-text-tertiary text-center">Loading component…</div>}>
      <YourComponent />
    </Suspense>
  </div>
)}
```

### Step 3: Use in Markdown

Simply add your marker in any blog post:

```markdown
---
slug: my-post
title: "My Post"
date: December 1, 2024
excerpt: "A post with an interactive component"
categories: ["Tech"]
---

Some content before...

[[YOUR_COMPONENT]]

Some content after...
```

## Component Design Guidelines

### Styling
- **Always use Tailwind** for styling consistency
- **Brand colors**: Use the design system tokens
  - `bg-brand-surface` - Surface backgrounds
  - `text-brand-text-primary` - Primary text
  - `text-brand-text-secondary` - Secondary text
  - `text-brand-text-tertiary` - Tertiary/muted text
  - `border-brand-border` - Borders
  - `text-brand-terracotta` - Accent/links
- **Dark mode**: All components must support dark mode via the theme context

### Structure
```jsx
<div className="my-12 w-full">              {/* Outer container with vertical margin */}
  <div className="bg-brand-surface rounded-lg p-6 shadow-lg">  {/* Card-like container */}
    <h3 className="...">Title</h3>           {/* Component title */}
    {/* Interactive content */}
    <p className="...">Instructions</p>      {/* User hint */}
  </div>
</div>
```

### Performance
- Use `lazy()` import in PostPage.jsx for code splitting
- Add Suspense fallback with descriptive loading message
- Optimize re-renders with `useMemo` and `useCallback`
- Keep bundle size minimal (avoid heavy dependencies)

### Interactivity
- Add hover states with `hover:` classes
- Use transitions: `transition-colors`, `transition-transform`
- Provide visual feedback for all interactions
- Include keyboard navigation support
- Add accessible labels and ARIA attributes

## Examples from Existing Components

### ChipletTimeline Implementation

The timeline component demonstrates several best practices:

1. **SVG-based visualization** - Scalable and performant
2. **Responsive design** - `overflow-x-auto` for mobile
3. **Theme-aware colors** - Uses `isDarkMode` to adjust colors
4. **Interactive states** - Hover effects with state management
5. **Accessible markup** - Semantic structure with labels

Key features:
```tsx
// Theme integration
const { isDarkMode } = useTheme();
const bgColor = isDarkMode ? '#1f2937' : '#f3f4f6';

// Interactive state
const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);

// Event handlers
onMouseEnter={() => setHoveredEvent(event)}
onMouseLeave={() => setHoveredEvent(null)}
```

### VectorStoreVisualizer Implementation

The vector visualizer shows advanced patterns:

1. **Complex state management** - Multiple useState hooks
2. **2D visualization** - SVG-based interactive chart
3. **Search functionality** - Real-time filtering
4. **Animation** - Smooth transitions for visual feedback
5. **Data clustering** - Simulated vector embeddings

## Testing Components

1. **Create component tests** in `src/components/__tests__/YourComponent.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders successfully', () => {
    render(
      <ThemeProvider>
        <YourComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('Your Component Title')).toBeInTheDocument();
  });
});
```

2. **Test in development**:
```bash
npm run dev
# Visit http://localhost:3000/blog/your-post-slug
```

3. **Test in production build**:
```bash
npm run build
npm start
```

## Troubleshooting

### Component not rendering
- Check that the marker constant matches exactly (case-sensitive)
- Verify the marker is in the split regex
- Ensure the type mapping is correct
- Check browser console for errors

### Styling issues
- Verify all Tailwind classes are valid
- Check dark mode support with theme toggle
- Test on mobile viewports
- Inspect component with browser DevTools

### Performance issues
- Check bundle size with `npm run build:analyze`
- Verify lazy loading is working (Network tab)
- Optimize heavy computations with useMemo
- Reduce re-renders with React DevTools

## Advanced Patterns

### Passing Data to Components

If you need to pass data from markdown to components, you can use an extended marker syntax:

```markdown
[[YOUR_COMPONENT:{"option": "value"}]]
```

Then parse the JSON in the segment parser:
```jsx
const match = part.match(/\|\|YOUR:(.+?)\|\|/);
if (match) {
  return { type: 'your', content: '', data: JSON.parse(match[1]) };
}
```

### Multiple Instance Support

Components should be stateless enough to support multiple instances on the same page:

```tsx
// Use unique IDs
const componentId = useId();

// Avoid global state
const [localState, setLocalState] = useState(initialValue);
```

## Next Steps

1. Create your component following the guidelines
2. Test thoroughly in both light and dark modes
3. Optimize for performance and accessibility
4. Document any special features or usage notes
5. Consider adding to the component library with examples
