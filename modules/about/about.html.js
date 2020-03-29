import { html } from '../../core/http.js'

export const Html = html`
<div class="frame about">
  <p>
    about works fine!
  </p>
  <div>
    handlebars: {{ age }}
  </div>
  <button pOnclick="getUsers()" > get users </button>
  <button pOnclick="deleteUsers()" > delete users </button>
  <button pOnclick="sayHello()" > hello </button>
  <div>
    <lit-table myString="ok"></lit-table>
    <!-- <ul class="pople_list"> -->
    {{#each users}}
    <!-- <li>{{this.name}}</li> -->
    <span>{{this.name}},</span>
    {{/each}}
    <!-- </ul> -->
  </div>
</div>
`;
