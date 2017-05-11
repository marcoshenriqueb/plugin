/* ============
 * Form class
 * ============
 *
 * This is the main class responsible for calling the plugin.
 */

import locale from './locale/en';
import Builder from './helpers/builder';
import Validator from './helpers/validator';
import Modal from './helpers/modal';
// import post from './helpers/requester';

// eslint-disable-next-line
export class Form {
  /**
   * Initializes class properties and assign options.
   *
   * @param {Object} options Form options object.
   */
  constructor(options) {
    this.container = {};
    this.formContainer = {};
    this.builder = {};
    this.availableFields = [
      'email',
      'first_name',
      'last_name',
      'phone_number',
      'mobile_number',
      'street_name',
      'zipcode',
      'city',
      'country',
    ];

    this.options = Object.assign({
      template: '<form id="kundan-form-container"></form>',
      formContainerClass: '',
      inputGroupClass: '',
      inputClass: '',
      labelClass: '',
      btnClass: '',
      errorClass: '',
      successClass: '',
      flat: false,
      style: 'kundan',
      fields: [
        {
          name: 'first_name',
          required: true,
        },
        'last_name',
      ],
      locale,
      successMessage: locale.success,
    }, options);

    this.validateFieldOptions();
  }

  /**
   * Assigns a already existing element as the form container and calls the buidler.
   *
   * @param {String} id The form container id.
   */
  render(id) {
    this.container = document.getElementById(id);
    this.insertForm();
  }

  /**
   * Creates a modal and assign it as the form container. Then calls the builder.
   */
  modal() {
    const modal = new Modal({
      style: this.options.style,
    });
    this.container = modal.getContainer();
    this.insertForm();
    return modal;
  }

  /**
   * Calls the builder constructor to render the form template and assign options.
   */
  insertForm() {
    this.builder = new Builder(this.container, this.options.template, {
      style: this.options.style,
      formContainerClass: this.options.formContainerClass,
      inputGroupClass: this.options.inputGroupClass,
      inputClass: this.options.inputClass,
      labelClass: this.options.labelClass,
      btnClass: this.options.btnClass,
      errorClass: this.options.errorClass,
      successClass: this.options.successClass,
    });
    this.build();
  }

  /**
   * Call the the Builder method to render the form fields and the submit button.
   */
  build() {
    if (this.options.flat) {
      this.builder.renderInputs(this.createFormJson());
    } else {
      this.builder.renderGroups(this.createFormJson());
    }

    this.builder.append(
      this.builder.createSubmitBtn(this.options.locale.submit, this.onSubmit.bind(this)),
    );
  }

  /**
   * Creates the Json object in which the form Builder will work on.
   */
  createFormJson() {
    const email = this.options.fields.filter(f => f.name === 'email');
    const form = [];

    this.options.fields.forEach((f) => {
      if (f === 'email' || f.name === 'email') {
        return;
      }
      let name = '';
      let type = 'text';
      let label = '';
      if (typeof f === 'string') {
        name = f;
        label = this.options.locale[f];
      } else {
        name = f.name;
        label = f.label || this.options.locale[f.name];
        type = f.type || type;
      }

      form.push({
        name,
        type,
        label,
        placeholder: typeof f !== 'string' ? f.placeholder : undefined,
      });
    });

    form.push(
      {
        name: 'email',
        type: 'email',
        placeholder: email.length > 0 ? email[0].placeholder : undefined,
        label: email.length > 0 && email[0].label !== undefined ?
        email[0].label : this.options.locale.email,
      },
    );

    return form;
  }

  /**
   * This method is the listener to the form submit button. It call the validator, render errors
   * if any, and then sends the request.
   *
   * @param {Object} e The submit event.
   */
  onSubmit(e) {
    e.preventDefault();
    const values = this.builder.getInputValues();
    const requiredFields = this.options.fields
    .filter(f => typeof f === 'string' || f.required === undefined || f.required)
    .map(f => (typeof f === 'string' ? f : f.name));
    requiredFields.push('email');

    const v = new Validator(requiredFields, this.options.locale);
    const errors = v.validate(values);

    if (Object.keys(errors).length > 0) {
      return this.builder.recordErrors(errors);
    }


    return this.builder.addSuccess(this.options.successMessage);
    // return post(values).then(() => {
    //   this.builder.addSuccess(this.options.successMessage);
    // })
    // .catch((error) => {
    //   if (error.message) {
    //     this.builder.recordErrors(JSON.parse(error.message));
    //   }
    // });
  }

  /**
   * Checks if any field not available is passed in the options fields array.
   */
  validateFieldOptions() {
    this.options.fields.forEach((f) => {
      let name = f;
      if (typeof f === 'object') {
        name = f.name;
      }

      if (this.availableFields.indexOf(name) === -1) {
        throw new Error(`Field ${name} not available. Make sure the fields array item has\
         a string or a object with a name attribute containing one of the available fields.`);
      }
    });
  }
}
