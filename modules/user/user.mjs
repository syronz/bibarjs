import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user')
    this.data = {}
  }


  async middleware() {
    await this.render()
    const outlet = document.getElementById("outlet")
    return [NEXT, outlet]
  }
  
}
