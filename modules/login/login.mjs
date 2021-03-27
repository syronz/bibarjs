import Init from '../../core/init.js'
import {post} from '../../core/http.js'
import {Html} from './login.html.js'
import {Css} from './login.css.js'
import {Ajax} from '../../core/http.js';

export default class Login extends Init {
  constructor(element) {
    super(element, 'login', Html, Css)
    this.data = {
      username: 'super3',
      password: 'superadmin'
    }

  }

  // async submit() {
  //   try {
  //     const username = document.getElementById('username').value
  //     const password = document.getElementById('password').value
  //     const resp = await post('/login',{username, password})
  //     localStorage.setItem('userData', JSON.stringify(resp.data.username))
  //     localStorage.setItem('token', resp.data.user_extra.token)
  //     window.token = resp.data.user_extra.token
  //     window.location.pathname = '/dashboard' 
  //   } catch(err) {
  //     this.data.error = err.message
  //     this.render()
  //     console.warn(err)
  //   }
  // }

  async start() {
    const btn = document.querySelector('#btnLogin')
    btn.addEventListener('click',async (e) => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const alertBar = document.getElementById('alertBar');
      console.log('this is just an example', alertBar);

      const ajax = new Ajax();
      ajax.post('/login', {username, password})
          .subscribe(
            res => {
              console.log('res', res);
              localStorage.setItem('username', JSON.stringify(res.data.username))
              localStorage.setItem('lang', JSON.stringify(res.data.lang))
              localStorage.setItem('token', res.data.user_extra.token)
              window.token = res.data.user_extra.token
              window.location.pathname = '/dashboard'
            },
            err => {
              alertBar.apply(err.error);
            }
          )

      /*
      try {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const resp = await post('/login',{username, password})
        console.log('.............', resp)
        localStorage.setItem('userData', JSON.stringify(resp.data.username))
        localStorage.setItem('token', resp.data.user_extra.token)
        window.token = resp.data.user_extra.token
        window.location.pathname = '/dashboard' 
      } catch(err) {
        this.data.error = err.message
        console.warn(err)
      }
      */
    })
  }

}
