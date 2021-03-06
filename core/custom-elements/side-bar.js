// import { WordDB } from '../word-db.js';
// import './dict.js';

const resources = "user:write user:read role:read role:write";
const navs = [
  {
    scope: "settings",
    links: [
      { name: "roles", resource: "role:read" },
      { name: "users", resource: "user:read" },
    ]
  },
  {
    scope: "accounting",
    links: [
      { name: "accounts", resource: "account:read" },
      { name: "receipt vouchers", resource: "all" },
      { name: "payment vouchers", resource: "all" },
    ]
  },

];

class SideBar extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});


    const divElem = document.createElement('div');
    // divElem.textContent = this.getAttribute('status');
    divElem.innerHTML = '<di-ct>hello</di-ct>';

    // const deleteTest = document.createElement('di-ct').textContent("hello");
    // deleteTest.innerHTML = "hello";
    // divElem.appendChild(deleteTest);

    navs.forEach((v) => {
      const part = document.createElement('div');
      part.textContent = '> ' + v.scope;
      divElem.appendChild(part);

      v.links.forEach((k) => {
        if (k.resource === "all" || resources.includes(k.resource)) {
          const link = document.createElement('p');
          // link.textContent = '>> ' + k.name;
          link.innerHTML = `<di-ct>${k.name}</di-ct>`;
          link.setAttribute('route', '/login');
          divElem.appendChild(link);
        }
      });

      console.log(v)
    });


    const pElem = document.createElement('p');
    pElem.textContent = ' ok ';
    shadowRoot.appendChild(divElem);
    shadowRoot.appendChild(pElem);
  }

  toggle() {
    console.log('hello it is toggle in the sideBar');
  }


}
customElements.define('side-bar', SideBar);
