import Init from '../../../core/init.js'
import { Html } from './city.html.js'
import { Css } from './city.css.js'

export default class City extends Init {
  constructor(element) {
    super(element, 'city', Html, Css)
    this.data = {
      format: {
        "part": "city",
        "url": "cities",
        "edit": true,
        "key": "id",
        "page_sizes": [10, 25, 50, 100, 500],
        "order_by": "id",
        "direction": "desc",
        "fields": {
          "id": {
            "title": "#",
            "list": true,
            "sort": true
          },
          "city": {
            "title": "City",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true
          },
          "notes": {
            "title": "Notes",
            "list": true,
            "sort": true,
            "edit": true,
            "type": "text"
          },
          "created_at": {
            "title": "Created At",
            "list": true,
            "sort": true,
            "edit": false,
            "look": "date"
          },
          "updated_at": {
            "title": "Updated At",
            "list": true,
            "sort": true,
            "edit": false,
            "look": "date"
          }
        }
      }
    }
  }

  async start() {
    this.render()
  }
}
