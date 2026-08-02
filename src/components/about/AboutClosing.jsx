import React from 'react';
import ReserveCtaSection from '@/components/ReserveCtaSection';

// AboutClosing — reuse the shared reserve CTA banner so the closing of /about
// matches the other banners (eyebrow + heading + accent + floating Reserveer
// card), with a working Reserveer call-to-action.
export default function AboutClosing() {
  return <ReserveCtaSection />;
}