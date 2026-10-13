# DESIGN SYSTEM SPECIFICATION: GPT-6 Astra — Sanjivani Sugar Factory

> **Project**: Sanjivani Sugar Factory Cane Procurement Intelligence & Farmer Ledger  
> **Model Persona**: GPT-6 Astra  
> **Infrastructure**: Next.js 16 (App Router), Model Context Protocol (MCP), MongoDB Atlas  
> **Aesthetic Standard**: Industrial Precision & Flat Obsidian Minimalism (ChatGPT v4.5 inspired)  
> **Hard Constraints**: Strictly NO gradients, plain solid colors only, zero emojis, zero AI slop.

---

## 1. Visual Theme & Philosophy
- **Intentional Restraint**: Eliminates generic consumer AI fluff (no purple glows, floating spheres, or cartoon badges). Adopts an authoritative, industrial ledger and command console tailored for agro-industrial operations.
- **Surface Contrast**: Built on layered matte obsidian tones (`#171717`, `#212121`, `#2f2f2f`) separated by razor-thin `1px` structural borders (`#2b2b2b`, `#383838`).
- **Signature Accent**: Deep solid emerald green (`#10a37f`), representing financial settlement and cane agriculture, balanced with solid amber (`#eab308`) for outstanding dues.

---

## 2. Color Palette (100% Solid Hex — No Gradients)

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| `--bg-sidebar` | `#171717` | Collapsible navigation rail & command background |
| `--bg-main` | `#212121` | Primary viewport canvas |
| `--bg-surface` | `#2f2f2f` | Card containers, cards, and modal bubbles |
| `--bg-surface-hover` | `#383838` | Interactive hover states |
| `--border-subtle` | `#2b2b2b` | Structural dividers & table row demarcations |
| `--border-light` | `#383838` | Container boundaries and input borders |
| `--accent-green` | `#10a37f` | OpenAI solid green: primary actions, live indicators |
| `--accent-green-hover` | `#0e8c6d` | Solid button active/pressed state |
| `--accent-amber` | `#eab308` | Outstanding balances & warning flags |
| `--badge-paid-bg` | `#12372a` | Solid dark forest background for settled payments |
| `--badge-paid-text` | `#34d399` | Crisp emerald text for settled payments |
| `--badge-due-bg` | `#3b2f15` | Solid dark bronze background for pending dues |
| `--badge-due-text` | `#facc15` | Crisp gold text for pending dues |
| `--text-primary` | `#ececec` | Primary headings, body copy, and data values |
| `--text-secondary` | `#b4b4b4` | Secondary metadata and labels |
| `--text-muted` | `#737373` | Table column headers, disclaimers, microcopy |

---

## 3. Typography System
- **Display & Body**: `Plus Jakarta Sans` (`400`, `500`, `600`, `700`) — Crisp, geometric, authoritative sans-serif avoiding generic Arial/Inter convergence.
- **Numbers & Telemetry**: `Space Grotesk` (`500`, `600`, `700`) — High-precision monospace/grotesk for tonnages, INR currencies, JSON tool logs, and status tags.

### Type Scale
- **H1 Header**: `26px / 600` (`--text-primary`)
- **Section Titles**: `16px / 600` (`--text-primary`)
- **Body Text**: `14px / 1.65` (`--text-primary`)
- **KPI Metrics**: `26px / 700` (`--font-mono`)
- **Metadata & Tags**: `10px - 11px / 700` (`--font-mono`, uppercase, letter-spacing `0.08em`)

---

## 4. Component Stylings

### Model Selector Dropdown
- Flat pill header with `GPT-6` label and solid green `Astra` badge.
- Telemetry chip: `MCP Protocol • Stdio Transport`.

### Sidebar Navigation & History
- Collapsible left drawer (`260px` width) with `New Session` button.
- Clean category dots (`6px` solid `#10a37f`) replacing all legacy icons/emojis.
- Factory profile card with `SF` square avatar, Atlas DB status, and seasonal context (`Season 2026`).

### Chat Stream & Assistant Bubbles
- User queries styled as solid `#2f2f2f` rounded cards on the right.
- Assistant responses rendered on the left with circular `Astra` avatar.
- **MCP Tool Trace Card**: Dedicated collapsible drawer displaying active MCP tool invocations (`query_farmers`, `get_factory_summary`), arguments, and raw MongoDB Atlas responses in dark code blocks (`#0f0f0f` with `#a7f3d0` code).

### Database Ledger
- **4-Column KPI Grid**: Total Cane Intake (`Tons`), Total Disbursed (`INR`), Total Pending (`INR`), Registered Growers.
- **Village Supply Distribution**: Visual progress bars per village (`Kopargaon`, `Shirdi`, `Rahata`, `Sangamner`, `Loni`, `Kolhar`, `Puntamba`).
- **Interactive Directory Table**: Multi-column sorting, search by name/village, village dropdown filter, and "Pending Only" toggle.

---

## 5. Layout & Spatial Composition
- **Dual-View Architecture**: Fluid tab switcher toggling seamlessly between **Chat View** (conversational analysis) and **Ledger View** (audit table).
- **Sticky Input Capsule**: Pill-shaped bottom bar (`#2f2f2f`) with integrated `MCP` indicator chip, border focus transitions, and circular dispatch button.

---

## 6. Depth & Elevation
- **Zero Drop-Shadow Glows**: Strict elimination of blurry neon glows or artificial lighting gradients.
- **Flat 1px Layering**: Depth is achieved entirely through solid color staging:
  - Base: `#212121`
  - Cards: `#2f2f2f`
  - Secondary Insets: `#171717`
  - Code Blocks: `#0f0f0f`

---

## 7. Strict Do's & Don'ts

| Do | Don't |
| :--- | :--- |
| Use solid flat colors (`#171717`, `#212121`, `#2f2f2f`, `#10a37f`) | Never use color gradients, radial fades, or mesh fills |
| Use geometric SVG lines and solid colored category dots | Never use emojis in UI, prompts, or LLM responses |
| Output exact numbers, metric tons, and rupee values (`INR`) | Never use AI marketing buzzwords ("supercharge", "magic", "delightful") |
| Maintain clean monospace data formatting for financials | Never use low-contrast or illegible text |
| Brand strictly as **GPT-6 Astra** | Never refer to deprecated model names |

---

## 8. Responsive Design
- **Desktop (>= 1024px)**: Full dual-pane view with persistent left sidebar, 4-column KPI cards, and expanded directory table.
- **Tablet / Mobile (< 768px)**: Auto-collapsing sidebar with overlay drawer, single-column KPI stacking, and horizontal scroll on financial ledger tables.

---

## 9. Agent Prompt Guide
For future agent additions or backend endpoints:
1. Always route farmer inquiries through MCP tools (`query_farmers` or `get_factory_summary`).
2. Maintain the **GPT-6 Astra** system persona: direct, factual, zero conversational fluff, zero emojis.
3. Keep all responses structured with clear markdown tables or bulleted financial totals.
