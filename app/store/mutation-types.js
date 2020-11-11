import { generateMapFromKeys } from '../utils';

const rawMutationTypes = [
  'CACHE_FOOD',
  'CHANGE_COLUMN_DIMENSION',
  'CHANGE_ROW_DIMENSION',
  'CHANGE_TILE_SIZE_DIMENSION',
  'DELETE_FOOD',
  'INCREMENT_SCORE',
  'PLACE_FOOD',
  'SET_CONFIG',
  'SET_DIRECTION',
  'SET_STATUS',
  'TICK',
  'TOGGLE_IS_PLAYING',
  'TRACK_SNAKE',
  'UNTRACK_SNAKE',
  'UPDATE_COMMAND',
  'UPDATE_PREVIOUS_COMMAND',
  // 'GROW',
  // 'KICK_OFF',
  // 'MOVE',
];

export const mutationTypes = generateMapFromKeys(rawMutationTypes);
