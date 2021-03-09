import Init from '../../core/init.js'
import { NEXT, STOP } from '../../core/consts.js'
import { Html } from './dashboard.html.js'
import { Css } from './dashboard.css.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'dashboard', Html, Css)
    this.data = {}
  }

  async toggleSidebar() {
    console.log("hello");
  }

  async middleware() {

    const token = localStorage.getItem('token')
    if (token)  {
      await this.render()
      const outlet = document.getElementById("dashboardOutlet")

      const btnMenu = document.querySelector('#menu')
      btnMenu.addEventListener('click',(e) => {
        const sideBar = document.querySelector('side-bar')
        sideBar.toggle();
      })

      btnMenu.addEventListener('dblclick',(e) => {
        const sideBar = document.querySelector('side-bar')
        sideBar.toggleExpansion();
      })

      return [NEXT, outlet]
    }
    window.location.pathname = '/login' 
  }


  async start() {
    console.log("this is start in dashboard");
  }

}
