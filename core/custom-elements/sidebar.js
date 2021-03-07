// import { WordDB } from '../word-db.js';
// import './dict.js';

const resources = "user:write user:read role:read role:write";
const navs = [
  {
    scope: "base",
    links: [
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
      { name: "dashboard", resource: "all", route: "/dashboard", icon: "dashboard" },
      { name: "about", resource: "all", route: "/dashboard/about/history/2016/sort", icon: 'groups' },
    ]
  },
  {
    scope: "settings",
    links: [
      { name: "roles", resource: "role:read", route: "/settings/roles", icon: "nature_people" },
      { name: "users", resource: "user:read", route: "/settings/users", icon: 'groups',
      },
    ]
  },
  {
    scope: "accounting",
    links: [
      { name: "accounts", resource: "account:read", route: "/accounting/accounts", icon: "people" },
      { name: "receipt vouchers", resource: "all", route: "/accounting/receipts", icon: "note_add" },
      { name: "payment vouchers", resource: "all", route: "/accounting/payments", icon: "remove_circle_outline" },
    ]
  },

];

class SideBar extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: "open"});
    const width = this.getAttribute("width") || "250px";
    const style = document.createElement("style");
    style.textContent = `
      main {
        background-color: #f7f6f3;
        width: ${width};
        color: #72706b;
        overflow: hidden;
      }

      section {
        margin-top: 0.8rem;
      }
      
      nav { 
        padding-left: 4px;
      }
      nav:hover {
        background-color: rgba(55,53,46,0.08);
      }

      .icon-text {
        height: 1.7rem;
        display: grid;
        grid-template-columns: 24px 1fr;
        align-items: center; 
      }

      .material-icons {
        font-family: 'Material Icons';
        font-size: 1rem;  /* Preferred icon size */
      }

      go-to {
        width: 100%; 
      }
    `;


    const divElem = document.createElement('main');


    navs.forEach((v) => {
      const part = document.createElement('section');
      // part.textContent = '> ' + v.scope;
      // divElem.appendChild(part);

      v.links.forEach((k) => {
        if (k.resource === "all" || resources.includes(k.resource)) {
          const link = document.createElement('nav');
          link.innerHTML = `
          <go-to route="${k.route}">
            <div class="icon-text">
              <span class="material-icons">${k.icon}</span> 
              <di-ct>${k.name}</di-ct>
            </div>
          </go-to>`;
          link.setAttribute('route', '/login');
          divElem.appendChild(link);
        }
      });

    });


    shadowRoot.appendChild(divElem);
    shadowRoot.appendChild(style);
  }

  toggle() {
    console.log('hello it is toggle in the sideBar');
  }


}
customElements.define('side-bar', SideBar);
