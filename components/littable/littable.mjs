import { LitElement, html } from 'https://unpkg.com/lit-element@2.3.1/lit-element.js?module';

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
    `;
  }

}
customElements.define('lit-table', LitTable);
