import scrollama from 'scrollama';
import { select, find } from './utils/dom';
import 'intersection-observer';


// Offset to trigger playing of video
const playVideoOffset = 1;

/**
 * Class to lazyload videos
 */
export default class AutoplayVideo {
  constructor(selector) {
    const $container = select(selector);
    const $video = find($container, '[data-video]')[0];

    // Cache elements
    this.props = {
      $container,
      $video,
    };

    // State handles variables that get updated
    this.state = {
      currentSentence: 1,
      currentTime: 0,
    };
  }

  /**
   * Lazyload videos once in view using scrollama
   * @method handleLoad
   */
  handleLoad() {
    const { $container, $video } = this.props;
    const scroller = scrollama();

    scroller
      .setup({
        step: [$container],
        offset: 1,
        once: true,
      })
      .onStepEnter(() => {
        const $source = find($video, 'source')[0];
        const dataSrc = $source.getAttribute('data-src');
        const src = $source.getAttribute('src');

        if (!src) {
          $source.setAttribute('src', dataSrc);
          $source.removeAttribute('data-src');
          $video.load();
        }
      });
  }

  /**
   * When videos come into view, play the videos if loaded;
   * otherwise, wait till loaded, then play. Pause when out of view.
   * @method handleInView
   */
  static handleInView() {
    const scroller = scrollama();

    scroller
      .setup({
        step: '[data-video]',
        offset: playVideoOffset,

      })
      .onStepEnter(({ element }) => {
        if (element.readyState === 4) {
          element.play();
        } else {
          element.addEventListener('canplaythrough', () => {
            element.play();
          });
        }
      })
      .onStepExit(({ element }) => {
        element.pause();
      });
  }

  /**
   * When video ends, loop.
   * @method handleEnd
   */
  handleEnd() {
    const { $video } = this.props;

    $video.addEventListener('ended', () => {
      this.state.currentTime = 0;
      $video.play();
    });
  }

  /**
   * Method to initiate all event handlers
   * @method eventListeners
   */
  eventListeners() {
    this.handleLoad();
    this.constructor.handleInView();
    this.handleEnd();
  }

  /**
   * Inits module
   * @method init
   */
  init() {
    this.eventListeners();
  }
}
