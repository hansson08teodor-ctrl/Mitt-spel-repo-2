/* Editorial metadata never implies an objective quality score. See CONTENT.md. */
const qualityName = q => ({ iconic: 'Iconic Only', balanced: 'Balanced', deep: 'Deep Cuts' }[q]);
const categoryPool = (category, quality) => [...new Set(quality === 'balanced' ? category.items : (category.qualityPools?.[quality] || []))];
const slug = value => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const frank = DATA.find(c => c.name === 'Frank Ocean · Songs');
frank.qualityPools = {
 iconic: ['Nights','Pink + White','Self Control','White Ferrari','Ivy','Pyramids','Thinkin Bout You','Lost','Super Rich Kids','Novacane','Chanel','Godspeed'],
 deep: ['Seigfried','Skyline To','Solo','Nikes','Close to You','Provider','DHL','In My Room','Sweet Life','Bad Religion','Pilot Jones','American Wedding','Swim Good','Biking','Rushes','Higgs','Wither','At Your Best (You Are Love)']
};
frank.items = [...new Set([...frank.items, 'Rushes', 'Higgs', 'Wither', 'At Your Best (You Are Love)'])];
frank.sources = ['https://pitchfork.com/reviews/tracks/13733-frank-ocean-pyramids/', 'https://pitchfork.com/reviews/albums/16859-channel-orange', 'https://musiccup.app/rank/artist/cb66065e648cc0cc/Frank%20Ocean'];
const pokemon = {
 group: 'Gaming', name: 'Fan Favorite Pokémon',
 items: ['Greninja','Lucario','Mimikyu','Charizard','Umbreon','Sylveon','Garchomp','Rayquaza','Gardevoir','Gengar','Dragapult','Tyranitar','Bulbasaur','Toxtricity','Lugia','Rowlet','Aegislash','Chandelure','Pikachu','Eevee','Luxray','Decidueye','Zoroark','Lycanroc','Corviknight','Flygon','Hydreigon','Sceptile','Blaziken','Snom','Dragonite','Mewtwo','Arcanine','Darkrai'],
 qualityPools: {
  iconic: ['Pikachu','Charizard','Mewtwo','Eevee','Gengar','Lucario','Greninja','Rayquaza','Dragonite','Bulbasaur','Lugia','Umbreon'],
  deep: ['Chandelure','Aegislash','Toxtricity','Rowlet','Decidueye','Luxray','Zoroark','Lycanroc','Corviknight','Flygon','Hydreigon','Snom','Dragapult','Mimikyu']
 },
 sources: ['https://pokemon2020.pokemon.com/en-us/', 'https://community.pokemon.com/en-us/discussion/21245/pikachu']
};
DATA.push(pokemon);
const CANDIDATES = new Map();
function attribution(category, item) {
 if (category === frank) return 'Frank Ocean';
 if (category === pokemon) return 'Pokémon · fan favorites';
 if (/^(Kendrick Lamar|J. Cole|Daniel Caesar|Drake|Kanye West|Travis Scott|Tyler, The Creator|The Weeknd) · Songs$/.test(category.name)) return category.name.replace(' · Songs','');
 return ARTISTS[item] || '';
}
function validateContent() {
 const ids = new Set();
 for (const c of DATA) {
  c.id = slug(c.name);
  if (ids.has(c.id)) throw Error('Duplicate category: '+c.name);
  ids.add(c.id);
  c.items = [...new Set(c.items.map(x=>x.trim()).filter(Boolean))];
  if (c.items.length < 10) throw Error('Insufficient category pool: '+c.name);
  for (const q of ['iconic','deep']) {
   if (c.qualityPools?.[q] && (new Set(c.qualityPools[q]).size < 10 || c.qualityPools[q].some(x=>!c.items.includes(x)))) throw Error('Invalid quality pool: '+c.name);
  }
  for (const item of c.items) {
   const id = c.id+'--'+slug(item);
   if (CANDIDATES.has(id)) throw Error('Duplicate candidate ID: '+id);
   CANDIDATES.set(id, {id, displayName:item, categoryId:c.id, attribution:attribution(c,item), verification:c.sources?'editorial-source-informed':'needs-review', lastReviewed:c.sources?'2026-10-23':null, sources:c.sources||[], artwork:{type:'original-svg',rights:'project-generated',offline:true}, judging:null});
  }
 }
}
