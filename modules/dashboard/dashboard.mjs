import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'dashboard')
    this.data = {}
  }

  firstLoad() {
    console.log('this is first load of dashboard')

  }

  async middleware() {
    await this.render()
    const outlet = document.getElementById("dashboardOutlet")
    console.log('dashboardOutlet', outlet)
    return [NEXT, outlet]
  }
  
}
