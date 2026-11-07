import {Chess} from './vendor/chess.js';
const values={p:100,n:320,b:335,r:500,q:900,k:0};
function evaluate(game){let score=0;for(const row of game.board())for(const p of row){if(!p)continue;const x=p.square.charCodeAt(0)-97,y=Number(p.square[1]);const center=7-Math.abs(x-3.5)-Math.abs(y-4.5);const bonus=p.type==='p'?(p.color==='w'?y-2:7-y)*7:p.type==='k'?0:center*4;score+=(p.color==='w'?1:-1)*(values[p.type]+bonus);}return score*(game.turn()==='w'?1:-1);}
export function chooseMove(pgn,depth=2,{maxNodes=18000,timeMs=1000}={}){
 const game=new Chess();if(pgn)game.loadPgn(pgn);if(game.isGameOver())return null;
 depth=Math.max(1,Math.min(3,Number(depth)||2));let nodes=0;const deadline=Date.now()+timeMs;
 const ordered=()=>game.moves({verbose:true}).sort((a,b)=>(values[b.captured]||0)+(b.promotion?800:0)-(values[a.captured]||0)-(a.promotion?800:0));
 function search(d,alpha,beta,ply){if(++nodes>maxNodes||Date.now()>deadline)throw new Error('budget');if(game.isCheckmate())return -100000+ply;if(game.isDraw())return 0;if(!d)return evaluate(game);let best=-Infinity;for(const m of ordered()){game.move(m);let score;try{score=-search(d-1,-beta,-alpha,ply+1);}finally{game.undo();}best=Math.max(best,score);alpha=Math.max(alpha,score);if(alpha>=beta)break;}return best;}
 let best=ordered()[0];for(let d=1;d<=depth;d++){let candidate=best,score=-Infinity;try{for(const m of ordered()){game.move(m);let value;try{value=-search(d-1,-Infinity,Infinity,1);}finally{game.undo();}if(value>score){score=value;candidate=m;}}best=candidate;}catch{break;}}
 return {from:best.from,to:best.to,...(best.promotion?{promotion:best.promotion}:{})};
}
export function humanWon(game){return game.isCheckmate()&&game.turn()==='b';}
