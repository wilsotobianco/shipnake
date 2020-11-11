import { mutationTypes } from './mutation-types';

export const mutations = {
  [mutationTypes.SET_CONFIG](state, { size, level, foods }) {
    state.config = { size, level, foods };
  },
  [mutationTypes.TICK](state) {
    state.moves++;
  },
  [mutationTypes.PLACE_FOOD](state, { x, y }) {
    state.food = { x, y };
  },
  [mutationTypes.CACHE_FOOD](state, { x, y }) {
    state[`food-${x}-${y}`] = { x, y };
  },
  [mutationTypes.DELETE_FOOD](state, { x, y }) {
    state[`food-${x}-${y}`] = false;
  },
  [mutationTypes.CHANGE_ROW_DIMENSION](state, { rows }) {
    state.rows = rows;
  },
  [mutationTypes.CHANGE_COLUMN_DIMENSION](state, { columns }) {
    state.columns = columns;
  },
  [mutationTypes.CHANGE_TILE_SIZE_DIMENSION](state, { tileSize }) {
    state.tileSize = tileSize;
  },
  [mutationTypes.UPDATE_COMMAND](state, { command }) {
    state.command = command;
  },
  [mutationTypes.UPDATE_PREVIOUS_COMMAND](state, { command }) {
    state.previousCommands.push(command);
  },
  [mutationTypes.SET_STATUS](state, { status }) {
    state.status = status;
  },
  [mutationTypes.SET_DIRECTION](state, { direction }) {
    state.direction = direction;
  },
  [mutationTypes.INCREMENT_SCORE](state) {
    state.score++;
  },
  [mutationTypes.TRACK_SNAKE](state, { x, y }) {
    state[`snake-${x}-${y}`] = { x, y };
  },
  [mutationTypes.UNTRACK_SNAKE](state, { x, y }) {
    state[`snake-${x}-${y}`] = false;
  },
  [mutationTypes.TOGGLE_IS_PLAYING](state, { isPlaying }) {
    state.isPlaying = isPlaying;
  },
};
