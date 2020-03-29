import { html } from '../../core/http.js'

export const Html = html`
<div class="login-container">
  <div></div>
  {{#if error }}
    <div class="logo error-logo">Ω</div>
  {{else}}
    <div class="logo">Ω</div>
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
    <span> 
      {{#if error}}
        {{ error }}
      {{/if}}
    </span>
      <button pOnclick="submit()">Login</button>
    </div>
  </div>
  <div></div>
</div>
`;
