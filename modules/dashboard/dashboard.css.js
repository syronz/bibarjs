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
  color: #72706b;
  display: grid;
  grid-template-columns: 40px 40px 80px 2fr 1fr 40px 40px 40px;
  align-items: center;
  overflow: hidden;
  // justify-content: center;
  border-bottom: 2px solid #f7f6f3;
}

side-bar[expansion="thick"] {
  width: 9rem;
}

side-bar[expansion="thin"] {
  width: 1.7rem;
}

side-bar[status="close"] {
  width: 0;
}

nav button {
  filter: grayscale(100%);
  padding: 0;
  margin: 0;
  background: none;
  color: #72706b;
  justify-self: stretch;
  font-size: 1.1em;
  border: none;
  height: 40px;
}
nav button:hover {
  background-color: rgba(55,53,46,0.08);
  cursor: pointer;
  filter: grayscale(0);
}
nav button:focus {
  outline: none;
}

.container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 0.5rem;

}

side-bar {
  height: calc(100vh - 40px - 2px);
  scrollbar-width: thin;
  overflow-y: auto;
  overflow-x: hidden;
}

side-bar::-webkit-scrollbar {
  width: 4px;
}

/* Track */
side-bar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
}
 
/* Handle */
side-bar::-webkit-scrollbar-thumb {
  background: #999; 
}

/* Handle on hover */
side-bar::-webkit-scrollbar-thumb:hover {
  background: #777; 
}



`;
