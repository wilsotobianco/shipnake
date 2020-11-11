import { generateMapFromKeys } from '../utils';

const rawActionTypes = [
  'REFRESH',
  'PLACE_FOOD',
  'CHANGE_DIMENSIONS',
  'QUEUE_COMMAND',
  'MOVE_SNAKE',
  'START_PLAYING',
  'KEEP_PLAYING',
  'PAUSE_PLAYING',
  'STOP_PLAYING',
];

export const actionTypes = generateMapFromKeys(rawActionTypes);
