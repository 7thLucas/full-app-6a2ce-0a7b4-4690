# Morning Buddy — Design Guidelines

## Brand Identity
- **Product name**: Morning Buddy
- **Tone**: Warm, playful, and encouraging for children; practical and trustworthy for parents
- **Metaphor**: A friendly sunrise companion — full of energy, warmth, and positivity

## Color Palette
- **Primary**: Amber/Orange — `#F59E0B` (warm sunrise energy, child-facing CTAs)
- **Accent**: Sky Blue — `#38BDF8` (calm, clear sky; secondary actions and icons)
- **Background**: Soft White — `#FFFBF5` (warm off-white, easy on children's eyes)
- **Surface**: `#FFF7ED` (orange-tinted card surfaces)
- **Text Primary**: `#1C1917` (near-black, high contrast)
- **Text Secondary**: `#78716C` (muted warm grey for subtitles)
- **Success/Reward**: `#22C55E` (green for completion celebrations)
- **Warning**: `#EF4444` (used sparingly, never as a scolding state)

## Typography
- **Display font**: Rounded, friendly sans-serif (e.g. Nunito or Poppins) — conveys warmth and approachability
- **Child-facing headings**: Extra-large, bold — minimum 28px, ensures a 6-year-old can read independently
- **Parent-facing text**: Regular weight, 14–16px — practical and readable
- **Step titles on checklist**: 24–32px bold, one step per screen to reduce cognitive load

## Elevation & Depth
- Cards use soft rounded corners (radius 16–24px) and very light shadows (`shadow-md`) to feel tactile and friendly
- Active/tappable elements have a slight scale-up on press (`scale-105`) for satisfying child interaction
- Completed steps get a celebratory green checkmark with a subtle bounce animation

## Component Design Principles

### Child Mode (Morning Routine Screen)
- Full-screen, one step at a time — no navigation clutter
- Giant tap target (button fills most of the screen width, 64px+ height)
- Friendly emoji or illustration accompanying each step
- Progress shown as a visual star trail or progress bar at the top
- Completion screen: big stars, confetti-style animation, "You did it!" message

### Parent Mode (Setup & Dashboard)
- Clean list-based layout for routine configuration
- Alarm time picker — large, clear
- 7-day history shown as a simple colored grid (green = complete, grey = incomplete)
- Toggle between Child Mode and Parent Mode with a clear, prominent button

## Iconography
- Use large, universally understood emoji-style icons for each step:
  - Bath/Wash: shower drop or bathtub
  - Get Dressed: t-shirt
  - Breakfast: bowl with spoon
  - Study Review: open book
  - Leave for School: school building or backpack
- Icons must be at least 48px to be tappable and recognisable for young children

## Animations & Feedback
- Step completion: celebratory bounce + green checkmark
- All-done screen: star burst or confetti animation
- Alarm screen: gentle pulse animation on the wake-up button
- Keep animations under 500ms to avoid distracting children from the task

## Layout & Spacing
- Mobile-first, portrait orientation optimised
- Generous padding (24–32px) so elements never feel cramped
- Minimum touch target: 48x48px (Apple HIG standard)
- Maximum one primary action per screen in Child Mode

## Accessibility
- High contrast text on all backgrounds (WCAG AA minimum)
- Large text defaults — do not make children pinch-zoom
- Clear visual hierarchy so non-readers can follow icons alone
