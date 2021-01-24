import { html } from '../../core/http.js'

export const Html = html`
<div class="frame about">
  <p>
    about works fine!
  </p>
  <div class="age">
    handlebars: {{ age }}
  </div>
  <button id="getUsers" pOnclick="getUsers()" > get users </button>
  <button pOnclick="deleteUsers()" > delete users </button>
  <button pOnclick="sayHello()" > hello </button>
  <div>
    <lit-table myString="ok"></lit-table>
    <wc-lit-html></wc-lit-html>
    <bib-table></bib-table>
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
