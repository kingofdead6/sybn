/* Brand contact points, shared by the footer and the Contact page so the two
   always show the same details. */
export const WHATSAPP_NUMBER = '+213 770 31 34 48';
export const WHATSAPP_DIGITS = '213770313448';
export const EMAIL = 'berrslim3@gmail.com';

const ICONS = {
  whatsapp:
    'M17.5 14.4c-.6-.3-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2s-1 1.2-1.2 1.4c-.2.2-.4.3-.8.1-.6-.3-1.6-.6-2.7-1.7-1-.9-1.6-2-1.8-2.4-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2.1-.4 0-.6-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.1-1.2 2.6s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4 3 1.3 3 .9 3.5.8.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 00-8.6 15L2 22l5.1-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2z',
  email: 'M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 8L4.2 7.4 4 7v.6l8 5.7 8-5.7V7l-.2.4L12 13z',
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 10.7a4.2 4.2 0 110-8.4 4.2 4.2 0 010 8.4zm6.8-11a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
  facebook:
    'M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.3c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z',
  youtube:
    'M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z',
};

export function SocialIcon({ name, className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/**
 * Every contact point in display order. `label` is what is shown, `ltr` marks
 * values (numbers, handles, addresses) that must stay left-to-right in Arabic.
 */
export const CONTACTS = [
  { key: 'whatsapp', name: 'WhatsApp', label: WHATSAPP_NUMBER, href: `https://wa.me/${WHATSAPP_DIGITS}`, ltr: true },
  { key: 'email', name: 'Email', label: EMAIL, href: `mailto:${EMAIL}`, ltr: true },
  { key: 'instagram', name: 'Instagram', label: '@berrayah_slimane', href: 'https://instagram.com/berrayah_slimane', ltr: true },
  { key: 'facebook', name: 'Facebook', label: 'Slimane Berrayah', href: 'https://www.facebook.com/2290555824559951' },
  { key: 'youtube', name: 'YouTube', label: 'YouTube', href: 'https://www.youtube.com/channel/UC_2J7AbvqCmpAIVSIZDrUmA' },
];
