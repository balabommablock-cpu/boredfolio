import type { Config } from "tailwindcss";

/*
 * BOREDFOLIO DESIGN TOKENS
 * ─────────────────────────
 * Editorial finance platform. Monocle meets The Pudding.
 * 
 * Brand pillars:
 *   - Cream backgrounds (not white — warm, like quality paper)
 *   - Sage green primary (trust without corporate coldness of blue)
 *   - Mustard gold accent (signals "pay attention" without alarm)
 *   - Red/Green ONLY for fund judgments (The Good / The Ugly)
 *   - No gradients. No deep shadows. No border-radius > 8px.
 *   - Generous whitespace. Typography IS the design.
 *
 * Typography hierarchy:
 *   - Instrument Serif → headlines, fund names, display text
 *   - DM Sans → body, UI, labels, navigation
 *   - JetBrains Mono → financial numbers, NAV, returns, codes
 */

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Core Brand ── */
        sage: {
          DEFAULT: "#6B8F71",
          50: "#6B8F710A",     // 4% — ultra-light wash
          100: "#6B8F7115",    // 8% — soft background tint
          200: "#6B8F7125",    // 15% — hover states
          300: "#8AAE8F",      // Light sage
          400: "#6B8F71",      // Base sage
          500: "#6B8F71",      // Primary — CTAs, links, active
          600: "#5A7D5F",      // Hover state
          700: "#4A6B50",      // Pressed / dark variant
          800: "#3A5940",      // Deep sage
          900: "#2A4730",      // Darkest
        },
        mustard: {
          DEFAULT: "#B8963E",
          50: "#B8963E0A",
          100: "#B8963E14",    // Soft background tint
          200: "#B8963E25",
          300: "#D4AF5C",      // Light mustard
          400: "#C9A84C",      // Warm variant
          500: "#B8963E",      // Base — accent, highlights, badges
          600: "#A07E2E",      // Hover
          700: "#8A6C22",      // Dark
          800: "#6E5518",
          900: "#523F12",
        },

        /* ── Surfaces (Warm, cream-based) ── */
        cream: {
          DEFAULT: "#F5F0E8",
          50: "#FAF8F4",       // Card / elevated surface
          100: "#F5F0E8",      // Page background (THE canvas)
          200: "#EDE7DB",      // Slightly deeper sections
          300: "#DDD8CC",      // Borders (visible but never harsh)
          400: "#CCC6BA",      // Stronger dividers
          500: "#B5AFA3",      // Disabled borders
        },

        /* ── Text (Warm charcoal-based, NOT slate/gray) ── */
        ink: {
          DEFAULT: "#1A1A1A",
          900: "#1A1A1A",      // Primary — headlines, body
          800: "#2D2D2D",      // Slightly lighter body
          700: "#4A4A4A",      // Secondary — subheadings, descriptions
          600: "#5A5A5A",      // Blockquotes, secondary emphasis
          500: "#6B6B6B",      // Tertiary — supporting copy
          400: "#8E8E8E",      // Meta — timestamps, labels, captions
          300: "#ABABAB",      // Placeholder text
          200: "#C5C5C5",      // Disabled text
        },

        /* ── The Good & The Ugly (reserved for fund judgments) ── */
        good: {
          DEFAULT: "#4A7C59",
          50: "#4A7C590A",
          100: "#4A7C5912",
          500: "#4A7C59",      // Positive returns, "The Good"
          600: "#3D6A4A",
          700: "#305A3C",
        },
        ugly: {
          DEFAULT: "#C4453C",
          50: "#C4453C0A",
          100: "#C4453C10",
          500: "#C4453C",      // Negative returns, "The Ugly"
          600: "#A83830",
          700: "#8E2E27",
        },

        /* ── Semantic (non-judgment) ── */
        warn: {
          50: "#F59E0B0A",
          100: "#F59E0B14",
          500: "#D4950A",
          600: "#B57E08",
        },
        info: {
          50: "#3B82F60A",
          100: "#3B82F614",
          500: "#3B6FCC",
          600: "#2D5BA8",
        },

        /* ── Verdict Colors ── */
        verdict: {
          buy: "#4A7C59",
          hold: "#B8963E",
          avoid: "#C4453C",
          watch: "#3B6FCC",
        },

        /* ── Chart Palette (warm, distinguishable, brand-aligned) ── */
        chart: {
          1: "#6B8F71",       // Sage (primary series)
          2: "#B8963E",       // Mustard
          3: "#C4453C",       // Red
          4: "#7B68A8",       // Muted purple
          5: "#4A7C59",       // Dark green
          6: "#D4AF5C",       // Light mustard
          7: "#8B5E3C",       // Warm brown
          8: "#5A8FA8",       // Steel blue
          9: "#C47A5C",       // Terracotta
          10: "#6B6B9E",      // Slate violet
        },

        /* ── Utility ── */
        white: "#FFFFFF",
        black: "#000000",
      },

      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", '"Times New Roman"', "serif"],
        sans: ['"DM Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },

      fontSize: {
        /* ── Scale optimized for financial data density ── */
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],  // 10px — fine print
        xs: ["0.75rem", { lineHeight: "1rem" }],           // 12px — labels, badges
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],      // 13px — table data, meta
        base: ["0.875rem", { lineHeight: "1.5rem" }],      // 14px — body text
        md: ["1rem", { lineHeight: "1.625rem" }],           // 16px — prominent body
        lg: ["1.125rem", { lineHeight: "1.75rem" }],        // 18px — section intros
        xl: ["1.25rem", { lineHeight: "1.75rem" }],         // 20px — sub-headings
        "2xl": ["1.5rem", { lineHeight: "2rem" }],          // 24px — card titles
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],     // 30px — page titles
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],       // 36px — section heroes
        "5xl": ["2.75rem", { lineHeight: "3rem" }],         // 44px — page heroes
        "6xl": ["3.5rem", { lineHeight: "3.75rem" }],       // 56px — home hero
      },

      spacing: {
        4.5: "1.125rem",   // 18px
        18: "4.5rem",       // 72px
        22: "5.5rem",       // 88px — section padding
        30: "7.5rem",       // 120px — generous section gaps
        88: "22rem",
        128: "32rem",
      },

      maxWidth: {
        content: "70rem",  // 1120px — max content width
        narrow: "48rem",   // 768px — article/editorial width
        wide: "85rem",     // 1360px — dashboard/full-bleed
      },

      borderRadius: {
        /* Brand rule: NEVER exceed 8px */
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",         // Maximum allowed
      },

      boxShadow: {
        /* Subtle, warm shadows — no harsh drop shadows */
        "card": "0 1px 3px 0 rgb(26 26 26 / 0.03), 0 1px 2px -1px rgb(26 26 26 / 0.03)",
        "card-hover": "0 4px 8px -2px rgb(26 26 26 / 0.06), 0 2px 4px -2px rgb(26 26 26 / 0.03)",
        "dropdown": "0 8px 24px -4px rgb(26 26 26 / 0.08), 0 4px 8px -4px rgb(26 26 26 / 0.04)",
        "modal": "0 20px 60px -12px rgb(26 26 26 / 0.12)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "ticker": "ticker 30s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
