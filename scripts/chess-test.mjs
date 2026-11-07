import assert from 'node:assert/strict';
import {Chess} from '../vendor/chess.js';
import {chooseMove,humanWon} from '../chess-engine.js';
const game=new Chess();assert.equal(game.moves().length,20);assert.throws(()=>game.move({from:'e2',to:'e5'}));assert.equal(humanWon(game),false);
for(const m of ['e4','e5','Qh5','Nc6','Bc4','Nf6','Qxf7#'])game.move(m);
assert.equal(humanWon(game),true);assert.equal(chooseMove(game.pgn()),null);
const replay=new Chess();replay.loadPgn(game.pgn());assert(humanWon(replay),'recovery replays and validates the actual win');
const lost=new Chess();for(const m of ['f3','e5','g4','Qh4#'])lost.move(m);assert(!humanWon(lost));
const stale=new Chess('7k/5K2/6Q1/8/8/8/8/8 b - - 0 1');assert(stale.isStalemate());assert(!humanWon(stale));
const castle=new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');castle.move('O-O');assert.equal(castle.get('f1').type,'r');
const ep=new Chess();for(const m of ['e4','a6','e5','d5','exd6'])ep.move(m);assert.equal(ep.get('d5'),undefined);assert.equal(ep.get('d6').color,'w');
for(const p of ['q','r','b','n']){const g=new Chess('7k/P7/8/8/8/8/8/7K w - - 0 1');g.move({from:'a7',to:'a8',promotion:p});assert.equal(g.get('a8').type,p);}
const repeat=new Chess();for(const m of ['Nf3','Nf6','Ng1','Ng8','Nf3','Nf6','Ng1','Ng8'])repeat.move(m);assert(repeat.isThreefoldRepetition());assert(!humanWon(repeat));
const black=new Chess();black.move('e4');for(const d of [1,2,3]){const move=chooseMove(black.pgn(),d,{timeMs:150,maxNodes:1000});const copy=new Chess();copy.loadPgn(black.pgn());assert(copy.move(move),'AI must return a legal move even with a budget limit');}
const mating=new Chess();for(const m of ['f3','e5','g4'])mating.move(m);const mate=chooseMove(mating.pgn(),2,{timeMs:1000});mating.move(mate);assert(mating.isCheckmate(),'AI finds available mate');
console.log('chess: legal moves, both checkmate outcomes, draw, PGN recovery, castling, en passant, underpromotion and budgeted AI passed');
