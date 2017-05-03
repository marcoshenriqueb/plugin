export default class Validator {
  constructor(required) {
    this.required = required;
    this.errors = {};
  }

  validate(fields) {
    fields.map((f) => {
      if (this.required.indexOf(f.name) >= 0 && Validator.isEmpty(f.value)) {
        this.addError(f.name, 'required');
      }

      return f;
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
