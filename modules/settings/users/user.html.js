import { html } from '../../../core/http.js'

export const Html = html`
<bi-form
  format='{{json format}}'
  id="createForm"
  type="create"
  display="none"
  tableid="">
</bi-form>

<button id="addUserBtn"><di-ct>add</di-ct> <di-ct>user</di-ct></button>

<div>
  <bi-table id="biTable" format='{{json format}}'></bi-table>
</div>
`;

