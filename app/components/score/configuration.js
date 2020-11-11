import Component from '../base';
import { levels } from '../../levels';

export default class Configuration extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.size_ = null;
    this.level_ = null;
  }

  set level(value) {
    this.level_ = value;
  }

  set size(value) {
    this.size_ = value;
  }

  render_({ key, value }) {
    if (!['config'].includes(key)) {
      return;
    }

    global.Object.keys(value).forEach((configKey) => {
      this[configKey] = value[configKey];
    });

    this.element.innerHTML = `– Speed: ${levels[this.level_]}ms – Tile size:${
      this.size_
    }`;
  }
}
