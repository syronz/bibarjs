import { html } from '../../core/http.js'

export const Html = html`
<div class="login-container">
  <div></div>
  {{#if error }}
    <div class="logo error-logo"></div>
  {{else}}
    <div class="logo"></div>
  {{/if}}
  <div class="box">
    <p>
      Sing In
    </p>
    <div class="form-control">
      <label> Username </label>
        <input 
          type="text" 
          pOnchange="change()"
          placeholder="username" 
          autocomplete="username"
          value="{{username}}"
          id="username">
    </div>
    <div class="form-control">
      <label> Password </label>
        <input
          type="password" 
          placeholder="password"
          autocomplete="password"
          value="{{password}}"
          id="password">
    </div>
    <div class="footer">
      <alert-bar 
        display="block"
        level="danger"
        code="E1088822"
        domain="base"
        message="to zor halay"
        original_error="token is required"
        title="daxl naboo"
        type="http://127.0.0.1:7173/api/restapi/v1/public/errors/ku.html#UNAUTHORIZED"
      ></alert-bar>
    <!-- <span> --> 
    <!--   {{#if error}} -->
    <!--     {{ error }} -->
    <!--   {{/if}} -->
    <!-- </span> -->
      <button id="btnLogin" >Login</button>
    </div>
  </div>
  <div></div>
</div>
`;
