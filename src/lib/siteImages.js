// Registry of every replaceable image position on the live Bogèst website.
// Each position has a stable key, a human label (NL), the default URL (which
// MUST match what the component renders today — zero visual change unless an
// override is set), and the list of real pages the image actually appears on.
// Only positions that are visibly rendered on a live page are listed here.

const SQ = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577';

// Pages the admin can filter the replace map by.
export const SITE_PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'menu', label: 'Menu' },
  { key: 'locations', label: 'Vestigingen' },
  { key: 'locationdetail', label: 'Vestiging detail' },
  { key: 'spaces', label: 'Restaurant & ruimtes' },
  { key: 'groups', label: 'Groepen & events' },
  { key: 'about', label: 'Over ons' },
  { key: 'onzefilosofie', label: 'Onze filosofie' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'onsverhaal', label: 'Ons verhaal' },
  { key: 'contact', label: 'Contact' },
  { key: 'reserve', label: 'Reserveren' },
  { key: 'takeaway', label: 'Afhalen' },
  { key: 'giftcards', label: 'Cadeaubonnen' },
  { key: 'jobs', label: 'Vacatures' },
];

export const SITE_IMAGE_POSITIONS = [
  // ── Home ────────────────────────────────────────────────────────────────
  { key: 'hero', label: 'Hero achtergrond', pages: ['home'], default: 'https://media.base44.com/images/public/6a062d5a5c4241c6b2404e25/8696324df_Make_this_photo_look_more_202605150157.jpg' },
  { key: 'story', label: 'Ons verhaal — interieur', pages: ['home'], default: `${SQ}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg` },
  { key: 'philosophy.0', label: 'Filosofie 01 — Onze Formule', pages: ['home', 'onzefilosofie'], default: `${SQ}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg` },
  { key: 'philosophy.1', label: 'Filosofie 02 — Vleesambacht', pages: ['home', 'onzefilosofie'], default: `${SQ}/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg` },
  { key: 'philosophy.2', label: 'Filosofie 03 — Kip, Vis & Veggie', pages: ['home', 'onzefilosofie'], default: `${SQ}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg` },
  { key: 'philosophy.3', label: 'Filosofie 04 — Onze Wijnen', pages: ['home', 'onzefilosofie'], default: `${SQ}/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg` },
  { key: 'philosophy.4', label: 'Filosofie 05 — De Sfeer', pages: ['home', 'onzefilosofie'], default: `${SQ}/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg` },
  { key: 'seasonal.0', label: 'Seizoensuggestie 1 — Kabeljauw', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/e9ee6ba3f_Cod_with_white_asparagus_dish_202607211718.jpg' },
  { key: 'seasonal.1', label: 'Seizoenssuggestie 2 — Poulet Noir', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/46bf2cc7f_Poulet_Noir_Asperges_dish_photo_202607211720.jpg' },
  { key: 'seasonal.2', label: 'Seizoenssuggestie 3 — Asperges Vlaamse wijze', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/882b3ba9c_Asparagus_Flemish_style_logo_2K_202607211720.jpg' },
  { key: 'seasonal.3', label: 'Seizoenssuggestie 4 — Angus', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/65351c82b_Angus_dish_with_logo_2K_202607211722.jpg' },
  { key: 'seasonal.4', label: 'Seizoenssuggestie 5 — Varkenswangetjes', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/484ea39d0_Pork_cheeks_dish_on_Inox_202607211722.jpg' },
  { key: 'seasonal.5', label: 'Seizoenssuggestie 6 — Asperges & zalm', pages: ['home'], default: 'https://media.base44.com/images/public/6a2318ef2d33f7eb2ee9283c/0d2b18917_Asparagus_with_smoked_salmon_dish_202607211723.jpg' },
  { key: 'cta.0', label: 'Actie — Reserveren', pages: ['home'], default: `${SQ}/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg` },
  { key: 'cta.1', label: 'Actie — Afhalen', pages: ['home'], default: `${SQ}/1756906798084-QF5DJWQ3TUKX4AZR1JXU/278560265_1007469039884087_903507914175074104_n.jpg` },
  { key: 'cta.2', label: 'Actie — Cadeaubonnen', pages: ['home'], default: `${SQ}/1756906798104-DAH7YUC0MQMSXKX8D257/437846437_908368301301701_1295494183982636809_n.jpg` },

  // ── Vestigingen (veranda's) — Home, Vestigingen, detail, Over ons, Ons verhaal, Groepen
  { key: 'location.hasselt', label: 'Bogèst Hasselt (veranda)', pages: ['home', 'locations', 'locationdetail', 'about', 'onsverhaal', 'groups'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
  { key: 'location.borgloon', label: 'Bogèst Borgloon (veranda)', pages: ['home', 'locations', 'locationdetail', 'groups'], default: `${SQ}/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg` },
  { key: 'location.heusden-zolder', label: 'Bogèst Heusden-Zolder (veranda)', pages: ['home', 'locations', 'locationdetail', 'onsverhaal', 'groups'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },

  // ── Ruimtes (spaces) — Vestiging detail, Restaurant & ruimtes, Groepen
  { key: 'space.hasselt.0', label: 'Hasselt — De Bar', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg` },
  { key: 'space.hasselt.1', label: 'Hasselt — Open Keuken / Tomahawk', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg` },
  { key: 'space.hasselt.2', label: 'Hasselt — De Living', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg` },
  { key: 'space.hasselt.3', label: 'Hasselt — Het Terras', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg` },
  { key: 'space.borgloon.0', label: 'Borgloon — De Bar', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg` },
  { key: 'space.borgloon.1', label: 'Borgloon — De Living', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg` },
  { key: 'space.borgloon.2', label: 'Borgloon — De Toog', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg` },
  { key: 'space.borgloon.3', label: 'Borgloon — De Koelcel', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg` },
  { key: 'space.borgloon.4', label: 'Borgloon — Het Terras', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg` },
  { key: 'space.heusden-zolder.0', label: 'Heusden-Zolder — Restaurant', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },
  { key: 'space.heusden-zolder.1', label: 'Heusden-Zolder — Het Terras', pages: ['locationdetail', 'spaces', 'groups'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },

  // ── Pagina-hero's (PanelHero achtergronden) ──────────────────────────────
  { key: 'menu.hero', label: 'Menu — hero', pages: ['menu'], default: `${SQ}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg` },
  { key: 'locations.hero', label: 'Vestigingen — hero', pages: ['locations'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },
  { key: 'groups.hero', label: 'Groepen — hero', pages: ['groups'], default: `${SQ}/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg` },
  { key: 'about.hero', label: 'Over ons — hero', pages: ['about'], default: `${SQ}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg` },
  { key: 'about.card1', label: 'Over ons — kaart Ons verhaal', pages: ['about'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
  { key: 'about.card2', label: 'Over ons — kaart Achter de schermen', pages: ['about'], default: `${SQ}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg` },
  { key: 'onsverhaal.hero', label: 'Ons verhaal — hero', pages: ['onsverhaal'], default: `${SQ}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg` },
  { key: 'onsverhaal.story.0', label: 'Ons verhaal — verhaal 1', pages: ['onsverhaal'], default: `${SQ}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg` },
  { key: 'onsverhaal.story.1', label: 'Ons verhaal — verhaal 2', pages: ['onsverhaal'], default: `${SQ}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg` },
  { key: 'onsverhaal.story.2', label: 'Ons verhaal — verhaal 3', pages: ['onsverhaal'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
  { key: 'onsverhaal.story.3', label: 'Ons verhaal — verhaal 4', pages: ['onsverhaal'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },
  { key: 'onsverhaal.pillar.0', label: 'Ons verhaal — pijler 1', pages: ['onsverhaal'], default: `${SQ}/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG` },
  { key: 'onsverhaal.pillar.1', label: 'Ons verhaal — pijler 2', pages: ['onsverhaal'], default: `${SQ}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg` },
  { key: 'onsverhaal.pillar.2', label: 'Ons verhaal — pijler 3', pages: ['onsverhaal'], default: `${SQ}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg` },
  { key: 'onsverhaal.loc.0', label: 'Ons verhaal — locatie Hasselt', pages: ['onsverhaal'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
  { key: 'onsverhaal.loc.1', label: 'Ons verhaal — locatie Borgloon', pages: ['onsverhaal'], default: `${SQ}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg` },
  { key: 'onsverhaal.loc.2', label: 'Ons verhaal — locatie Heusden-Zolder', pages: ['onsverhaal'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },
  { key: 'onsverhaal.loc.3', label: 'Ons verhaal — locatie Lommel', pages: ['onsverhaal'], default: `${SQ}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg` },
  { key: 'contact.hero', label: 'Contact — hero', pages: ['contact'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
  { key: 'reserve.hero', label: 'Reserveren — hero', pages: ['reserve'], default: `${SQ}/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg` },
  { key: 'takeaway.hero', label: 'Afhalen — hero', pages: ['takeaway'], default: `${SQ}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg` },
  { key: 'giftcards.hero', label: 'Cadeaubonnen — hero', pages: ['giftcards'], default: `${SQ}/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg` },
  { key: 'jobs.hero', label: 'Vacatures — hero', pages: ['jobs'], default: `${SQ}/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg` },

  // ── Onze filosofie (/about/onze-filosofie) ────────────────────────────────
  { key: 'philosophy.hero', label: 'Onze filosofie — hero', pages: ['onzefilosofie'], default: `${SQ}/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg` },

  // ── Instagram / Achter de schermen (/about/instagram) ────────────────────
  { key: 'instagram.hero', label: 'Instagram — hero', pages: ['instagram'], default: `${SQ}/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg` },

  // ── Cadeaubonnen — highlights (GiftCardsHighlights) ───────────────────────
  { key: 'giftcards.highlight.0', label: 'Cadeaubonnen — highlight 1', pages: ['giftcards'], default: `${SQ}/1756906792564-LXWK1DRHFSE5N4CODE8U/cadeaubon.jpeg` },
  { key: 'giftcards.highlight.1', label: 'Cadeaubonnen — highlight 2', pages: ['giftcards'], default: `${SQ}/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg` },
  { key: 'giftcards.highlight.2', label: 'Cadeaubonnen — highlight 3', pages: ['giftcards'], default: `${SQ}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg` },
];

export const SITE_IMAGE_DEFAULTS = Object.fromEntries(
  SITE_IMAGE_POSITIONS.map((p) => [p.key, p.default]),
);