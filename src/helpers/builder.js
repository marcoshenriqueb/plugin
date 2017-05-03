export default class Builder {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
  }

  append(element) {
    this.container.appendChild(element);
  }

  appendGroup(name, type, label, placeholder) {
    const groupClass = this.options.inputGroupClass !== undefined ? this.options.inputGroupClass : '';
    this.append(
      Builder.createInputGroup(name, type, label, groupClass, placeholder),
    );
  }

  renderGroups(groups) {
    groups.map(g => this.appendGroup(g.name, g.type, g.label, g.placeholder));
  }

  static createInputGroup(name, type, labelText, groupClass, placeholder = '') {
    const label = Builder.createLabel(name, labelText);
    const input = Builder.createInput(name, type, placeholder);

    const group = document.createElement('div');
    group.classList.add(groupClass);
    group.appendChild(label);
    group.appendChild(input);

    return group;
  }

  static createInput(name, type, placeholder) {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('type', type);
    input.setAttribute('placeholder', placeholder);

    return input;
  }

  static createLabel(name, text) {
    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerHTML = text;

    return label;
  }

  static createSubmitBtn(text, listener) {
    const btn = document.createElement('button');
    btn.innerHTML = text;
    btn.addEventListener('click', listener);

    return btn;
  }
}
