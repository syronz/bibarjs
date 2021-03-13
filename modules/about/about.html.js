import { html } from '../../core/http.js'

export const Html = html`
<div class="frame about">
  <p>
    about works fine!
    <di-ct>hello </di-ct>
  </p>
  <div class="age">
    handlebars: {{ age }}
  </div>
  <button id="getUsers" pOnclick="getUsers()" > get users </button>
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
