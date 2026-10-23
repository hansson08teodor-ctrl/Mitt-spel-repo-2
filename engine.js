/* Pure auction rules. No DOM, storage, network, or judging dependencies. */
(function (root) {
  'use strict';
  const slots = (g, p) => 5 - g.picks[p].length;
  const limit = (g, p) => slots(g, p) > 0 ? g.cash[p] - (slots(g, p) - 1) : 0;
  function validate(g) {
    if (!['auction', 'award', 'complete'].includes(g.phase)) throw Error('Invalid phase');
    const picks = g.picks.flat();
    if (g.pool.length !== 10 || new Set(g.pool).size !== 10) throw Error('Ten unique candidates required');
    if (picks.length !== g.idx || g.idx > 10) throw Error('Invalid progress');
    for (let p = 0; p < 2; p++) {
      if (slots(g, p) < 0 || !Number.isInteger(g.cash[p]) || g.cash[p] < slots(g, p)) throw Error('Invalid budget or picks');
      if (g.cash[p] + g.picks[p].reduce((n, x) => n + x.cost, 0) !== 20) throw Error('Money not conserved');
    }
    if (g.phase === 'auction' && (g.turn === g.lead || slots(g, g.lead) === 0 || slots(g, g.turn) === 0 || g.bid > limit(g, g.lead))) throw Error('Invalid auction');
    if (g.phase === 'complete' && (g.idx !== 10 || slots(g, 0) || slots(g, 1))) throw Error('Incomplete draft');
    return g;
  }
  function award(g, winner, cost, automatic = false) {
    if (!Number.isInteger(cost) || cost < 1 || cost > limit(g, winner)) throw Error('Illegal award');
    const item = g.pool[g.idx];
    g.cash[winner] -= cost;
    g.picks[winner].push({ item, cost });
    g.idx++;
    g.lastAward = { item, winner, cost, automatic };
    g.phase = 'award';
    return validate(g);
  }
  function open(g) {
    if (g.idx === 10) { g.phase = 'complete'; return validate(g); }
    g.bid = 1; g.raise = 1; g.lead = g.idx % 2; g.turn = 1 - g.lead;
    g.phase = 'auction';
    if (!slots(g, g.lead)) return award(g, g.turn, 1, true);
    if (!slots(g, g.turn)) return award(g, g.lead, 1, true);
    return validate(g);
  }
  function create(pool) {
    if (!Array.isArray(pool) || pool.length !== 10 || new Set(pool).size !== 10 || pool.some(x => typeof x !== 'string' || !x.trim())) throw Error('Ten distinct named candidates required');
    return open({ pool: [...pool], idx: 0, cash: [20, 20], picks: [[], []], phase: 'auction', lastAward: null });
  }
  function requireAuction(g) { if (g.phase !== 'auction') throw Error('No active auction'); }
  function bid(g) {
    requireAuction(g);
    const amount = g.bid + g.raise;
    if (!Number.isInteger(g.raise) || g.raise < 1 || amount > limit(g, g.turn)) throw Error('Bid exceeds available budget');
    g.bid = amount; g.lead = g.turn; g.turn = 1 - g.turn; g.raise = 1;
    // The responder always gets the explicit GIVE AWAY decision, even when unable to raise.
    return validate(g);
  }
  function give(g) { requireAuction(g); return award(g, g.lead, g.bid); }
  function increment(g, delta) {
    requireAuction(g);
    if (delta !== 1 && delta !== -1) throw Error('Invalid increment');
    g.raise = Math.max(1, Math.min(Math.max(1, limit(g, g.turn) - g.bid), g.raise + delta));
    return validate(g);
  }
  function next(g) { if (g.phase !== 'award') throw Error('No award to acknowledge'); return open(g); }
  const api = { create, bid, give, next, increment, limit, slots, validate };
  root.DraftEngine = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
