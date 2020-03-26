import Init from '../../core/init.js'
import {post} from '../../core/http.js'

export default class Login extends Init {
  constructor(element) {
    super(element, 'login')
    this.data = {
      error2: 'this is error'
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

  async middleware() {
    await this.render()
    return [null, null]
  }

}
