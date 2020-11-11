import { getRandomPosition } from '../utils';
import { actionTypes } from './action-types';
import { mutationTypes } from './mutation-types';

const isCommandValid_ = ({ command, previousCommands }) => {
  const lastCommand = [...previousCommands].pop();

  return !lastCommand || command.name !== lastCommand.opposite;
};

export const actions = {
  [actionTypes.REFRESH]({ commit }, { command }) {
    commit(mutationTypes.UPDATE_PREVIOUS_COMMAND, { command });
    commit(mutationTypes.TICK);
  },
  [actionTypes.PLACE_FOOD](
    { commit, state },
    { snakeX = undefined, snakeY = undefined }
  ) {
    return new Promise(async (resolve, reject) => {
      // If rejected it means the user won (maybe?).
      let newFoodPosition = null;
      // console.log('placefood');
      // console.log('snakeX', snakeX);
      // console.log('snakeY', snakeY);
      // console.log(
      //   `food-${snakeX}-${snakeY}`,
      //   state[`food-${snakeX}-${snakeY}`]
      // );
      // const { x, y } = state.food || {};

      if (snakeX && snakeY && state[`food-${snakeX}-${snakeY}`]) {
        commit(mutationTypes.DELETE_FOOD, { x: snakeX, y: snakeY });
      }

      // if (snakeX) debugger;
      do {
        newFoodPosition = getRandomPosition(state);
      } while (state[`snake-${newFoodPosition.x}-${newFoodPosition.y}`]);

      const result = { x: newFoodPosition.x, y: newFoodPosition.y };

      commit(mutationTypes.PLACE_FOOD, result);
      commit(mutationTypes.CACHE_FOOD, result);

      resolve(result);
    });
  },
  [actionTypes.CHANGE_DIMENSIONS]({ commit }, { columns, rows, tileSize }) {
    commit(mutationTypes.CHANGE_ROW_DIMENSION, { rows });
    commit(mutationTypes.CHANGE_COLUMN_DIMENSION, { columns });
    commit(mutationTypes.CHANGE_TILE_SIZE_DIMENSION, { tileSize });
    commit(mutationTypes.TOGGLE_IS_PLAYING, { isPlaying: true });
  },
  [actionTypes.QUEUE_COMMAND]({ commit, state }, { command }) {
    //TODO seems like this could be done in a mutation instead.
    const { previousCommands } = state;

    if (isCommandValid_({ command, previousCommands })) {
      commit(mutationTypes.UPDATE_COMMAND, { command });
    }
  },
  [actionTypes.MOVE_SNAKE]({ commit }, { oldX, oldY, x, y }) {
    commit(mutationTypes.UNTRACK_SNAKE, { x: oldX, y: oldY });
    commit(mutationTypes.TRACK_SNAKE, { x, y });
  },
  [actionTypes.START_PLAYING]({ commit }) {
    commit(mutationTypes.SET_STATUS, { status: 1 });
  },
  [actionTypes.KEEP_PLAYING]({ commit }) {
    commit(mutationTypes.SET_STATUS, { status: 2 });
  },
  [actionTypes.PAUSE_PLAYING]({ commit }) {
    commit(mutationTypes.SET_STATUS, { status: 0 });
  },
  [actionTypes.STOP_PLAYING]({ commit }) {
    commit(mutationTypes.SET_STATUS, { status: -1 });
  },
};
