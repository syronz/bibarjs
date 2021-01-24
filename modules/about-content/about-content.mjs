import Init from '../../core/init.js'
import { Html } from './about-content.html.js'
import { Css } from './about-content.css.js'

export default class About extends Init {
  constructor(element) {
    super(element, 'about-content', Html, Css)
    this.data = {
      age: 88
    }
  }

  async start(v) {
    console.log('....>>..', v)
    
  }

}
