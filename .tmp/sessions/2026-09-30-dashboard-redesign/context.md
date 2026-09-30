# Task Context: Dashboard Redesign

Session ID: 2026-09-30-dashboard-redesign
Created: 2026-09-30T08:55:41.061Z
Status: in_progress

## Current Request

Redesign the existing finance dashboard to match the provided reference design. The new design features:
- Dark glassmorphism visual style with teal/green and purple accents
- Top navigation with greeting, profile info, and logout button
- Profile card showing user details and recent transactions snippet
- Security/Proksi Kunci card with teal accent and action button
- Financial summary widgets (Saldo Awal, Total Pemasukan, Total Pengeluaran) with charts
- Transaction management table with search bar and add button
- Cookie Settings panel on the right sidebar
- Responsive grid layout with proper spacing and borders

## Context Files (Standards to Follow)

From ContextScout discovery:
- `AGENTS.md` - Next.js version-specific guidance (breaking changes may exist)
- `README.md` - Project requirements and tech stack (Next.js 16, Tailwind CSS v4, TypeScript)
- `src/components/README.md` - Component structure and organizational patterns
- `CLAUDE.md` - References AGENTS.md

## Reference Files (Source Material)

Key project files to examine and modify:
- `src/app/globals.css` - Current theme variables and utility classes (Tailwind v4)
- `src/app/dashboard/page.tsx` - Main dashboard page structure
- `src/app/dashboard/TransactionManager.tsx` - Transaction management client component
- `src/app/dashboard/PreferenceForm.tsx` - Preference settings panel
- `src/components/dashboard/DashboardLayout.tsx` - Main layout wrapper
- `src/components/dashboard/DashboardHeader.tsx` - Header component (includes UserSessionCard, CookieStatusCard)
- `src/components/dashboard/FinancialWidget.tsx` - Financial summary cards
- `src/components/dashboard/RecentTransactions.tsx` - Transaction display
- `src/components/transactions/TransactionTable.tsx` - Transaction table
- `src/components/transactions/FilterTabs.tsx` - Filter tab component
- `src/components/transactions/Modal.tsx` - Modal components
- `src/components/transactions/TransactionForm.tsx` - Transaction form
- `src/components/preferences/PreferencePanel.tsx` - Preference panel
- `src/components/preferences/ThemeProvider.tsx` - Theme context provider
- `src/components/preferences/ThemeToggle.tsx` - Theme toggle component
- `package.json` - Dependencies: Next.js 16.3.6, Tailwind CSS v4, Framer Motion, Lucide React

## Design Requirements (from Reference Image)

### Color Scheme
- Background: Dark navy/slate (#0a0f1b or similar dark blue)
- Card backgrounds: Semi-transparent dark with glass effect
- Primary accent: Teal/Cyan (#10b981 or #14b8a6 range)
- Secondary accent: Purple/Indigo (#a78bfa or #818cf8 range)
- Text: White for headings, light gray for secondary
- Success/Income: Teal/Green
- Expense/Warning: Red/Rose
- Borders: Subtle white/light borders on dark backgrounds

### Layout Components
1. **Top Navigation**: 
   - Left: Greeting "Hello. Adityo" with sun emoji
   - Right: User email badge, notification bell, logout button

2. **Main Grid (2-column)**:
   - Left section (2/3 width):
     - User profile card (initials, name, email, recent transaction snippets)
     - Financial widgets grid (Saldo Awal with chart, Total Pemasukan, Total Pengeluaran)
     - Transaction management section (search, add button, table)
   - Right section (1/3 width):
     - Security/Proksi card (green accent, lock icon)
     - Cookie Settings panel (theme, language dropdowns, save button)

3. **Cards**: Consistent glassmorphism with borders, rounded corners (xl or 2xl radius)

4. **Typography**: 
   - Headings: Bold, white
   - Labels: Small, uppercase, muted gray
   - Values: Large, colored (green for income, red for expense)

### Spacing & Visual
- Generous padding and gaps
- Rounded borders on all cards and inputs
- Subtle gradients and shadows for depth
- Smooth animations and transitions
- Icons from lucide-react

## External Docs Fetched

None required at discovery stage - using existing installed Next.js 16 and Tailwind CSS v4.

## Components to Modify/Create

1. **DashboardLayout.tsx** - Update overall background and layout structure
2. **DashboardHeader.tsx** - Redesign to match reference (greeting, profile section)
3. **FinancialWidget.tsx** - Update card styling and layout for new design
4. **UserSessionCard** - Redesign profile card with recent transactions
5. **CookieStatusCard** - Update security/proksi card design
6. **PreferencePanel.tsx** - Redesign cookie settings appearance
7. **globals.css** - Update CSS variables for new color scheme (teal + purple accents)
8. **dashboard/page.tsx** - Update grid layout and component arrangement
9. **TransactionTable.tsx** - Update table styling for new design
10. **Modal.tsx** - Update modal styling to match glassmorphism

## Constraints

- Maintain all existing functionality (no features removed or changed)
- Use existing component hierarchy and props
- Work with Tailwind CSS v4 (already configured)
- Use framer-motion for animations (already in dependencies)
- Ensure dark theme consistency (reference appears to be dark-only)
- Maintain TypeScript type safety
- Keep responsive design working for mobile and desktop

## Exit Criteria

- [ ] Dashboard background updated to dark blue/navy with appropriate gradient
- [ ] Top navigation redesigned with greeting, email badge, and logout button
- [ ] Profile card displays user info with transaction snippets on left
- [ ] Security card with teal accent and proper styling on right
- [ ] Financial widgets updated with new styling and chart appearance
- [ ] Transaction table redesigned with new styling
- [ ] Cookie Settings panel repositioned to right sidebar
- [ ] All color accents changed to teal/purple scheme
- [ ] Cards have consistent glassmorphism with proper borders
- [ ] Layout matches 2-column responsive grid from reference
- [ ] Build succeeds with no TypeScript errors
- [ ] No functionality broken or changed
- [ ] Visual design matches reference image as closely as possible
