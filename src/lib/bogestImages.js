// Real Bogèst imagery collected from bogest.be (Squarespace CDN).
// Categorized by subject so every photo is authentic to Bogèst and placed
// next to the content it actually depicts.

const CDN = 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577';

export const bogestImages = {
  // Restaurant interiors — verandas, living rooms, dining spaces
  interiors: [
    `${CDN}/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg`,
    `${CDN}/5baf9326-de7f-4a23-9273-dd46941a1b15/veranda+borgloon.jpeg`,
    `${CDN}/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg`,
    `${CDN}/1756906798133-O44CER8WRTZ0YVM5E8TK/living.jpeg`,
    `${CDN}/1756906798126-DFOS1XY5Y0NOWCQVE23M/96368874_542981379699687_4859956873555607552_n.jpg`,
    `${CDN}/1756906798149-17KHS8RDD2FJIZI179ZQ/EF6D9D08-F3ED-41E2-9392-96AB73DEF2E6.jpeg`,
    `${CDN}/1756906798165-JY6MLWTWSAW9LSNQ1R89/2503F10C-6FB0-4FB4-9296-9E616D4559C3.jpeg`,
    `${CDN}/1756906798141-H0H195TOCA6WGBG9N8WA/IMG_4166.jpg`,
    `${CDN}/1756906798157-1KE555XAD515OGKMTL1M/IMG_5033.JPG`,
    `${CDN}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg`,
  ],

  // Beef & grilled meat dishes (filet pur, ribeye, brochette, etc.)
  beef: [
    `${CDN}/1756906798035-Y0LQXMVFSBJWWVXQG7ZI/filet+pur+.jpeg`,
    `${CDN}/1756906798060-BJGKYWMVJNFODKFB94TE/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg`,
    `${CDN}/1756906799913-Y5ZEKPI4I2XXUTYC8W3T/d2db3621-8f9b-45f1-95c8-498c24ed15c3-1.jpg`,
    `${CDN}/1756906798084-QF5DJWQ3TUKX4AZR1JXU/278560265_1007469039884087_903507914175074104_n.jpg`,
    `${CDN}/1756906798020-1RKR6N8VGHSE1Z88BXP4/378389609_756558059816060_7208800625589654574_n.jpg`,
    `${CDN}/1756906798052-P24QWA3M58JWMGOWHVBD/399841843_793829846088881_1062638734165438461_n.jpg`,
    `${CDN}/1756906798104-DAH7YUC0MQMSXKX8D257/437846437_908368301301701_1295494183982636809_n.jpg`,
    `${CDN}/1756906798027-ZPXKAMZNVCSV6440QX6W/402597853_796945305777335_8211882432551808857_n.jpg`,
    `${CDN}/1756906793828-46U4HY2BWRCMXLZ9G2VW/313432687_792246775522672_788010508288086563_n.jpg`,
    `${CDN}/1756906793880-RYMZN9OWYYUERUL16C6K/B4E94C22-3656-4874-A66B-CEA4D674F86D.jpeg`,
  ],

  // Pork dishes
  pork: [
    `${CDN}/1756906798068-Y30B7VANC5RKS6HTHGE9/tomapork.jpeg`,
  ],

  // Chicken dishes
  chicken: [
    `${CDN}/1756906799922-SLXI4OSI7W3KWGKE3UFY/5a7c094c-9679-410a-bbc5-5f8c663d8a14.JPG`,
  ],

  // Fish dishes
  fish: [
    `${CDN}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg`,
    `${CDN}/73cc2b2a-9419-4222-80ee-be10bc8bff62/69FCF8C3-2BD9-4D7C-9871-8E00EDE111A5.jpeg`,
  ],

  // Vegetarian dishes
  veggie: [
    `${CDN}/2691085b-33a3-45ec-80b3-484d63c034d2/WhatsApp+Image+2026-06-09+at+14.13.49.jpeg`,
    `${CDN}/426ec0ed-f1b6-4eb0-90d5-ad7cea634e7c/7B0C379C-A65C-400B-83D7-C140E27E6ABF_1_201_a.jpeg`,
  ],

  // Starters / soups / bouletjes
  starters: [
    `${CDN}/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg`,
    `${CDN}/1756906793871-KBDPOQZVPFE4ORKRLGFS/402597853_796945305777335_8211882432551808857_n.jpg`,
  ],

  // Desserts
  desserts: [
    `${CDN}/1b9991fd-fc43-405b-acb6-a86317aaf9f1/5757bb8f-abdc-43e6-9219-e4e103f1a2e0.jpeg`,
    `${CDN}/1756906799926-VML5QXWO8V6D1NYAO2ZA/909af4c2-7392-4bbc-af18-2ea890714ecd-1.jpg`,
  ],

  // Bar / drinks / wine atmosphere
  bar: [
    `${CDN}/1756906793871-KBDPOQZVPFE4ORKRLGFS/402597853_796945305777335_8211882432551808857_n.jpg`,
    `${CDN}/32f05da0-47c0-41c3-8beb-befced66a749/5D626C0A-F4F5-4B45-895D-E1D622FB21E2.jpeg`,
  ],

  // Curated stock photography (Unsplash) for subjects Bogèst doesn't shoot
  // itself — wine pours, grill flames, dining atmosphere. Only known URLs.
  external: {
    wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80',
    interior: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80',
    beef: 'https://images.unsplash.com/photo-1558030006-450675393492?w=900&q=80',
    dessert: 'https://images.unsplash.com/photo-1567206563064-6f60f5cc5857?w=900&q=80',
  },
};

// Flat pool of every image, useful for galleries and fallbacks.
export const bogestImagePool = [
  ...bogestImages.interiors,
  ...bogestImages.beef,
  ...bogestImages.pork,
  ...bogestImages.chicken,
  ...bogestImages.fish,
  ...bogestImages.veggie,
  ...bogestImages.starters,
  ...bogestImages.desserts,
  ...bogestImages.bar,
];