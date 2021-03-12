import Init from '../../../core/init.js'
import { Html } from './role.html.js'
import { Css } from './role.css.js'

export default class Role extends Init {
  constructor(element) {
    super(element, 'role', Html, Css)
    this.data = {
      age: 88
    }


  }

  sayHello = _ => {
    console.log("hello from role.mjs")
    this.data.age = 95;
    let oo = document.querySelector(".age");
    console.log(oo);
    this.render(this.data)
    document.querySelector(".age").style.backgroundColor = "red";
  }

  getUsers = async _ => {
    console.log(".....................");
    const users = await fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
    this.data.users = users

    this.render(this.data)
  }

  deleteUsers = _ => {
    this.data.users = []
    this.render(this.data)
  }

  async start() {
    const btn = document.querySelector('#getUsers')
    btn.addEventListener('click',async (e) => {
      const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then((res) => res.json())
      this.data.users = users

      this.render(this.data)
    })
  }
}
