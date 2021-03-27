import { html } from '../../core/http.js'

export const Html = html`
<div class="login-container">
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
        id="alertBar"
        display="none"
        level="danger"
      ></alert-bar>
      <button id="btnLogin" >Login</button>
    </div>
  </div>
</div>
`;
