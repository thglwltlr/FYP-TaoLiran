import {Puzzle} from './Puzzle';
export interface Location {
  name: string;
  type:string;
  photoUrl: string;
  order:number;
  puzzles:Puzzle[];
}
