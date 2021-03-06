import { css } from '../../core/http.js'

export const Css = css`
body {
  padding: 0;
  margin: 0;
}

h2 {
  color: red;
}

.login-container {
  display: grid;
  height: 100vh;
  padding-top: 3rem;
  /* background: #2a386e; */
  background-image: radial-gradient(circle, #051937, #0d2144, #162852, #203060, #2a386e);
  justify-items: center;
  align-items: start;
}

.login-container > .box {
  grid-template-columns: 1fr 12fr 1fr;
  align-items: center;

  display: grid;
  grid-gap: 1rem;
  color: white;
  font-family: arial;
  width: 375px;
  max-width: 95% !important;

  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(255,255,255,0.5);
  background: linear-gradient(0deg, 
  rgba(255,255,255,0.4) -30%, 
  rgba(0,0,0,0) 30%, 
  rgba(203,246,255,0) 70%, 
  rgba(255,255,255,0.4) 130%);
  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30);
  overflow: auto;
  padding-bottom: 1rem;

}

@media only screen and (max-width: 400px) {
  .login-container > .box {
    width: 95%;
  }
}

alert-bar {
}

.login-container > .logo {
  color: white;
  font-family: arial;
  font-size: 5em;
}

.error-logo {
  /*color: #ff4b4b !important;
  text-shadow: 0 0 50px white;*/
  text-shadow: 0 0 20px #ff4b4b;
}

.login-container button {
  background: none;
  color: white;
  padding: 5px 10px;
  border: none;
  font-size: 1em;
}

.login-container button:active {
  background: #4a4a4a;
}

.login-container > .box .form-control{
  grid-column: 2;
  display: grid;
  grid-template-columns: 3fr 7fr;
}

.login-container > .box .footer{
  grid-column: 2;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
}


.login-container > .box > p {
  grid-column: 2;
}
`;
