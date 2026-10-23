/* Source-informed additions, not live rankings. Research ledger: CONTENT.md. */
const historicTeams = {
 group:'Football',name:'Legendary Club Teams · Specific Seasons',
 description:'Judge the named season only: performance, opposition, achievements and influence. Historical snapshot reviewed 23 Oct 2026; not live squad data.',
 items:['Barcelona 2008/09','Barcelona 2010/11','Barcelona 2014/15','Real Madrid 1959/60','Real Madrid 2013/14','Real Madrid 2016/17','Real Madrid 2021/22','Manchester United 1998/99','Manchester United 2007/08','Bayern Munich 1973/74','Bayern Munich 2012/13','Bayern Munich 2019/20','AC Milan 1988/89','AC Milan 1993/94','AC Milan 2006/07','Ajax 1971/72','Ajax 1994/95','Liverpool 1976/77','Liverpool 1983/84','Liverpool 2018/19','Inter Milan 2009/10','Juventus 1995/96','Borussia Dortmund 1996/97','Porto 2003/04','Celtic 1966/67','Manchester City 2022/23'],
 sources:['https://www.uefa.com/uefachampionsleague/history/winners/','https://www.uefa.com/uefachampionsleague/news/0235-0e96071dcd7c-6319d5efa8de-1000--some-of-the-greatest-teams-in-european-history/','https://www.bbc.co.uk/sport/football/61311898'],
 qualityPools:{
 iconic:['Barcelona 2008/09','Barcelona 2010/11','Barcelona 2014/15','Real Madrid 2016/17','Manchester United 1998/99','Manchester United 2007/08','Bayern Munich 2012/13','Bayern Munich 2019/20','AC Milan 1988/89','AC Milan 1993/94','Inter Milan 2009/10','Manchester City 2022/23'],
 deep:['Real Madrid 1959/60','Bayern Munich 1973/74','AC Milan 1993/94','Ajax 1971/72','Ajax 1994/95','Liverpool 1976/77','Liverpool 1983/84','Juventus 1995/96','Borussia Dortmund 1996/97','Porto 2003/04','Celtic 1966/67','AC Milan 2006/07']
 }
};
DATA.push(historicTeams,{
 group:'Gaming',name:'Iconic Clash Royale Cards',
 description:'Base cards, judged on identity, fun and legacy. Not a live competitive tier list; evolutions are not separate candidates.',
 items:['Mega Knight','P.E.K.K.A','Hog Rider','Electro Wizard','Princess','Sparky','Miner','Royal Ghost','Skeleton Army','Goblin Barrel','The Log','X-Bow','Golem','Lava Hound','Ice Wizard','Bandit','Graveyard','Night Witch','Inferno Dragon','Baby Dragon','Balloon','Giant','Royal Giant','Musketeer','Valkyrie','Mini P.E.K.K.A','Knight','Witch','Wizard','Fireball','Rocket','Zap','Tornado','Mortar','Cannon Cart','Dark Prince','Goblin Cage','Mother Witch','Bowler','Skeleton Dragons'],
 sources:['https://royaleapi.com/cards/popular','https://support.supercell.com/clash-royale/en/articles/cards-and-decks-6.html']
},{
 group:'Gaming',name:'Clash of Clans · Home Village Troops',
 description:'Permanent Home Village troops. Heroes, spells, siege machines and Builder Base troops are excluded. Judge fun, utility and legacy, not an unverified live meta.',
 items:['Barbarian','Archer','Giant','Goblin','Wall Breaker','Balloon','Wizard','Healer','Dragon','P.E.K.K.A','Baby Dragon','Miner','Electro Dragon','Yeti','Dragon Rider','Electro Titan','Root Rider','Minion','Hog Rider','Valkyrie','Golem','Witch','Lava Hound','Bowler','Ice Golem','Headhunter','Apprentice Warden'],
 sources:['https://cocwiki.com/troops','https://www.clashrecord.com/troops']
});
for(const [name,sources] of [
 ['Rap Albums · All Time',['https://pitchfork.com/features/lists-and-guides/the-best-rap-albums-of-all-time-according-to-pitchfork-readers/','https://www.albumoftheyear.org/list/2280-billboards-100-greatest-rap-albums-of-all-time/','https://www.grammy.com/awards/categories/best-rap-album/']],
 ['Football Players · GOAT',['https://www.francefootball.fr/news/Ballon-d-or-dream-team-decouvrez-les-revelations-de-ce-onze-de-legende/1205748','https://www.fcbarcelona.fr/fr/football/equipe-premiere/actualites/1938928/xavi-maradona-messi-et-ronaldo-dans-la-dream-team-ballon-dor/featured']]
]) DATA.find(c=>c.name===name).sources=sources;
// Source dates remain distinct from the date an editor last reviewed the pool.
const POKEMON_VOTES_2020={Greninja:140559,Lucario:102259,Mimikyu:99077,Charizard:93968,Umbreon:67062,Sylveon:66029,Garchomp:61877,Rayquaza:60939,Gardevoir:60596,Gengar:60214,Dragapult:57973,Tyranitar:56834,Bulbasaur:56015,Toxtricity:55032,Lugia:53268,Rowlet:52367,Aegislash:51517,Chandelure:50943,Pikachu:48060,Eevee:47762,Luxray:46032,Decidueye:44011,Zoroark:43782,Lycanroc:42792,Corviknight:41711,Flygon:41420,Hydreigon:40054,Sceptile:38724,Blaziken:38307,Snom:38034,Dragonite:36873,Mewtwo:34585,Arcanine:29795,Darkrai:30544};
function offlineAssessment(category, game) {
 if(category!==pokemon || game.phase!=='complete' || game.picks.some(p=>p.some(x=>!Number.isInteger(POKEMON_VOTES_2020[x.item])))) return null;
 const totals=game.picks.map(p=>p.reduce((n,x)=>n+POKEMON_VOTES_2020[x.item],0));
 return {totals,winner:totals[0]===totals[1]?-1:totals[0]>totals[1]?0:1};
}
