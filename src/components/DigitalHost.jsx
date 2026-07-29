import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronRight, ExternalLink, MessageCircle, Mic, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useTheme } from '@/lib/ThemeContext';
import { useLang } from '@/lib/LangContext';
import { getSystemPrompt } from '@/lib/digitalHostKnowledge';
import { useVisitorProfile } from '@/hooks/useVisitorProfile';
import { useMenuKnowledge } from '@/hooks/useMenuKnowledge';
import { startElevenLabsConversation } from '@/lib/elevenLabsWidget';
import { syncToTopic } from '@/lib/websiteSyncEngine';
import RecommendationCard from '@/components/digital-host/RecommendationCard';
import { dispatchUIAction } from '@/lib/uiActionDispatcher';


const HOST_PHOTO_URL = 'https://media.base44.com/images/public/6a62118af65a96c8b1eb8e17/00206836e_salvoelev.jpg';
const WELCOME_VIDEO_URL = 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/f33cb896e_popuphost.mp4';
const MOBILE_WELCOME_VIDEO_URL = 'https://media.base44.com/videos/public/6a62118af65a96c8b1eb8e17/a0758be5f_popuphost_.mp4';

// ─── Multilingual content ────────────────────────────────────────────────────
const HOST_STRINGS = {
  nl: {
    title: 'Vraag het aan Bogèst',
    assistant: 'Vraag het aan Bogèst',
    placeholder: 'Stel gerust uw vraag...',
    footer_text: 'Vraag het aan Bogèst · Reservaties via',
    footer_link: 'de website',
    fab_label: 'Bogèst',
    fab_cta: 'Vraag het aan Bogèst',
    chat_to: 'Klik om te chatten →',
    close_skip: 'Ik kijk gewoon even rond',
    greeting_morning: 'Goedemorgen',
    greeting_afternoon: 'Goedemiddag',
    greeting_evening: 'Goedenavond',
    greeting_night: 'Goedenacht',
    intro_line1: 'Ik ben de gastheer van Bogèst.',
    intro_line2_lunch: 'Hebt ge zin in een lekkere lunch vandaag?',
    intro_line2_diner: 'Plannen voor vanavond? Ik help u graag verder.',
    intro_line2_default: 'Ik ken ons menu en onze vestigingen van binnen en van buiten.',
    intro_line3_warm_sunny: 'Het is trouwens prachtig weer vandaag — {temp}°C en zonnig. Ge zit vast graag buiten? Perfect op ons terras.',
    intro_line3_rainy: 'Het is wat regenachtig buiten ({temp}°C), maar binnen bij ons is het altijd gezellig en warm.',
    intro_line3_weather: 'Buiten is het momenteel {desc} en {temp}°C. Het weekend ziet er {forecast} uit.',
    intro_question: 'Waarmee kan ik u helpen?',
    chip_location: 'Welke vestiging past bij mij?',
    chip_reserve: 'Tafel reserveren',
    chip_menu: 'Mag ik iets aanraden?',
    chip_explore: 'Ik kijk even rond',
    entry_headline: 'Welkom bij Bogèst',
    entry_sub: 'Hoe wilt u vandaag kennismaken?',
    entry_chat: 'Chat met de gastheer',
    entry_chat_sub: 'Stel uw vraag via tekst',
    entry_live: 'Live gesprek voeren',
    entry_live_sub: 'Spreek met onze gastheer',
    entry_explore: 'Zelf ontdekken',
    entry_explore_sub: 'Ik kijk even rond',
    capabilities: ['Menu aanbevelingen', 'Tafel reserveren', 'Vestigingen & uren', 'Wijn- & bieradvies', 'Cadeaubonnen', 'Groepen & events'],
    speech_on: 'Spraak inschakelen',
    speech_off: 'Spraak uitschakelen',
    page_chips: {
      '/menu': ['Beste vleessnit voor mij', 'Populairste gerechten', 'Vegetarische opties', 'Gezinsvriendelijk'],
      '/locations': ['Vergelijk vestigingen', 'Welke heeft een terras?', 'Best voor families'],
      '/reserve': ['Openingsuren', 'Parkeren', 'Groepsreservering'],
      '/about': ['Het verhaal van Bogèst', 'Onze vleesfilosofie'],
    },
    page_greetings: {
      '/menu': 'Twijfelt ge nog tussen een paar gerechten? Zeg het maar — ik help u graag kiezen.',
      '/locations': 'Zijt ge op zoek naar de juiste vestiging? Ik vertel u graag het verschil.',
      '/reserve': 'Nog vragen voor uw reservering? Geen probleem, ik help u alvast verder.',
      '/about': 'Nieuwsgierig naar het verhaal achter Bogèst? Ik vertel het u graag.',
      default: 'Waarmee kan ik u helpen? Ik ken alles over ons menu, onze vestigingen en wat Bogèst zo bijzonder maakt.',
    },
    proactive_facts: [
      { msg: 'Wist ge al dat bij elk hoofdgerecht bij ons een voorgerecht én een dessert inbegrepen zijn? Ge betaalt alleen de prijs van het hoofdgerecht.', actions: [{ label: 'Bekijk het menu', url: '/menu' }] },
      { msg: 'Onze Côte à l\'os voor twee is zo populair dat gasten er speciaal voor terugkomen. Zou ge dat ook graag eens ontdekken?', actions: [{ label: 'Reserveer een tafel', url: '/reserve' }] },
      { msg: 'Bogèst heeft drie gezellige vestigingen in Limburg — in Hasselt, Borgloon en Heusden-Zolder. Elke plek heeft zijn eigen sfeer.', actions: [{ label: 'Ontdek de locaties', url: '/locations' }] },
      { msg: 'Onze spare ribs worden urenlang langzaam gegaard. Het vlees valt letterlijk van het bot — met ons eigen geheim sausje erbij. Echte Bogèst-klassieker.', actions: [{ label: 'Zie het menu', url: '/menu' }] },
      { msg: 'Volg ons op Instagram voor sfeerbeelden en weekspecials — per vestiging zelfs!', actions: [{ label: 'Hasselt', url: 'https://www.instagram.com/bogesthasselt' }, { label: 'Borgloon', url: 'https://www.instagram.com/bogestborgloon' }] },
      { msg: 'Voor een romantisch diner voor twee is Borgloon echt de moeite — landelijk, charmant en intiem. Ge zult er geen spijt van hebben.', actions: [{ label: 'Borgloon', url: '/locations/borgloon' }, { label: 'Reserveer', url: '/reserve' }] },
      { msg: 'Onze Masters of Meat — Angus Ribeye en Hereford Ribeye — zijn premium stukken met superieure marmering. Iets voor de echte vleesliefhebber.', actions: [{ label: 'Meer over het menu', url: '/menu' }] },
      { msg: 'Komt ge met het gezin? Heusden-Zolder is echt gezinsvriendelijk en ruim. De kinderen kunnen er zelfs hun eigen ijsje versieren!', actions: [{ label: 'Ontdek Heusden-Zolder', url: '/locations/heusden-zolder' }] },
      { msg: 'De naam "Bogèst" komt van "Beau Geste" — een mooi gebaar. Want bij ons genieten, dat is meer dan alleen eten. Het is een ervaring.' },
      { msg: 'Onze trots: het Belgisch Witblauw. Een streekras dat van nature uitzonderlijk mals en fijn vlees levert. Echte Limburgse kwaliteit.', actions: [{ label: 'Zie het menu', url: '/menu' }] },
      { msg: 'Wist ge dat we al onze sauzen vers kloppen? Béarnaise, roquefort, peperroom — niets komt uit een potje. Dat proeft ge.' },
      { msg: 'Een goede filet pur hoort rosé te zijn aan de binnenkant. Vraag gerust aan onze grilleurs hoe zij het perfect bereiden.' },
      { msg: 'De Maillard-reactie — dat is de scheikunde achter dat heerlijke korstje op gegrild vlees. Hoe heter de grill, hoe lekkerder de korst.' },
      { msg: 'Onze stoofvlees wordt traag gesudderd op grootmoeders wijze. Geen haast, alleen geduld en goede ingrediënten. Dat is het geheim.' },
      { msg: 'Wist ge dat marmering — die witte vette adertjes in vlees — zorgt voor smaak en malsheid? Hoe meer marmering, hoe sappiger.' },
      { msg: 'Onze huiswijnen zijn persoonlijk geselecteerd door Ardan zelf. Geen toeval — elke fles is een bewuste keuze die bij ons vlees past.' },
      { msg: 'Orange wines zijn een van onze specialiteiten. Geen gewone witte wijn — een natuurlijke wijn met een oranjekleurige tint en verrassende smaak.' },
      { msg: 'Het vlees na het grillen laten rusten? Dat is geen luxe — het laat de sappen herverdelen zodat elke hap mals blijft. Onze grilleurs weten precies hoe lang.' },
      { msg: 'Onze luikse saus is huisbereid — geen gewone saus uit de winkel. Echte Luikse stroop, mosterd en kruiden. Dat maakt het verschil bij onze bouletten.' },
      { msg: 'De Entremisu Bogèst is onze eigen creatie — een kruising tussen tiramisu en entremet. Ge vindt nergens anders zoiets.' },
      { msg: 'Onze grilleurs kennen elk stuk vlees persoonlijk. Zij weten precies welke snede hoe op de grill thuishoort. Dat is ambacht, geen toeval.' },
      { msg: 'Na een goede maaltijd hoort een goed glas. Onze Godina-wijn? Die hebben we zelf laten maken — een volle rode die perfect past bij onze grillgerechten.' },
    ],
    proactive_invites: [
      { msg: 'Ik zit hier klaar om u te helpen. Hebt ge een vraag, of gewoon zin om even te kletsen?', actions: [] },
      { msg: 'Zit ge te twijfelen tussen een paar gerechten? Vraag het me gerust — ik ken het menu van buiten.', actions: [] },
      { msg: 'Nog even en ge hebt honger, zeker? Ik kan u alvast een tafel zoeken als ge wilt.', actions: [{ label: 'Reserveer', url: '/reserve' }] },
      { msg: 'Hebt ge iets bijzonders gepland? Een verjaardag, een date? Ik help u het perfect te maken.', actions: [] },
      { msg: 'Twijfelt ge over welke vestiging het beste past? Vraag het me — ik ken ze alle drie.', actions: [{ label: 'Vergelijk locaties', url: '/locations' }] },
      { msg: 'Ge kunt me alles vragen, hè. Van wijnadvies tot parkeerinformatie. Ik ben er voor u.', actions: [] },
    ],
    proactive_weather: {
      warm_sunny: [
        { msg: 'Pfft, {temp}°C vandaag — hoe houdt ge het vol in deze hitte? Een koud drankje op ons terras kan verkoeling brengen.', actions: [{ label: 'Terrasplek reserveren', url: '/reserve' }] },
        { msg: '{temp}°C en zonnig! Perfect terrasweer bij ons. Komt ge vandaag nog even langs?', actions: [{ label: 'Reserveer', url: '/reserve' }] },
        { msg: 'Wat een heerlijke dag — {temp}°C en stralend zonnetje. Ik zeg: bel iemand en kom genieten. Zal ik een tafel zoeken?', actions: [{ label: 'Reserveer', url: '/reserve' }] },
      ],
      rainy: [
        { msg: 'Het regent buiten ({temp}°C)... Maar bij Bogèst is het altijd warm en gezellig. Misschien het perfecte moment om binnen te schuilen met een goede maaltijd?', actions: [{ label: 'Reserveer', url: '/reserve' }] },
        { msg: 'Sombere dag buiten ({temp}°C). Maar bij ons brandt de grill en staat de wijn klaar. Zin om binnen te zitten?', actions: [{ label: 'Zie het menu', url: '/menu' }] },
      ],
      cold: [
        { msg: 'Brr, {temp}°C vandaag. Een warme maaltijd bij Bogèst is precies wat ge nu nodig hebt, niet? Onze stoofvlees is dan een aanrader.', actions: [{ label: 'Zie het menu', url: '/menu' }] },
        { msg: 'Koud buiten ({temp}°C). Tijd voor stevig comfortfood. Onze spare ribs zijn urenlang gegaard — ideaal om op te warmen.', actions: [{ label: 'Reserveer', url: '/reserve' }] },
      ],
      default: [
        { msg: '{temp}°C en {desc} vandaag. Geen slecht weer om binnen te zitten met een goed stuk vlees. Zin in een tafel?', actions: [{ label: 'Reserveer', url: '/reserve' }] },
        { msg: 'Het is {temp}°C buiten. Weet ge wat leuk is? Een bezoekje aan Bogèst. Ik help u graag verder.', actions: [] },
      ],
    },
  },
  fr: {
    title: 'Vraag het aan Bogèst',
    assistant: 'Vraag het aan Bogèst',
    placeholder: 'Posez votre question...',
    footer_text: 'Vraag het aan Bogèst · Réservations via',
    footer_link: 'le site',
    fab_label: 'Bogèst',
    fab_cta: 'Vraag het aan Bogèst',
    chat_to: 'Cliquer pour chatter →',
    close_skip: 'Juste regarder',
    greeting_morning: 'Bonjour',
    greeting_afternoon: 'Bonjour',
    greeting_evening: 'Bonsoir',
    greeting_night: 'Bonne nuit',
    intro_line1: 'Je suis votre hôte personnel chez Bogèst.',
    intro_line2_lunch: 'Vous cherchez une table pour le déjeuner ?',
    intro_line2_diner: 'Des plans pour ce soir ?',
    intro_line2_default: 'Je connais notre menu, nos établissements et tout ce qu\'il y a entre les deux.',
    intro_line3_warm_sunny: 'Il fait d\'ailleurs un temps magnifique — {temp}°C et ensoleillé. Parfait pour notre terrasse.',
    intro_line3_rainy: 'Il pleut un peu dehors ({temp}°C), mais chez nous il fait toujours bon.',
    intro_line3_weather: 'Dehors il fait actuellement {desc} et {temp}°C. Le week-end s\'annonce {forecast}.',
    intro_question: 'Comment puis-je vous aider aujourd\'hui ?',
    chip_location: 'Quel établissement me convient ?',
    chip_reserve: 'Réserver une table',
    chip_menu: 'Quelle est la recommandation ?',
    chip_explore: 'Je regarde juste',
    entry_headline: 'Bienvenue chez Bogèst',
    entry_sub: 'Comment souhaitez-vous découvrir Bogèst ?',
    entry_chat: "Discuter avec l'hôte",
    entry_chat_sub: 'Posez votre question par écrit',
    entry_live: 'Conversation en direct',
    entry_live_sub: 'Parlez à notre hôte',
    entry_explore: 'Explorer par vous-même',
    entry_explore_sub: 'Je regarde juste',
    capabilities: ['Recommandations menu', 'Réserver une table', 'Lieux & horaires', 'Conseils vin & bière', 'Bons cadeaux', 'Groupes & événements'],
    speech_on: 'Activer la voix',
    speech_off: 'Désactiver la voix',
    page_chips: {
      '/menu': ['La meilleure coupe pour moi', 'Plats les plus populaires', 'Options végétariennes'],
      '/locations': ['Comparer les lieux', 'Lequel a une terrasse ?', 'Idéal pour les familles'],
      '/reserve': ['Horaires', 'Parking', 'Réservation de groupe'],
      '/about': ["L'histoire de Bogèst", 'Notre philosophie de la viande'],
    },
    page_greetings: {
      '/menu': 'Pas sûr de ce que vous voulez ? Je compare les plats et vous donne une recommandation personnalisée.',
      '/locations': "Besoin d'aide pour choisir le bon établissement ?",
      '/reserve': 'Avez-vous des questions avant votre réservation ?',
      '/about': "Envie d'en savoir plus sur l'histoire de Bogèst ?",
      default: 'Comment puis-je vous aider ? Je connais tout sur notre menu, nos établissements et ce qui rend Bogèst unique.',
    },
    proactive_facts: [
      { msg: 'Saviez-vous qu\'avec chaque plat principal, nous offrons une entrée ET un dessert ? Vous ne payez que le plat principal.', actions: [{ label: 'Voir la carte', url: '/menu' }] },
      { msg: 'Notre Côte à l\'os pour deux est si populaire que les clients reviennent spécialement pour ça. Envie de le découvrir ?', actions: [{ label: 'Réserver une table', url: '/reserve' }] },
      { msg: 'Bogèst a trois établissements chaleureux en Limbourg — à Hasselt, Borgloon et Heusden-Zolder. Chaque lieu a son propre caractère.', actions: [{ label: 'Découvrir les lieux', url: '/locations' }] },
      { msg: 'Nos spare ribs cuisent lentement pendant des heures. La viande tombe littéralement de l\'os, avec notre sauce maison secrète.', actions: [{ label: 'Voir la carte', url: '/menu' }] },
      { msg: 'Suivez-nous sur Instagram pour des photos d\'ambiance et les spéciaux — chaque établissement a son propre compte !', actions: [{ label: 'Hasselt', url: 'https://www.instagram.com/bogesthasselt' }, { label: 'Borgloon', url: 'https://www.instagram.com/bogestborgloon' }] },
      { msg: 'Pour un dîner romantique en tête-à-tête, nous recommandons vivement Borgloon — champêtre, charmant et intime.', actions: [{ label: 'Borgloon', url: '/locations/borgloon' }, { label: 'Réserver', url: '/reserve' }] },
      { msg: 'Le nom "Bogèst" vient de "Beau Geste" — un beau geste. Parce que savourer chez nous, c\'est plus qu\'un repas. C\'est une expérience.' },
      { msg: 'Notre fierté : le Blanc Bleu Belge. Une race régionale qui offre une viande d\'une finesse exceptionnelle. De la vraie qualité limbourgeoise.', actions: [{ label: 'Voir la carte', url: '/menu' }] },
      { msg: 'Le saviez-vous ? Toutes nos sauces sont fouettées maison. Béarnaise, roquefort, poivre — rien ne vient d\'un bocal. Ça se goûte.' },
      { msg: 'Un bon filet pur se sert saignant à cœur. Demandez à nos grillards comment ils le préparent à la perfection.' },
      { msg: 'La réaction de Maillard — c\'est la chimie derrière cette délicieuse croûte sur la viande grillée. Plus la grille est chaude, plus la croûte est savoureuse.' },
      { msg: 'Notre carbonnade mijote lentement, à la manière de grand-mère. Pas de précipitation, seulement de la patience et de bons ingrédients.' },
      { msg: 'Le saviez-vous ? Le persillé — ces petites veines de graisse dans la viande — apporte saveur et tendreté. Plus il y en a, plus c\'est juteux.' },
      { msg: 'Nos vins de maison sont personnellement sélectionnés par Ardan lui-même. Pas de hasard — chaque bouteille est un choix réfléchi qui accompagne notre viande.' },
      { msg: 'Les orange wines sont l\'une de nos spécialités. Pas un simple vin blanc — un vin naturel à la teinte orangée et au goût surprenant.' },
      { msg: 'Laisser reposer la viande après cuisson ? Ce n\'est pas un luxe — cela redistribue les sucs pour que chaque bouchée reste tendre.' },
      { msg: 'L\'Entremisu Bogèst est notre propre création — un croisement entre tiramisu et entremet. Vous ne trouverez ça nulle part ailleurs.' },
      { msg: 'Nos grillards connaissent chaque morceau de viande personnellement. Ils savent exactement comment chaque coupe doit cuire. C\'est de l\'artisanat.' },
    ],
    proactive_invites: [
      { msg: 'Je suis là pour vous aider. Une question, ou juste envie de discuter ?', actions: [] },
      { msg: 'Vous hésitez entre deux plats ? Demandez-moi — je connais la carte par cœur.', actions: [] },
      { msg: 'Bientôt l\'heure de manger ? Je peux vous trouver une table si vous voulez.', actions: [{ label: 'Réserver', url: '/reserve' }] },
      { msg: 'Vous prévoyez quelque chose de spécial ? Un anniversaire, un rencard ? Je vous aide à le rendre parfait.', actions: [] },
      { msg: 'Vous ne savez pas quel établissement choisir ? Demandez-moi — je les connais tous.', actions: [{ label: 'Comparer les lieux', url: '/locations' }] },
      { msg: 'Vous pouvez tout me demander, vous savez. Du conseil vin au parking. Je suis là pour vous.', actions: [] },
    ],
    proactive_weather: {
      warm_sunny: [
        { msg: 'Pff, {temp}°C aujourd\'hui — comment vous faites pour supporter cette chaleur ? Un verre frais sur notre terrasse peut aider.', actions: [{ label: 'Réserver', url: '/reserve' }] },
        { msg: '{temp}°C et ensoleillé ! Parfait pour notre terrasse. Vous venez aujourd\'hui ?', actions: [{ label: 'Réserver', url: '/reserve' }] },
        { msg: 'Quelle belle journée — {temp}°C et grand soleil. Appelez un ami et venez en profiter. Je vous trouve une table ?', actions: [{ label: 'Réserver', url: '/reserve' }] },
      ],
      rainy: [
        { msg: 'Il pleut ({temp}°C)... Mais chez Bogèst, c\'est toujours chaleureux. Le moment parfait pour s\'abriter avec un bon repas ?', actions: [{ label: 'Réserver', url: '/reserve' }] },
        { msg: 'Jour sombre dehors ({temp}°C). Mais chez nous, la grille chauffe et le vin est prêt. Envie de vous installer à l\'intérieur ?', actions: [{ label: 'Voir la carte', url: '/menu' }] },
      ],
      cold: [
        { msg: 'Brr, {temp}°C aujourd\'hui. Un bon repas chaud chez Bogèst, c\'est exactement ce qu\'il vous faut, non ?', actions: [{ label: 'Voir la carte', url: '/menu' }] },
        { msg: 'Il fait froid dehors ({temp}°C). Place au comfort food. Nos spare ribs mijotent pendant des heures — parfait pour se réchauffer.', actions: [{ label: 'Réserver', url: '/reserve' }] },
      ],
      default: [
        { msg: '{temp}°C et {desc} aujourd\'hui. Pas mauvais temps pour s\'installer avec un bon morceau de viande. Envie d\'une table ?', actions: [{ label: 'Réserver', url: '/reserve' }] },
        { msg: 'Il fait {temp}°C dehors. Vous savez ce qui serait sympa ? Une visite chez Bogèst. Je vous aide volontiers.', actions: [] },
      ],
    },
  },
  en: {
    title: 'Vraag het aan Bogèst',
    assistant: 'Vraag het aan Bogèst',
    placeholder: 'Ask your question...',
    footer_text: 'Vraag het aan Bogèst · Reservations via',
    footer_link: 'the website',
    fab_label: 'Bogèst',
    fab_cta: 'Vraag het aan Bogèst',
    chat_to: 'Click to chat →',
    close_skip: 'Just browsing',
    greeting_morning: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    greeting_night: 'Good night',
    intro_line1: "I'm your personal host at Bogèst.",
    intro_line2_lunch: 'Looking for a lunch table today?',
    intro_line2_diner: 'Any plans for dinner tonight?',
    intro_line2_default: 'I know our menu, locations and everything in between inside out.',
    intro_line3_warm_sunny: "By the way, it's gorgeous outside — {temp}°C and sunny. Perfect for our terrace.",
    intro_line3_rainy: "It's a bit rainy outside ({temp}°C), but inside it's always cosy here.",
    intro_line3_weather: 'Outside it is currently {desc} and {temp}°C. The weekend looks {forecast}.',
    intro_question: 'How can I help you today?',
    chip_location: 'Which location suits me?',
    chip_reserve: 'Reserve a table',
    chip_menu: "What's the recommendation?",
    chip_explore: 'Just browsing',
    entry_headline: 'Welcome to Bogèst',
    entry_sub: 'How would you like to explore today?',
    entry_chat: 'Chat with the host',
    entry_chat_sub: 'Ask your question in text',
    entry_live: 'Have a live conversation',
    entry_live_sub: 'Talk to our host',
    entry_explore: 'Explore by yourself',
    entry_explore_sub: 'Just browsing',
    capabilities: ['Menu recommendations', 'Book a table', 'Locations & hours', 'Wine & beer advice', 'Gift cards', 'Groups & events'],
    speech_on: 'Enable speech',
    speech_off: 'Disable speech',
    page_chips: {
      '/menu': ['Best cut for me', 'Most popular dishes', 'Vegetarian options', 'Family-friendly'],
      '/locations': ['Compare locations', 'Which has a terrace?', 'Best for families'],
      '/reserve': ['Opening hours', 'Parking', 'Group reservation'],
      '/about': ['The Bogèst story', 'Our meat philosophy'],
    },
    page_greetings: {
      '/menu': "Not sure what to choose? I'll compare dishes and give you a personal recommendation.",
      '/locations': 'Need help choosing the right location?',
      '/reserve': 'Any questions before your reservation?',
      '/about': 'Want to know more about the story behind Bogèst?',
      default: 'How can I help? I know everything about our menu, locations and what makes Bogèst special.',
    },
    proactive_facts: [
      { msg: "Did you know that every main course at Bogèst includes both a starter AND a dessert? You only pay the price of the main.", actions: [{ label: 'View menu', url: '/menu' }] },
      { msg: "Our Côte à l'os for two is so popular guests come back just for it. Want to discover it for yourself?", actions: [{ label: 'Reserve a table', url: '/reserve' }] },
      { msg: 'Bogèst has three welcoming locations in Limburg — in Hasselt, Borgloon and Heusden-Zolder. Each has its own character.', actions: [{ label: 'Discover locations', url: '/locations' }] },
      { msg: 'Our spare ribs are slow-cooked for hours. The meat literally falls off the bone, with our own secret dipping sauce.', actions: [{ label: 'See the menu', url: '/menu' }] },
      { msg: 'Follow us on Instagram for atmosphere shots and weekly specials — each location has its own account!', actions: [{ label: 'Hasselt', url: 'https://www.instagram.com/bogesthasselt' }, { label: 'Borgloon', url: 'https://www.instagram.com/bogestborgloon' }] },
      { msg: "For a romantic dinner for two, we highly recommend Borgloon — rural, charming and intimate.", actions: [{ label: 'Borgloon', url: '/locations/borgloon' }, { label: 'Reserve', url: '/reserve' }] },
      { msg: 'The name "Bogèst" comes from "Beau Geste" — a beautiful gesture. Because enjoying a meal with us is more than just eating. It\'s an experience.' },
      { msg: 'Our pride: the Belgian Blue. A regional breed that naturally yields exceptionally tender and fine meat. Real Limburg quality.', actions: [{ label: 'See the menu', url: '/menu' }] },
      { msg: 'Did you know? All our sauces are whipped fresh in-house. Béarnaise, roquefort, peppercream — nothing comes from a jar. You can taste the difference.' },
      { msg: 'A proper filet pur should be pink on the inside. Ask our grillers how they prepare it to perfection.' },
      { msg: 'The Maillard reaction — that\'s the chemistry behind that delicious crust on grilled meat. The hotter the grill, the tastier the crust.' },
      { msg: 'Our beef stew simmers slowly, just like grandmother used to make. No rush, only patience and good ingredients. That\'s the secret.' },
      { msg: 'Did you know that marbling — those white fat veins in meat — is what creates flavour and tenderness? More marbling means juicier meat.' },
      { msg: 'Our house wines are personally selected by Ardan himself. No accident — every bottle is a deliberate choice that pairs with our grilled dishes.' },
      { msg: 'Orange wines are one of our specialties. Not your regular white wine — a natural wine with an orange tint and surprising taste.' },
      { msg: 'Letting meat rest after grilling? It\'s not a luxury — it redistributes the juices so every bite stays tender. Our grillers know exactly how long.' },
      { msg: 'The Entremisu Bogèst is our own creation — a cross between tiramisu and entremet. You won\'t find this anywhere else.' },
      { msg: 'Our grillers know every cut of meat personally. They know exactly how each piece belongs on the grill. That\'s craftsmanship, not chance.' },
    ],
    proactive_invites: [
      { msg: "I'm right here to help. Got a question, or just fancy a chat?", actions: [] },
      { msg: "Torn between a couple of dishes? Just ask — I know the menu inside out.", actions: [] },
      { msg: "Getting hungry soon? I can find you a table if you'd like.", actions: [{ label: 'Reserve', url: '/reserve' }] },
      { msg: 'Planning something special? A birthday, a date? I\'ll help make it perfect.', actions: [] },
      { msg: 'Not sure which location suits you best? Ask me — I know all three.', actions: [{ label: 'Compare locations', url: '/locations' }] },
      { msg: 'You can ask me anything, you know. From wine advice to parking info. I\'m here for you.', actions: [] },
    ],
    proactive_weather: {
      warm_sunny: [
        { msg: 'Phew, {temp}°C today — how are you holding up in this heat? A cold drink on our terrace might help.', actions: [{ label: 'Reserve a terrace spot', url: '/reserve' }] },
        { msg: '{temp}°C and sunny! Perfect terrace weather at our place. Coming by today?', actions: [{ label: 'Reserve', url: '/reserve' }] },
        { msg: 'What a lovely day — {temp}°C and bright sunshine. Call a friend and come enjoy it. Shall I find you a table?', actions: [{ label: 'Reserve', url: '/reserve' }] },
      ],
      rainy: [
        { msg: "It's raining outside ({temp}°C)... But at Bogèst it's always warm and cosy. Maybe the perfect time to shelter with a good meal?", actions: [{ label: 'Reserve', url: '/reserve' }] },
        { msg: 'Gloomy day out there ({temp}°C). But inside, the grill is hot and the wine is ready. Fancy sitting inside?', actions: [{ label: 'See the menu', url: '/menu' }] },
      ],
      cold: [
        { msg: "Brr, {temp}°C today. A warm meal at Bogèst is exactly what you need right now, isn't it?", actions: [{ label: 'See the menu', url: '/menu' }] },
        { msg: "Cold outside ({temp}°C). Time for hearty comfort food. Our spare ribs are slow-cooked for hours — perfect to warm up.", actions: [{ label: 'Reserve', url: '/reserve' }] },
      ],
      default: [
        { msg: '{temp}°C and {desc} today. Not bad weather to sit inside with a good piece of meat. Fancy a table?', actions: [{ label: 'Reserve', url: '/reserve' }] },
        { msg: "It's {temp}°C outside. Know what would be nice? A visit to Bogèst. I'm happy to help.", actions: [] },
      ],
    },
  },
};

