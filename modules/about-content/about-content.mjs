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
    console.log('++++>>++', Object.keys(v.query))

// Object.keys(myObject).map(function(key, index) {
//   myObject[key] *= 2;
// });

    for (let [key, value] of v.query.entries()) {
      console.log(key + ' = ' + value)
    }
    
  }

}
