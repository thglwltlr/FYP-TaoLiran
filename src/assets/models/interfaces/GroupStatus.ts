import {PuzzleStatus} from './PuzzleStatus';

export interface GroupStatus {
  puzzles: PuzzleStatus[],
  endTime: any;
  point: number;
  startTime: any;
}
