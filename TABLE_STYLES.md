# Table Styling Guide

This document shows different table styling options available in your blog posts.

## How to Use

### Basic Table Syntax

Use GitHub Flavored Markdown table syntax:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Superscript Syntax

Use `^` characters to wrap superscript text:

```markdown
E = mc^2^
Temperature: 25°C^±2^
Area: 100 mm^2^
```

### Subscript Syntax

Use `~` characters to wrap subscript text:

```markdown
H~2~O
CO~2~
```

## Customizing Table Styles

The default table style includes:
- Bordered tables with rounded corners
- Hover effects on rows
- Dark mode support
- Responsive overflow scrolling

### Style Variations

You can create different table styles by adding custom component variations in `PostPage.jsx`.

#### Option 1: Borderless Tables

Add a new component for borderless tables:

```jsx
tableNoBorder: ({ children }) => (
  <div className="my-8 overflow-x-auto">
    <table className="min-w-full">
      {children}
    </table>
  </div>
),
```

To use in markdown, you'd need to extend the parser or use a data attribute system.

#### Option 2: Compact Tables

Create a compact variant:

```jsx
tableCompact: ({ children }) => (
  <div className="my-8 overflow-x-auto">
    <table className="min-w-full divide-y divide-brand-border border border-brand-border rounded-lg text-sm">
      {children}
    </table>
  </div>
),
```

#### Option 3: Striped Tables

Add alternating row colors:

```jsx
tbody: ({ children }) => (
  <tbody className="divide-y divide-brand-border">
    {children}
  </tbody>
),
tr: ({ children, isHeader }) => (
  <tr className="even:bg-brand-surface/30 hover:bg-brand-surface/50 transition-colors">
    {children}
  </tr>
),
```

## Advanced: Style Selection via HTML Comments

If you want different table styles in the same post, you can use a more advanced approach:

1. Add a wrapper div with data attributes in markdown:
   ```markdown
   <div data-table-style="compact">

   | Header 1 | Header 2 |
   |----------|----------|
   | Data 1   | Data 2   |

   </div>
   ```

2. Update the table component to read parent data attributes:
   ```jsx
   table: ({ children, node }) => {
     const parentDiv = node?.position?.start?.column;
     // Check parent for data-table-style attribute
     const style = 'default'; // or 'compact', 'borderless', etc.

     const styles = {
       default: "min-w-full divide-y divide-brand-border border border-brand-border rounded-lg",
       compact: "min-w-full text-sm border-b border-brand-border",
       borderless: "min-w-full"
     };

     return (
       <div className="my-8 overflow-x-auto">
         <table className={styles[style]}>
           {children}
         </table>
       </div>
     );
   }
   ```

## Best Practices

1. **Keep it Simple**: Use the default style unless you have a specific design need
2. **Consistent Sizing**: Use consistent column widths for better readability
3. **Mobile-First**: The default wrapper includes `overflow-x-auto` for mobile scrolling
4. **Dark Mode**: All custom styles should include dark mode variants
5. **Accessibility**: Always include proper header rows with semantic `<th>` elements

## Current Default Style

The current implementation in `PostPage.jsx` provides:

- **Container**: Scrollable wrapper with margin spacing
- **Table**: Full-width with borders and rounded corners
- **Header**: Light background with uppercase, semibold text
- **Body**: Divided rows with alternating hover effect
- **Cells**: Generous padding (6px horizontal, 4px vertical)
- **Dark Mode**: Automatic theme adaptation

To modify the default style, edit the component definitions in `src/pages/PostPage.jsx` around lines 177-213.
