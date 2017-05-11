/* ============
 * Modal class
 * ============
 *
 * This is the class responsible for building the modal.
 */
import classes from './../classes';
import Builder from './builder';

export default class Modal {
  constructor(options) {
    this.modal = document.createElement('div');
    this.dialog = document.createElement('div');
    this.content = document.createElement('div');
    this.header = document.createElement('div');
    this.title = document.createElement('h4');
    this.body = document.createElement('div');
    this.options = options;
    this.classes = classes[this.options.style];

    this.modalId = 'modal';
    this.buildModal();
    this.listener = () => {};
  }

  onHide(listener) {
    if (this.options.style === 'bootstrap') {
      // eslint-disable-next-line
      $(`#${this.modalId}`).on('hide.bs.modal', listener);
    } else {
      this.listener = listener;
    }
  }

  toggle() {
    if (this.options.style === 'bootstrap') {
      // eslint-disable-next-line
      $(`#${this.modalId}`).modal('toggle');
    } else {
      if (this.modal.classList.contains('active')) {
        this.listener();
      }
      this.modal.classList.toggle('active');
    }
  }

  buildModal() {
    // Build modal
    this.modal.appendChild(this.dialog);
    Builder.addClass(this.modal, this.classes.modal.modal);
    this.modal.id = this.modalId;

    // Build dialog
    this.dialog.appendChild(this.content);
    Builder.addClass(this.dialog, this.classes.modal.dialog);

    // Build dialog content
    this.content.appendChild(this.header);
    this.content.appendChild(this.body);
    Builder.addClass(this.content, this.classes.modal.content);

    // Build close button
    const closeBtn = document.createElement('button');
    Builder.addClass(closeBtn, this.classes.modal.closeBtn);
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', this.toggle.bind(this));

    // Build title
    Builder.addClass(this.title, this.classes.modal.title);
    this.title.innerHTML = this.options.title;

    // Build header
    this.header.appendChild(closeBtn);
    this.header.appendChild(this.title);
    Builder.addClass(this.header, this.classes.modal.header);

    // Build body
    this.body.setAttribute('style', 'padding:2rem;');
  }
}
