import Init from '../../core/init.js'
import { Html } from './about.html.js'
import { Css } from './about.css.js'


/*


//apprun start
import { app, Component, html } from 'https://unpkg.com/apprun@next/esm/apprun-html?module';
class Counter extends Component {
  state = 0;
  view = (state) => html`<div>
    <h1>${state}</h1>
    <button @click=${()=>this.run("add", -1)}>-1</button>
    <button @click=${()=>this.run("add", +1)}>+1</button>
  </div>`;
  update =[
    ['add', (state, n) => state + n]
  ]
}
app.webComponent('wc-lit-html', Counter);
//apprun end
*/

export default class About extends Init {
  constructor(element) {
    super(element, 'about', Html, Css)
    this.data = {
      age: 88
    }
  }

  // firstLoad() {
  //   // this.getUsers()
  // }

  sayHello = _ => {
    console.log("hello from about.mjs")
    this.data.age = 95;
    let oo = document.querySelector(".age");
    console.log(oo);
    this.render(this.data)
    document.querySelector(".age").style.backgroundColor = "red";
  }

  getUsers = async _ => {
    const users = await fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
    this.data.users = users

    this.render(this.data)
  }

  deleteUsers = _ => {
    this.data.users = []
    this.render(this.data)
  }

  async middleware() {
    await this.render()
    return [null, null]
  }

}
