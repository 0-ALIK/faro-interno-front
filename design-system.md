# Design System — Municipality of Panama

## Foundations

### Color

#### Color System

The institutional blue **#0660FF** drives all actions and interactions. It is supported by cool neutrals for text and clean backgrounds, category colors for services, and semantic colors for states.

### Primary Blue — brand / action

|     Scale | Color         |
| --------: | ------------- |
|        50 | `#EDF7FF`     |
|       100 | `#D6EAFF`     |
|       200 | `#B5DCFF`     |
|       300 | `#83C8FF`     |
|       400 | `#48A9FF`     |
| **500 ★** | **`#0660FF`** |
| **600 ★** | **`#0046EF`** |
|       700 | `#083AC5`     |
|       800 | `#0D369B`     |
|       900 | `#0E225D`     |

**Primary color:** `#0660FF`

---

### Neutrals — text, backgrounds, borders

| Scale | Color     |
| ----: | --------- |
|     0 | `#FCFDFD` |
|    50 | `#F4F6F7` |
|   100 | `#D9D9D9` |
|   200 | `#CAD2D7` |
|   300 | `#A4B1BC` |
|   400 | `#627485` |
|   500 | `#4F5B6B` |
|   600 | `#363B43` |
|   900 | `#21252B` |

> Note: The provided scale does not contain a `700` or `800` value.

---

### Service Categories

#### Cyan

**Use:** Digital · maps

| Level | Color     |
| ----: | --------- |
| Light | `#B9F2FB` |
|  Base | `#22D3EE` |
|  Dark | `#0EA5C6` |

#### Purple

**Use:** Culture

| Level | Color     |
| ----: | --------- |
| Light | `#CFC5FB` |
|  Base | `#7C6AE6` |
|  Dark | `#5B4BC4` |

#### Lime Green

**Use:** Sports

| Level | Color     |
| ----: | --------- |
| Light | `#D9F2B8` |
|  Base | `#84CC16` |
|  Dark | `#65A30D` |

#### Terracotta

**Use:** Fairs

| Level | Color     |
| ----: | --------- |
| Light | `#E2C9B8` |
|  Base | `#B45309` |
|  Dark | `#8A3F06` |

---

### Semantics — states

#### Success

**Use:** Resolved · payment

| Level | Color     |
| ----: | --------- |
| Light | `#E6F6EC` |
|  Base | `#2ECC71` |
|  Dark | `#1E9E57` |

#### Warning

**Use:** Pending

| Level | Color     |
| ----: | --------- |
| Light | `#FFF4E5` |
|  Base | `#F59E0B` |
|  Dark | `#B45309` |

#### Error

**Use:** Rejected

| Level | Color     |
| ----: | --------- |
| Light | `#FDECEA` |
|  Base | `#E53935` |
|  Dark | `#B71C1C` |

#### Info

**Use:** In progress

| Level | Color     |
| ----: | --------- |
| Light | `#EDF7FF` |
|  Base | `#0660FF` |
|  Dark | `#0046EF` |

---

# Typography

## Typography System

Two voices:

* **Noka** for titles and headings (impact).
* **Montserrat** for everything else (readability).
* **Prometo** is reserved for the logo and institutional names.

| Style   | Typeface   | Size | Weight |
| ------- | ---------- | ---: | -----: |
| Display | Noka       |   44 |    800 |
| H1      | Noka       |   32 |    700 |
| H2      | Noka       |   26 |    700 |
| Title   | Montserrat |   18 |    600 |
| Body    | Montserrat |   15 |    400 |
| Caption | Montserrat |   12 |    500 |
| Brand   | Prometo    |    — |    700 |

---

# Spacing and Radii

## Spacing System

The base scale is **4pt**.

| Token        |  Value | Use          |
| ------------ | -----: | ------------ |
| `--space-1`  |  `4px` | —            |
| `--space-2`  |  `8px` | —            |
| `--space-3`  | `12px` | —            |
| `--space-4`  | `16px` | gutter       |
| `--space-6`  | `24px` | card padding |
| `--space-12` | `48px` | sections     |

### Corner Radii

Soft corners:

* Tags and inputs: `8px`
* Cards: `16px`
* Banners: `24px`
* Buttons and FABs: fully rounded

| Element       |         Radius |
| ------------- | -------------: |
| Tags · inputs |          `8px` |
| Cards         |         `16px` |
| Banners       |         `24px` |
| Buttons       | `999px` / Full |

---

# Elevation

## Shadows

Shadows use blue-tinted tones based on:

`rgba(14,34,93)`

> **Important:** The concrete CSS values for these variables do not appear in the provided HTML. They are only referenced through `var(--shadow-xs)`, `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)`, and `var(--shadow-focus)`.

| Token            | Use        |
| ---------------- | ---------- |
| `--shadow-xs`    | xs         |
| `--shadow-sm`    | sm · card  |
| `--shadow-md`    | md · hover |
| `--shadow-lg`    | lg · modal |
| `--shadow-focus` | focus ring |
