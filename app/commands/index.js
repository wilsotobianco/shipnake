import { actionTypes } from '../store/action-types';

const resume__ = (store) => store.dispatch(actionTypes.KEEP_PLAYING);
const pause__ = (store) => store.dispatch(actionTypes.PAUSE_PLAYING);

const viewMenu_ = {
  name: 'viewMenu',
  default: pause__,
  opposite: resume__,
  isGlobal: true,
};
const left_ = { name: 'left', opposite: 'right' };
const up_ = { name: 'up', opposite: 'down' };
const right_ = { name: 'right', opposite: 'left' };
const down_ = { name: 'down', opposite: 'up' };

export const commands = {
  32: viewMenu_,
  37: left_,
  38: up_,
  39: right_,
  40: down_,
  72: left_,
  76: right_,
  74: down_,
  75: up_,
};

export const showCommands = (game) => console.log('showCommands_', game);
