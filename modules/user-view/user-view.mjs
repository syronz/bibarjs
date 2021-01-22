import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user-view')
    this.data = {}
  }


  async middleware() {
    await this.render()
    return [NEXT, outlet]
  }
  
}
