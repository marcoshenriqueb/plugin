/* ============
 * Builder class
 * ============
 *
 * This is the main class responsible for rendering the form to the DOM.
 */


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

    this.form.classList.add(this.options.formContainerClass);
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
    group.classList.add(this.options.inputGroupClass);
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
    input.classList.add(this.options.inputClass);
    input.setAttribute('name', name);
    input.setAttribute('type', type);
    input.setAttribute('placeholder', placeholder);
    input.addEventListener('keydown', this.removeError.bind(this));
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
    label.classList.add(this.options.labelClass);
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
    btn.classList.add(this.options.btnClass);
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
    error.classList.add(this.options.errorClass);
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
  removeError(e) {
    const element = this.errors.filter(error => (error.id === `${e.target.name}Error`));

    if (element.length > 0 && !!element[0]) {
      element[0].parentNode.removeChild(element[0]);
    }

    this.errors = this.errors.filter(error => (error.id !== `${e.target.name}Error`));
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
    const span = document.createElement('span');
    span.classList.add(this.options.successClass);
    span.innerHTML = text;
    this.success = span;

    return span;
  }

  /**
   * Appends success message node to the form and reset inputs.
   *
   * @param {String} message The success message.
   */
  addSuccess(message) {
    this.inputs.forEach((i) => {
      // eslint-disable-next-line
      i.value = '';
    });

    this.form.appendChild(this.createSuccess(message));
  }
}
