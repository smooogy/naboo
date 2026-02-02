# Riv page – design system

Scoped to `/riv` only. Do not use these tokens or classes outside this route.

## Rules

| Rule | Value |
|------|--------|
| **Primary color** | `#C6E278` (lime) |
| **Primary foreground** | `#131829` (dark) |
| **Default font** | Aeonik |
| **Default font-weight** | Regular (400) |
| **Medium font-weight** | 500 (nav, buttons, links) |

## CSS variables (use inside `.riv-page`)

- `--riv-primary` → #C6E278  
- `--riv-primary-foreground` → #131829  
- `--riv-font-family` → 'Aeonik', system-ui, sans-serif  
- `--riv-font-weight` → 400  
- `--riv-font-weight-medium` → 500  

## Utility classes

- **`.riv-btn-primary`** – primary button (background + text from tokens)  
- **`.riv-bg-primary`** – background only (e.g. NEWS pill)  
- **`.riv-text-primary`** – text color only  
- **`.riv-font-medium`** – font-weight 500 (nav, CTAs)  

## Usage

- Primary CTAs (e.g. “Get started”): add `riv-btn-primary`.  
- Accent backgrounds (e.g. NEWS pill): add `riv-bg-primary`.  
- Default text uses Aeonik regular; use `riv-font-medium` for nav/buttons/links.  
- Headings that should be bold/semibold: use Tailwind `font-semibold` or `font-bold` as usual.
