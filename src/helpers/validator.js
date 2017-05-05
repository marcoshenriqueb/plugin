/* ============
 * Validator class
 * ============
 *
 * This class is responsible for validating required fields. Field specific validations are
 * performed in the backend.
 */

export default class Validator {
  /**
   * The constructor assigns the required fields and locales properties. Also initializes
   * the errors object.
   *
   * @param {Array} required Array of required field names.
   * @param {Object} locale Locale translations.
   */
  constructor(required, locale) {
    this.required = required;
    this.locale = locale;
    this.errors = {};
  }

  /**
   * Method to validate the fields and return the errors if any.
   *
   * @param {Object} values Form fields with its values.
   */
  validate(values) {
    Object.keys(values).forEach((k) => {
      if (this.required.indexOf(k) >= 0 && Validator.isEmpty(values[k])) {
        this.addError(k, 'required');
      }
    });

    return this.errors;
  }

  /**
   * Method to add an error to the errors property.
   *
   * @param {String} name The field name.
   * @param {String} error The error key.
   */
  addError(name, error) {
    if (this.errors[name] === undefined) {
      this.errors[name] = [];
    }

    this.errors[name].push(
      this.locale.validation[error].replace('{{field}}', this.locale[name].toLowerCase()),
    );
  }

  /**
   * Checks if the field value is empty.
   *
   * @param {*} value The field value.
   */
  static isEmpty(value) {
    return value.length === 0;
  }
}
