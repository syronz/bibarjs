import { html } from '../../core/http.js'

export const Html = html`
<h3> /users </h3>
<hr>
<button route="/login">login</button>
<h3> inside the user </h3>
<hr>
<div id="outlet">this is outlet</div>
`;
