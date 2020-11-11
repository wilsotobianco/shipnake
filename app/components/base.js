import { actionTypes } from '../store/action-types';
import { mutationTypes } from '../store/mutation-types';
import { asyncCall } from '../utils';

export default class Component {
  constructor(element, store, global) {
    this.store_ = store;
    this.element_ = element;
    this.global_ = global;
    this.document_ = this.global_.document;
    this.mutationTypes_ = mutationTypes;
    this.actionTypes_ = actionTypes;

    this.render_ = this.render_.bind(this);

    this.init_();
  }

  get element() {
    return this.element_;
  }

  init_() {
    asyncCall(() =>
      this.store_.subscribe('STATE_CHANGED', this.render_)
    ).then(() => this.hasMounted_());
  }

  render_() {}

  async hasMounted_() {}
}
