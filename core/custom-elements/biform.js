import {Router} from '../route/router.js';
import {Ajax} from '../../core/http.js';

class BiForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.err = {
      display: 'none'
    };

    this.display = this.getAttribute('display');
    this.position = 'fixed';
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
    ajax.getNode(`${this.format.url}/${this.tableID}`)
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
  }

  connectedCallback() {
    this.fetchData();
  }

  static get observedAttributes() {
    return ['display', 'tableid'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('change', name, oldValue, newValue);
    if (name === 'tableid' && oldValue !== null) {
      this.display = 'block';
      this.position = 'fixed';
      this.tableID = newValue;
      this.fetchData();
      return;
    }

    if (name === 'display') {
      this.display = newValue;
      this.render();
      return;
    }


  }

  render() {

    console.log('display is ', this.display);
    if (this.display === 'none') {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const content = document.createElement('div');
    content.innerHTML = `
      <style>
        .whole {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(255, 255, 0, .3);
        }

        #bi-form-container {
          display: grid;
          grid-template-columns: 1fr;
          padding: .5rem;
          position: ${this.position};
          width: 300px;
          grid-gap: 0.2rem;
          background-color: #FFF;
          border: 1px solid #EEE;
          top: 10px;
          left: calc(50vw - 150px);
          border-radius: 2px;
        }

        .form-control {
          display: grid;
          grid-template-columns: 3fr 8fr;
          align-items: center;
        }

        .actions {
          margin-top: .5rem;
          display: flex;
          justify-content: space-between;
        }

        alert-bar {
          margin-top: 1rem;
        }

        h4 {
          padding: 0;
          margin: 0;
        }

        hr {
          border: 0;
          clear:both;
          display:block;
          width: 100%;
          background-color:#DDD;
          height: 1px;
        }
      </style>


      <div class="whole">
        <div id="bi-form-container">
          <h4> Edit Roles </h4>
          <hr>

          ${this.cols.map(x => {
            return `
            <div class="form-control">
              <label for="${x}">${this.format.fields[x].title}</label>
              <input
                type="${this.format.fields[x].type}"
                id="${x}"
                value="${this.format.fields[x].value}"/>
            </div>
            `;
          }).join('')}

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

          <div class="actions">
            <button id="closeBtn"><di-ct>close</di-ct></button>
            <button id="saveBtn"><di-ct>save</di-ct></button>
          </div>

        </div>
      </div>
    `;

    // this.shadowRoot.appendChild(content);
    this.shadowRoot.innerHTML = content.innerHTML;

    const saveBtn = this.shadowRoot.querySelector('#saveBtn');
    saveBtn.addEventListener('click', () => {
      this.save();
    });

    const closeBtn = this.shadowRoot.querySelector('#closeBtn');
    closeBtn.addEventListener('click', () => {
      this.close();
    });

    const outside = this.shadowRoot.querySelector('.whole');
    outside.addEventListener('click', (e) => {
      this.close();
    });

    const inside = this.shadowRoot.querySelector('#bi-form-container');
    inside.addEventListener('click', (e) => {
      e.stopPropagation();
    });


  }

  close() {
    this.setAttribute('display', 'none');
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
        ajax.putNode(`${this.format.url}/${this.tableID}`, this.elementData)
            .subscribe(
              res => {
                console.log('res ', res)
                window.SnackBar.message(res.message);
                this.close();
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
