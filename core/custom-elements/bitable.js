class BiTable extends HTMLElement {
  constructor() {
    super();

    const url = new URL(location);
    this.query = url.search;
    console.log('constructor: ', location.search);

    this.pageSize = url.searchParams.get('page_size') ?? 10;
    this.page = url.searchParams.get('page') ?? 0;

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

    console.log('connectedCallback: ', location.search);
    const result = await fetch(this.format.url + this.query, {
      headers: {
        "authorization":`Bearer ${token}`
      }
    }).then((res) => res.json())

    this.count = result.data.count ?? 1000;




    const data = result.data.list;

    this.render(data);
  }

  render(data) {
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

      <button id="navigateT"> just navigate </button>

      <go-to route="/dashboard/settings/roles?page_size=2&page=1">
        <button> page 1 </button>
      </go-to>
      <go-to route="/dashboard/settings/roles?page_size=2&page=2">
        <button> page 2 </button>
      </go-to>

      
    `;

    const btn = document.createElement('button');
    btn.textContent = 'click me';
    btn.addEventListener('click',() => {
      console.log(location.pathname);
      // window.location = 'http://erp14.com';
      window.location = 'http://localhost:3000/dashboard/settings/roles?page_size=2&page=1';
      // router.navigate(window.location.pathname+)
    });
    

    this.shadowRoot.appendChild(content);
    this.shadowRoot.appendChild(btn);
    // const btn = document.querySelector("table");
    /*
    const btn = document.querySelector('#getUsers')
    btn.addEventListener('click',async (e) => {
      const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
      this.data.users = users

      this.render(this.data)
    })
    */

  }

  async disconnectedCallback() {
    await console.log('disconnectedCallback: ', location.search);
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

}
customElements.define('bi-table', BiTable);
