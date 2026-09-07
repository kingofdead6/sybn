/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Canonical (prefer these)
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        sunk: 'var(--c-sunk)',
        ink: 'var(--c-ink)',
        'ink-soft': 'var(--c-ink-soft)',
        muted: 'var(--c-muted)',
        rule: 'var(--c-rule)',
        'rule-strong': 'var(--c-rule-strong)',
        accent: 'var(--c-accent)',
        'accent-deep': 'var(--c-accent-deep)',
        'accent-wash': 'var(--c-accent-wash)',
        'on-accent': 'var(--c-on-accent)',
        success: 'var(--c-success)',
        error: 'var(--c-error)',
        warning: 'var(--c-warning)',
        'error-wash': 'var(--c-error-wash)',
        'success-wash': 'var(--c-success-wash)',
        'track-gyb': 'var(--c-track-gyb)',
        'track-syb': 'var(--c-track-syb)',
        'track-iyb': 'var(--c-track-iyb)',
        'track-neutral': 'var(--c-track-neutral)',

        // Retained: dark bands (CTA, footer) still paint text on --c-ink.
        'on-ink': 'var(--c-on-ink)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        DEFAULT: 'var(--radius-sm)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-md)',
        '2xl': 'var(--radius-md)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-pill)', /* dot markers + avatars */
      },
      fontSize: {
        '2xs': 'var(--text-2xs)',
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        md: 'var(--text-md)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      fontFamily: {
        'ar-display': 'var(--font-ar-display)',
        'ar-body': 'var(--font-ar-body)',
        'en-display': 'var(--font-en-display)',
        'en-body': 'var(--font-en-body)',
      },
      boxShadow: {
        none: 'none',
        raised: 'var(--shadow-raised)',
        overlay: 'var(--shadow-overlay)',
        focus: 'var(--shadow-focus)',
      },
      borderColor: {
        DEFAULT: 'var(--c-rule)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      letterSpacing: {
        caps: '0.14em',
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
};
