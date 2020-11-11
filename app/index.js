import './index.scss';
import { actions } from './store/actions';
import { actionTypes } from './store/action-types';
import { asyncCall, getRandomPosition } from './utils/';
import { levels } from './levels';
import { mutations } from './store/mutations';
import { getters } from './store/getters';
import { mutationTypes } from './store/mutation-types';
import { state } from './store/state';
import Configuration from './components/score/configuration';
import Food from './components/food';
import Score from './components/score';
import Snake from './components/snake';
import Store from './store';
import Board from './components/board';
import Menu from './components/menu';

(async (global) => {
  let game = null;

  const toggleMenu_ = (game, isHide = true) =>
    asyncCall(() => {
      isHide
        ? game.global.document.documentElement.classList.add('game--loaded')
        : game.global.document.documentElement.classList.remove('game--loaded');

      return game;
    });

  const toggleIsPlaying_ = (game, isPlaying = true) =>
    asyncCall(() => {
      isPlaying
        ? global.document.documentElement.classList.add('game--is-playing')
        : global.document.documentElement.classList.remove('game--is-playing');

      return game;
    });

  const showUserLost_ = (global) =>
    global.document.documentElement.classList.add('game--over');

  const toggleCountdown_ = (game, isHide = false) => {
    const countdown =
      game.countdown || game.global.document.querySelector('.countdown');

    if (isHide) {
      countdown.classList.add('countdown--done');
      countdown.classList.remove('countdown--start');
    } else {
      countdown.classList.add('countdown--start');
      countdown.classList.remove('countdown--done');
    }

    return { ...game, countdown };
  };

  const startUI_ = (game) =>
    Promise.resolve(toggleMenu_(game))
      .then((game) => toggleCountdown_(game))
      .then((game) =>
        asyncCall(() => {
          store.dispatch(actionTypes.START_PLAYING);

          return game;
        }, 4000)
      )
      .then((game) => toggleCountdown_(game, true))
      .then((game) => toggleIsPlaying_(game));

  const bootUp_ = (game) =>
    asyncCall(() => {
      const { global, store } = game;

      store.subscribe('STATE_CHANGED', ({ key, value }) => react_(key, value));
      const menuElement = global.document.querySelector('.menu');
      const menu = new Menu(menuElement, store, global);

      // menu.addEventListener('submit', (e) => handleSubmit_(e, game));

      const scoreElement = global.document.querySelector('.board__star-score');
      const score = new Score(scoreElement, store, global);

      const configurationElement = global.document.querySelector(
        '.board__configuration'
      );
      const configuration = new Configuration(
        configurationElement,
        store,
        global
      );

      return { global, store, menu, score, configuration };
    });

  const start_ = async (game) => {
    const { store, global } = game;

    if (store.getters.gameHasStarted) {
      game.board.resume();
      return game;
    }

    const boardElement = global.document.querySelector('.board');
    board = new Board(boardElement, store, global);

    return { ...game, board };
  };

  const refresh_ = async (game) => {
    return asyncCall(() => {
      const { store } = game;
      const { command } = store.state;

      store.dispatch(actionTypes.REFRESH, { command });

      return game;
    }, levels[store.state.config.level]);
  };

  const play_ = async (game) => {
    let { status } = game.store.state;
    while (true && status !== 0 && status !== -1) {
      status = game.store.state.status;
      game = await refresh_(game);
    }

    return game;
  };

  const setDirection_ = (store, { name = 'right' }) => {
    const { direction = name } = store.state;
    global.document.documentElement.classList.remove(`game--${direction}`);
    store.commit(mutationTypes.SET_DIRECTION, {
      direction: name,
    });
    global.document.documentElement.classList.add(`game--${name}`);
  };

  const react_ = async (key, value) => {
    const { global, store } = game;

    let response = null;

    if (key === 'status') {
      const { status } = game.store.state;
      if (status === 1 || status === 2) {
        response = play_(game);
      }
      if (status === 0) {
        response = toggleIsPlaying_(game, false).then(() =>
          toggleMenu_(game, false)
        );
      }
      if (status === -1) {
        await showUserLost_(global);
      }
    } else if (key === 'command') {
      await setDirection_(store, value);
    } else if (key === 'config') {
      game = await start_(game);
    } else if (key === 'isPlaying') {
      game = await kickOff_(game).then((game) => startUI_(game));
    }
  };

  const kickOff_ = async (game) => {
    const { global, store, board } = game;

    if (store.getters.gameHasStarted) {
      return game;
    }

    board.snake = new Snake(null, store, window);
    global
      .Array(store.state.config.foods * 1)
      .fill()
      .forEach(() => board.addFood(new Food(null, store, window)));

    return { ...game, board };
  };

  const store = new Store({ state, mutations, actions, getters });
  game = { store, global };
  game = await bootUp_(game);
})(window);
