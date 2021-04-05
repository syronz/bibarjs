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
            "edit": false,
            "create": true
          },
          "password": {
            "title": "password",
            "list": false,
            "sort": false,
            "edit": true,
            "create": true
          },
          "name_en": {
            "title": "name",
            "list": false,
            "sort": false,
            "edit": false,
            "create": true
          },
          "code": {
            "title": "Code",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true,
            "type": "text",
            "create": true
          },
          "name_en": {
            "title": "Name",
            "list": true,
            "sort": true,
            "edit": true,
            "required": true,
            "type": "text",
            "create": true
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
            ],
            "create": true
          },
          "role": {
            "title": "Role",
            "list": true,
            "sort": true,
            "edit": false,
            "create": false
          },
          "role_id": {
            "title": "Role",
            "list": false,
            "sort": false,
            "edit": true,
            "required": true,
            "type": "foreign",
            "foreign_url": `companies/${window.UserInfo.company_id}/roles?order_by=bas_roles.name&direction=asc&page=0&page_size=10000&select=bas_roles.id,bas_roles.name`,
            "foreign_value_key": "id",
            "foreign_caption_key": "name",
            "create": true
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
            ],
            "create": true
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
    // this.render()
    const btn = document.querySelector('#addUserBtn')
    console.log(btn);
    btn.addEventListener('click', (e) => {
      const createForm = document.querySelector('#createForm');
      createForm.setAttribute('display', 'block');
    })
  }
}
