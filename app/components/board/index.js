import './index.scss';

import Component from '../base';
import {
  getComputedStyle,
  getBoundingClientRect,
  setGlobalProperty,
} from '../../utils/';
import { levels } from '../../levels';

export default class Board extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.tileSize_ = 16;
    this.width_ = 0;
    this.height_ = 0;

    this.snake_ = null;
    this.foods_ = [];
  }

  get snake() {
    return this.snake_;
  }

  set snake(value) {
    if (this.snake_) {
      return;
    }

    this.snake_ = value;
  }

  get foods() {
    return this.foods_;
  }

  resume() {
    this.hasMounted_();
  }

  render_({ key, value }) {
    if (key === 'food') {
      this.foods_.forEach((food) => {
        if (food.element) {
          this.element_.appendChild(food.element);
        }
      });
    } else if (key === 'moves') {
      if (this.snake_.piecesQueue.length > 0) {
        this.snake_.piecesQueue = this.snake_.piecesQueue.filter((piece) => {
          this.element_.appendChild(piece.element);
          this.snake_.addPiece(piece);

          return false;
        });
      }
    }
  }

  addFood(food) {
    this.foods_.push(food);
  }

  async hasMounted_() {
    return Promise.all([
      getComputedStyle(this.document_.documentElement),
      getBoundingClientRect(this.element_),
    ])
      .then(([computedStyle, dimensions]) => {
        this.tileSize_ =
          this.store_.state.config.size ||
          computedStyle
            .getPropertyValue('--board-tile-size')
            .trim()
            .replace(/[^0-9].+/, '');

        this.width_ = dimensions.width;
        this.height_ = dimensions.height;
        this.columns_ = this.getRatio_(this.width_ - 8);
        this.rows_ = this.getRatio_(this.height_ - 8);
      })
      .then(() => this.setBoardConfiguration_());
  }

  setBoardConfiguration_() {
    setGlobalProperty(
      this.global_.document,
      '--board-column-dimension',
      this.columns_
    );

    setGlobalProperty(document, '--board-row-dimension', this.rows_);
    setGlobalProperty(
      this.global_.document,
      '--board-tile-size',
      `${this.tileSize_}px`
    );
    setGlobalProperty(
      this.global_.document,
      '--board-level',
      `${levels[this.store_.state.config.level]}`
    );

    this.store_.dispatch(this.actionTypes_.CHANGE_DIMENSIONS, {
      columns: this.columns_,
      rows: this.rows_,
      tileSize: this.tileSize_,
    });
  }

  getRatio_(length) {
    return this.global_.Math.floor(length / this.tileSize_);
  }
}
