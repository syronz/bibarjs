import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user-view')
    this.data = {}
  }

  firstLoad() {
    console.log('this is first load')

  }

  async middleware() {
    await this.render()
    // const outlet = document.getElementById("outlet2")
    // console.log('outlet', outlet)
    return [NEXT, outlet]
  }
  
}
