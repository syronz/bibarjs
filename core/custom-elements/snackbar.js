class SnackBar extends HTMLElement {
  constructor() {
    super();

    // const pElem = document.createElement('p');
    // pElem.textContent = "here is I am";

    this.attachShadow({mode: 'open'});
    // shadowRoot.appendChild(pElem);

  }

  render(msg, timer) {
    this.shadowRoot.innerHTML = `
      <style>
        .base {
          visibility: hidden;
          position: fixed;
          right: 0;
          background-color: #333;
          color: #FFF;
          border-radius: 2px;
          top: 3rem;
          padding: 1rem;
          z-index: 1;
          display: block;
          overflow: hidden;
          white-space: nowrap;
        }

        .show {
          visibility: visible;
          animation: fadein 0.5s, fadeout 0.5s ${timer - .4}s;
        }

        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeout {
          from { opacity: 1;}
          to { opacity: 0;}
        }

      </style>

      <div class="base show"> ${msg} </h3>`;

    const base = this.shadowRoot.querySelector('.base');
    setTimeout(function(){ base.className = base.className.replace('show', ''); }, timer * 1000);
  }

  message(str, timer = 3) {
    this.render(str, timer);
  }
}

customElements.define('snack-bar', SnackBar);
