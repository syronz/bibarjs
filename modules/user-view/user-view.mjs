import Init from '../../core/init.js'
import {NEXT} from '../../core/consts.js'
import { Html } from './user-view.html.js'
import { Css } from './user-view.css.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user-view', Html, Css)
    this.data = {}
  }


  async middleware() {
    await this.render()
    return [NEXT, outlet]
  }
  
}
