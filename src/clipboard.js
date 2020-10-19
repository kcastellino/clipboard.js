import ClipboardHandler from './clipboard-handler';
import listen from 'good-listener';

/**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */
class Clipboard extends ClipboardHandler {
    /**
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     * @param {Object} options
     */
    constructor(trigger, options) {
        super(options);

        this.listenClick(trigger);
    }

    /**
     * Adds a click event listener to the passed trigger.
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     */
    listenClick(trigger) {
        this.listener = listen(trigger, 'click', (e) => this.onClick(e));
    }

    /**
     * Destroy lifecycle.
     */
    destroy() {
        this.listener.destroy();

        super.destroy();
    }
}

export default Clipboard;
