import Init from '../../core/init.js'
import { Html } from './about.html.js'
import { Css } from './about.css.js'


//apprun start

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
