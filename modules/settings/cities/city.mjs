import Init from '../../../core/init.js'
import { Html } from './city.html.js'
import { Css } from './city.css.js'

export default class City extends Init {
  constructor(element) {
    super(element, 'city', Html, Css)
    this.data = {}
  }

  async start() {
    this.render()
  }
}
