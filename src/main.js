import locale from './locale/en';
import Builder from './helpers/builder';
import Validator from './helpers/validator';
import post from './helpers/requester';

// eslint-disable-next-line
export class Form {
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
      formContainerClass: 'kundan-form',
      inputGroupClass: 'input-group',
      inputClass: 'input',
      labelClass: 'label',
      btnClass: 'button',
      errorClass: 'error',
      successClass: 'success',
      flat: false,
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

  render(id) {
    this.container = document.getElementById(id);
    this.insertForm();
  }

  modal() {
    this.container = document.createElement('div');
    this.container.style.borderColor = 'red';
    document.body.appendChild(this.container);
    this.insertForm();
  }

  insertForm() {
    this.builder = new Builder(this.container, this.options.template, {
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

  createFormJson() {
    const email = this.options.fields.filter(f => f.name === 'email');
    const form = [];

    this.options.fields.map((f) => {
      if (f === 'email' || f.name === 'email') {
        return f;
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

      return form.push({
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

  onSubmit(e) {
    e.preventDefault();
    const values = this.builder.getInputValues();
    const requiredFields = this.options.fields
    .filter(f => typeof f === 'string' || f.required === undefined || f.required)
    .map(f => (typeof f === 'string' ? f : f.name));
    requiredFields.push('email');

    const v = new Validator(requiredFields);
    const errors = v.validate(values);

    if (Object.keys(errors).length > 0) {
      return this.builder.recordErrors(errors);
    }

    const data = {};
    values.forEach((value) => {
      data[value.name] = value.value;
    });
    return post(data).then((response) => {
      console.log(response);

      this.builder.addSuccess(this.options.successMessage);
    })
    .catch((error) => {
      console.log(JSON.parse(error.message));

      this.builder.recordErrors(JSON.parse(error.message));
    });
  }

  validateFieldOptions() {
    this.options.fields.map((f) => {
      let name = f;
      if (typeof f === 'object') {
        name = f.name;
      }

      if (this.availableFields.indexOf(name) === -1) {
        throw new Error(`Field ${name} not available. Make sure the fields array item has\
         a string or a object with a name attribute containing one of the available fields.`);
      }

      return f;
    });
  }
}
