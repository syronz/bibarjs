import { app, Component, html } from 'https://unpkg.com/apprun@next/esm/apprun-html?module';



export class Table extends Component {

  static get properties() {
    return {
      prop1: { type: Number },
      prop2: { type: Number }
    };
  }

  constructor() {
    super();
    this.prop1 = 10;
    this.prop2 = 0;
  }

  state = {
    a: 1,
    b: 2,
  };


  view = (state) => {
    const style = `
      td {
        color: blue;
      }
    `;
    return html`<div>
      <style>
        ${style}
      </style>
      <input type="number" $bind="a" />
      <!-- <input type="number" id="aValue" .value="${state.a}" @keyup=${e => console.log(e.target.value)}/> -->
        <input type="number" id="aValue" .value="${state.a}" @keyup=${(e)=>this.updateA("a", e.target.value)}/>
      <table border="1">
        <tr>
          <th> Name </th>
          <th> Mark </th>
        </tr>
        <tr>
          <td> Diako </td>
          <td> ${state.a}  </td>
        </tr>
      </table>


      <style>button:focus { background-color: aliceblue; }</style>

      <p>prop1: ${this.prop1}</p>
      <p>prop2: ${this.prop2}</p>

      <button id="a" @click="${() => this.prop1=Math.random()}">prop1</button>
      <button id="b" @click="${() => this.prop2=Math.random()}">prop2</button>

      <button @click=${()=>this.run("rand")}>rand</button>
    </div>`;
}

update ={
  'rand': (state) => {
    state.a = this.getRand();
    this.prop1 = Math.random();
    return state
  } ,
   'show': (state) => { return state; }
}

/*
update =[
  ['rand', (state) => {
    state.a = this.getRand();
    this.prop1 = Math.random();
    return state
  }
  ],
  [ 'show', (state) => { return state; } ]
]
*/

  getRand() {
    return Math.random();
  }

  updateA(val, num) {
    console.log(val, num);
    // this.state.a = num
    this.state[val] = num
    console.log(val);
    this.run("show");
  }

}
app.webComponent('bib-table', Table);
