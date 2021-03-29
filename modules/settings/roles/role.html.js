import { html } from '../../../core/http.js'

export const Html = html`
<div class="frame role">
  <div>
    <bi-table id="biTable" format='{
      "part": "role",
      "url":"roles",
      "edit": true,
      "key": "id",
      "page_sizes": [2, 10, 25, 50, 100, 500],
      "order_by": "id",
      "direction": "desc",
      "fields": {
        "id": {
          "title": "#",
          "list": true,
          "sort": true
        },
        "name": {
          "title": "Name",
          "list": true,
          "sort": true,
          "edit": true,
          "required": true
        },
        "resources": {
          "title": "Resources",
          "list": true,
          "sort": false,
          "edit": true,
          "type": "textarea",
          "rows": 10,
          "required": true
        },
        "description": {
          "title": "Description",
          "list": true,
          "sort": true,
          "edit": true,
          "type": "number"
        }
      }
    }'></bi-table>
  </div>
  <p>
    role works fine!
    <di-ct>hello </di-ct>
  </p>
  <div class="age">
    handlebars: {{ age }}
    t
  </div>
  <button id="getUsers"> get users </button>
  <button pOnclick="deleteUsers()" > delete users </button>
  <button pOnclick="sayHello()" > hello </button>
  <div>
    <!-- <ul class="pople_list"> -->
    {{#each users}}
    <!-- <li>{{this.name}}</li> -->
    <p>
    <span>{{this.name}},</span>
    <span>{{this.email}},</span>
    </p>
    {{/each}}
    <!-- </ul> -->
  </div>
</div>
`;

