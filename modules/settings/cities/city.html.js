import { html } from '../../../core/http.js'

export const Html = html`
<div class="frame city">
  <div>
    <bi-table id="biTable" format='{
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
    }'></bi-table>
  </div>
</div>
`;

