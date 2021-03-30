import { html } from '../../../core/http.js'

export const Html = html`
<div class="frame role">
  <div>
    <bi-table id="biTable" format='{{json format}}'></bi-table>
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

