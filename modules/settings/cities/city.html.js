import { html } from '../../../core/http.js'

export const Html = html`
<div class="frame city">
  <bi-form
    format='{{json format}}'
    id="createForm"
    type="create"
    display="none"
    tableid="">
  </bi-form>

  <button id="addCityBtn"><di-ct>add</di-ct> <di-ct>city</di-ct></button>
  <div>
    <bi-table id="biTable" format='{{json format}}'></bi-table>
  </div>
</div>
`;

