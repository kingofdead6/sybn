import { useState, useId } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EASE = [0.2, 0, 0, 1];

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b border-rule">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-4 py-4 text-start font-medium text-ink transition-colors duration-fast ease-out hover:text-accent"
      >
        <span>{title}</span>
        <motion.span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-accent transition-colors duration-fast ease-out ${
            open ? 'border-accent bg-accent-wash' : 'border-rule group-hover:border-accent'
          }`}
          animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-ink-soft">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ children }) {
  return <div className="divide-y-0">{children}</div>;
}
