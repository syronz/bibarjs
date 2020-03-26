import Init from '../../core/init.js'
import {NEXT, STOP} from '../../core/consts.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'dashboard')
    this.data = {}
  }

  // firstLoad() {
  // }

  async middleware() {
    const token = localStorage.getItem('token')
    if (token) {
      await this.render()
      const outlet = document.getElementById("dashboardOutlet")
      return [NEXT, outlet]
    }
    window.location.pathname = '/login' 

    // return [STOP, null]
  }
  
}
