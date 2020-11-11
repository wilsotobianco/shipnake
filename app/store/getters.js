export const getters = {
  gameHasStarted: ({ moves }) => {
    return moves > 0;
  },

  level: ({ config }) => {
    return config.level || 0;
  },

  command: ({ command }) => {
    return command.name || 'right';
  },
};
