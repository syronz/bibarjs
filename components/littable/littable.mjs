import { LitElement, html } from 'https://unpkg.com/lit-element@2.3.1/lit-element.js?module';
import {Router} from '../../core/route/router.js';

export class LitTable extends LitElement {
  static get properties() { return {
    myString: { type: String },
    myNumber: { type: Number },
    myBool: { type: Boolean },
    myArray: { type: Array },
    myObj: { type: Object }
  };}

  constructor() {
    super();
    this.myString = '';
    this.myNumber = 0;
    this.myBool = false;
    this.myObj = { };
    this.myArray = [];
  }

  render() {
    return html`
      <p>myString: ${this.myString}</p>
      <p>myNumber: ${this.myNumber}</p>
      <p>myBool: ${this.myBool}</p>
      <p>myObj.stuff: ${this.myObj.stuff}</p>
      <p>myArray: ${this.myArray.map(item => html`<span>${item},</span>`)}</p>
      <button route="/dashboard">Root</button>
        <button @click="${this.tester}"> tester </button>
        <a href="/dashboard"> this is link to dashboard </a>
    `;
  }

  tester() {
    console.log("this is tester");
    const router = new Router(window.routes, window.baseHref)
    router.navigate('/dashboard')
  }

}
customElements.define('lit-table', LitTable);
