import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, ShoppingBag, Gift, Package, Mail, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_ICONS = {
  reservation: CalendarDays,
  order: ShoppingBag,
  giftcard: Gift,
  giftpackage: Package,
  contact: Mail,
};

const CATEGORY_LABELS = {
  reservation: 'Reservering',
  order: 'Takeaway bestelling',
  giftcard: 'Cadeaubon',
  giftpackage: 'Cadeaupakket',
  contact: 'Contactaanvraag',
};

export default function AdminNotificationsPopup({ notifications, onClose, onMarkAllSeen }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden z-10"
          style={{
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(36px)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-foreground">Nieuwe meldingen</h2>
                <p className="font-body text-xs text-muted-foreground">{notifications.length} nieuwe activiteiten</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {notifications.map((n, i) => {
              const Icon = CATEGORY_ICONS[n.type] || Bell;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 px-6 py-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-medium text-foreground">
                      {CATEGORY_LABELS[n.type]} — <span className="text-primary">{n.name}</span>
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{n.detail}</p>
                  </div>
                  <span className="font-body text-[10px] text-muted-foreground flex-shrink-0 mt-1">
                    {n.time}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex gap-3">
            <button
              onClick={onMarkAllSeen}
              className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Alles gelezen
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-white/10 text-muted-foreground font-body text-xs tracking-widest uppercase hover:border-white/20 transition-colors"
            >
              Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}