// Groepsruimtes per vestiging — voor de /groups concept-sectie.
// Alleen de actieve vestigingen met groepsruimtes (Lommel volgt later).
export const GROUP_LOCATIONS = {
  nl: [
    {
      id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
      tagline: 'Authentieke hoeve met vijf unieke ruimtes',
      formula: 'Formule vanaf €53 pp — 3-gangen menu incl. wijn, water & koffie',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Ideaal voor aperitieven met vrienden.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'De Living', capacity: 44, desc: 'Centraal in het restaurant, erg gezellig voor een grotere groep.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'De Toog', capacity: 25, desc: 'Kleinere gezellige ruimte aansluitend aan de keuken.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'De Koelcel', capacity: 42, desc: 'Unieke ruimte met doorkijkraam op het vlees.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'Het Terras', capacity: 60, desc: 'Zomers terras met beweegbaar dak.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    {
      id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
      tagline: 'Authentieke charme in het hart van Limburg',
      formula: 'Formule vanaf €55 pp — 3-gangen menu incl. wijn, water & koffie (v.a. 12p, niet op vr/za)',
      spaces: [
        { name: 'De Bar', capacity: 40, desc: 'Karakteristiek met de stierenkop en open haard.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Keuken / Tomahawk', capacity: 14, desc: 'De open keuken — ideaal voor een exclusieve vleesbeleving.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'De Living', capacity: 45, desc: 'Vernieuwd met authentieke elementen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'Het Terras', capacity: 50, desc: 'Buitenterras met duurzame materialen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    {
      id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
      tagline: 'Gezellige sfeer aan het station',
      formula: 'Formule vanaf €55 pp — 3-gangen menu incl. wijn, water & koffie (v.a. 12p)',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warm ingericht restaurant met authentieke sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'Het Terras', capacity: 40, desc: 'Ruim terras met aangename sfeer.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  ],
  fr: [
    {
      id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
      tagline: 'Ferme authentique avec cinq espaces uniques',
      formula: 'Formule à partir de €53 pp — menu 3 services incl. vin, eau & café',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Idéal pour les apéritifs entre amis.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'Le Living', capacity: 44, desc: 'Au cœur du restaurant, très convivial pour un grand groupe.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'Le Comptoir', capacity: 25, desc: "Petit espace convivial attenant à la cuisine.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'La Cave Réfrigérée', capacity: 42, desc: 'Espace unique avec vue sur la viande.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'La Terrasse', capacity: 60, desc: 'Terrasse estivale avec toit mobile.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    {
      id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
      tagline: 'Charme authentique au cœur du Limbourg',
      formula: 'Formule à partir de €55 pp — menu 3 services incl. vin, eau & café (dès 12p, pas ven/sam)',
      spaces: [
        { name: 'Le Bar', capacity: 40, desc: 'Caractéristique avec la tête de taureau et la cheminée ouverte.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Cuisine Ouverte / Tomahawk', capacity: 14, desc: 'La cuisine ouverte — idéale pour une expérience viande exclusive.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'Le Living', capacity: 45, desc: 'Rénové avec des éléments authentiques.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'La Terrasse', capacity: 50, desc: 'Terrasse extérieure avec matériaux durables.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    {
      id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
      tagline: 'Ambiance chaleureuse près de la gare',
      formula: 'Formule à partir de €55 pp — menu 3 services incl. vin, eau & café (dès 12p)',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Restaurant chaleureusement décoré avec une ambiance authentique.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'La Terrasse', capacity: 40, desc: 'Grande terrasse avec une ambiance agréable.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  ],
  en: [
    {
      id: 'borgloon', name: 'Bogèst Borgloon', city: 'Borgloon',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/ba4c98fb-2ded-4472-88d3-e42960e519bc/veranda+borgloon.jpeg',
      tagline: 'Authentic farmhouse with five unique spaces',
      formula: 'Formula from €53 pp — 3-course menu incl. wine, water & coffee',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: 'Ideal for aperitifs with friends.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802728-7LJYOC6YHA2PJVKIDKGG/bar+foto.jpeg' },
        { name: 'The Living Room', capacity: 44, desc: 'Central in the restaurant, very cosy for a larger group.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802733-3PGFA7WU2025MY4ZEZKY/living2.jpeg' },
        { name: 'The Counter', capacity: 25, desc: 'Smaller cosy space adjoining the kitchen.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802739-61LMNQL52FSYCJKA3O7F/WhatsApp+Image+2022-02-03+at+19.01.48.jpeg' },
        { name: 'The Cold Room', capacity: 42, desc: 'Unique space with a view through to the meat.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802744-PRS75L0LKF5TIBCFBON6/koelcel.jpg' },
        { name: 'The Terrace', capacity: 60, desc: 'Summer terrace with a movable roof.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906802749-3W8YU4ZMJS6D1H37O1ZD/196900130_3314256705467512_189454985727372203_n.jpeg' },
      ],
    },
    {
      id: 'hasselt', name: 'Bogèst Hasselt', city: 'Hasselt',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/b7c2edca-9db5-43c2-b109-4cc33197dfbe/veranda+hasselt.jpeg',
      tagline: 'Authentic charm in the heart of Limburg',
      formula: 'Formula from €55 pp — 3-course menu incl. wine, water & coffee (from 12p, not Fri/Sat)',
      spaces: [
        { name: 'The Bar', capacity: 40, desc: "Characterful with the bull's head and open fireplace.", image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819061-M771PN6UEKBULK7QL4YF/104452603_569843427256836_5136003467880034448_n.jpg' },
        { name: 'Open Kitchen / Tomahawk', capacity: 14, desc: 'The open kitchen — ideal for an exclusive meat experience.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819066-6MA0KSXPX5SHGKCY0Q7R/tbone.jpeg' },
        { name: 'The Living Room', capacity: 45, desc: 'Renovated with authentic elements.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819071-DNNEJIY9OY0UDSFSMKYI/IMG_4186.jpg' },
        { name: 'The Terrace', capacity: 50, desc: 'Outdoor terrace with sustainable materials.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/1756906819075-OY72K200C7HXS7OTC5NE/IMG_4180.jpg' },
      ],
    },
    {
      id: 'heusden-zolder', name: 'Bogèst Heusden-Zolder', city: 'Heusden-Zolder',
      image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg',
      tagline: 'Cosy atmosphere at the station',
      formula: 'Formula from €55 pp — 3-course menu incl. wine, water & coffee (from 12p)',
      spaces: [
        { name: 'Restaurant', capacity: 80, desc: 'Warmly decorated restaurant with authentic atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
        { name: 'The Terrace', capacity: 40, desc: 'Spacious terrace with a pleasant atmosphere.', image: 'https://images.squarespace-cdn.com/content/v1/68b84525485ccc7e15a25577/04917c77-6ebc-4470-83fb-a2abc637268b/zolder+veranda.jpeg' },
      ],
    },
  ],
};