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
    this.token = localStorage.getItem('token');

    const result = await fetch(`${this.format.url}/${this.tableID}`, {
      headers: {
        "authorization":`Bearer ${this.token}`
      }
    }).then((res) => res.json());

    this.elementData = result.data;

    this.cols.map(x => {
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
      this.save();
    });
  }

  async save() {
    this.cols.map(x => {
      const el = this.shadowRoot.querySelector(`#${x}`);
      this.elementData[x] = el.value;
    });

    switch (this.type) {
      case 'edit':

        // let result = null
        const ajax = new Ajax();
          ajax.post(`${this.format.url}/${this.tableID}`, this.elementData)
          .subscribe(x => console.log('res ', x), err => console.warn('err ', err));

        break;
      default:
        console.warn(this.type, 'not accepted');
    }
  }





}

customElements.define('bi-form', BiForm);

class Ajax {

  post(url = '', data = {}) {
    this.response = fetch(url, {
      method: 'put',
      headers: {
        'authorization2':`Bearer ${this.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (res.status > 299) {
        this.hasError = true;
      }
      return res.json()
    })
      .catch(err => { console.warn("error in post", err); return err; });

    return this;
  }

  subscribe(l,m) {
    Promise.race([this.response]).then(x => {
      if (this.hasError) {
        m(x);
      } else {
        l(x);
      }
    }).catch(m);
  }

}
