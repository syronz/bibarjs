class SnackBar extends HTMLElement {
  constructor() {
    super();

    const pElem = document.createElement('p');
    pElem.textContent = "here is I am";

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(pElem);



  }
}

customElements.define('snack-bar', SnackBar);
