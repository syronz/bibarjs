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
<<<<<<< HEAD:modules/about/about.html.js
    <lit-table myString="ok"></lit-table>
=======
    <wc-lit-html></wc-lit-html>
    <bib-table></bib-table>
>>>>>>> a7a01925c8e2d497dea656dd84cdfefa619caeb6:modules/about/about.html
    <!-- <ul class="pople_list"> -->
    {{#each users}}
    <!-- <li>{{this.name}}</li> -->
    <span>{{this.name}},</span>
    {{/each}}
    <!-- </ul> -->
  </div>
</div>
`;
