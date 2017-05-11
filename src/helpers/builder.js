/* ============
 * Builder class
 * ============
 *
 * This is the main class responsible for rendering the form to the DOM.
 */
import classes from './../classes';

export default class Builder {
  /**
   * Assigns initial properties and insert the template into the container.
   *
   * @param {Object} container The form container node.
   * @param {String} template The template to render the fields on.
   * @param {Object} options The Builder options.
   */
  constructor(container, template, options = {}) {
    this.container = container;
    this.container.innerHTML = template;
    this.form = this.container.firstChild;
    this.inputs = [];
    this.button = {};
    this.errors = [];
    this.success = {};
    this.options = options;

    this.classes = classes[this.options.style];
    Builder.addClass(this.form, this.options.formContainerClass);
    Builder.addClass(this.form, this.classes.form.container);
  }

  /**
   * Appends a element into the template node.
   *
   * @param {Object} element The node to be appended.
   */
  append(element) {
    return this.form.appendChild(element);
  }

  /**
   * Wrapper to append a created field group to the template.
   *
   * @param {String} name The field name.
   * @param {String} type The field type.
   * @param {String} label The field label.
   * @param {String} placeholder The field placeholder.
   */
  appendGroup(name, type, label, placeholder) {
    return this.append(
      this.createInputGroup(name, type, label, placeholder),
    );
  }

  /**
   * Render form fields with a group that has a container div with the label and the
   * input in it.
   *
   * @param {Array} groups The field groups to be rendered.
   */
  renderGroups(groups) {
    groups.forEach(g => this.appendGroup(g.name, g.type, g.label, g.placeholder));
  }

  renderInputs(inputs) {
    inputs.forEach((i) => {
      const placeholder = i.placeholder !== undefined ? i.placeholder : i.label;
      this.append(this.createInput(i.name, i.type, placeholder));
    });
  }

  /**
   * Creates the group node and appends the label and input nodes.
   *
   * @param {String} name The field name.
   * @param {String} type The field type.
   * @param {String} labelText The field label.
   * @param {String} placeholder The field placeholder.
   */
  createInputGroup(name, type, labelText, placeholder = '') {
    const label = this.createLabel(name, labelText);
    const input = this.createInput(name, type, placeholder);

    const group = document.createElement('div');
    Builder.addClass(group, this.options.inputGroupClass);
    Builder.addClass(group, this.classes.form.group);
    group.appendChild(label);
    group.appendChild(input);

    return group;
  }

  /**
   * Creates the input node.
   *
   * @param {String} name The field name.
   * @param {String} type The field type.
   * @param {String} placeholder The field placeholder.
   */
  createInput(name, type, placeholder) {
    const input = document.createElement('input');
    Builder.addClass(input, this.options.inputClass);
    Builder.addClass(input, this.classes.form.input);
    input.setAttribute('name', name);
    input.setAttribute('type', type);
    input.setAttribute('placeholder', placeholder);
    input.addEventListener('keydown', (e) => {
      this.removeError(e.target.name);
    });
    this.inputs.push(input);

    return input;
  }

  /**
   * Creates the label node.
   *
   * @param {String} name The field name.
   * @param {*} text The label text.
   */
  createLabel(name, text) {
    const label = document.createElement('label');
    Builder.addClass(label, this.options.labelClass);
    Builder.addClass(label, this.classes.form.label);
    label.setAttribute('for', name);
    label.innerHTML = text;

    return label;
  }

  /**
   * Creates the submit button node.
   *
   * @param {String} text The button text.
   * @param {Function} listener The click event listener.
   */
  createSubmitBtn(text, listener) {
    const btn = document.createElement('button');
    Builder.addClass(btn, this.options.btnClass);
    Builder.addClass(btn, this.classes.form.button);
    btn.innerHTML = text;
    btn.addEventListener('click', listener);
    this.button = btn;
    return btn;
  }

  /**
   * Get the form input values.
   */
  getInputValues() {
    const values = {};
    this.inputs.forEach((i) => { values[i.name] = i.value; });

    return values;
  }

  /**
   * Creates a error node.
   *
   * @param {String} name The field name.
   * @param {String} text The error text.
   */
  createError(name, text) {
    const error = document.createElement('span');
    Builder.addClass(error, this.options.errorClass);
    Builder.addClass(error, this.classes.form.error);
    error.setAttribute('id', `${name}Error`);
    error.innerHTML = text;
    this.errors.push(error);

    return error;
  }

  /**
   * Insert the errors nodes with the messages after each field on the object.
   * @param {Object} errors The errors object.
   */
  recordErrors(errors) {
    this.inputs.forEach((input) => {
      if (errors[input.name] === undefined) {
        return;
      }

      const error = this.createError(input.name, errors[input.name][0]);
      if (input.nextSibling) {
        input.parentNode.insertBefore(error, input.nextSibling);
      } else {
        input.parentNode.appendChild(error);
        Builder.addClass(input.parentNode, this.classes.form.groupError);
      }
    });

    if (Object.keys(errors).length > 0) {
      this.button.disabled = true;
    }
  }

  /**
   * Listener for input keydown to remove the field error when the user types.
   *
   * @param {Object} e The event object.
   */
  removeError(name) {
    const element = this.errors.filter(error => (error.id === `${name}Error`));

    if (
      element.length > 0 &&
      this.classes.form.groupError &&
      element[0].parentNode.classList.contains(this.classes.form.groupError)
    ) {
      Builder.removeClass(element[0].parentNode, this.classes.form.groupError);
    }

    if (element.length > 0 && !!element[0]) {
      element[0].parentNode.removeChild(element[0]);
    }

    this.errors = this.errors.filter(error => (error.id !== `${name}Error`));
    if (this.errors.length === 0) {
      this.button.disabled = false;
    }
  }

  /**
   * Creates the success message node.
   *
   * @param {String} text The success message.
   */
  createSuccess(text) {
    this.success = document.createElement('p');
    Builder.addClass(this.success, this.options.successClass);
    Builder.addClass(this.success, this.classes.form.success);
    this.success.innerHTML = text;
    this.success = this.success;

    return this.success;
  }

  /**
   * Appends success message node to the form and reset inputs.
   *
   * @param {String} message The success message.
   */
  addSuccess(message) {
    this.clearForm();

    this.form.appendChild(this.createSuccess(message));
  }

  clearForm() {
    this.inputs.forEach((i) => {
      this.removeError(i.name);
      // eslint-disable-next-line
      i.value = '';
    });
    if (this.success.parentNode) {
      this.success.parentNode.removeChild(this.success);
    }
  }

  static addClass(el, c) {
    if (c.length > 0) {
      c.split(' ').forEach((classItem) => {
        el.classList.add(classItem);
      });
    }
  }

  static removeClass(el, c) {
    if (c.length > 0) {
      c.split(' ').forEach((classItem) => {
        el.classList.remove(classItem);
      });
    }
  }
}
