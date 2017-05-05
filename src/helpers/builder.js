export default class Builder {
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

  append(element) {
    return this.form.appendChild(element);
  }

  appendGroup(name, type, label, placeholder) {
    return this.append(
      this.createInputGroup(name, type, label, placeholder),
    );
  }

  renderGroups(groups) {
    groups.forEach(g => this.appendGroup(g.name, g.type, g.label, g.placeholder));
  }

  renderInputs(inputs) {
    inputs.forEach((i) => {
      const placeholder = i.placeholder !== undefined ? i.placeholder : i.label;
      this.append(this.createInput(i.name, i.type, placeholder));
    });
  }

  createInputGroup(name, type, labelText, placeholder = '') {
    const label = this.createLabel(name, labelText);
    const input = this.createInput(name, type, placeholder);

    const group = document.createElement('div');
    group.classList.add(this.options.inputGroupClass);
    group.appendChild(label);
    group.appendChild(input);

    return group;
  }

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

  createLabel(name, text) {
    const label = document.createElement('label');
    label.classList.add(this.options.labelClass);
    label.setAttribute('for', name);
    label.innerHTML = text;

    return label;
  }

  createSubmitBtn(text, listener) {
    const btn = document.createElement('button');
    btn.classList.add(this.options.btnClass);
    btn.innerHTML = text;
    btn.addEventListener('click', listener);
    this.button = btn;
    return btn;
  }

  getInputValues() {
    const values = {};
    this.inputs.forEach((i) => { values[i.name] = i.value; });

    return values;
  }

  createError(name, text) {
    const error = document.createElement('span');
    error.classList.add(this.options.errorClass);
    error.setAttribute('id', `${name}Error`);
    error.innerHTML = text;
    this.errors.push(error);

    return error;
  }

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

  createSuccess(text) {
    const span = document.createElement('span');
    span.classList.add(this.options.successClass);
    span.innerHTML = text;
    this.success = span;

    return span;
  }

  addSuccess(message) {
    this.inputs.forEach((i) => {
      // eslint-disable-next-line
      i.value = '';
    });

    this.form.appendChild(this.createSuccess(message));
  }
}
