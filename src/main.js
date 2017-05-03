import locale from './locale/en';
import Builder from './helpers/builder';

const availableFields = [
  'email',
  'firstName',
  'lastName',
  'phoneNumber',
  'mobileNumber',
  'streetName',
  'zipcode',
  'city',
  'country',
];

// eslint-disable-next-line
export class Form {
  constructor(id, options) {
    this.container = document.getElementById(id);
    this.options = Object.assign({
      template: '<form id="kundan-form-container"></form>',
      formContainerClass: 'kundan-form',
      inputGroupClass: 'input-group',
      fields: [
        {
          name: 'firstName',
          required: true,
        },
        'lastName',
      ],
      locale,
    }, options);

    Form.validateFieldOptions(this.options.fields);

    this.container.innerHTML = this.options.template;
    this.formContainer = document.getElementById('kundan-form-container');
    this.formContainer.classList.add(this.options.formContainerClass);

    this.build();
  }

  createFormJson() {
    const email = this.options.fields.filter(f => f.name === 'email');
    const form = [
      {
        name: 'email',
        type: 'email',
        placeholder: email.length > 0 ? email[0].placeholder : undefined,
        label: email.length > 0 && email[0].label !== undefined ?
        email[0].label : this.options.locale.email,
      },
    ];

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

    return form;
  }

  build() {
    const b = new Builder(this.formContainer, {
      inputGroupClass: this.options.inputGroupClass,
    });

    b.renderGroups(this.createFormJson());

    b.append(
      Builder.createSubmitBtn(this.options.locale.submit, this.onSubmit.bind(this)),
    );
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this);
  }

  static validateFieldOptions(fields) {
    fields.map((f) => {
      let name = f;
      if (typeof f === 'object') {
        name = f.name;
      }

      if (availableFields.indexOf(name) === -1) {
        throw new Error(`Field ${name} not available. Make sure the fields array item has\
         a string or a object with a name attribute containing one of the available fields.`);
      }

      return f;
    });
  }
}
