import {Router} from '../route/router.js';

class BiTable extends HTMLElement {
  constructor() {
    super();

    const url = new URL(location);
    this.query = url.search;

    this.pageSize = url.searchParams.get('page_size') ?? 10;
    this.page = url.searchParams.get('page') ?? 0;
    this.page = parseInt(this.page, 10);

    console.log('constructor: ', location.search, this.pageSize, this.page);

    // const shadowRoot = this.attachShadow({mode: 'open'});
    this.attachShadow({mode: 'open'});
    this.format = JSON.parse(this.getAttribute('format'));

    this.cols = [];
    for (const el in this.format.fields) {
      if (this.format.fields[el].list === true) {
        this.cols.push(el);
      }
    }
  }

  async connectedCallback() {
    const token = localStorage.getItem('token');

    const result = await fetch(this.format.url + this.query, {
      headers: {
        "authorization":`Bearer ${token}`
      }
    }).then((res) => res.json())

    this.count = result.data.count ?? 1000;




    const data = result.data.list;

    this.render(data);
  }

  goto() {
    console.log(this.page, location);
    const router = new Router(window.routes, window.baseHref)
    router.navigate(`${location.pathname}?page_size=${this.pageSize}&page=${this.page}`);

  }

  render(data) {

    console.log(this.count,this.page, this.pageSize);
    const nextDisabled = this.page >= Math.floor(this.count/this.pageSize)? 'disabled':'';
    const preDisabled = this.page <= 0? 'disabled': '';

    const content = document.createElement('div');
     content.innerHTML = `
      <style> p { color: green;}</style>
      <table border=1 cellspacing=0>
        <tr>
          ${this.cols.map(x => `<th>${this.format.fields[x].title}</th>`).join('')}
        </tr>
        ${data.map(x => `
          <tr>
            ${this.cols.map(y => `<td>${eval(`x.${y}`)}</td>`).join('')}
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
    })

  }

  async disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

}
customElements.define('bi-table', BiTable);
