/* ============
 * Modal class
 * ============
 *
 * This is the class responsible for building the modal.
 */
import classes from './../classes';

export default class Modal {
  constructor(options) {
    this.container = {};
    this.options = options;
    this.classes = classes[this.options.style];

    if (this.options.style === 'bootstrap') {
      this.buildBootstrapModal();
    } else {
      this.buildModal();
    }
  }

  getContainer() {
    return this.container;
  }

  open() {

  }

  buildBootstrapModal() {

  }

  buildModal() {

  }
}
