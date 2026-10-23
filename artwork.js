/* Local assets only. No remote images are requested by the game. */
const POKEMON_TILES=['Greninja','Lucario','Mimikyu','Charizard','Umbreon','Sylveon','Garchomp','Rayquaza','Gardevoir','Gengar','Dragapult','Tyranitar','Bulbasaur','Toxtricity','Lugia','Rowlet','Aegislash','Chandelure','Pikachu','Eevee','Luxray','Decidueye','Zoroark','Lycanroc','Corviknight','Flygon','Hydreigon','Sceptile','Blaziken','Snom','Dragonite','Mewtwo','Arcanine','Darkrai'];
function categoryTile(category){
 if(category.name.includes('Pokémon'))return 12;
 if(category.name.includes('Clash'))return 13;
 if(category.group==='TV & Anime')return category.name.includes('Anime')?7:6;
 return {'Music · Songs':0,'Music · Albums':1,'Football':3,'Sports':3,'Gaming':4,'Movies':5,'Social Media':11,'Food & Drinks':8,'Desserts & Sweets':9,'Fun & Culture':14}[category.group]??15;
}
function tileStyle(path,index,columns){
 const x=(index%columns)*100/(columns-1),y=Math.floor(index/columns)*100/(columns-1);
 return `background-image:url('./${path}');background-size:${columns*100}% ${columns*100}%;background-position:${x}% ${y}%`;
}
function categoryArtwork(category){
 return `<span class="category-art" aria-hidden="true" style="${tileStyle('assets/images/category-atlas.png',categoryTile(category),4)}"></span>`;
}
function candidateArtwork(category,item){
 const photo=ARTWORK[category.name+'\n'+item];
 const pokemonIndex=category.name.includes('Pokémon')?POKEMON_TILES.indexOf(item):-1;
 if(photo)return {kind:photo.kind,photo,fallback:tileStyle('assets/images/category-atlas.png',categoryTile(category),4)};
 if(pokemonIndex>=0)return {kind:'AI fan illustration',style:tileStyle('assets/images/pokemon-atlas.png',pokemonIndex,6)};
 return {kind:'Original category illustration',style:tileStyle('assets/images/category-atlas.png',categoryTile(category),4)};
}
function localPicture(item,group,cl='art'){
 const category=chosen||{name:'',group};const art=candidateArtwork(category,item);
 const title=esc(`${item} · ${art.kind}`);
 return `<span class="${cl} artwork" role="img" aria-label="${title}" style="${art.style||art.fallback}">${art.photo?`<img class="image-fill" src="./${esc(art.photo.path)}" alt="" loading="eager" decoding="async" onerror="this.hidden=true">`:''}</span>`;
}
function artworkCaption(item){
 const art=candidateArtwork(chosen,item);
 if(art.photo)return `<a class="image-credit" href="./artwork-credits.html#${art.photo.path.split('/').pop().split('.')[0]}" target="_blank" rel="noopener">${esc(art.kind)} · ${esc(art.photo.license)} · Credits ↗</a>`;
 return `<span class="image-credit">${art.kind==='AI fan illustration'?'AI fan illustration · unofficial':'Category illustration · not official cover art'}</span>`;
}
