import {Router} from '../route/router.js';

class GoTo extends HTMLElement {
  constructor() {
    super();


    // add pointer style to all routes
    this.style.cursor = "pointer";

    const route = this.getAttribute("route") || '/route-attribute-is-missing';

    console.log(route)

    const router = new Router(window.routes, window.baseHref)
    this.addEventListener('click', (x) => {
      x.preventDefault();
      router.navigate(route);
    }, false);

  }

}
customElements.define('go-to', GoTo);
