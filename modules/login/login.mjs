import Init from '../../core/init.js'
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

  async start() {
    const btn = document.querySelector('#btnLogin')
    btn.addEventListener('click',async (e) => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const alertBar = document.getElementById('alertBar');
      console.log('this is just an example', alertBar);

      const ajax = new Ajax();
      ajax.post('login', {username, password})
          .subscribe(
            res => {
              localStorage.setItem('username', JSON.stringify(res.data.username));
              localStorage.setItem('lang', JSON.stringify(res.data.lang));
              localStorage.setItem('token', res.data.user_extra.token);
              window.LANG = res.data.lang;
              window.token = res.data.user_extra.token;
              window.location.pathname = '/dashboard';
            },
            err => {
              alertBar.apply(err.error);
            }
          );
    })
  }

}
