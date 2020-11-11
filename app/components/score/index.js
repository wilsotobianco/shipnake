import Component from '../base';

export default class Score extends Component {
  constructor(element, store, global) {
    super(element, store, global);

    this.score_ = 0;
    this.level_ = '';
    this.show_();
  }

  render_({ key, value }) {
    if (!['score'].includes(key)) {
      return;
    }

    this.level_ = value.level;

    if (this.store_.getters.gameHasStarted) {
      this.show_();
    }
  }

  show_() {
    const { score } = this.store_.state;
    this.global_.document.documentElement.style.setProperty(
      `--board-score`,
      score
    );

    this.element.innerHTML = `Score: ${(
      '00' +
      score * (this.store_.getters.level || 0)
    ).slice(-3)}`;
  }
}
