import { levels } from '../levels';
export const state = {
  moves: 0,
  level: 1,
  config: {},
  command: 'right',
  previousCommands: [],
  levels,
  status: 0,
  direction: 'right',
  score: 0,
  isPlaying: false,
  isBoardReady: false,
};
