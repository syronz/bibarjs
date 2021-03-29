class AlertBar extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  render() {
    const container = document.createElement('div');
    const level = this.getAttribute('level');
    const code = this.getAttribute('code');
    const domain = this.getAttribute('domain');
    let message = this.getAttribute('message');
    const original_error = this.getAttribute('original_error');
    const title = this.getAttribute('title');
    const type = this.getAttribute('type');
    const display = this.getAttribute('display');

    if (display === 'none') {
      this.shadowRoot.innerHTML = '';
      return;
    }

    if (message === 'undefined' && title !== 'undefined') {
      message = title;
    }

    container.innerHTML = `
      <style>
        .container {
          display: ${display};
          position: relative;
          padding: .5rem 1rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: .25rem;
        }
        .danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        #closeBtn {
          background-color: transparent;
          border: none;
          color: #777;
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 5px;
        }

        #closeBtn:focus {
          border: none;
          outline: none;
        }

      </style>

      <div class="container ${level}">
        <details>
          <summary>
            <span>${message}</span>
            <button id="closeBtn">Ⅹ</button>
          </summary>
          <div><di-ct>title</di-ct>: <code>${title}</code></div>
          <div><di-ct>code</di-ct>: <code>${code}</code></div>
          <div><di-ct>domain</di-ct>: <code>${domain}</code></div>
          <div><di-ct>original error</di-ct>: <code>${original_error}</code></div>
          <div><di-ct>detail</di-ct>: <a href="${type}" target="_blank">${type.split('#')[1]}</a></div>
        </details>



      </div>
    `;

    this.shadowRoot.innerHTML = container.innerHTML;

    const closeBtn = this.shadowRoot.querySelector("#closeBtn");
    closeBtn.addEventListener('click', () => {
      this.close();
    });

  }

  static get observedAttributes() {
    return ['display', 'message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  close() {
    this.setAttribute('display', 'none');
  }

  apply(err) {
    this.setAttribute('code', err.code);
    this.setAttribute('type', err.type);
    this.setAttribute('title', err.title);
    this.setAttribute('domain', err.domain);
    this.setAttribute('base', err.base);
    this.setAttribute('original_error', err.original_error);
    this.setAttribute('path', err.path);
    this.setAttribute('message', err.message);
    this.setAttribute('display', 'block');
  }
}

customElements.define('alert-bar', AlertBar);
