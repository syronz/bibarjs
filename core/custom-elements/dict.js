import { WordDB } from '../word-db.js';

class Dict extends HTMLElement {
  constructor() {
    super();

    this.translatedTerm = this.term = this.innerHTML.trim();
    this.pElem = document.createElement('span');
    this.attachShadow = this.attachShadow({mode: 'open'});
  }

  render() { 
    this.pElem.textContent = this.translatedTerm;
    this.shadowRoot.appendChild(this.pElem);
  }

  async connectedCallback() { 
    let wordDB = new WordDB();
    await wordDB.open(window.DBVERSION);
    let r = await wordDB.get(this.term);
    if ( r != undefined) {
      this.translatedTerm = r[window.LANG];
    } else {
      // this.pElem.style.backgroundColor = 'red';
      this.pElem.style.textDecoration = 'line-through';
    }

    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}
customElements.define('di-ct', Dict);
