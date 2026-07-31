// Helpers for the "Vraag het aan Bogèst!" hover hints. askHost opens the
// digital host chat with a question so it can explain the hovered item.

export function hostQuestion(lang, name) {
  if (lang === 'fr') return `Pouvez-vous m'en dire plus sur ${name} ?`;
  if (lang === 'en') return `Can you tell me more about ${name}?`;
  return `Kan u me meer vertellen over ${name}?`;
}

export function hostHintLabel(lang) {
  if (lang === 'fr') return 'Demandez à Bogèst !';
  if (lang === 'en') return 'Ask Bogèst!';
  return 'Vraag het aan Bogèst!';
}

export function spaceQuestion(lang, space, city) {
  if (lang === 'fr') return `Pouvez-vous me raconter quelque chose de spécial à propos de ${space} chez Bogèst ${city} ?`;
  if (lang === 'en') return `Can you tell me something special about the ${space} at Bogèst ${city}?`;
  return `Kan u me iets bijzonders vertellen over de ${space} van Bogèst ${city}?`;
}

export function askHost(question) {
  window.dispatchEvent(new CustomEvent('bogest:open-host', { detail: { question } }));
}