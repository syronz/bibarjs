import Init from '../../core/init.js'

export default class About extends Init {
  constructor(element) {
    super(element, 'about')
    this.data = {
      age: 88
    }
  }

  firstLoad() {
    this.getUsers()

  }

  sayHello = _ => {
    console.log("hello from about.mjs")
  }

  getUsers = async _ => {
    console.log("pressed")
    const users = await fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
    this.data.users = users

    this.render(this.data)
  }

  deleteUsers = _ => {
    console.log("delete users pressed")
    this.data.users = []
    this.render(this.data)
  }
  
}
