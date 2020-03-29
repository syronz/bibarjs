import { css } from '../../core/http.js'

export const Css = css`
h3 {
  color: orange;
}

a {
  color: red;
}

nav {
  height: 40px;
  padding: 0 10px 0 10px;
  background: #2a386e;
  color: #fff;
  display: grid;
  grid-template-columns: 40px 40px 80px 2fr 1fr 40px 40px 40px;
  align-items: center;
  justify-content: center;
  /* grid-gap: 8px; */
}

nav button {
  padding: 0;
  margin: 0;
  background: none;
  color: #fff;
  justify-self: stretch;
  font-size: 1.1em;
  border: none;
  height: 40px;
}
nav button:hover {
  background: #47599f;
}
nav button:focus {
  outline: none;
}

nav .feather {
  margin-top: 5px;
  width: 20px;
  height: 20px;
}

nav .search-box .feather {
  margin-top: 0;
  width: 15px;
  height: 15px;
}

nav .search-box {
  margin-left: 8px;
  margin-right: 8px;
  color: #000;
  padding-left: 5px;
  background: #eee;
  border-radius: 2px;
  display: grid;
  grid-template-columns: 22px 1fr;
  grid-template-rows: 25px;
  align-items: center;
}

nav .search-box input:focus{
  outline: none;
  background: #fff;
}

nav .search-box input {
  border: none;
  background: #eee;
  border-radius: 2px;
  height: 25px;
  padding: 0;
}
`;
