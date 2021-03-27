import {Router} from '../route/router.js';
import {Ajax} from '../../core/http.js';

class BiForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.err = {
      display: 'none'
    };

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

  fetchData() {
    const ajax = new Ajax();
    ajax.get(`${this.format.url}/${this.tableID}`)
        .subscribe(
          res => {
            console.log('res2', res);
            this.elementData = res.data;

            this.cols.map(x => {
              this.format.fields[x].value = res.data[x];
            });
            this.render();
          },
          err => {
            console.warn('err2', err);
            // const alertBar = this.shadowRoot.querySelector('alert-bar');
            // alertBar.apply(err.error)
            this.err = err.error;
            this.err.dispay = 'block';
            this.render();
          }
        );

    /*
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
    */
  }

  connectedCallback() {
    this.fetchData();
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

  render() {

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

        <alert-bar
          display="${this.err.display}"
          level="danger"
          code="${this.err.code}"
          domain="${this.err.domain}"
          message="${this.err.message}"
          original_error="${this.err.original_error}"
          title="${this.err.title}"
          type="${this.err.type}"
        ></alert-bar>

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

  save() {
    this.cols.map(x => {
      const el = this.shadowRoot.querySelector(`#${x}`);
      this.elementData[x] = el.value;
    });

    switch (this.type) {
      case 'edit':

        // let result = null
        const ajax = new Ajax();
        ajax.put(`${this.format.url}/${this.tableID}`, this.elementData)
            .subscribe(
              res => {
                console.log('res ', res)
                window.SnackBar.message(res.message);
              },
              err => {
                const alertBar = this.shadowRoot.querySelector('alert-bar');
                alertBar.apply(err.error)
              });

        break;
      default:
        console.warn(this.type, 'not accepted');
    }
  }
}

customElements.define('bi-form', BiForm);
