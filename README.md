# Naboo Component Library

A clean, component-based design system built with Next.js, TypeScript, and Tailwind CSS, extracted from Figma designs.

## Project Structure

```
/naboo
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── components-showcase/ # Storybook-style component showcase
│   └── globals.css         # Global styles and font definitions
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   └── Input/
│   └── index.ts           # Component exports
├── tokens/                 # Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── index.ts
└── lib/
    └── cn.ts              # Utility for merging Tailwind classes
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **View the component showcase:**
   - Open [http://localhost:3000](http://localhost:3000) for the home page
   - Open [http://localhost:3000/components-showcase](http://localhost:3000/components-showcase) for the component library

## Design Tokens

All design tokens are extracted from Figma and located in `/tokens`:

- **Colors**: Primary, neutrals, semantic colors
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation shadows

## Components

### Button
```tsx
import { Button } from '@/components';

<Button variant="primary" size="md">Click me</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`
Sizes: `sm`, `md`, `lg`

### Card
```tsx
import { Card } from '@/components';

<Card variant="default">Content</Card>
```

Variants: `default`, `elevated`, `outlined`

### Input
```tsx
import { Input } from '@/components';

<Input label="Email" placeholder="Enter email" />
```

## Iterating on Components

1. **Edit components** in `/components/ui/[ComponentName]/`
2. **View changes** in real-time at `/components-showcase`
3. **Update tokens** in `/tokens/` as needed
4. **Use components** in your app pages once finalized

## Design System Colors

- **Primary**: `#D3D676` (Yellow-Green)
- **Black**: `#212724`
- **White**: `#ffffff`
- **Grey**: `#737876`
- **Border**: `#e0e0e0`

## Typography

- **Sans**: Google Sans (400-700)
- **Display**: TT Hoves Pro Trial Variable (545)

## Next Steps

1. Add more components based on Figma designs
2. Iterate on component styles in the showcase
3. Use components in your application pages
4. Build out the full design system



