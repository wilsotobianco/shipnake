const statuses = {
  IDLE: 1,
  MUTATING: 2,
  ACTIONING: 3,
};

export default class Store {
  constructor({ state = {}, actions = {}, mutations = {}, getters = {} }) {
    this.subscribers_ = {};
    this.status_ = statuses.IDLE;
    this.actions_ = actions;
    this.mutations_ = mutations;

    this.getters_ = this.setUpGetters_(getters);
    this.state_ = this.setUpState_(state);

    this.commit = this.commit.bind(this);
  }

  get state() {
    return this.state_;
  }

  get getters() {
    return this.getters_;
  }

  subscribe(topic, callback) {
    topic = topic.toUpperCase();

    if (!this.subscribers_[topic]) {
      this.subscribers_[topic] = new Set([]);
    }

    this.subscribers_[topic].add(callback);
  }

  dispatch(actionId, payload) {
    const action = this.actions_[actionId];

    if (!action) {
      return;
    }

    this.status_ = statuses.ACTIONING;

    return action(this, payload ? payload : {});
  }

  notify_(topic, payload) {
    const subscribers = this.subscribers_[topic];

    if (!subscribers) {
      return;
    }

    return [...subscribers].forEach((callback) => callback(payload));
  }

  setUpGetters_(getters) {
    return new Proxy(getters, {
      get: (getters, name, receiver) => {
        if (!Reflect.has(getters, name)) {
          return undefined;
        }

        return Reflect.get(getters, name, receiver)(this.state_);
      },
    });
  }

  setUpState_(state) {
    return new Proxy(state, {
      set: (state, key, value) => {
        state[key] = value;
        if (this.status_ !== statuses.MUTATING) {
          console.error('STATE POORLY MANAGED');
        }

        this.notify_(`STATE_CHANGED`, { key, value });
        console.log('STATE_CHANGED', { key, value });

        this.status_ = statuses.IDLE;

        return true;
      },
    });
  }

  commit(mutationId, payload) {
    const mutation = this.mutations_[mutationId];

    if (!mutation) {
      return;
    }

    this.status_ = statuses.MUTATING;

    mutation(this.state_, payload);

    return this.state_;
  }
}