// ─── Returning visitor memory ─────────────────────────────────────────────────
function getVisitorMemory() {
  try {
    const raw = localStorage.getItem('bogest-visitor');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function setVisitorMemory(data) {
  try { localStorage.setItem('bogest-visitor', JSON.stringify(data)); } catch {}
}
function touchVisitorMemory() {
  const mem = getVisitorMemory() || { visits: 0 };
  const updated = { ...mem, visits: (mem.visits || 0) + 1, lastVisit: Date.now() };
  setVisitorMemory(updated);
  return updated;
}

// ─── Profile extraction from user messages ────────────────────────────────────
// Lightweight NLP: detect name, location preference, allergies from what the user says.
function extractProfileInfo(text, updateProfile) {
  if (!text || !updateProfile) return;
  const lower = text.toLowerCase();
  const updates = {};

  // Name: "ik ben X", "mijn naam is X", "je m'appelle X", "my name is X"
  const nameMatch = lower.match(/(?:ik ben|mijn naam is|je m'appelle|my name is)\s+([a-zÀ-ÿ]{2,20})/i);
  if (nameMatch) {
    const name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    // Filter out common false positives
    if (!['ook', 'wel', 'het', 'een', 'niet', 'op', 'aan', 'maar', 'gewoon'].includes(nameMatch[1])) {
      updates.name = name;
    }
  }

  // Location preference
  if (/\b(hasselt|borgloon|heusden|zolder)\b/i.test(lower)) {
    const loc = lower.match(/(hasselt|borgloon|heusden-zolder|heusden|zolder)/i);
    if (loc) {
      let val = loc[1].toLowerCase();
      if (val === 'heusden' || val === 'zolder') val = 'heusden-zolder';
      updates.preferred_location = val;
    }
  }

  // Allergies
  if (/\b(allerg|allergi|gluten|lactose|noten|pinda|pinda|vegetarisch|vegetari|vegan|halal|kosher)\b/i.test(lower)) {
    updates.allergies = text.substring(0, 200);
  }

  // Favorite dish
  const dishMatch = lower.match(/(?:favoriet|liefst|houd|prefere|j'aime|love|favorite)\s+(?:van|het|de|les|the)?\s*([a-zÀ-ÿ]{3,30})/i);
  if (dishMatch) {
    updates.favorite_dish = dishMatch[1];
  }

  if (Object.keys(updates).length > 0) {
    updateProfile(updates);
  }
}

// ─── Intro variants for natural variation ─────────────────────────────────────
const INTRO_VARIANTS = {
  nl: {
    line1: [
      'Ik ben de digitale gastheer van Bogèst.',
      'Welkom! Ik ben de gastheer van Bogèst, altijd paraat.',
      'Fijn dat ge er zijt — ik ben de digitale gastheer van Bogèst.',
      'Dag! Ik hou u graag wegwijs bij Bogèst.',
    ],
    line2_lunch: [
      'Hebt ge zin in een lekkere lunch vandaag?',
      'Perfect moment voor een goed stuk vlees — zin in een lunch?',
      'Lunchplannen? Ik help u graag verder.',
    ],
    line2_diner: [
      'Plannen voor vanavond? Ik help u graag verder.',
      'Nog geen dinerplannen? Ge bent hier aan het juiste adres.',
      'Vanavond iets lekkers doen? Ik vertel u graag meer.',
    ],
    line2_default: [
      'Ik ken ons menu en onze vestigingen van binnen en van buiten.',
      'Van menu tot locatie — ik weet alles van Bogèst.',
      'Ge kunt mij alles vragen over ons menu, onze vestigingen of reservaties.',
    ],
    question: [
      'Waarmee kan ik u helpen?',
      'Waar kan ik u mee van dienst zijn?',
      'Hebt ge een vraag? Zeg het maar.',
      'Hoe kan ik u vandaag helpen?',
    ],
    returning: [
      'Fijn u weer te zien! Wat kan ik voor u doen?',
      'Welkom terug bij Bogèst. Waarmee mag ik u helpen?',
      'Ah, een vertrouwd gezicht — fijn dat ge er weer zijt. Wat zoekt ge vandaag?',
    ],
  },
  fr: {
    line1: [
      'Je suis votre hôte personnel chez Bogèst.',
      'Bienvenue ! Je suis l\'hôte numérique de Bogèst.',
      'Ravi de vous accueillir — je suis l\'hôte de Bogèst.',
      'Bonjour ! Je suis là pour vous guider chez Bogèst.',
    ],
    line2_lunch: [
      'Vous cherchez une table pour le déjeuner ?',
      'Parfait moment pour un bon repas — une idée de déjeuner ?',
      'Des projets pour le midi ?',
    ],
    line2_diner: [
      'Des plans pour ce soir ?',
      'Pas encore de plans pour dîner ? Vous êtes au bon endroit.',
      'Une belle soirée en vue ? Je vous aide volontiers.',
    ],
    line2_default: [
      'Je connais notre menu, nos établissements et tout ce qu\'il y a entre les deux.',
      'Du menu à nos lieux — je connais tout sur Bogèst.',
      'N\'hésitez pas à me poser toutes vos questions sur notre carte ou nos établissements.',
    ],
    question: [
      'Comment puis-je vous aider aujourd\'hui ?',
      'En quoi puis-je vous être utile ?',
      'Avez-vous une question ? Je vous écoute.',
      'Que puis-je faire pour vous ?',
    ],
    returning: [
      'Ravi de vous revoir ! Comment puis-je vous aider ?',
      'Bienvenue à nouveau chez Bogèst. Que puis-je faire pour vous ?',
      'Ah, une connaissance — bienvenue ! Que cherchez-vous aujourd\'hui ?',
    ],
  },
  en: {
    line1: [
      "I'm your personal host at Bogèst.",
      "Welcome! I'm Bogèst's digital host, happy to help.",
      "Great to have you here — I'm the Bogèst digital host.",
      "Hi there! Let me be your guide at Bogèst.",
    ],
    line2_lunch: [
      'Looking for a lunch table today?',
      'Perfect timing for a good meal — thinking about lunch?',
      'Lunch plans? I\'m here to help.',
    ],
    line2_diner: [
      'Any plans for dinner tonight?',
      'No dinner plans yet? You\'re in the right place.',
      'Fancy something special tonight? Let me tell you more.',
    ],
    line2_default: [
      'I know our menu, locations and everything in between inside out.',
      'From the menu to our venues — I know everything about Bogèst.',
      'Feel free to ask me anything about our menu, locations or reservations.',
    ],
    question: [
      'How can I help you today?',
      'What can I do for you?',
      'Got a question? Just ask.',
      'How can I assist you today?',
    ],
    returning: [
      'Great to see you again! What can I help you with?',
      'Welcome back to Bogèst. What are you looking for today?',
      'A familiar face — welcome back! How can I help?',
    ],
  },
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Localized context strings for LLM ────────────────────────────────────────
const WEATHER_LABELS = {
  nl: { bewolkt: 'bewolkt', zonnig: 'zonnig', gedeeltelijk: 'gedeeltelijk bewolkt', nevelig: 'nevelig', regenachtig: 'regenachtig', sneeuw: 'sneeuw', buien: 'buien', onweer: 'onweer' },
  fr: { bewolkt: 'nuageux', zonnig: 'ensoleillé', gedeeltelijk: 'partiellement nuageux', nevelig: 'brumeux', regenachtig: 'pluvieux', sneeuw: 'neige', buien: 'averses', onweer: 'orage' },
  en: { bewolkt: 'cloudy', zonnig: 'sunny', gedeeltelijk: 'partly cloudy', nevelig: 'misty', regenachtig: 'rainy', sneeuw: 'snow', buien: 'showers', onweer: 'thunderstorm' },
};

const CONTEXT_STRINGS = {
  nl: {
    weather: (w) => w ? `Huidig weer: ${w.desc}, ${w.temp}°C.${w.forecast ? ` Voorspelling: ${w.forecast.join(', ')}.` : ''}` : '',
    time: () => `Tijdstip: ${new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}. Dag: ${new Date().toLocaleDateString('nl-BE', { weekday: 'long' })}.`,
    device: () => `Apparaat: ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobiel' : 'desktop'}.`,
    scroll: (past) => past ? 'De bezoeker is voorbij de hero-sectie, bezig met content te ontdekken.' : 'De bezoeker bevindt zich nog bovenaan de pagina.',
    memory: (visitorMemory, visitorProfile) => {
      const parts = [];
      if (visitorMemory && visitorMemory.visits > 1) {
        parts.push(`Deze bezoeker is al ${visitorMemory.visits} keer op de website geweest. Vorige bezoek: ${visitorMemory.lastVisit ? new Date(visitorMemory.lastVisit).toLocaleDateString('nl-BE') : 'onbekend'}.`);
      } else { parts.push('Dit is een nieuwe bezoeker.'); }
      if (visitorProfile) {
        if (visitorProfile.name) parts.push(`Naam bezoeker: ${visitorProfile.name}.`);
        if (visitorProfile.preferred_location) parts.push(`Voorkeursvestiging: ${visitorProfile.preferred_location}.`);
        if (visitorProfile.favorite_dish) parts.push(`Favoriet gerecht: ${visitorProfile.favorite_dish}.`);
        if (visitorProfile.allergies) parts.push(`Allergieën/dieet: ${visitorProfile.allergies}.`);
        if (visitorProfile.conversation_count > 0) parts.push(`Al ${visitorProfile.conversation_count} keer gechat met de gastheer.`);
        if (visitorProfile.notes) parts.push(`Notities: ${visitorProfile.notes}.`);
      }
      return parts.join(' ');
    },
    page: (p) => `Huidige pagina: ${p}`,
    cards_instr: 'RICHE CARDS: Je kan [CARD:categorie|naam|beschrijving|prijs|pairing] gebruiken om een aanbevelingskaartje te tonen. Bijv: [CARD:beef|Ribeye|Mals, goed gemarmerd|34|Rode wijn]. Max 1 per antwoord.',
  },
  fr: {
    weather: (w) => w ? `Météo actuelle : ${w.desc}, ${w.temp}°C.${w.forecast ? ` Prévisions : ${w.forecast.join(', ')}.` : ''}` : '',
    time: () => `Heure : ${new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}. Jour : ${new Date().toLocaleDateString('fr-BE', { weekday: 'long' })}.`,
    device: () => `Appareil : ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile' : 'desktop'}.`,
    scroll: (past) => past ? "Le visiteur a dépassé la section hero, il découvre le contenu." : "Le visiteur se trouve encore en haut de la page.",
    memory: (visitorMemory, visitorProfile) => {
      const parts = [];
      if (visitorMemory && visitorMemory.visits > 1) {
        parts.push(`Ce visiteur est déjà venu ${visitorMemory.visits} fois. Dernière visite : ${visitorMemory.lastVisit ? new Date(visitorMemory.lastVisit).toLocaleDateString('fr-BE') : 'inconnue'}.`);
      } else { parts.push("C'est un nouveau visiteur."); }
      if (visitorProfile) {
        if (visitorProfile.name) parts.push(`Nom : ${visitorProfile.name}.`);
        if (visitorProfile.preferred_location) parts.push(`Établissement préféré : ${visitorProfile.preferred_location}.`);
        if (visitorProfile.favorite_dish) parts.push(`Plat préféré : ${visitorProfile.favorite_dish}.`);
        if (visitorProfile.allergies) parts.push(`Allergies/régime : ${visitorProfile.allergies}.`);
        if (visitorProfile.conversation_count > 0) parts.push(`Déjà ${visitorProfile.conversation_count} conversations avec l'hôte.`);
        if (visitorProfile.notes) parts.push(`Notes : ${visitorProfile.notes}.`);
      }
      return parts.join(' ');
    },
    page: (p) => `Page actuelle : ${p}`,
    cards_instr: 'CARTES : Vous pouvez utiliser [CARD:catégorie|nom|description|prix|accord] pour afficher une carte de recommandation. Ex : [CARD:beef|Ribeye|Tendre, bien persillé|34|Vin rouge]. Max 1 par réponse.',
  },
  en: {
    weather: (w) => w ? `Current weather: ${w.desc}, ${w.temp}°C.${w.forecast ? ` Forecast: ${w.forecast.join(', ')}.` : ''}` : '',
    time: () => `Time: ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}. Day: ${new Date().toLocaleDateString('en-GB', { weekday: 'long' })}.`,
    device: () => `Device: ${typeof window !== 'undefined' && window.innerWidth < 640 ? 'mobile' : 'desktop'}.`,
    scroll: (past) => past ? 'The visitor has scrolled past the hero section, exploring content.' : 'The visitor is still at the top of the page.',
    memory: (visitorMemory, visitorProfile) => {
      const parts = [];
      if (visitorMemory && visitorMemory.visits > 1) {
        parts.push(`This visitor has been to the website ${visitorMemory.visits} times. Last visit: ${visitorMemory.lastVisit ? new Date(visitorMemory.lastVisit).toLocaleDateString('en-GB') : 'unknown'}.`);
      } else { parts.push('This is a new visitor.'); }
      if (visitorProfile) {
        if (visitorProfile.name) parts.push(`Visitor name: ${visitorProfile.name}.`);
        if (visitorProfile.preferred_location) parts.push(`Preferred location: ${visitorProfile.preferred_location}.`);
        if (visitorProfile.favorite_dish) parts.push(`Favorite dish: ${visitorProfile.favorite_dish}.`);
        if (visitorProfile.allergies) parts.push(`Allergies/diet: ${visitorProfile.allergies}.`);
        if (visitorProfile.conversation_count > 0) parts.push(`Already ${visitorProfile.conversation_count} conversations with the host.`);
        if (visitorProfile.notes) parts.push(`Notes: ${visitorProfile.notes}.`);
      }
      return parts.join(' ');
    },
    page: (p) => `Current page: ${p}`,
    cards_instr: 'CARDS: You can use [CARD:category|name|description|price|pairing] to show a recommendation card. E.g.: [CARD:beef|Ribeye|Tender, well-marbled|34|Red wine]. Max 1 per response.',
  },
};

function pickWeatherProactive(s, weather) {
  if (!weather || !s.proactive_weather) return null;
  let category = 'default';
  if (weather.isWarm && weather.isSunny) category = 'warm_sunny';
  else if (weather.isRainy) category = 'rainy';
  else if (weather.isCold) category = 'cold';
  const arr = s.proactive_weather[category] || s.proactive_weather.default;
  if (!arr || arr.length === 0) return null;
  const msg = arr[Math.floor(Math.random() * arr.length)];
  return {
    ...msg,
    msg: msg.msg.replace(/\{temp\}/g, weather.temp).replace(/\{desc\}/g, weather.desc),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTimeGreeting(s) {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return s.greeting_morning;
  if (h >= 12 && h < 17) return s.greeting_afternoon;
  if (h >= 17 && h < 22) return s.greeting_evening;
  return s.greeting_night;
}

function getMealCtx() {
  const h = new Date().getHours();
  if (h >= 11 && h < 15) return 'lunch';
  if (h >= 17 && h < 23) return 'diner';
  return null;
}

function parseActions(text) {
  // Extract CARD tags — [CARD:category|item_name|description|price|pairing]
  const cards = [];
  let textNoCards = text.replace(/\[CARD:\s*(.+?)\]/g, (_, content) => {
    const parts = content.split('|').map(x => x.trim());
    cards.push({
      category: parts[0] || 'beef',
      item_name: parts[1] || '',
      description: parts[2] || '',
      price: parts[3] ? parseFloat(parts[3]) : null,
      pairing: parts[4] || '',
      is_popular: false
    });
    return '';
  });

  // Extract PHOTO tags
  const photos = [];
  const textNoPhotos = textNoCards.replace(/\[PHOTO:\s*(.+?)\|(.+?)\]/g, (_, desc, loc) => {
    photos.push({ desc: desc.trim(), location: loc.trim() });
    return '';
  });
  // Extract INSTAGRAM tags — [IG:media_url|caption|permalink]
  const instagrams = [];
  const textNoIg = textNoPhotos.replace(/\[IG:\s*(.+?)\|(.+?)(?:\|(.+?))?\]/g, (_, url, cap, link) => {
    instagrams.push({ media_url: url.trim(), caption: cap.trim(), permalink: (link || '').trim() });
    return '';
  });

  // Extract UIACTION tags — [UIACTION:type|arg1|arg2] (Section 5 UI Action vocabulary)
  const uiActions = [];
  const textNoUi = textNoIg.replace(/\[UIACTION:\s*([^|\]]+)(?:\|([^\]]*))?\]/g, (_, t, rest) => {
    uiActions.push({ type: t.trim(), args: rest ? rest.split('|').map(s => s.trim()) : [] });
    return '';
  });

  // Extract ACTIONS tags
  const match = textNoUi.match(/\[ACTIONS:\s*(.+?)\]/s);
  if (!match) return { clean: textNoUi.trim(), actions: [], photos, cards, instagrams, uiActions };
  const actions = match[1].split(',').map(s => {
    const parts = s.split('|').map(x => x.trim());
    return { label: parts[0], url: parts[1] };
  }).filter(a => a.label && a.url);
  return { clean: textNoUi.replace(/\[ACTIONS:.*?\]/s, '').trim(), actions, photos, cards, instagrams, uiActions };
}

async function fetchWeather(lang = 'nl') {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.93&longitude=5.34&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=Europe%2FBrussels');
    const data = await res.json();
    const c = data.current;
    const wc = c.weather_code;
    const wl = WEATHER_LABELS[lang] || WEATHER_LABELS.nl;
    let descKey = 'bewolkt';
    if (wc <= 1) descKey = 'zonnig';
    else if (wc <= 3) descKey = 'gedeeltelijk';
    else if (wc <= 48) descKey = 'nevelig';
    else if (wc <= 67) descKey = 'regenachtig';
    else if (wc <= 77) descKey = 'sneeuw';
    else if (wc <= 82) descKey = 'buien';
    else descKey = 'onweer';
    let desc = wl[descKey];
    // Build forecast summary for next 2 days
    const locale = lang === 'fr' ? 'fr-BE' : lang === 'en' ? 'en-GB' : 'nl-BE';
    const forecast = [];
    if (data.daily) {
      for (let i = 1; i < Math.min(3, data.daily.time.length); i++) {
        const fwc = data.daily.weather_code[i];
        let fdescKey = 'bewolkt';
        if (fwc <= 1) fdescKey = 'zonnig';
        else if (fwc <= 3) fdescKey = 'gedeeltelijk';
        else if (fwc <= 67) fdescKey = 'regenachtig';
        else if (fwc <= 82) fdescKey = 'buien';
        const dayName = new Date(data.daily.time[i]).toLocaleDateString(locale, { weekday: 'short' });
        forecast.push(`${dayName}: ${wl[fdescKey]}, ${Math.round(data.daily.temperature_2m_max[i])}°/${Math.round(data.daily.temperature_2m_min[i])}°`);
      }
    }
    return { temp: Math.round(c.temperature_2m), desc, isWarm: c.temperature_2m >= 20, isCold: c.temperature_2m < 10, isRainy: wc >= 51, isSunny: wc <= 1, forecast };
  } catch { return null; }
}

// ─── Sound engine ────────────────────────────────────────────────────────────
function playTone(freq, type, duration, vol, delay = 0) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch {}
}
// The digital host runs silently — no sound effects.
const sounds = { open: () => {}, send: () => {}, receive: () => {} };

// ─── Logo avatar ─────────────────────────────────────────────────────────────
function LogoAvatar({ size = 'sm', online = true }) {
  const px = size === 'lg' ? 64 : size === 'md' ? 40 : 32;
  return (
    <div className="relative flex-shrink-0" style={{ width: px, height: px }}>
      <div className="w-full h-full rounded-full overflow-hidden"
        style={{ border: '1.5px solid rgba(231,205,112,0.45)' }}>
        <img src={HOST_PHOTO_URL} alt="Bogèst gastheer" className="w-full h-full object-cover" />
      </div>
      {online && (
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2"
          style={{ borderColor: 'rgba(8,8,8,0.92)' }} />
      )}
    </div>
  );
}

// ─── Typing animation ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </div>
  );
}

// ─── Typewriter effect ────────────────────────────────────────────────────────
function Typewriter({ text, speed = 22, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const i = useRef(0);
  useEffect(() => {
    i.current = 0; setDisplayed('');
    const iv = setInterval(() => {
      i.current++;
      setDisplayed(text.slice(0, i.current));
      if (i.current >= text.length) { clearInterval(iv); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}</span>;
}

// ─── Proactive bubble action button (white on gold) ───────────────────────────
function ProactiveActionButton({ label, url, onClick }) {
  const isExternal = url?.startsWith('http');
  const isInternal = url?.startsWith('/');
  const cls = 'inline-flex items-center gap-1.5 font-body text-xs py-1.5 px-3 rounded-full transition-all duration-200 hover:scale-[1.03] cursor-pointer';
  const style = { background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.45)', color: 'rgba(255,255,255,0.97)' };
  if (isInternal) return <Link to={url} className={cls} style={style} onClick={onClick}>{label}<ChevronRight className="w-2.5 h-2.5 opacity-70" /></Link>;
  if (isExternal) return <a href={url} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={onClick}>{label}<ExternalLink className="w-2.5 h-2.5 opacity-70" /></a>;
  return null;
}

// ─── Action buttons ───────────────────────────────────────────────────────────
function ActionButton({ label, url, isDark, onClick }) {
  const isExternal = url?.startsWith('http');
  const isInternal = url?.startsWith('/');
  const cls = 'inline-flex items-center gap-1.5 font-body text-xs py-1.5 px-3 rounded-full transition-all duration-200 hover:scale-[1.03] hover:opacity-90 cursor-pointer';
  const style = isDark
    ? { background: 'rgba(20,14,0,0.55)', border: '1px solid rgba(231,205,112,0.35)', color: 'rgba(255,235,160,0.92)' }
    : { background: 'rgba(107,122,63,0.08)', border: '1px solid rgba(107,122,63,0.25)', color: 'hsl(var(--foreground))' };
  if (isInternal) return <Link to={url} className={cls} style={style} onClick={onClick}>{label}<ChevronRight className="w-2.5 h-2.5 opacity-60" /></Link>;
  if (isExternal) return <a href={url} target="_blank" rel="noopener noreferrer" className={cls} style={style} onClick={onClick}>{label}<ExternalLink className="w-2.5 h-2.5 opacity-60" /></a>;
  return null;
}

// Social photo preview card
const SOCIAL_IMAGES = {
  Hasselt: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  Borgloon: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  'Heusden-Zolder': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
};

function PhotoCard({ desc, location, isDark }) {
  const img = SOCIAL_IMAGES[location] || SOCIAL_IMAGES.default;
  return (
    <div className="rounded-xl overflow-hidden mt-2" style={{ border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(74,83,32,0.18)' }}>
      <img src={img} alt={desc} className="w-full h-36 object-cover" />
      <div className="px-3 py-2" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(74,83,32,0.05)' }}>
        <p className="font-body text-xs text-muted-foreground">{desc}</p>
        <p className="font-body text-[10px] text-primary/70 mt-0.5 tracking-wide uppercase">Bogèst {location}</p>
      </div>
    </div>
  );
}

function InstagramCard({ post }) {
  return (
    <a href={post.permalink || '#'} target="_blank" rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden mt-2 transition-transform duration-200 hover:scale-[1.02]"
      style={{ border: '1px solid rgba(231,205,112,0.30)' }}>
      <img src={post.media_url} alt={post.caption || 'Instagram'} className="w-full h-40 object-cover" />
      {post.caption && (
        <div className="px-3 py-2" style={{ background: 'rgba(20,14,0,0.55)' }}>
          <p className="font-body text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,240,200,0.92)' }}>{post.caption}</p>
          <p className="font-body text-[10px] text-primary/80 mt-0.5 tracking-wide uppercase">Bekijk op Instagram →</p>
        </div>
      )}
    </a>
  );
}

function AssistantBubble({ content, actions, photos, cards, instagrams, uiActions, isDark, onLinkClick }) {
  const uiDispatchedRef = useRef(false);
  useEffect(() => {
    if (uiDispatchedRef.current) return;
    if (!uiActions || uiActions.length === 0) return;
    uiDispatchedRef.current = true;
    const navTypes = ['openPage', 'openSection', 'openReservation', 'openContact', 'openGiftCards'];
    uiActions.forEach((a, i) => {
      setTimeout(() => {
        dispatchUIAction(a);
        if (navTypes.includes(a.type)) onLinkClick?.();
      }, 250 + i * 400);
    });
  }, [uiActions]);

  // Proactive auto-action fallback: when the host didn't emit a [UIACTION:] tag
  // but its reply is a short directive with a single internal action button (no
  // rich media), perform that action automatically so the visitor is taken
  // there without having to click.
  useEffect(() => {
    if (uiActions && uiActions.length > 0) return;
    if (cards?.length || photos?.length || instagrams?.length) return;
    if (!actions || actions.length === 0) return;
    const internal = actions.filter((a) => a.url && String(a.url).startsWith('/'));
    if (internal.length === 0) return;
    if ((content || '').length > 240) return;
    const target = internal[0].url;
    const t = setTimeout(() => {
      dispatchUIAction({ type: 'openPage', args: [target] });
      onLinkClick?.();
    }, 600);
    return () => clearTimeout(t);
  }, [uiActions, actions, cards, photos, instagrams, content]);

  return (
    <div className="flex items-start gap-2">
      <LogoAvatar size="sm" online={false} isDark={isDark} />
      <div className="flex-1 min-w-0">
        <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm" style={{ background: isDark ? 'rgba(20,14,0,0.78)' : 'rgba(107,122,63,0.06)' }}>
          <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: isDark ? 'rgba(255,240,200,0.95)' : 'hsl(var(--foreground))' }}>
            {content}
          </p>
          {cards?.map((c, i) => <RecommendationCard key={i} item={c} isDark={isDark} />)}
          {photos?.map((p, i) => <PhotoCard key={i} desc={p.desc} location={p.location} isDark={isDark} />)}
          {instagrams?.map((p, i) => <InstagramCard key={i} post={p} />)}
        </div>
        {actions?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 pl-0.5">
            {actions.map((a, i) => <ActionButton key={i} label={a.label} url={a.url} isDark={isDark} onClick={onLinkClick} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ content, isDark }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm" style={{ background: isDark ? 'rgba(20,14,0,0.72)' : 'rgba(107,122,63,0.12)', border: isDark ? '1px solid rgba(231,205,112,0.25)' : '1px solid rgba(107,122,63,0.25)' }}>
        <p className="font-body text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,240,200,0.95)' : 'hsl(var(--foreground))' }}>{content}</p>
      </div>
    </div>
  );
}

function Chip({ label, onClick, isDark }) {
  return (
    <button onClick={() => onClick(label)} className="font-body text-xs py-1.5 px-3 rounded-full transition-all duration-200 hover:scale-[1.03] text-left"
      style={{ background: isDark ? 'rgba(20,14,0,0.55)' : 'rgba(107,122,63,0.08)', border: isDark ? '1px solid rgba(231,205,112,0.35)' : '1px solid rgba(107,122,63,0.25)', color: isDark ? 'rgba(255,235,160,0.92)' : 'hsl(var(--foreground))' }}>
      {label}
    </button>
  );
}

// ─── Conversational Entry Popup ───────────────────────────────────────────────
function EntryButton({ icon: Icon, label, sub, isDark, onClick, variant }) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  let style;
  if (isPrimary) {
    style = { background: isDark ? 'rgba(231,205,112,0.14)' : 'rgba(107,122,63,0.10)', border: '1px solid rgba(231,205,112,0.50)' };
  } else if (isGhost) {
    style = { background: 'transparent', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(74,83,32,0.18)') };
  } else {
    style = { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.025)', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(74,83,32,0.14)') };
  }
  return (
    <button onClick={onClick}
      className="group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:scale-[1.015] cursor-pointer text-left"
      style={style}>
      <span className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: isPrimary ? 'rgba(231,205,112,0.20)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.035)', border: isPrimary ? '1px solid rgba(231,205,112,0.35)' : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(74,83,32,0.14)' }}>
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-body text-sm font-medium text-foreground leading-tight tracking-tight">{label}</span>
        <span className="block font-body text-[11px] text-muted-foreground mt-0.5">{sub}</span>
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:translate-x-1 group-hover:text-primary/70 transition-all flex-shrink-0" />
    </button>
  );
}

function EntryPopup({ isDark, s, lang, weather, onChat, onLiveConversation, onSkip, visitorMemory }) {
  const greeting = getTimeGreeting(s);
  const meal = getMealCtx();
  const v = INTRO_VARIANTS[lang] || INTRO_VARIANTS.nl;
  const isReturning = visitorMemory && visitorMemory.visits > 1;

  const videoRef = useRef(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => { el.muted = true; el.play(); });
  }, []);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    try { mq.addEventListener('change', update); } catch { mq.addListener(update); }
    return () => { try { mq.removeEventListener('change', update); } catch { mq.removeListener(update); } };
  }, []);

  let fullIntro;
  if (isReturning) {
    fullIntro = `${greeting}! ${pickRandom(v.returning)}`;
  } else {
    const line1 = pickRandom(v.line1);
    const line2 = meal === 'lunch' ? pickRandom(v.line2_lunch) : meal === 'diner' ? pickRandom(v.line2_diner) : pickRandom(v.line2_default);
    let line3 = null;
    if (weather) {
      const forecastSimple = weather.forecast && weather.forecast.length > 0 ? weather.forecast[0].split(':')[1]?.trim() : 'mooi';
      if (weather.isWarm && weather.isSunny) line3 = s.intro_line3_warm_sunny.replace('{temp}', weather.temp);
      else if (weather.isRainy) line3 = s.intro_line3_rainy.replace('{temp}', weather.temp);
      else line3 = s.intro_line3_weather.replace('{temp}', weather.temp).replace('{desc}', weather.desc).replace('{forecast}', forecastSimple);
    }
    const question = pickRandom(v.question);
    fullIntro = `${greeting}! ${[line1, line2, line3].filter(Boolean).join(' ')}\n\n${question}`;
  }

  // Frosted glass — matches the chat window + proactive badges (unified look).
  const panelStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.16)',
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[98] bg-black/55 backdrop-blur-sm" onClick={onSkip} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.5, ease: [0.55, 0, 1, 0.45] }}
        className="fixed inset-0 z-[99] flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full rounded-[24px] overflow-hidden relative flex flex-col sm:flex-row"
          style={{ maxWidth: 680, maxHeight: '88vh', ...panelStyle, boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.70)' : '0 32px 80px rgba(0,0,0,0.18)' }}>

          {/* Welcome video — top on mobile, left on sm+ (pure, no overlays) */}
          <div className="relative flex-shrink-0 w-full h-40 sm:w-[42%] sm:h-auto sm:min-h-[300px]">
            <video
              ref={videoRef}
              src={isMobile ? MOBILE_WELCOME_VIDEO_URL : WELCOME_VIDEO_URL}
              autoPlay playsInline
              className="absolute inset-0 w-full h-full object-cover object-top sm:object-center"
            />
            {/* Gradient blend — mobile: bottom */}
            <div className="sm:hidden absolute left-0 right-0 bottom-0 h-16 pointer-events-none"
              style={{ background: isDark ? 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.92))' : 'linear-gradient(to bottom, transparent, rgba(254,252,248,0.95))' }} />
            {/* Gradient blend — sm+: right */}
            <div className="hidden sm:block absolute top-0 right-0 h-full w-16 pointer-events-none"
              style={{ background: isDark ? 'linear-gradient(to right, transparent, rgba(8,8,8,0.92))' : 'linear-gradient(to right, transparent, rgba(254,252,248,0.95))' }} />
          </div>

          {/* Content — bottom on mobile, right on sm+ */}
          <div className="relative flex-1 flex flex-col px-6 sm:px-8 py-6 overflow-y-auto">
            {/* Close */}
            <button onClick={onSkip}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)' }}>
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="mb-5 pr-8">
              <p className="font-body text-[10px] tracking-[0.32em] uppercase text-primary/80 mb-2">Bogèst</p>
              <h2 className="font-heading text-2xl font-bold text-foreground leading-tight">{s.entry_headline}</h2>
              <p className="font-body text-sm text-muted-foreground mt-1.5">{s.entry_sub}</p>
            </div>
            <div className="h-px w-10 mb-5" style={{ background: isDark ? 'rgba(231,205,112,0.45)' : 'rgba(107,122,63,0.40)' }} />

            <p className="font-body text-sm text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">{fullIntro}</p>

            {/* Action buttons */}
            <div className="space-y-3 mt-auto">
              <EntryButton icon={MessageCircle} label={s.entry_chat} sub={s.entry_chat_sub} isDark={isDark} onClick={onChat} variant="primary" />
              <EntryButton icon={Mic} label={s.entry_live} sub={s.entry_live_sub} isDark={isDark} onClick={onLiveConversation} />
              <EntryButton icon={Compass} label={s.entry_explore} sub={s.entry_explore_sub} isDark={isDark} onClick={onSkip} variant="ghost" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DigitalHost() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const isDark = theme === 'dark';
  const location = useLocation();

  const s = HOST_STRINGS[lang] || HOST_STRINGS.nl;
  const langPrompt = lang === 'fr' ? 'Répondez TOUJOURS en français.' : lang === 'en' ? 'ALWAYS respond in English.' : 'Antwoord ALTIJD in het Nederlands.';

  const [phase, setPhase] = useState('idle'); // idle | entry | chat | minimized
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // The host runs silently — no speech/sound.
  const audioRef = useRef(null);

  // Conversation history for InvokeLLM (array of {role, content})
  const historyRef = useRef([]);

  // speakText removed — the host runs silently.



  const [weather, setWeather] = useState(null);
  const [proactiveMsg, setProactiveMsg] = useState(null);
  const [pastHero, setPastHero] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  const [visitorMemory] = useState(() => touchVisitorMemory());
  const { profile: visitorProfile, updateProfile, incrementConversation, visitorId } = useVisitorProfile();
  const { menuContext, popularItems } = useMenuKnowledge(lang);
  const prevLangRef = useRef(lang);
  const blinkTimerRef = useRef(null);
  const proactiveRef = useRef(null);
  const scheduleProactiveRef = useRef(null);
  const inactivityRef = useRef(null);
  const proactiveIndexRef = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const entryShownRef = useRef(false);
  const weatherRef = useRef(null);
  const conversationRef = useRef(null);
  const subscriptionRef = useRef(null);
  const greetingRef = useRef(null);
  const responsePendingRef = useRef(false);

  const pageGreeting = s.page_greetings[location.pathname] || s.page_greetings.default;
  const pageChips = s.page_chips[location.pathname] || [s.chip_location, s.chip_reserve, s.chip_menu];

  useEffect(() => { fetchWeather(lang).then(w => { setWeather(w); weatherRef.current = w; }); }, [lang]);

  // Listen for hero scroll state
  useEffect(() => {
    const handler = (e) => setPastHero(e.detail.pastHero);
    window.addEventListener('bogest:hero-scroll', handler);
    return () => window.removeEventListener('bogest:hero-scroll', handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    try { mq.addEventListener('change', update); } catch { mq.addListener(update); }
    return () => { try { mq.removeEventListener('change', update); } catch { mq.removeListener(update); } };
  }, []);

  // Listen for hero button click — open chat with a special hero greeting
  useEffect(() => {
    const handler = () => {
      sessionStorage.setItem('bogest-host-seen', '1');
      const heroGreeting = lang === 'fr'
        ? "Bien sûr ! Je suis là pour vous aider. Vous pouvez aussi toujours me retrouver en bas à droite. Qu'est-ce que je peux faire pour vous ?"
        : lang === 'en'
        ? "Of course! I'm here to help. You can always find me in the bottom-right corner too. What can I do for you?"
        : "Natuurlijk! Ik ben er graag voor u. Ge kunt me trouwens altijd terugvinden rechtsonder op de pagina. Waar kan ik u mee helpen?";
      greetingRef.current = heroGreeting;
      setMessages([{ role: 'assistant', content: heroGreeting, actions: [] }]);
      sounds.open();
      setPhase('chat');
    };
    window.addEventListener('bogest:open-host', handler);
    return () => window.removeEventListener('bogest:open-host', handler);
  }, [phase, lang]);

  // Entry flow
  useEffect(() => {
    if (entryShownRef.current) return;
    const t = setTimeout(() => { entryShownRef.current = true; setPhase('entry'); sounds.open(); }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Hide the floating video card + ElevenLabs widget while the entry popup is open
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bogest:popup-visibility', { detail: { open: phase === 'entry' } }));
  }, [phase]);

  // Proactive inactivity messages
  const scheduleProactive = () => {
    clearTimeout(inactivityRef.current);
    if (phase === 'chat') return;
    // First trigger after 12s, subsequent after 20s
    const delay = proactiveIndexRef.current === 0 ? 3500 : 30000;
    inactivityRef.current = setTimeout(() => {
      // Build a varied pool: fun facts + conversational invites + weather-aware messages
      const pool = [...(s.proactive_facts || []), ...(s.proactive_invites || [])];
      const w = weatherRef.current;
      if (w) {
        const weatherMsg = pickWeatherProactive(s, w);
        if (weatherMsg) {
          const weight = (w.isWarm || w.isRainy || w.isCold) ? 5 : 2;
          for (let i = 0; i < weight; i++) pool.push(weatherMsg);
        }
      }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      proactiveIndexRef.current++;
      setProactiveMsg(pick);
      // Auto-hide after 14s then reschedule
      proactiveRef.current = setTimeout(() => {
        setProactiveMsg(null);
        scheduleProactiveRef.current();
      }, 12000);
    }, delay);
  };
  scheduleProactiveRef.current = scheduleProactive;

  useEffect(() => {
    if (phase === 'minimized') scheduleProactive();
    if (phase === 'chat') { clearTimeout(inactivityRef.current); setProactiveMsg(null); }
    return () => { clearTimeout(inactivityRef.current); clearTimeout(proactiveRef.current); };
  }, [phase, location.pathname, lang]);

  // Reset proactive timer on user interaction
  useEffect(() => {
    const reset = () => { if (phase === 'minimized') scheduleProactiveRef.current(); };
    window.addEventListener('mousemove', reset, { passive: true });
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('touchstart', reset, { passive: true });
    return () => { window.removeEventListener('mousemove', reset); window.removeEventListener('scroll', reset); window.removeEventListener('touchstart', reset); };
  }, [phase]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);
  useEffect(() => { if (phase === 'chat') setTimeout(() => inputRef.current?.focus(), 350); }, [phase]);

  // Track mobile keyboard via Visual Viewport API
  const [kbOffset, setKbOffset] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => setKbOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, []);

  // Reset conversation history when language changes
  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    historyRef.current = [];
    setMessages([]);
    // Reset agent conversation on language change
    if (subscriptionRef.current) { try { subscriptionRef.current(); } catch {} subscriptionRef.current = null; }
    conversationRef.current = null;
    greetingRef.current = null;
    responsePendingRef.current = false;
  }, [lang]);

  // Cleanup agent subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) { try { subscriptionRef.current(); } catch {} }
      if (window.DID_AGENTS_API?.functions?.interrupt) {
        try { window.DID_AGENTS_API.functions.interrupt(); } catch {}
      }
    };
  }, []);

  // FAB blink effect — blink every ~18s while minimized
  useEffect(() => {
    if (phase !== 'minimized') { clearInterval(blinkTimerRef.current); setBlinking(false); return; }
    const iv = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 1400);
    }, 18000);
    return () => clearInterval(iv);
  }, [phase]);

  const cs = CONTEXT_STRINGS[lang] || CONTEXT_STRINGS.nl;
  const weatherCtx = weather ? cs.weather(weather) : '';
  const timeCtx = cs.time();
  const deviceCtx = cs.device();
  const scrollCtx = cs.scroll(pastHero);
  const memoryCtx = cs.memory(visitorMemory, visitorProfile);

  const ensureConversation = async () => {
    if (conversationRef.current) return conversationRef.current;
    const conv = await base44.agents.createConversation({
      agent_name: 'VraagHetBogest',
      metadata: { name: 'Vraag het aan Bogèst', lang },
    });
    conversationRef.current = conv;
    subscriptionRef.current = base44.agents.subscribeToConversation(conv.id, (data) => {
      const agentMessages = (data.messages || []).map(m => {
        if (m.role === 'user') return { role: 'user', content: (m.content || '').replace(/^\[ctx:[^\]]*\]\s*/i, '') };
        const parsed = parseActions(m.content || '');
        return { role: 'assistant', content: parsed.clean, actions: parsed.actions, photos: parsed.photos, cards: parsed.cards, instagrams: parsed.instagrams, uiActions: parsed.uiActions };
      });
      const greeting = greetingRef.current ? [{ role: 'assistant', content: greetingRef.current, actions: [] }] : [];
      setMessages([...greeting, ...agentMessages]);
      const last = agentMessages[agentMessages.length - 1];
      if (last?.role === 'assistant' && last?.content && responsePendingRef.current) {
        responsePendingRef.current = false;
        setIsLoading(false);
        sounds.receive();
      }
    });
    return conv;
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;
    setInput(''); setPhase('chat'); sounds.send();
    setIsLoading(true);
    responsePendingRef.current = true;

    // Proactively sync the website to the user's topic — open the relevant
    // page/panel the moment they mention it, without waiting for the reply.
    syncToTopic(userText).catch(() => {});

    // Show greeting locally if no conversation yet and no messages
    if (!conversationRef.current && messages.length === 0) {
      greetingRef.current = pageGreeting;
      setMessages([{ role: 'assistant', content: pageGreeting, actions: [] }]);
    }

    try {
      const conv = await ensureConversation();
      const profileStr = visitorProfile
        ? `name=${visitorProfile.name || '-'},loc=${visitorProfile.preferred_location || '-'},fav=${visitorProfile.favorite_dish || '-'},diet=${visitorProfile.allergies || '-'}`
        : 'new';
      const ctx = `[ctx: visitor_id=${visitorId || 'anon'}; page=${location.pathname}; weather=${weather ? `${weather.desc} ${weather.temp}C` : 'n/a'}; profile=${profileStr}]`;
      await base44.agents.addMessage(conv, { role: 'user', content: `${ctx} ${userText}` });
      incrementConversation();
      extractProfileInfo(userText, updateProfile);
    } catch {
      responsePendingRef.current = false;
      setIsLoading(false);
    }
  };

  const openChat = (preload = null) => {
    setProactiveMsg(null);
    sessionStorage.setItem('bogest-host-seen', '1');
    if (messages.length === 0) {
      historyRef.current = [];
      greetingRef.current = pageGreeting;
      setMessages([{ role: 'assistant', content: pageGreeting, actions: [] }]);
    }
    sounds.open(); setPhase('chat');
    if (preload) setTimeout(() => sendMessage(preload), 80);
  };

  // Open the chat with a proactive notification message already shown as the
  // first assistant message (the message the visitor just tapped).
  const openChatWithProactive = (msg, actions) => {
    setProactiveMsg(null);
    sessionStorage.setItem('bogest-host-seen', '1');
    historyRef.current = [];
    greetingRef.current = msg;
    setMessages([{ role: 'assistant', content: msg, actions: actions || [] }]);
    sounds.open();
    setPhase('chat');
  };

  const handleEntryChip = (chip) => {
    sessionStorage.setItem('bogest-host-seen', '1');
    if (chip === s.chip_explore || chip === s.close_skip) { setPhase('minimized'); return; }
    setMessages([]);
    sounds.open(); setPhase('chat');
    setTimeout(() => sendMessage(chip), 80);
  };

  const handleSkip = () => { sessionStorage.setItem('bogest-host-seen', '1'); setPhase('minimized'); };

  const handleLiveConversation = () => {
    sessionStorage.setItem('bogest-host-seen', '1');
    try { startElevenLabsConversation(); } catch {}
    setPhase('minimized');
  };

  // Yellow glass — more transparent with stronger blur
  const glassStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(40px) saturate(160%)',
    WebkitBackdropFilter: 'blur(40px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.16)',
  };

  return (
    <>
      {/* ENTRY */}
      <AnimatePresence>
        {phase === 'entry' && (
          <EntryPopup isDark={isDark} s={s} lang={lang} weather={weather}
            onChat={() => openChat()} onLiveConversation={handleLiveConversation} onSkip={handleSkip} visitorMemory={visitorMemory} />
        )}
      </AnimatePresence>

      {/* MINIMIZED — FAB hidden when in hero zone on home page */}
      <AnimatePresence>
        {phase === 'minimized' && (
          <>
            {/* Proactive bubble */}
            <AnimatePresence>
              {proactiveMsg && (
                isMobile ? (
                  <motion.div
                    initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed top-3 left-3 right-3 z-[100000] cursor-pointer"
                    onClick={() => openChatWithProactive(proactiveMsg.msg, proactiveMsg.actions)}
                  >
                    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(28px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                      }}>
                      <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[9px] tracking-[0.22em] uppercase font-semibold mb-0.5" style={{ color: 'rgba(231,205,112,0.90)' }}>Bogèst</p>
                        <p className="font-body text-[13px] leading-snug" style={{ color: 'rgba(255,255,255,0.95)' }}>{proactiveMsg.msg}</p>
                        {proactiveMsg.actions?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proactiveMsg.actions.map((a, i) => (
                              <ProactiveActionButton key={i} label={a.label} url={a.url} onClick={() => setProactiveMsg(null)} />
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); setProactiveMsg(null); }}
                        className="flex-shrink-0 -mr-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-[120px] right-[184px] z-[60] cursor-pointer"
                    style={{ maxWidth: 'min(calc(100vw - 160px), 300px)' }}
                    onClick={() => { setProactiveMsg(null); openChat(proactiveMsg.msg); }}
                  >
                    <div className="px-5 py-4 rounded-2xl rounded-r-sm relative"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(28px) saturate(140%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(140%)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
                      }}>
                      <button onClick={e => { e.stopPropagation(); setProactiveMsg(null); }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: 'rgba(255,255,255,0.75)' }}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                      <p className="font-body text-[13px] leading-relaxed pr-4" style={{ color: 'rgba(255,255,255,0.97)' }}>{proactiveMsg.msg}</p>
                      {proactiveMsg.actions?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {proactiveMsg.actions.map((a, i) => (
                            <ProactiveActionButton key={i} label={a.label} url={a.url} onClick={() => setProactiveMsg(null)} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                        borderTop: '1px solid rgba(255,255,255,0.16)',
                        borderRight: '1px solid rgba(255,255,255,0.16)',
                      }} />
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* FAB — circle by default, pill on hover */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: blinking ? [1, 0.4, 1, 0.5, 1] : 1, scale: blinking ? [1, 1.06, 1, 1.04, 1] : 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: blinking ? 1.2 : 0.4, ease: blinking ? 'easeInOut' : [0.22, 1, 0.36, 1] }}
              onClick={() => openChat()}
              onMouseEnter={() => setFabExpanded(true)}
              onMouseLeave={() => setFabExpanded(false)}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] flex items-center rounded-full shadow-xl active:scale-100 overflow-hidden"
              style={{
                /* Circle: 56px mobile, 64px desktop. Pill when expanded */
                width: fabExpanded ? 'auto' : undefined,
                minWidth: fabExpanded ? undefined : '56px',
                height: '56px',
                padding: fabExpanded ? '0 16px 0 10px' : '0',
                justifyContent: 'center',
                gap: fabExpanded ? '10px' : '0',
                /* SM+: 64px circle */
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(254,252,248,0.90)',
                backdropFilter: 'blur(48px) saturate(180%)', WebkitBackdropFilter: 'blur(48px) saturate(180%)',
                border: blinking ? '1px solid hsl(var(--primary) / 0.65)' : isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(74,83,32,0.30)',
                boxShadow: blinking
                  ? '0 0 20px hsl(var(--primary) / 0.38), 0 8px 32px rgba(0,0,0,0.28)'
                  : isDark ? '0 8px 32px rgba(0,0,0,0.50)' : '0 8px 32px rgba(74,83,32,0.20)',
                maxWidth: 'calc(100vw - 32px)',
              }}
            >
              {/* Desktop: larger circle (64px) */}
              <span className="hidden sm:flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                <LogoAvatar size="md" online isDark={isDark} />
              </span>
              {/* Mobile: normal circle (56px) */}
              <span className="flex sm:hidden items-center justify-center flex-shrink-0">
                <LogoAvatar size="sm" online isDark={isDark} />
              </span>
              {/* Label — only visible when expanded */}
              <motion.div
                initial={false}
                animate={{ opacity: fabExpanded ? 1 : 0, width: fabExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-left overflow-hidden whitespace-nowrap"
                style={{ pointerEvents: fabExpanded ? 'auto' : 'none' }}
              >
                <p className="font-body text-[9px] tracking-[0.15em] uppercase text-muted-foreground leading-none mb-0.5">{s.fab_label}</p>
                <p className="font-heading text-xs font-semibold text-foreground leading-tight">{s.fab_cta}</p>
              </motion.div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* CHAT — Mobile: bottom sheet anchored above keyboard | Desktop: floating panel */}
      <AnimatePresence>
        {phase === 'chat' && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[79] bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setPhase('minimized'); }}
            />
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[80] flex flex-col overflow-hidden
                /* Mobile: full-width bottom sheet, fixed height so keyboard pushes content up naturally */
                bottom-0 left-0 right-0 rounded-t-[24px]
                /* Tablet+: floating panel bottom-right */
                sm:bottom-6 sm:left-auto sm:right-6 sm:rounded-[24px]
                /* Desktop: larger panel */
                md:w-[480px] md:h-[640px]"
              style={{
                ...glassStyle,
                /* Mobile: move panel up when keyboard opens, shrink to fit visible area */
                bottom: kbOffset > 0 ? `${kbOffset}px` : undefined,
                height: kbOffset > 0 ? `${Math.min((typeof window !== 'undefined' && window.visualViewport?.height || 520) * 0.85, 500)}px` : 'min(72dvh, 520px)',
                /* Tablet+ override */
                ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? { width: 'min(calc(100vw - 48px), 440px)', height: 'min(80vh, 600px)', bottom: '24px', right: '96px' } : {}),
                boxShadow: isDark ? '0 28px 72px rgba(80,50,0,0.60), 0 0 0 1px rgba(231,205,112,0.15)' : '0 28px 72px rgba(0,0,0,0.20), 0 0 0 1px rgba(74,83,32,0.10)',
              }}
            >
              {/* Background watermark removed */}

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 relative z-10"
                style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                {/* Mobile drag handle */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-foreground/15 sm:hidden" />
                <div className="flex items-center gap-2.5 mt-1 sm:mt-0">
                  <LogoAvatar size="md" online isDark={isDark} />
                  <div>
                    <p className="font-heading text-sm font-bold leading-none" style={{ color: isDark ? 'rgba(255,240,180,0.97)' : 'rgba(40,50,15,0.95)' }}>{s.title}</p>
                    <p className="font-body text-[9px] tracking-[0.15em] uppercase mt-0.5" style={{ color: isDark ? 'rgba(231,205,112,0.80)' : 'rgba(107,122,63,0.80)' }}>
                      {weather ? `${weather.desc}, ${weather.temp}°C` : s.assistant}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPhase('minimized')}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    style={{ background: isDark ? 'rgba(100,70,0,0.18)' : 'rgba(107,122,63,0.06)', color: isDark ? 'rgba(255,235,150,0.90)' : 'rgba(40,50,15,0.70)' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages-hide-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-4 overscroll-contain relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {messages.map((m, i) => (
                  m.role === 'user'
                    ? <UserBubble key={i} content={m.content} isDark={isDark} />
                    : <AssistantBubble key={i} content={m.content} actions={m.actions} photos={m.photos} cards={m.cards} instagrams={m.instagrams} uiActions={m.uiActions} isDark={isDark} onLinkClick={() => setPhase('minimized')} />
                ))}
                {messages.length === 1 && pageChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-10">
                    {pageChips.map((c, i) => <Chip key={i} label={c} onClick={sendMessage} isDark={isDark} />)}
                  </div>
                )}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <LogoAvatar size="sm" online={false} isDark={isDark} />
                    <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm" style={{ background: isDark ? 'rgba(20,14,0,0.78)' : 'rgba(107,122,63,0.06)' }}>
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input — sticky at bottom, safe area aware */}
              <div className="flex-shrink-0 px-3 pb-safe pt-2.5 pb-3 relative z-10"
                style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)' }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={s.placeholder}
                    disabled={isLoading}
                    enterKeyHint="send"
                    className={`flex-1 bg-transparent font-body text-sm outline-none min-w-0 disabled:opacity-40 ${isDark ? 'placeholder:text-amber-200/40' : 'placeholder:text-muted-foreground/40'}`}
                    style={{ color: isDark ? 'rgba(255,240,200,0.92)' : 'hsl(var(--foreground))', caretColor: isDark ? 'rgba(231,205,112,0.9)' : 'rgba(107,122,63,0.9)', fontSize: '16px' }}
                  />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:opacity-90 disabled:opacity-25 disabled:cursor-not-allowed">
                    <Send className="w-3.5 h-3.5 text-primary-foreground" />
                  </button>
                </div>
                <p className="font-body text-[9px] text-muted-foreground/50 text-center mt-2 tracking-wide">
                  {s.footer_text}{' '}
                  <Link to="/reserve" onClick={() => setPhase('minimized')} className="underline underline-offset-2 hover:text-muted-foreground transition-colors">{s.footer_link}</Link>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}