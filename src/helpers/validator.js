export default class Validator {
  constructor(required) {
    this.required = required;
    this.errors = {};
  }

  validate(values) {
    Object.keys(values).forEach((k) => {
      if (this.required.indexOf(k) >= 0 && Validator.isEmpty(values[k])) {
        this.addError(k, 'required');
      }
    });

    return this.errors;
  }

  addError(name, error) {
    if (this.errors[name] === undefined) {
      this.errors[name] = [];
    }

    this.errors[name].push(error);
  }

  static isEmpty(value) {
    return value.length === 0;
  }
}
