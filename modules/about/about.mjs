import Init from '../../core/init.js'
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

export default class About extends Init {
  constructor(element) {
    super(element, 'about')
    this.data = {
      age: 88
    }
  }

  // firstLoad() {
  //   // this.getUsers()
  // }

  sayHello = _ => {
    console.log("hello from about.mjs")
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
