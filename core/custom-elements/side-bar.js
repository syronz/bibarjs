// import { WordDB } from '../word-db.js';
// import './dict.js';

const resources = "user:write user:read role:read role:write";
const navs = [
  {
    scope: "settings",
    links: [
      { name: "roles", resource: "role:read", route: "/settings/roles" },
      { name: "users", resource: "user:read", route: "/settings/users" },
    ]
  },
  {
    scope: "accounting",
    links: [
      { name: "accounts", resource: "account:read", route: "/accounting/accounts" },
      { name: "receipt vouchers", resource: "all", route: "/accounting/receipts" },
      { name: "payment vouchers", resource: "all", route: "/accounting/payments" },
    ]
  },

];

class SideBar extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});


    const divElem = document.createElement('div');
    // divElem.textContent = this.getAttribute('status');
    divElem.innerHTML = '<go-to route="/dashboard/about/location"><di-ct>hello</di-ct></go-to>';

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
          link.innerHTML = `<go-to route="${k.route}"><di-ct>${k.name}</di-ct></go-to>`;
          link.setAttribute('route', '/login');
          divElem.appendChild(link);
        }
      });

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
