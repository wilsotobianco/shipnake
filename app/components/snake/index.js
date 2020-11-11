import './index.scss';

import Component from '../base';
import { asyncCall, getRandomPosition, setGlobalProperty } from '../../utils/';
import SnakePiece from './piece';

export default class Snake extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.head_ = null;
    this.pieces_ = [];
    this.queuedCommand_ = 'right';
    this.isDead_ = false;
    this.piecesQueue_ = [];
  }

  get head() {
    return this.head_;
  }

  get piecesQueue() {
    return this.piecesQueue_;
  }

  set piecesQueue(value) {
    this.piecesQueue_ = value;
  }

  addPiece(piece) {
    this.pieces_.push(piece);
  }

  hasMounted_() {
    this.place_();
  }

  place_() {
    if (this.head_) {
      return;
    }

    const { x, y } = getRandomPosition(this.store_.state);

    this.x_ = x;
    this.y_ = y;

    const headToBe = new SnakePiece(
      document.createElement('DIV'),
      this.store_,
      global
    );

    headToBe.isHead = true;
    this.head_ = headToBe;
    this.head_.position = { x, y };
    document.querySelector('.board').appendChild(this.head_.element);
    this.pieces_.push(this.head_);
    this.head_.refresh_();
  }

  async render_(payload) {
    if (!['moves', 'command'].includes(payload.key)) {
      return;
    }

    if (payload.key === 'command') {
      this.queuedCommand_ = payload.value.name;
    } else {
      try {
        await this.move_(this.queuedCommand_);
      } catch (e) {
        this.store_.dispatch(this.actionTypes_.STOP_PLAYING);
        this.isDead_ = true;
        console.log('error catched');
        throw e;
      }
    }
  }

  async move_(payload) {
    if (this.isDead_) {
      return;
    }

    this.head_.isHead = false;
    const newHead = this.pieces_.pop();
    newHead.isHead = true;
    newHead.isTail = false;
    this.head_ = newHead;
    const { x, y } = this.head_;

    this.head_.position = { x: this.x_, y: this.y_ };
    this.head_.move(payload);
    // console.log('snake moved', this.head_.x, this.head_.y);

    if (this.userLost_()) {
      this.store_.dispatch(this.actionTypes_.STOP_PLAYING);
    } else if (this.shouldGrow_()) {
      await this.grow_({ x, y });
    }

    this.x_ = this.head_.x;
    this.y_ = this.head_.y;
    this.store_.dispatch(this.actionTypes_.MOVE_SNAKE, {
      oldX: x,
      oldY: y,
      x: this.x_,
      y: this.y_,
    });

    this.pieces_.unshift(this.head_);
  }

  grow_({ x, y }) {
    return asyncCall(() => {
      const body = new SnakePiece(
        document.createElement('DIV'),
        this.store_,
        global
      );

      body.position = { x, y };
      body.isTail = true;
      body.show();
      this.store_.commit(this.mutationTypes_.INCREMENT_SCORE, {
        multiplier: 1,
      });
      // this.main_.appendChild(body.element);
      // document.querySelector('.board').appendChild(body.element);
      this.piecesQueue_.push(body);
      // this.pieces_.push(body);
    }).then(() =>
      this.store_.dispatch(this.actionTypes_.PLACE_FOOD, {
        snakeX: this.head_.x,
        snakeY: this.head_.y,
      })
    );
  }

  userLost_() {
    let response = false;
    const { columns, rows } = this.store_.state;

    if (
      this.head_.x < 1 ||
      this.head_.x > columns ||
      this.head.y < 1 ||
      this.head.y > rows
    ) {
      response = true;
    }

    if (this.store_.state[`snake-${this.head_.x}-${this.head_.y}`]) {
      response = true;
    }

    return response;
  }

  shouldGrow_() {
    let response = false;
    if (this.store_.state[`food-${this.head_.x}-${this.head_.y}`]) {
      response = true;
    }

    return response;
  }
}
