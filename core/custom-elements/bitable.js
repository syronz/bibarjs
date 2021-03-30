import {Router} from '../route/router.js';
import {Ajax} from '../../core/http.js';

class BiTable extends HTMLElement {
  constructor() {
    super();

    const url = new URL(location);
    this.query = url.search;

    this.pageSize = url.searchParams.get('page_size') ?? 10;
    this.page = url.searchParams.get('page') ?? 0;
    this.page = parseInt(this.page, 10);

    // const shadowRoot = this.attachShadow({mode: 'open'});
    this.attachShadow({mode: 'open'});
    this.rawFormat = this.getAttribute('format');
    
    this.format = JSON.parse(this.rawFormat);

    this.orderBy = url.searchParams.get('order_by') ?? this.format.order_by;
    this.direction = url.searchParams.get('direction') ?? this.format.direction;

    this.cols = [];
    for (const el in this.format.fields) {
      if (this.format.fields[el].list === true) {
        this.cols.push(el);
      }
    }
  }

  connectedCallback() {
    const ajax = new Ajax();
    ajax.list(this.format.url + this.query)
        .subscribe(
          res => {
            this.count = res.data.count ?? 1000;
            const data = res.data.list;
            this.render(data);
          },
          err => {
            console.warn('err', err);
          }
        );
    // const token = localStorage.getItem('token');

    // const result = await fetch(this.format.url + this.query, {
    //   headers: {
    //     "authorization":`Bearer ${token}`
    //   }
    // }).then((res) => res.json())

    // this.count = result.data.count ?? 1000;

    // const data = result.data.list;

  }

  goto() {
    const router = new Router(window.routes, window.baseHref)

    const query = `page_size=${this.pageSize}&page=${this.page}&order_by=${this.orderBy}&direction=${this.direction}`;
    router.navigate(`${location.pathname}?${query}`);
  }

  sort(field) {
    if (this.format.fields[field].sort !== true) {
      return;
    }

    if (field.toLowerCase() == this.orderBy.toLowerCase()) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = field.toLowerCase();
      this.direction = 'asc';
    }
    this.page = 0;

    this.goto();

    // console.log("i'm sort", field, this.orderBy, this.direction);
  }

  render(data) {

    const nextDisabled = this.page >= Math.floor(this.count/this.pageSize)? 'disabled':'';
    const preDisabled = this.page <= 0? 'disabled': '';

    const content = document.createElement('div');
    content.innerHTML = `
      <style> 
        p { color: green;}

        table th div {
          display: flex;
          justify-content: space-between;
        }

        .sortable {
          cursor: pointer;
        }

        .sorted {
          cursor: pointer;
        }

        .sorted .thin {
          color: #555;
        }

        .thin {
          font-weight: 100;
          color: #CCC;
        }

        .action-btn {
          cursor: pointer;
          font-size: 1.5rem;
        }

      </style>

      ${this.format.edit === true ?
      `<bi-form
        format='${this.rawFormat}'
        id="editForm"
        type="edit"
        tableid="80">
      </bi-form>`:
      `<div> +++++++ </div>`}

      <table border=1 cellspacing=0>
        <tr>
          ${this.cols.map(x => {
            let sortable = this.format.fields[x].sort ? 'sortable' : '';
            let sortIcon = this.format.fields[x].sort ? '⇅' : '';

            if (x.toLowerCase() == this.orderBy.toLowerCase()) {
              sortIcon = this.direction === 'asc' ? '↧' : '↥';
              sortable = 'sorted';
            }
            return `<th onclick="biTable.sort('${x}')" class="${sortable}">
              <div>
                <span>${this.format.fields[x].title}</span>
                <span class="thin">${sortIcon}</span>
              </div>
            </th>`;
          }).join('')}
        </tr>
        ${data.map(x => `
          <tr>
            ${this.cols.map(y => {
              let v = eval(`x.${y}`);
              if (v === undefined) {
                return `<td></td>`;
              }
              v = this.look(v, this.format.fields[y].look);
              return `<td>${v}</td>`
            }).join('')}

            ${this.format.edit === true ? 
                `<td class="action-btn" onclick="biTable.edit(${x[this.format.key]})">
                  &#9998;
                </td>` : '' }
          </tr>
        `).join('')}
      </table>

      <select id="page_size">
        ${this.format.page_sizes.map(x => {
          const selected = this.pageSize == x?'selected':'';
          return `<option ${selected}>${x}</option>`
        }).join('')}
      </select>
      <button id="first" ${preDisabled}> << </button>
      <button id="pre" ${preDisabled}> < </button>
      <button> ${this.page} </button>
      <button id="next" ${nextDisabled}> > </button>
      <button id="last" ${nextDisabled}> >> </button>


    `;



    this.shadowRoot.appendChild(content);


    const next = this.shadowRoot.querySelector('#next');
    next.addEventListener('click', () => {
      this.page++;
      this.goto();
    });

    const pre = this.shadowRoot.querySelector('#pre');
    pre.addEventListener('click', () => {
      this.page--;
      this.goto();
    });

    const first = this.shadowRoot.querySelector('#first');
    first.addEventListener('click', () => {
      this.page = 0;
      this.goto();
    });

    const last = this.shadowRoot.querySelector('#last');
    last.addEventListener('click', () => {
      this.page = Math.floor(this.count / this.pageSize);
      this.goto();
    });

    const pageSize = this.shadowRoot.querySelector('#page_size');
    pageSize.addEventListener('change', (e) => {
      this.pageSize = parseInt(e.target.value, 10);
      this.page = 0;
      this.goto();
    });


  }

  edit(id) {
    console.log('I am edit', id);
    const editForm = this.shadowRoot.querySelector('#editForm');
    editForm.setAttribute('tableid', id);
  }

  look(v, format) {
    switch (format) {
      case 'date':
        return v.substring(0,10);
      default:
        return v;
    }
  }

  async disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

}
customElements.define('bi-table', BiTable);
