import {chooseMove} from './chess-engine.js';
self.onmessage=({data})=>{try{self.postMessage({move:chooseMove(data.pgn,data.depth)});}catch{self.postMessage({error:true});}};
