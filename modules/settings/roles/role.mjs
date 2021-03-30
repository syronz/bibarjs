import Init from '../../../core/init.js'
import { Html } from './role.html.js'
import { Css } from './role.css.js'

export default class Role extends Init {
  constructor(element) {
    super(element, 'role', Html, Css)
    this.data = {
      format: {
        "part": "role",
        "url":"roles",
        "edit": true,
        "key": "id",
        "page_sizes": [10, 25, 50, 100, 500],
        "order_by": "id",
        "direction": "desc",
        "fields": {
          "id": {
            "title": "#",
            "list": true,
            "sort": true
          },
          "name": {
            "title": "Name",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true
          },
          "resources": {
            "title": "Resources",
            "list": true,
            "sort": false,
            "edit": true,
            "type": "textarea",
            "rows": 10,
            "required": true
          },
          "description": {
            "title": "Description",
            "list": true,
            "sort": true,
            "edit": true,
            "type": "number"
          }
        }
      } // end of format
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
