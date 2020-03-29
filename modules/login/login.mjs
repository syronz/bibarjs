import Init from '../../core/init.js'
import {post} from '../../core/http.js'
import { Html } from './login.html.js'
import { Css } from './login.css.js'

export default class Login extends Init {
  constructor(element) {
    super(element, 'login', Html, Css)
    this.data = {
      username: 'super3',
      password: 'superadmin'
    }
  }

  sayHello() {
    console.log('hello mahmoud')
  }

  alert() {
    alert("this is an alert")
  }

  async submit() {
    try {
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      const resp = await post('/login',{username, password})
      localStorage.setItem('userData', JSON.stringify(resp.data.username))
      localStorage.setItem('token', resp.data.user_extra.token)
      window.token = resp.data.user_extra.token
      window.location.pathname = '/dashboard' 
    } catch(err) {
      this.data.error = err.message
      this.render()
      console.warn(err)
    }
  }

  change() {
    console.log(document.getElementById('username').value);
    this.data.error = null;
    this.data.username = document.getElementById('username').value
    this.data.password = document.getElementById('password').value
    this.render()
  }

  async middleware() {
    await this.render()
    return [null, null]
  }

}
