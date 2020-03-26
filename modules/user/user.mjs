import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'
import { Html } from './user.html.js'
import { Css } from './user.css.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user', Html, Css)
    this.data = {}
  }


  async middleware() {
    await this.render()
    const outlet = document.getElementById("outlet")
    return [NEXT, outlet]
  }
  
}
