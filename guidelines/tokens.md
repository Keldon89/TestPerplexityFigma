# PrimeReact Design Tokens

PrimeReact exposes all design tokens as CSS custom properties. Always use `var(--token-name)` instead of hardcoded values.

## Color Tokens

```css
var(--primary-color)
var(--surface-ground)
var(--surface-section)
var(--surface-card)
var(--surface-border)
var(--surface-hover)
var(--text-color)
var(--text-color-secondary)
var(--green-500)
var(--yellow-500)
var(--red-500)
var(--blue-500)
```

## Rules
- OK: `color: var(--text-color)`
- NEVER: `color: #333333`
- NEVER: `background: white`
