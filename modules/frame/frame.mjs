import Init from '../../core/init.js'
import { Html } from './frame.html.js'
import { Css } from './frame.css.js'

export default class Frame extends Init {

  constructor(element) {
    super(element, 'frame', Html, Css)
    this.data = {
      age: 88
    }
  }


  async middleware() {
    await this.render()
    return [null, null]
  }

}
