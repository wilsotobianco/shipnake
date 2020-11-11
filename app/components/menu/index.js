import './index.scss';

import Component from '../base';
import { commands, showCommands } from '../../commands';

export default class Menu extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.form_ = null;

    this.handleSubmit_ = this.handleSubmit_.bind(this);
    this.handleKeyPress_ = this.handleKeyPress_.bind(this);
  }

  hasMounted_() {
    this.form_ = this.element_.querySelector('.menu__form');

    this.form_.addEventListener('submit', this.handleSubmit_);
  }

  handleSubmit_(event) {
    event.preventDefault();

    const formData = new this.global_.FormData(event.target);
    const size = formData.get('size');
    const level = formData.get('level');
    const foods = formData.get('foods');
    this.global_.addEventListener('keydown', this.handleKeyPress_);

    if (!this.store_.getters.gameHasStarted) {
      this.store_.dispatch(this.actionTypes_.QUEUE_COMMAND, {
        command: commands[39],
      });
    }

    this.store_.commit(this.mutationTypes_.SET_CONFIG, { size, level, foods });
  }

  handleKeyPress_(event) {
    const command = commands[event.keyCode] || { default: showCommands };

    if (command.isGlobal) {
      if (this.store_.state.status === 0) {
        // command.opposite(store);
        // startUI_(game);
      } else {
        command.default(this.store_);
      }
    } else {
      this.store_.dispatch(this.actionTypes_.QUEUE_COMMAND, { command });
    }
  }
}
