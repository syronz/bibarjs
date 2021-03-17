import {Router} from '../route/router.js';

class BiForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.display = 'block';
    this.rawFormat = this.getAttribute('format');
    this.type = this.getAttribute('type');
    this.tableID = this.getAttribute('tableid');
    this.format = JSON.parse(this.rawFormat);

    this.cols = [];
    for (const el in this.format.fields) {
      if (this.format.fields[el][this.type] === true) {
        this.cols.push(el);
      }
    }

  }

  async fetchData() {
    const token = localStorage.getItem('token');

    const result = await fetch(`${this.format.url}/${this.tableID}`, {
      headers: {
        "authorization":`Bearer ${token}`
      }
    }).then((res) => res.json());

    console.log(result.data);

    this.cols.map(x => {
      console.log(x);
      this.format.fields[x].value = result.data[x];
    });
    this.render();

  }

  async connectedCallback() {
    await this.fetchData();

  }

  static get observedAttributes() {
    return ['tableid'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attr has been changed', name, oldValue, newValue);

    if (name === 'tableid' & oldValue !== null) {
      this.display = 'block';
      this.position = 'fixed';
      this.tableID = newValue;
      this.fetchData();
    }

  }

  render(data) {

    const content = document.createElement('div');
    content.innerHTML = `
      <style>
        * {
        color: maroon;
        }

        #bi-form-container {
          display: ${this.display};
          position: ${this.position};
          background-color: #CCC;
          top: 10px;
          left: 10px;
        }
      </style>

      <div id="bi-form-container">
      ${this.cols.map(x => {
        return `
          <div>
            <label for="${x}">${this.format.fields[x].title}</lable>
            <input 
              type="${this.format.fields[x].type}" 
              id="${x}" 
              value="${this.format.fields[x].value}">
          </div>
        `;

      }).join('')}

        <div class="actions">
          <button id="saveBtn"><di-ct>save</di-ct></button>
        </div>

        <div> ${this.rawFormat} </div>
      </div>
    `;

    // this.shadowRoot.appendChild(content);
    this.shadowRoot.innerHTML = content.innerHTML;

    const saveBtn = this.shadowRoot.querySelector('#saveBtn');
    saveBtn.addEventListener('click', () => {
      console.log('save btn clicked');
    });
  }


}

customElements.define('bi-form', BiForm);
