import Component from '../base';

export default class Food extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.x_ = 0;
    this.y_ = 0;
    this.isActive_ = false;
  }
  async hasMounted_() {
    this.place_();
  }

  place_() {
    this.element_ = document.createElement('DIV');

    this.element_.classList.add('board__star');
    this.store_.dispatch(this.actionTypes_.PLACE_FOOD).then(({ x, y }) => {
      this.x_ = x;
      this.y_ = y;

      this.refresh_();
    });
  }

  refresh_() {
    this.element_.style.setProperty('--food-x-position', this.x_);
    this.element_.style.setProperty('--food-y-position', this.y_);
    this.isActive_ = true;
  }

  render_({ key, value }) {
    if (!key.includes('food-')) {
      return;
    }

    if (key === `food-${this.x_}-${this.y_}` && !value) {
      this.isActive_ = false;
    } else if (!this.isActive_ && value) {
      this.x_ = value.x;
      this.y_ = value.y;
      this.refresh_();
    }
  }
}
