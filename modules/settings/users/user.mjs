import Init from '../../../core/init.js'
import { Html } from './user.html.js'
import { Css } from './user.css.js'

export default class User extends Init {
  constructor(element) {
    super(element, 'user', Html, Css)
    this.data = {
      format: {
        "part": "user",
        "url": "users",
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
          "username": {
            "title": "username",
            "list": true,
            "sort": true,
            "edit": false
          },
          "code": {
            "title": "Code",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true,
            "type": "text"
          },
          "name_en": {
            "title": "Name",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true,
            "type": "text"
          },
          "lang": {
            "title": "Language",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true,
            "type": "options",
            "options": [
              {
                "value": "en",
                "caption": "English"
              },
              {
                "value": "ku",
                "caption": "Kurdish"
              }
            ]
          },
          "role": {
            "title": "Role",
            "list": true,
            "sort": true,
            "edit": false
          },
          "role_id": {
            "title": "Role",
            "list": false,
            "sort": false,
            "edit": true,
            "required": true,
            "type": "number"
          },
          "status": {
            "title": "Status",
            "list": true,
            "sort": true,
            "edit": true,
            "type": "options",
            "options": [
              {
                "value": "active",
                "caption": "Active"
              },
              {
                "value": "inactive",
                "caption": "Inactive"
              }
            ]
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
        }//end of fields
      }
    }
  }

  async start() {
    this.render()
  }
}
