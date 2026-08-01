import { useState, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Delete, ChevronDown, ChevronUp, Send } from 'lucide-react';

// Bespoke on-screen keyboard for the Digital Host chat on mobile. Blocks the
// native phone keyboard (input is readOnly) so the chat keeps its design.
// Styled as a bottom sheet that matches the site footer — same translucent
// glass, olive hairline top border, rounded top corners and soft shadow.

const ROWS_LETTERS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['SHIFT','z','x','c','v','b','n','m','BACK'],
  ['NUMS','SPACE','SEND'],
];
const ROWS_NUMBERS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['-','/',':', ';','(',')','€','&','@','"'],
  ['ABC',',','.','?','!',"'",'BACK'],
  ['ABC','SPACE','SEND'],
];

export default function ChatKeyboard({ isDark, onKey, onBackspace, onSend, onClose, onHeight, sendDisabled }) {
  const [shift, setShift] = useState(false);
  const [nums, setNums] = useState(false);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (onHeight && rootRef.current) onHeight(rootRef.current.offsetHeight);
  }, [onHeight]);

  const rows = nums ? ROWS_NUMBERS : ROWS_LETTERS;

  const press = (k) => {
    if (k === 'SHIFT') { setShift((s) => !s); return; }
    if (k === 'BACK') { onBackspace?.(); return; }
    if (k === 'NUMS') { setNums(true); return; }
    if (k === 'ABC') { setNums(false); return; }
    if (k === 'SPACE') { onKey?.(' '); return; }
    if (k === 'SEND') { if (!sendDisabled) onSend?.(); return; }
    const ch = (shift && /[a-z]/.test(k)) ? k.toUpperCase() : k;
    onKey?.(ch);
    if (shift) setShift(false);
  };

  const keyBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.50)';
  const keyBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(74,83,32,0.18)';
  const keyColor = isDark ? 'rgba(255,255,255,0.92)' : 'hsl(var(--foreground))';
  const base = 'min-w-0 h-11 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 font-body text-sm select-none';

  const renderKey = (k, i) => {
    if (k === 'SHIFT') return (
      <button key={i} onClick={() => press(k)} aria-label="Shift" className={`${base} flex-[1.4]`}
        style={{ background: shift ? 'rgba(231,205,112,0.28)' : keyBg, border: `1px solid ${shift ? 'rgba(231,205,112,0.6)' : keyBorder}`, color: keyColor }}>
        <ChevronUp className="w-4 h-4" />
      </button>
    );
    if (k === 'BACK') return (
      <button key={i} onClick={() => press(k)} aria-label="Backspace" className={`${base} flex-[1.4]`}
        style={{ background: keyBg, border: `1px solid ${keyBorder}`, color: keyColor }}>
        <Delete className="w-4 h-4" />
      </button>
    );
    if (k === 'NUMS' || k === 'ABC') return (
      <button key={i} onClick={() => press(k)} className={`${base} flex-[1.6] text-xs`}
        style={{ background: keyBg, border: `1px solid ${keyBorder}`, color: keyColor }}>
        {k === 'NUMS' ? '123' : 'ABC'}
      </button>
    );
    if (k === 'SPACE') return (
      <button key={i} onClick={() => press(k)} aria-label="Spatie" className={`${base} flex-[5]`}
        style={{ background: keyBg, border: `1px solid ${keyBorder}`, color: keyColor }} />
    );
    if (k === 'SEND') return (
      <button key={i} onClick={() => press(k)} aria-label="Verstuur" className={`${base} flex-[2.2]`}
        style={{
          background: sendDisabled ? 'rgba(231,205,112,0.30)' : 'rgba(231,205,112,0.92)',
          border: '1px solid rgba(231,205,112,0.95)',
          color: 'rgba(20,16,8,0.95)',
          opacity: sendDisabled ? 0.5 : 1,
        }}>
        <Send className="w-4 h-4" />
      </button>
    );
    const label = (shift && /[a-z]/.test(k)) ? k.toUpperCase() : k;
    return (
      <button key={i} onClick={() => press(k)} className={`${base} flex-1`}
        style={{ background: keyBg, border: `1px solid ${keyBorder}`, color: keyColor }}>{label}</button>
    );
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-[81] overflow-hidden"
      style={{
        borderRadius: '24px 24px 0 0',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'hsl(var(--background) / 0.30)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid hsl(78 35% 28% / 0.25)',
        borderLeft: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid hsl(78 35% 28% / 0.12)',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid hsl(78 35% 28% / 0.12)',
        boxShadow: isDark ? '0 -30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)' : '0 -24px 60px rgba(0,0,0,0.10)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex justify-end pt-2 pr-2 mb-1">
        <button onClick={onClose} aria-label="Sluit toetsenbord" className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(74,83,32,0.06)', color: keyColor }}>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1.5 px-2 pb-2">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((k, i) => renderKey(k, i))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}