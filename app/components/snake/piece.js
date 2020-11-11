import Component from '../base';

export default class SnakePiece extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.x_ = null;
    this.y_ = null;

    this.isHead_ = false;
    this.isTail_ = false;

    this.element_.classList.add('snake');
    this.up_ = this.up_.bind(this);
    this.right_ = this.right_.bind(this);
    this.down_ = this.down_.bind(this);
    this.left_ = this.left_.bind(this);

    this.command_ = this[`${this.store_.getters.command}_`];
  }

  get isHead() {
    return this.isHead_;
  }

  get isTail() {
    return this.isTail_;
  }

  set isHead(value) {
    if (this.isHead_ === value) {
      return;
    }

    this.isTail = false;

    if (value) {
      this.element_.classList.add('snake--head');
    } else {
      this.element.classList.remove('snake--head');
    }

    this.isHead_ = value;
  }

  set isTail(value) {
    if (this.isTail_ === value) {
      return;
    }

    if (value) {
      this.element_.classList.add('snake--tail');
    } else {
      this.element.classList.remove('snake--tail');
    }

    this.isTail_ = value;
  }

  set position({ x, y }) {
    this.x_ = x;
    this.y_ = y;
  }

  get x() {
    return this.x_;
  }

  get y() {
    return this.y_;
  }

  refresh_() {
    // let shouldGrow = false;
    // let userLost = false;

    // const { columns, rows } = this.store_.state;
    // if (this.x_ < 1 || this.x_ > columns || this.y_ < 1 || this.y_ > rows) {
    //   userLost = true;

    //   throw new Error('Snake Out of Bounds');

    //   // return { shouldGrow, userLost };
    // }

    // if (this.store_.state[`snake-${this.x_}-${this.y_}`]) {
    //   userLost = true;

    //   return { shouldGrow, userLost };
    // }

    // if (this.store_.state[`food-${this.x_}-${this.y_}`]) {
    //   shouldGrow = true;
    // }

    this.show();

    // return { shouldGrow, userLost };
  }

  show() {
    this.element_.style.setProperty('--snake-x-position', this.x_);
    this.element_.style.setProperty('--snake-y-position', this.y_);
  }

  move(moveCommand) {
    const command = this[`${moveCommand}_`];
    return command();
  }

  up_() {
    this.y_--;

    return this.refresh_();
  }

  right_() {
    this.x_++;

    return this.refresh_();
  }

  down_() {
    this.y_++;

    return this.refresh_();
  }

  left_() {
    this.x_--;

    return this.refresh_();
  }
}
