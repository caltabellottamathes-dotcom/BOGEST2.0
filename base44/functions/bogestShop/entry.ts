import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BOGEST_BASE = 'https://www.bogest-online.be';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Public proxy — no auth required (restaurant menu/catalog is public data)
    const body = await req.json().catch(() => ({}));
    const { action, locationId, categoryId } = body;

    // Step 1: Set the location on the bogest session
    if (locationId) {
      await fetch(`${BOGEST_BASE}/system/cm:setLocation:${locationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: '',
      });
    }

    if (action === 'getLocations') {
      const r = await fetch(`${BOGEST_BASE}/system/cm:booqModules:menu:getLocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: '',
      });
      const locations = await r.json();
      const clean = locations.map(l => ({
        id: l.id,
        name: l.name,
        city: l.city,
        streetname: l.streetname,
        housenumber: l.housenumber,
        zipcode: l.zipcode,
        phone: l.telephonenumber,
        image: l.image ? BOGEST_BASE + l.image : null,
        isOpen: l.isOpen,
        pickupLocation: l.pickupLocation,
      }));
      return Response.json({ locations: clean });
    }

    if (action === 'getCatalog') {
      const r = await fetch(`${BOGEST_BASE}/system/cm:booqModules:menu:getCategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: `locationId=${locationId || ''}`,
      });
      const categories = await r.json();

      const clean = categories
        .filter(c => c.nietTonen !== 'true' && c.products && Object.keys(c.products).length > 0)
        .map(c => ({
          id: c.id,
          title: c.title,
          url: c.url,
          description: (c.beschrijving || '').replace(/<[^>]*>/g, '').trim(),
          products: Object.values(c.products)
            .filter(p => p.nietTonen !== 'true')
            .map(p => ({
              id: p.id,
              title: p.title,
              description: (p.beschrijving || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
              price: p.calculatedPrice || parseFloat(p.prijs) || 0,
              formattedPrice: (p.formattedPrice || '').replace(/&euro;&nbsp;/g, '€ ').replace(/&nbsp;/g, ' '),
              image: p.afbeelding ? BOGEST_BASE + p.afbeelding : null,
              uitverkocht: p.uitverkocht === 'true',
              alcoholisch: p.alcoholisch === 'true',
              hasAdditionals: p.hasAdditionals,
              cmKey: p.cmKey,
            })),
        }));

      return Response.json({ categories: clean });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});