import React from 'react';

// Rich recommendation card for menu items shown inside the digital host chat.
// Renders a compact card with image, name, description, price, and pairing.
export default function RecommendationCard({ item, isDark }) {
  if (!item) return null;

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(74,83,32,0.05)';
  const cardBorder = isDark ? 'rgba(200,163,89,0.18)' : 'rgba(74,83,32,0.22)';

  // Use category-based placeholder images
  const CATEGORY_IMAGES = {
    signature: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    beef: 'https://images.unsplash.com/photo-1558030006-450675393492?w=400&q=80',
    chicken: 'https://images.unsplash.com/photo-1598103442097-8b7c94b271f7?w=400&q=80',
    fish: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
    veggie: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    sides: 'https://images.unsplash.com/photo-1576045604519-9d8b65a4c4d0?w=400&q=80',
    wines: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    beers: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80',
    desserts: 'https://images.unsplash.com/photo-1567206563064-6f60f5cc5857?w=400&q=80',
    kids: 'https://images.unsplash.com/photo-1576506295286-5cda4dfb7ff7?w=400&q=80',
  };

  const img = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.beef;

  return (
    <div className="rounded-xl overflow-hidden mt-2.5"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-stretch">
        <img src={img} alt={item.item_name}
          className="w-20 h-20 object-cover flex-shrink-0"
          style={{ filter: isDark ? 'brightness(0.8)' : 'saturate(0.9)' }} />
        <div className="flex-1 px-3 py-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-heading text-sm font-bold leading-tight"
              style={{ color: isDark ? 'rgba(255,235,160,0.95)' : 'rgba(40,50,15,0.95)' }}>
              {item.item_name}
            </p>
            {item.price != null && (
              <span className="font-body text-xs font-semibold flex-shrink-0"
                style={{ color: isDark ? 'rgba(200,163,89,0.95)' : 'rgba(107,122,63,0.95)' }}>
                €{item.price}
              </span>
            )}
          </div>
          {item.description && (
            <p className="font-body text-[11px] leading-snug mt-0.5 line-clamp-2"
              style={{ color: isDark ? 'rgba(255,240,200,0.65)' : 'rgba(40,50,15,0.60)' }}>
              {item.description}
            </p>
          )}
          {item.pairing && (
            <p className="font-body text-[10px] mt-1 flex items-center gap-1"
              style={{ color: isDark ? 'rgba(200,163,89,0.75)' : 'rgba(107,122,63,0.75)' }}>
              <span className="tracking-wide">🍷</span>
              <span className="line-clamp-1">{item.pairing}</span>
            </p>
          )}
        </div>
      </div>
      {(item.is_popular || item.is_new) && (
        <div className="px-3 pb-2 flex gap-1.5">
          {item.is_popular && (
            <span className="font-body text-[9px] tracking-wide uppercase px-1.5 py-0.5 rounded-full"
              style={{ background: isDark ? 'rgba(200,163,89,0.15)' : 'rgba(107,122,63,0.15)', color: isDark ? 'rgba(200,163,89,0.85)' : 'rgba(107,122,63,0.85)' }}>
              Populair
            </span>
          )}
          {item.is_new && (
            <span className="font-body text-[9px] tracking-wide uppercase px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(46,139,87,0.15)', color: 'rgba(46,139,87,0.85)' }}>
              Nieuw
            </span>
          )}
        </div>
      )}
    </div>
  );
}